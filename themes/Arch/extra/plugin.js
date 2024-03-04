function plugin() {
    return {
        hasPropertyThenOr: (g1, g2, g3) => {
            return GObject.hasProperty(g1, g2) ? GObject.getProperty(g1, g2) : g3
        },
        /**
         * 
         * @param {string} str 
         * @returns {string} css hex code
         */
        getColorByString: (str) => {
            /* NOTE that we don't need to build code for utf plane,
               THIS function uses to get color, nothing about chars output
            */
            let arr = ['', '', ''];
            while (str.length % 3 != 0) str += '^';
            for (let i = 0; i < str.length; i += 3) {
                arr[0] += str[i];
                arr[1] += str[i + 1];
                arr[2] += str[i + 2];
            }
            let arr_num = arr.map(v => {
                let sum = 0;
                for (let i = 0; i < v.length; i++)
                    sum += v.charCodeAt(i);
                sum = (sum % 255).toString(16).padStart(2, 'f');
                return sum;
            });
            return '#' + arr_num.join('');
        }
    }
}