/**
 * COSMIC PROJECT
 * 
 * Cosmic logger
 */

/**
 * Module-level imports
 */

// Local imports
const { CosmicColor } = require('./CosmicColor');

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

function hex(hexstr, ...args): string {
    // https://tintin.mudhalla.net/info/ansicolor/
    let c = new CosmicColor(hexstr);
    let str = ``;
    
    for (let i = 0; i < args.length; i++) {
        str += `\x1b[38;2;${c.r};${c.g};${c.b}m${args[i]}\x1b[0m`;

        if (i + 1 < args.length) {
            str += ' ';
        }
    }

    return str;
}

function log_full_info(method = 'log', ...args) {
    const ms = Date.now();
    
    const ss = Math.floor((ms / 1000) % 60);
    const mm = Math.floor((ms / 1000 / 60) % 60);
    const hh = Math.floor((ms / 1000 / 60 / 60) % 24);

    const ampm = Math.floor((ms / 1000 / 60 / 60) % 24) > 12 ? 'PM' : 'AM';

    console[method](`${hh.toString()}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')} ${ampm}`, ...args);
}

/**
 * Main class
 */

class CosmicLogger {
    id: string;
    color: (...args) => string;
    
    constructor(id: string, color: (...args) => string) {
        this.id = id;
        this.color = color;
    }

    log(...args) {
        log_full_info('log', `${blue('[INFO]')} ${this.color(`[${this.id}]`)}`, ...args);
    }

    error(...args) {
        log_full_info('error', `${red('[ERROR]')} ${this.color(`[${this.id}]`)}`, ...args);
    }

    warn(...args) {
        log_full_info('warn', `${yellow('[WARNING]')} ${this.color(`[${this.id}]`)}`, ...args);
    }

    debug(...args) {
        log_full_info('debug', `${blue('[DEBUG]')} ${this.color(`[${this.id}]`)}`, ...args);
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
