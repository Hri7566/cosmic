/**
 * COSMIC PROJECT
 * 
 * Item shop module
 */

import { EventEmitter } from 'events';
import { Item, ShopListing } from './CosmicTypes';
import { SHOP_ITEMS } from './CosmicShopItems';
import { CosmicSeasonDetection } from './CosmicSeasonDetection';

const DEFAULT_PRICE = 10;

class CosmicShop {
    protected static list: ShopListing[] = SHOP_ITEMS;
    public static emoji = '🛒';

    /**
     * Get the current item listings in the shop
     * @returns List of items in the shop
     */
    public static getListings(): ShopListing[] {
        let rendered = [];

        for (const ls of this.list) {
            if (ls.season) {
                if (CosmicSeasonDetection.getSeason().displayName == ls.season) {
                    rendered.push(ls);
                }
            } else {
                rendered.push(ls);
            }
        }
        return this.list;
    }

    /**
     * Get the price of an item in the shop
     * @param id Item ID
     * @returns Value of item, otherwise undefined
     */
    public static getItemPrice(id: string): number {
        for (let ls of this.list) {
            if (ls.item.id == id) {
                return ls.overridePrice || ls.item.value || DEFAULT_PRICE;
            }
        }
    }

    /**
     * Get an item listing from the shop
     * @param id Item ID
     * @returns Shop listing object
     */
    public static getItemListing(id: string): ShopListing {
        for (let ls of this.list) {
            if (ls.item.id == id) {
                return ls;
            }
        }
    }

    public static addItemListing(it: Item, overridePrice?: number, season?: string): void {
        this.list.push({
            item: it,
            overridePrice,
            season
        });
    }

    public static removeItemListing(id: string): boolean {
        for (let ls of this.list) {
            if (ls.item.id == id) {
                this.list.splice(this.list.indexOf(ls), 1);
                return true;
            }
        }
        
        return false;
    }
}

export {
    CosmicShop
}
