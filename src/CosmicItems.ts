/**
 * COSMIC PROJECT
 * 
 * Item list
 */

import { Item, FoodItem, AnyItem } from "./CosmicTypes";

export const ITEMS: Record<string | symbol, AnyItem> = {
    LARGER_EGGS: {
        id: 'upgrade_larger_eggs',
        displayName: 'Upgrade: Larger Eggs',
        emoji: '🥚',
        count: 1,
        description: `Bake slightly faster`,
        value: 150,
        sellable: false,
        cake_bonus: 1.25,
        max_stack: 1
    },
}
