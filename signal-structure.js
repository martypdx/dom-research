
function signal(initial) {
    let value = initial;
    const scribers = new Set();
    const notify = () => scribers.forEach(s => s(value));
    const subscribe = s => scribers.add(s); // for "hot" signal add s(value)
    const add = incr => {
        value = (value ?? 0) + incr;
        notify();
    };

    return { subscribe, add };
}

function getCountSignal(initial) {
    let value = initial;
    const signal = new Signal();
    const subscribe = signal.subscribe.bind(signal);

    const add = incr => {
        value = (value ?? 0) + incr;
        signal.notify(value);
    };

    return { subscribe, add };
}

class Signal extends Set {
    notify(payload) {
        this.forEach(s => s(payload));
    }
    subscribe(s) {
        this.add(s);
    }
}

class ValueSignal {
    constructor(initial) {
        this.signal = new Signal();
        this.value = initial;
    }
    subscribe(s) {
        this.signal.subscribe(s);
        // for "hot" signal add:
        // s(this.value);
    }
}

class CountSignal extends ValueSignal {
    add(incr) {
        this.signal.notify(this.value = (this.value ?? 0) + incr);
    }
}

console.log('signal');
const { subscribe, add } = signal(0);
subscribe(console.log);
add(1);
add(3);
add(2);

console.log('CountSignal');
const countSignal = new CountSignal(5);
countSignal.subscribe(console.log);
countSignal.add(1);
countSignal.add(2);
countSignal.add(1);

console.log('getCountSignal');
const c2Signal = getCountSignal(3);
c2Signal.subscribe(console.log);
c2Signal.add(2);
c2Signal.add(2);
c2Signal.add(10);


async function* store(initial) {
    let value = initial;
    const change = newValue => value = newValue;

    let request = yield await value;
    while(true) {
        change(request);
        request = yield await value;
    }
}

async function operator(initial) {
    const iterator = store(initial);
    const change = async nextValue => {
        const { value } = await iterator.next(nextValue);
        return value;
    };
    const value = await change();
    return { change, value };
}

async function counter(count) {
    let { change, value } = await operator(count);
    const doChange = async amt => value = await change(value + amt);
    return {
        increment: () => doChange(1),
        decrement: () => doChange(-1),
    };
}

console.log('operator');

const { increment, decrement } = await counter(5);

console.log(await increment());
console.log(await increment());
console.log(await increment());
console.log(await decrement());
console.log(await decrement());
console.log(await decrement());
console.log(await increment());