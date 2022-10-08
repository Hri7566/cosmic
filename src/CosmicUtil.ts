/**
 * COSMIC PROJECT
 * 
 * Utility module
 */

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

    public static set = CosmicData.utilSet;
    public static get = CosmicData.utilGet;

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
}

/**
 * Module-level exports
 */

export {
    CosmicUtil
}
