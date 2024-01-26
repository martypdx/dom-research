import { Bench } from '/node_modules/tinybench/dist/index.js';


const felix = { name: 'felix', lives: 9 };
class MyClass {
    constructor({ name, lives }) {
        this.name = name;
        this.lives = lives;
    }
}
const myObject = { ...felix };
function myFunction({ name, lives }) {
    return { name, lives };
}
function thisFunction({ name, lives }) {
    this.name = name;
    this.lives = lives;
}

const benchmark = true;

if(benchmark) {
    await doBench(create_objects);
}

async function create_objects(bench) {
    bench
        .add('new class', () => {
            new MyClass(felix);
        })
        .add('function call', () => {
            myFunction(felix);
        })
        .add('new function', () => {
            new myFunction(felix);
        })
        .add('new this function', () => {
            new thisFunction(felix);
        })
}

async function doBench(setup) {
    const bench = new Bench({ time: 5000 });
    setup(bench)
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