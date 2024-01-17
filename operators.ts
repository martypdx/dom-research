
export { };

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
    const change = async (nextValue?: any) => {
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