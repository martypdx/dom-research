import { Bench } from '/node_modules/tinybench/dist/index.js';


const html = (strings, ...exprs) => {
    const template = document.createElement('template');
    template.innerHTML = String.raw(strings, ...exprs);
    return template.content.firstElementChild;
};

class WordCount extends HTMLParagraphElement {
    // Element functionality written in here
}

class Divvy extends HTMLDivElement {
    // Element functionality written in here
}
class PopupInfo extends HTMLElement {
    // Element functionality written in here
}
customElements.define("word-count", WordCount, { extends: "p" });
customElements.define("div-vy", Divvy, { extends: "div" });
customElements.define("popup-info", PopupInfo);


const benchmark = true;

if(benchmark) {
    await doBench(createElement);
}

async function createElement(bench) {
    bench
        .add('div', () => {
            document.createElement('div');
        })
        .add('wat', () => {
            document.createElement('wat');
        })
        .add('p is word-count', () => {
            document.createElement('p', { is: 'word-count' });
        })
        .add('div is div-vy', () => {
            document.createElement('div', { is: 'div-vy' });
        })
        .add('popup-info', () => {
            document.createElement('popup-info');
        });
}

async function doBench(setup) {
    const bench = new Bench();
    setup(bench)
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