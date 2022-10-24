/**
 * COSMIC PROJECT
 * 
 * Utility tests
 */

const datamap = {};

jest.mock('../src/CosmicData', () => {
    return {
        CosmicData: {
            utilSet: (key: string, val: any, _id: string = 'util') => {
                if (!datamap[_id]) {
                    datamap[_id] = new Map();
                }

                datamap[_id].set(key, val);
            },
            utilGet: (key: string, _id: string = 'util') => {
                if (!datamap[_id]) return;

                return datamap[_id].get(key);
            }
        }
    }
});

import { CosmicUtil } from '../src/CosmicUtil';

describe('Method testing', () => {
    test('Method stringHasPrefix', () => {
        expect(CosmicUtil.stringHasPrefix('*help', '*')).toBe(true);
    });

    test('Method get', async () => {
        await CosmicUtil.set('test-value', 42);

        expect(await CosmicUtil.get('test-value')).toBe(42);
    });
    
    test('Method trimListString', () => {
        expect(CosmicUtil.trimListString('Hello | Goodbye | Good evening |')).toBe('Hello | Goodbye | Good evening');
    });

    test('Method getClosestNumberFromArray', () => {
        expect(CosmicUtil.getClosestNumberFromArray(12, [5, 15])).toBe(15);
    });
});
