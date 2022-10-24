/**
 * COSMIC PROJECT
 * 
 * Cosmic logger
 */

/**
 * Module-level imports
 */

// Local imports
import { Cosmic as CosmicColor } from "./CosmicColor";

/**
 * Module-level declarations
 */

const ANSIColors = new Map();

ANSIColors.set('black',     0);
ANSIColors.set('red',       1);
ANSIColors.set('green',     2);
ANSIColors.set('yellow',    3);
ANSIColors.set('blue',      4);
ANSIColors.set('magenta',   5);
ANSIColors.set('cyan',      6);
ANSIColors.set('white',     7);

function formatAsANSI(ansi, ...args): string {
    let str = "";

    for (let i = 0; i < args.length; i++) {
        str += `\x1b[${ansi}m${args[i]}\x1b[0m`;

        if (i + 1 < args.length) {
            str += ' ';
        }
    }

    return str;
}

const ANSI_REGEX = /[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))/g;

// Direct color exports
//* Use as the second parameter for the main class constructor

function black(...args): string {
    return formatAsANSI('3' + ANSIColors.get('black'), ...args);
}

function red(...args): string {
    return formatAsANSI('3' + ANSIColors.get('red'), ...args);
}

function green(...args): string {
    return formatAsANSI('3' + ANSIColors.get('green'), ...args);
}

function yellow(...args): string {
    return formatAsANSI('3' + ANSIColors.get('yellow'), ...args);
}

function blue(...args): string {
    return formatAsANSI('3' + ANSIColors.get('blue'), ...args);
}

function magenta(...args): string {
    return formatAsANSI('3' + ANSIColors.get('magenta'), ...args);
}

function cyan(...args): string {
    return formatAsANSI('3' + ANSIColors.get('cyan'), ...args);
}

function white(...args): string {
    return formatAsANSI('3' + ANSIColors.get('white'), ...args);
}

function hex(hexstr: string, ...args: any[]): string {
    // https://tintin.mudhalla.net/info/ansicolor/
    let c = new CosmicColor.Color(hexstr);
    let str = ``;
    
    for (let i = 0; i < args.length; i++) {
        str += `\x1b[38;2;${c.r};${c.g};${c.b}m${args[i]}\x1b[0m`;

        if (i + 1 < args.length) {
            str += ' ';
        }
    }

    return str;
}

function log_full_info(method = 'log', ...args: any[]) {
    const ms = (new Number(new Date()) as number);
    const ss = Math.floor((ms / 1000) % 60);
    const mm = Math.floor((ms / 1000 / 60) % 60);
    let hh = Math.floor(((ms / 1000 / 60 / 60) % 12) - (new Date().getTimezoneOffset() / 60));

    let ampm = Math.floor((ms / 1000 / 60 / 60) % 24) > 12 ? 'PM' : 'AM';
    
    if (hh < 0) {
        hh += 12;

        if (ampm == 'AM') {
            ampm = 'PM';
        } else {
            ampm = 'AM'
        }
    }

    console[method](`${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')} ${ampm}`, ...args);
    return [`${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')} ${ampm}`, ...args];
}

/**
 * Main class
 */

class CosmicLogger {
    static PAST_MESSAGES = [];

    /**
     * Get previous console lines as an expanded array
     * @param lines Number of lines
     * @returns Array of arrays of strings containing what was previously logged
     */
    static read(lines: number = 10): string[][] {
        return this.PAST_MESSAGES.slice(this.PAST_MESSAGES.length - lines, this.PAST_MESSAGES.length);
    }

    /**
     * Read previous logs to console
     * @param lines Number of lines
     * @param method Console method to log with (log, error, warn, debug)
     */
    static readToConsole(lines: number = 10, method: string = 'log'): void {
        let prevLogs = this.read(lines);

        for (const log of prevLogs) {
            console[method](log);
        }
    }

    id: string;
    color: (...args) => string;
    
    /**
     * CosmicLogger class
     * @param id String identifier
     * @param color Color method (import from CosmicLogger)
     */
    constructor(id: string, color: (...args) => string) {
        this.id = id;
        this.color = color;
    }

    /**
     * Log to console
     * @param args Content to log
     */
    log(...args: any[]) {
        let [str, pastArgs] = log_full_info('log', `${blue('[INFO]')} ${this.color(`[${this.id}]`)}`, ...args);
        CosmicLogger.PAST_MESSAGES.push([str, ...pastArgs]);
    }

    /**
     * Log to stderr
     * @param args Content to log to stderr
     */
    error(...args: any[]) {
        let [str, pastArgs] = log_full_info('error', `${red('[ERROR]')} ${this.color(`[${this.id}]`)}`, ...args);
        CosmicLogger.PAST_MESSAGES.push([str, ...pastArgs]);
    }

    /**
     * Log warning messages
     * @param args Content to log
     */
    warn(...args: any[]) {
        let [str, pastArgs] = log_full_info('warn', `${yellow('[WARNING]')} ${this.color(`[${this.id}]`)}`, ...args);
        CosmicLogger.PAST_MESSAGES.push([str, ...pastArgs]);
    }

    /**
     * Log debug messages (doesn't run on NODE_ENV=prod)
     * @param args Debug content to log
     */
    debug(...args: any[]) {
        if (process.env.NODE_ENV) {
            if (process.env.NODE_ENV == 'prod') return;
        }
        let [str, pastArgs] = log_full_info('debug', `${blue('[DEBUG]')} ${this.color(`[${this.id}]`)}`, ...args);
        CosmicLogger.PAST_MESSAGES.push([str, ...pastArgs]);
    }
}

/**
 * Module-level exports
 */

export {
    CosmicLogger,
    black,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white,
    hex
}
