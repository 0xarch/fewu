const TERMINAL_STYLE_END = `\x1b[0m`;
const TERMINAL_COLOR = {
    BLACK: '30', RED: '31',
    GREEN: '32', YELLOW: '33',
    BLUE: '34', MAGENTA: '35',
    CYAN: '36', LIGHTGREY: '37',
    WHITE: '39'
};
const TERMINAL_EFFECT = {
    BOLD: ';1',
    ITALIC: ';3',
    UNDERLINE: ';4',
    NONE: ''
};

class Console {
    static controlStart = '\x1b[';
    static controlEnd = '\x1b[0m';
    static colors = {
        BLACK: '30', RED: '31',
        GREEN: '32', YELLOW: '33',
        BLUE: '34', MAGENTA: '35',
        CYAN: '36', LIGHTGREY: '37',
        WHITE: '39'
    };
    static effects = {
        BOLD: ';1',
        ITALIC: ';3',
        UNDERLINE: ';4',
        NONE: ''
    }

    static #parseMessage(messages){
        let parsedMessage = [];
        for(let message of messages){
            if(message.msg){
                let prefix = '';
                if(message.color && message.color in Console.colors){
                    prefix += Console.colors[message.color];
                }
                if(message.effect && message.effect in Console.effects){
                    prefix += Console.effects[message.effect];
                }
                parsedMessage.push(Console.controlStart+prefix+'m',message.msg,Console.controlEnd);
            } else {
                parsedMessage.push(message);
            }
        }
        return parsedMessage;
    }

    /**
     * 
     * @param  {...{color:keyof Console.colors,effect:keyof Console.effects,msg:any}|any} messages 
     */
    static info(...messages){
        let parsedMessage = Console.#parseMessage(messages);
        console.info(`${Console.controlStart}${Console.colors.GREEN}m[INFO] ${Console.controlEnd}`,...parsedMessage);
    }

    /**
     * 
     * @param  {...{color:keyof Console.colors,effect:keyof Console.effects,msg:any}|any} messages 
     */
    static error(...messages){
        let parsedMessage = Console.#parseMessage(messages);
        console.error(`${Console.controlStart}${Console.colors.RED}m[ERROR]${Console.controlEnd}`,...parsedMessage);
    }

    /**
     * 
     * @param  {...{color:keyof Console.colors,effect:keyof Console.effects,msg:any}|any} messages 
     */
    static log(...messages){
        let parsedMessage = Console.#parseMessage(messages);
        console.log(`${Console.controlStart}${Console.colors.GREEN}m[LOG]  ${Console.controlEnd}`,...parsedMessage);
    }
}

export default Console;