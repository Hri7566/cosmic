/**
 * COSMIC PROJECT
 * 
 * Seasonal event detection module
 */

import { Cosmic, Timestamp } from "./CosmicTypes";

let CURRENT_YEAR = new Date().getFullYear();

let HOLIDAYS: Array<Cosmic.Holiday | Cosmic.RangeHoliday> = [
    {
        displayName: 'New Year\'s Day',
        emoji: '🎆',
        timestamp: `Dec 31 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Valentine\'s Day',
        emoji: '💘',
        timestamp: `Feb 14 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Saint Patrick\'s Day',
        emoji: '🍀',
        timestamp: `Mar 17 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Independence Day',
        emoji: '🇺🇸',
        timestamp: `Jul 4 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Halloween',
        emoji: '🎃',
        timestamp: `Oct 31 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Thanksgiving',
        emoji: '🦃',
        start: `Nov 22 ${CURRENT_YEAR}`,
        end: `Nov 28 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Christmas',
        emoji: '🎄',
        timestamp: `Dec 25 ${CURRENT_YEAR}`
    },
    {
        displayName: 'New Year\'s Eve',
        emoji: '🎆',
        timestamp: `Jan 1 ${CURRENT_YEAR}`
    }
]

setInterval(() => {
    CURRENT_YEAR = new Date().getFullYear();
    HOLIDAYS = [
    {
        displayName: 'New Year\'s Day',
        emoji: '🎆',
        timestamp: `Dec 31 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Valentine\'s Day',
        emoji: '💘',
        timestamp: `Feb 14 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Saint Patrick\'s Day',
        emoji: '🍀',
        timestamp: `Mar 17 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Independence Day',
        emoji: '🇺🇸',
        timestamp: `Jul 4 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Halloween',
        emoji: '🎃',
        timestamp: `Oct 31 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Thanksgiving',
        emoji: '🦃',
        start: `Nov 22 ${CURRENT_YEAR}`,
        end: `Nov 28 ${CURRENT_YEAR}`
    },
    {
        displayName: 'Christmas',
        emoji: '🎄',
        timestamp: `Dec 25 ${CURRENT_YEAR}`
    },
    {
        displayName: 'New Year\'s Eve',
        emoji: '🎆',
        timestamp: `Jan 1 ${CURRENT_YEAR}`
    }
]
}, 36e5 * 24 * 14);

export class CosmicSeasonDetection {
    /**
     * Get the current season information.
     * @param t Optional date for detection
     */
    public static getSeason(t?: number): Cosmic.Season {
        const date = new Date(t || Date.now());
        const month = date.getMonth();
        const day = date.getDate();

        if ((month == 2 && day <= 21) || month >= 11 || month < 2) {
            return {
                displayName: 'Winter',
                emoji: '❄'
            }
        }

        if ((month == 8 && day >= 23) || month > 8) {
            return {
                displayName: 'Autumn',
                emoji: '🍁'
            }
        }
        
        if ((month == 5 && day >= 22) || month > 5) {
            return {
                displayName: 'Summer',
                emoji: '☀'
            }
        }

        if ((month == 2 && day >= 22) || month > 2) {
            return {
                displayName: 'Spring',
                emoji: '🌷'
            }
        }
    }
    
    /**
     * Get the current holiday.
     * @param t Optional date
     * @returns Current holiday, otherwise undefined
     */
    public static getHoliday(t?: Timestamp): Cosmic.Holiday | Cosmic.RangeHoliday {
        const date = new Date(t || Date.now());

        for (let hol of HOLIDAYS) {
            if (hol.hasOwnProperty('start')) {
                hol = (hol as Cosmic.RangeHoliday);
                
                if (date > new Date(hol.start) && date < new Date(hol.end)) {
                    return hol;
                }
            } else {
                hol = (hol as Cosmic.Holiday);
                
                if (date > new Date(hol.timestamp) && date < new Date((new Number(new Date(hol.timestamp)) as number) + (36e5 * 24))) {
                    return hol;
                }
            }
        }
    }
}
