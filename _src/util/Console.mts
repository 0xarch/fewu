import Argv from "./Argv.mjs";


declare type _ConsoleColors = typeof Console.colors;

declare type _ConsoleEffects = typeof Console.effects;

declare type ConsoleComponent = {
    msg: string,
    color?: keyof _ConsoleColors | undefined,
    effect?: keyof _ConsoleEffects | undefined
};

declare type ConsoleAcceptableArgument = ConsoleComponent | string | Error | Array<string>;

class Console {
    static controlStart = '\x1b[';
    static controlEnd = '\x1b[0m';
    static colors = {
        BLACK: '30', RED: '31',
        GREEN: '32', YELLOW: '33',
        BLUE: '34', MAGENTA: '35',
        CYAN: '36', LIGHTGREY: '37',
        DARKGREY: '90',
        LIGHTRED: '91', LIGHTGREEN: '92',
        LIGHTYELLOW: '93', LIGHTBLUE: '94',
        LIGHTMAGENTA: '95', LIGHTCYAN: '96',
        WHITE: '97'
    };
    static effects = {
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
            } else if (message instanceof Error) {
                parsedMessage.push(message.message + '\n' + message.stack as string);
            } else if (Array.isArray(message)) {
                parsedMessage.push('[', ...message, ']');
            } else {
                let prefix = '';
                if (message.color !== undefined) {
                    prefix += Console.colors[message.color];
                }
                if (message.effect !== undefined) {
                    prefix += Console.effects[message.effect];
                }
                parsedMessage.push(Console.controlStart + prefix + 'm' + message.msg + Console.controlEnd);

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

    static may = Argv['-Q'] || Argv['--quiet'] ? {
        info() { },
        error() { },
        log() { },
        warn() { }
    } : {
        info(...messages: ConsoleAcceptableArgument[]) {
            let parsedMessage = Console.#parseMessage(messages);
            console.info(`${Console.controlStart}${Console.colors.GREEN}m[INFO] ${Console.controlEnd}`, ...parsedMessage);
        },

        error(...messages: ConsoleAcceptableArgument[]) {
            let parsedMessage = Console.#parseMessage(messages);
            console.error(`${Console.controlStart}${Console.colors.RED}m[ERROR]${Console.controlEnd}`, ...parsedMessage);
        },

        log(...messages: ConsoleAcceptableArgument[]) {
            let parsedMessage = Console.#parseMessage(messages);
            console.log(`${Console.controlStart}${Console.colors.GREEN}m[LOG]  ${Console.controlEnd}`, ...parsedMessage);
        },

        warn(...messages: ConsoleAcceptableArgument[]) {
            let parsedMessage = Console.#parseMessage(messages);
            console.log(`${Console.controlStart}${Console.colors.YELLOW}m[WARN] ${Console.controlEnd}`, ...parsedMessage);
        },
    }
}

export default Console;