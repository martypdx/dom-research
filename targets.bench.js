
import { Bench } from '/node_modules/tinybench/dist/index.js';
/*
        const code = compile(`const t = <p className={"className"}>
            {"Greeting"} <span>hey {"Azoth"}!</span>
        </p>;`);
        expect(code).toMatchInlineSnapshot(
            `"const targets = (r,t) => [r,r.childNodes[1],t[0].childNodes[1]];"`
*/

const objectMap = [
    { index: -1, child: -1 },
    { index: -1, child: 1 },
    { index: 0, child: 1 },
];

const generated = (r, t) => [r, r.childNodes[1], t[0].childNodes[1]];

const template = document.createElement('template');
template.innerHTML = `<p data-bind=""> <!--1--> <span data-bind>hey <!--0--></span></p>`;
const nodes = template.content.querySelectorAll('[data-bind]');
const root = nodes[0];
const targets = [nodes[1]];

const imperativeMapped = (input, r, t) => {
    const mapped = Array(input.length);
    for(let i = 0; i < input.length; i++) {
        const { index, child } = input[i];
        const node = index === -1 ? r : t[index];
        mapped[i] = (child === -1 ? node : node.childNodes[child]);
    }
    return mapped;
};

const imperativeTupleMapped = (inputs, r, t) => {
    const mapped = Array(inputs.length);
    for(let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const index = input[0];
        const child = input[1];
        const node = index === -1 ? r : t[index];
        mapped[i] = (child === -1 ? node : node.childNodes[child]);
    }
    return mapped;
};

const objectMapped = (input, r, t) => {
    return input.map(({ index, child }) => {
        const node = index === -1 ? r : t[index];
        return child === -1 ? node : node.childNodes[child];
    });
};

const tupleMap = [
    [-1, -1],
    [-1, 1],
    [0, 1],
];

const tupleMapped = (input, r, t) => {
    return input.map(([index, child]) => {
        const node = index === -1 ? r : t[index];
        return child === -1 ? node : node.childNodes[child];
    });
};

console.log(generated(root, targets));
console.log(objectMapped(objectMap, root, targets));
console.log(tupleMapped(tupleMap, root, targets));
console.log(imperativeMapped(objectMap, root, targets));

const benchmark = true;

if(benchmark) {
    await doBench(run);
}


async function run(bench) {
    bench
        .add('static', () => {
            generated(root, targets);
        })
        .add('object mapped', () => {
            objectMapped(objectMap, root, targets);
        })
        .add('tuple mapped', () => {
            tupleMapped(tupleMap, root, targets);
        })
        .add('imperative mapped', () => {
            imperativeMapped(objectMap, root, targets);
        })
        .add('imperative tuple mapped', () => {
            imperativeTupleMapped(tupleMap, root, targets);
        });
}

async function doBench(setup) {
    const bench = new Bench({ time: 1000 });
    setup(bench);
    await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
    await bench.run();

    const tabulation = bench.table();
    console.table(tabulation);

    if(bench.todos.length) {
        console.table(
            bench.todos.map(({ name }) => ({
                'Task name': name,
            })),
        );
    }

}