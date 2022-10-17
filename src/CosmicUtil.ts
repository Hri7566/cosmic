/**
 * COSMIC PROJECT
 * 
 * Utility module
 */

import { Cosmic } from "./Cosmic";
import { CosmicLogger, red } from "./CosmicLogger";

/**
 * Local module imports
 */

const { CosmicData } = require('./CosmicData');

/**
 * Module-level declarations
 */

class CosmicUtil {
    /**
     * Check if a string starts with a prefix
     * @param str String with supposed prefix
     * @param prefix Prefix
     * @returns True if the string has the prefix, otherwise false
     */
    public static stringHasPrefix(str: string, prefix: string): boolean {
        return str.toLowerCase().startsWith(prefix.toLowerCase());
    }

    public static async set(key: string, val: string, _id: string = 'util') {
        return await CosmicData.utilSet(key, val, _id);
    }

    public static async get(key: string, _id: string = 'util') {
        return await CosmicData.utilGet(key, _id);
    }

    public static logger = new CosmicLogger("CosmicUtil", red);

    /**
     * Trim the few characters at the end of a list
     *
     * Example: "Hello | Goodbye |" -> "Hello | Goodbye"
     * @param str String of list to truncate ending
     * @returns Trimmed string
     */
    public static trimListString(str: string): string {
        return str.trim().substring(0, str.trim().length - 1).trim();
    }
    
    /**
     * Get the nearest number to a specified value in an array
     * @param num Number to search for
     * @param arr Array of numbers to check
     * @returns Number from `arr` that has the smallest difference to `num`
     */
    public static getClosestNumberFromArray(num: number, arr: number[]): number {
        let curr = arr[0];

        for (let val of arr) {
            if (Math.abs(num - val) < Math.abs(num - curr)) {
                curr = val;
            }
        }

        return curr;
    }
    
    /**
     * Get a random value from an array
     * @param arr Array of random elements
     * @returns Random element from array
     */
    public static async getRandomValueFromArray(arr: any[]) {
        let prev = await this.get('PREVIOUS_RANDOM_INDEX');
        let index = Math.floor(Math.random() * arr.length);
        
        // danger
        if (prev) {
            while (index == prev) {
                index = Math.floor(Math.random() * arr.length);
            }
        }

        this.logger.log("Previous value test:", prev);

        let set_out = await this.set('PREVIOUS_RANDOM_INDEX', index.toString());
        this.logger.log("Set output:", set_out);
        return arr[index];
    }
    
    /**
     * Format an item's data to display as a string
     * @param name Name of item
     * @param emoji Emoji of item
     * @param count Number of items
     * @returns Formatted string
     */
    public static formatItemString(name: string, emoji: string = '', count: number) {
        return `${emoji}${name} ${count > 1 ? `(x${count})` : ''}`;
    }

    // migrated from main class
    /**
     * Get the uptime of the program
     * @returns Time since program start
     */
    public static getUptime(): number {
        return Date.now() - Cosmic.startTime;
    }

    /**
     * Get the memory usage of the program
     * @returns Memory used in megabytes
     */
    public static getMemoryUsage(): number {
        return process.memoryUsage().heapUsed / 1024 / 1024;
    }

    /**
     * Get the time in milliseconds since Cosmic's inception
     * @returns Time in milliseconds
     */
    public static getTimeSinceProjectCreation(): number {
        return Date.now() - new (Date as any)("Sun Jul 31 06:17:45 2022 -0400");
    }
}

/**
 * Module-level exports
 */

export {
    CosmicUtil
}
