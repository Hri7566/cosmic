/**
 * COSMIC PROJECT
 * Cosmic item shop module
 */

import { EventEmitter } from 'events';
import { Item, ShopListing } from './CosmicTypes';

const DEFAULT_PRICE = 10;

class CosmicShop {
    protected static itemList: ShopListing[] = [];

    public static getListings(): ShopListing[] {
        return this.itemList;
    }

    public static getItemPrice(id: string): number {
        for (let ls of this.itemList) {
            if (ls.item.id == id) {
                return ls.overridePrice || ls.item.value || DEFAULT_PRICE;
            }
        }
    }
}

export {
    CosmicShop
}
