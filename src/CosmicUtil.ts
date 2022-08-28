/**
 * COSMIC PROJECT
 * 
 * Utility module
 */

class CosmicUtil {
    public static stringHasPrefix(str: string, prefix: string): boolean {
        return str.toLowerCase().startsWith(prefix.toLowerCase());
    }
}

export {
    CosmicUtil
}
