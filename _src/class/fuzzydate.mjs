class FuzzyDate {
    y=1970;
    m=1;
    d=1;
    /**
     * 
     * @param {{
     *      y: number,
     *      m: number,
     *      d: number
     * }} p 
     */
    constructor(p){
        this.y = p?.y ?? 1970;
        this.m = p?.m ?? 1;
        this.d = p?.d ?? 1;
    }
    compareWith(datz) {
        if (datz.y > this.y) return 1;
        if (datz.y < this.y) return -1;
        if (datz.m > this.m) return 1;
        if (datz.m < this.m) return -1;
        if (datz.d > this.d) return 1;
        if (datz.d < this.d) return -1;
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