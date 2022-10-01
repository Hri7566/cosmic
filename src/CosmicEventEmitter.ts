/**
 * COSMIC PROJECT
 * 
 * Custom Event Emitter subsystem module
 */

/**
 * Global module imports
 */

import { EventEmitter } from 'events';

/**
 * Local module imports
 */

import { Cosmic } from './CosmicTypes';

/**
 * Module-level declarations
 */

const on = EventEmitter.prototype.on;
const off = EventEmitter.prototype.off;
const once = EventEmitter.prototype.once;
const emit = EventEmitter.prototype.emit;

class CosmicEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.bindDefaultListeners();
    }

    public override on(eventName: string | symbol, listener: (...args: any[]) => void): any {
        super.on(eventName, listener);
        return this;
    }

    public override off(eventName: string | symbol, listener: (...args: any[]) => void): any {
        super.off(eventName, listener);
        return this;
    }

    public override once(eventName: string | symbol, listener: (...args: any[]) => void): any {
        super.once(eventName, listener);
        return this;
    }

    public override emit(eventName: string | symbol, ...args: any[]): any {
        super.emit(eventName, ...args);
        return this;
    }

    private bindDefaultListeners(): void {
        
    }
}

/**
 * Module exports
 */

export {
    CosmicEventEmitter
}
