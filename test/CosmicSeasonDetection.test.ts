/**
 * COSMIC PROJECT
 * 
 * Season detection tests
 */

import { CosmicSeasonDetection } from "../src/CosmicSeasonDetection";

describe('Method testing', () => {
    test('Method getSeason', () => {
        expect(CosmicSeasonDetection.getSeason()).toBeDefined();
    });

    test('Method getHoliday', () => {
        const holiday = CosmicSeasonDetection.getHoliday('Oct 31 2022 12:00');
        expect(holiday).toBeDefined();
        expect(holiday.displayName).toBe('Halloween');
    });
});
