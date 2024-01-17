import { Bench } from '/node_modules/tinybench/dist/index.js';

const bench = new Bench();

const html = (strings, ...exprs) => {
    const template = document.createElement('template');
    template.innerHTML = String.raw(strings, ...exprs);
    return template.content.firstElementChild;
};

const template = replacement => html`
    <div>
        <div>
            <p>text1<span>span_text</span>${replacement}<span>span_text</span>text3</p>
        </div>
    </div>
`;

const childText = template('text2');
const childComment = template('<!--text2-->');
const childSpan = template('<span data-bind>text2</span>');
const childWat = template('<w>text2</w>');
const childCreate = template('');

const cloneText = () => childText.cloneNode(true).firstElementChild.firstElementChild;
const cloneComment = () => childComment.cloneNode(true).firstElementChild.firstElementChild;
const cloneSpan = () => childSpan.cloneNode(true).querySelector('[data-bind]').firstChild;
const cloneWat = () => childWat.cloneNode(true).querySelector('w').firstChild;
const cloneWatReplace = () => childWat.cloneNode(true).querySelector('w');
const list = document.createElement('div');
const size = 10000;
for(let i = 0; i < size; i++) {
    const item = childComment.cloneNode(true);
    item.id = `fw-node-${i}`;
    item.dataset.id = `fw-node-${i}`;
    list.append(item);
}
document.body.append(list);

console.log(document.getElementById(`fw-node-5000`))
console.log(list.querySelector(`#fw-node-5000`))
const pooled = childComment.cloneNode(true);
const pool = [pooled];
const adoptPool = () => (pool[0] = pool[0]).firstElementChild.firstElementChild;
const adoptFlyweight = () => document.getElementById(`fw-node-5000`).firstElementChild.firstElementChild;
const adoptFlyweight2 = () => list.querySelector(`#fw-node-5000`).firstElementChild.firstElementChild;

// const flyweight = () =>

// const spanText = cloneSpan();
// let proto = spanText;
// // eslint-disable-next-line no-cond-assign
// while(proto = Object.getPrototypeOf(proto)) {
//     console.dir(proto);
//     if(Object.hasOwn(proto, 'data')) { console.log(proto); }

const benchmark = true;

if(benchmark) {
    bench
        .add('childNodes:text', () => {
            cloneText().childNodes[2].data = 'new value';
        })
        .add('childNodes:comment', () => {
            cloneComment().childNodes[2].data = 'new value';
        })
        .add('adoptPool:comment', () => {
            adoptPool().childNodes[2].data = 'new value';
        })
        .add('adoptFlyweight:comment', () => {
            adoptFlyweight().childNodes[2].data = 'new value';
        })
        .add('adoptFlyweight2:comment', () => {
            adoptFlyweight2().childNodes[2].data = 'new value';
        })
        .add('sibling props:text', () => {
            cloneText().firstChild.nextSibling.nextSibling.data = 'new value';
        })
        .add('sibling props:comment', () => {
            cloneComment().firstChild.nextSibling.nextSibling.data = 'new value';
        })
        .add('span injection', () => {
            cloneSpan().data = 'new value';
        })
        .add('reflect span injection call', () => {
            const node = cloneSpan();
            Reflect.set(node, 'data', 'new value', node);
        })
        .add('wat injection', () => {
            cloneWat().data = 'new value';
        })
        .add('wat replace', () => {
            cloneWatReplace().replaceWith(document.createTextNode('new value'));
        });

    await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
    await bench.run();

    const tabulation = bench.table();
    console.table(tabulation);

    console.table(
        bench.todos.map(({ name }) => ({
            'Task name': name,
        })),
    );
}