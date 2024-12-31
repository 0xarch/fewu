class BuiltinCorrespond {
    from = '';
    to = '';
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

// macros
function Correspond(from, to) { return new BuiltinCorrespond(from, to) }

export {
    Correspond
}