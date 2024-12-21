declare interface _ConsoleColors {
    BLACK: string, RED: string,
    GREEN: string, YELLOW: string,
    BLUE: string, MAGENTA: string,
    CYAN: string, LIGHTGREY: string,
    WHITE: string
}

declare interface _ConsoleEffects {
    BOLD: string,
    ITALIC: string,
    UNDERLINE: string,
    NONE: string
}

declare type ConsoleComponent = {
    msg: string,
    color: keyof _ConsoleColors | undefined,
    effect: keyof _ConsoleEffects | undefined
};

declare type ConsoleAcceptableArgument = ConsoleComponent | string;

class Console {
    static controlStart = '\x1b[';
    static controlEnd = '\x1b[0m';
    static colors: _ConsoleColors = {
        BLACK: '30', RED: '31',
        GREEN: '32', YELLOW: '33',
        BLUE: '34', MAGENTA: '35',
        CYAN: '36', LIGHTGREY: '37',
        WHITE: '39'
    };
    static effects: _ConsoleEffects = {
        BOLD: ';1',
        ITALIC: ';3',
        UNDERLINE: ';4',
        NONE: ''
    };

    static #parseMessage(messages: ConsoleAcceptableArgument[]) {
        let parsedMessage: string[] = [];
        for (let message of messages) {
            if (typeof message === 'string') {
                parsedMessage.push(message);
            } else {
                let prefix = '';
                if (message.color !== undefined) {
                    prefix += Console.colors[message.color];
                }
                if (message.effect !== undefined) {
                    prefix += Console.effects[message.effect];
                }
                parsedMessage.push(Console.controlStart + prefix + 'm', message.msg, Console.controlEnd);

            }
        }
        return parsedMessage;
    }

    static info(...messages: ConsoleAcceptableArgument[]) {
        let parsedMessage = Console.#parseMessage(messages);
        console.info(`${Console.controlStart}${Console.colors.GREEN}m[INFO] ${Console.controlEnd}`, ...parsedMessage);
    }

    static error(...messages: ConsoleAcceptableArgument[]) {
        let parsedMessage = Console.#parseMessage(messages);
        console.error(`${Console.controlStart}${Console.colors.RED}m[ERROR]${Console.controlEnd}`, ...parsedMessage);
    }

    static log(...messages: ConsoleAcceptableArgument[]) {
        let parsedMessage = Console.#parseMessage(messages);
        console.log(`${Console.controlStart}${Console.colors.GREEN}m[LOG]  ${Console.controlEnd}`, ...parsedMessage);
    }

    static warn(...messages: ConsoleAcceptableArgument[]) {
        let parsedMessage = Console.#parseMessage(messages);
        console.log(`${Console.controlStart}${Console.colors.YELLOW}m[WARN] ${Console.controlEnd}`, ...parsedMessage);
    }
}

export default Console;