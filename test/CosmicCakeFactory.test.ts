/**
 * COSMIC PROJECT
 * 
 * Cake factory tests
 */

import { CosmicCakeFactory } from '../src/CosmicCakeFactory';

describe('Method testing', () => {
    test('Method generateRandomCake', () => {
        for (let i = 0; i < 1000; i++) {
            let cake = CosmicCakeFactory.generateRandomCake();
            expect(cake).toBeDefined();
        }
    });
});
