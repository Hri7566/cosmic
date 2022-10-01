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
    public static stringHasPrefix(str: string, prefix: string): boolean {
        return str.toLowerCase().startsWith(prefix.toLowerCase());
    }

    public static set = CosmicData.utilSet;
    public static get = CosmicData.utilGet;

    public static trimListString(str) {
        return str.trim().substring(0, str.trim().length - 1).trim();
    }
}

/**
 * Module-level exports
 */

export {
    CosmicUtil
}
