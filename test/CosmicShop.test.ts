/**
 * COSMIC PROJECT
 * 
 * Shop tests
 */

import { CosmicShop } from '../src/CosmicShop';

const testItem = {
    id: 'test-item',
    displayName: 'Test Item',
    count: 1,
    value: 1
}

describe('Method testing', () => {
    test('Method getListings', () => {
        expect(CosmicShop.getListings()).toBeDefined();
    });
    
    test('Method addItemListing', () => {
        expect(CosmicShop.getListings().find(ls => ls.item.id == testItem.id)).toBeUndefined();
        CosmicShop.addItemListing(testItem);

        let listing = CosmicShop.getListings().find(ls => ls.item.id == testItem.id);

        expect(listing).toBeDefined();
        expect((listing as any).item).toBeDefined();
    });
    
    test('Method getItemPrice', () => {
        CosmicShop.addItemListing(testItem);
        expect(CosmicShop.getItemPrice('test-item')).toBe(1);
    });
});
