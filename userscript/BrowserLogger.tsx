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
}

class BrowserLogger {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    log(...args: any[]) {
        log_full_info('log', `[INFO]`, `[${this.id}]`, ...args);
    }

    error(...args: any[]) {
        log_full_info('error', `[ERROR]`, `[${this.id}]`, ...args);
    }

    warn(...args: any[]) {
        log_full_info('warn', `[WARNING]`, `[${this.id}]`, ...args);
    }

    debug(...args: any[]) {
        log_full_info('log', `[DEBUG]`, `[${this.id}]`, ...args);
    }
}

export {
    BrowserLogger
}
