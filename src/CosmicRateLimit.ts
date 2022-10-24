/**
 * COSMIC PROJECT
 * 
 * Rate limit module
 * This module was originally written by Brandon Lockaby circa 2012.
 * It has been repurposed for use here.
 */

/**
 * Module-level declarations
 */

namespace CosmicRateLimit {
    class RateLimit {
        private interval_ms: number;
        private after: number = 0;

        constructor(interval_ms: number) {
            this.interval_ms = interval_ms || 0;
        }

        public attempt(time: number = Date.now()): boolean {
            if (time < this.after) return false;
            
            this.after = time + this.interval_ms;
            return true;
        }

        public setInterval(interval_ms: number) {
            this.after += interval_ms - this.interval_ms;
            this.interval_ms = interval_ms;
        }
    }

    class RateLimitChain {
        protected chain: RateLimit[];

        constructor(num: number, interval_ms: number) {
            this.setNumAndInterval(num, interval_ms);
        }

        public setNumAndInterval(num: number, interval_ms: number) {
            this.chain = [];

            for (let i = 0; i < this.chain.length; i++) {
                this.chain.push(new RateLimit(interval_ms));
            }
        }

        public attempt(time: number = Date.now()) {
            for (let i = 0; i < this.chain.length; i++) {
                if (this.chain[i].attempt(time)) return true;
            }
        }
    }

    class DataRateLimit {
        private limit: number;
        private interval_ms: number;
        private after = 0;
        private size = 0;

        constructor(limit: number, interval_ms: number) {
            this.limit = limit;
            this.interval_ms = interval_ms || 0;
        }
        
        attempt(size: number, time: number = Date.now()) {
            if (time >= this.after) {
                this.size = 0;
                this.after = time + this.interval_ms;
            }
            
            if (this.size + size <= this.limit) {
                this.size += size;
                return true;
            } else {
                return false;
            }
        }
    }
}

/**
 * Module exports
 */

export {
    CosmicRateLimit
}
