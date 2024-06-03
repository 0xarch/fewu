class FuzzyDate {
    y=1970;
    m=1;
    d=1;
    topMark=0;
    /**
     * 
     * @param {{
     *      y: number,
     *      m: number,
     *      d: number,
     *      k: number
     * } | string} p
     * string format: yyyy-mm-dd-MARK (- or / or [Space])
     */
    constructor(p){
        if(typeof p === 'string'){
            const numbers = p.split(/[\ \-\/]/).map(v => parseInt(v));
            this.y = numbers?.[0] ?? 1970;
            this.m = numbers?.[1] ?? 1;
            this.d = numbers?.[2] ?? 1;
            this.topMark = numbers?.[3] ?? 0;
        } else {
            this.y = p?.y ?? 1970;
            this.m = p?.m ?? 1;
            this.d = p?.d ?? 1;
            this.topMark = p.k ?? 0;
        }
    }
    compareWith(datz) {
        if (datz.y > this.y) return 1;
        if (datz.y < this.y) return -1;
        if (datz.m > this.m) return 1;
        if (datz.m < this.m) return -1;
        if (datz.d > this.d) return 1;
        if (datz.d < this.d) return -1;
        if (datz.topMark > this.topMark) return 1;
        if (datz.topMark < this.topMark) return -1;
        return 0;
    }
    isEarlierThan(datz) {
        return this.compareWith(datz) == -1;
    }
    isLaterThan(datz) {
        return !this.compareWith(datz) == 1;
    }
    toPathString() {
        return this.toString('/');
    }
    toString(separator) {
        if (typeof (separator) != 'string') separator = '-';
        return this.y + separator + this.m + separator + this.d;
    }
}

export default FuzzyDate;
