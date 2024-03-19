const SVG_PRESET = {
    'gnome-feather-tool': `<svg class="feather feather-tool" viewBox="0 0 24 24" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
}

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
        },
        load_svg: (str)=>SVG_PRESET[str]
    }
}