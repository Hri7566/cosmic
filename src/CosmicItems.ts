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
        value: 1000,
        sellable: false,
        cake_bonus: 1.05,
        max_stack: 1
    },
    BIGGER_BRAIN: {
        id: 'upgrade_bigger_brain',
        displayName: 'Upgrade: Bigger Brain',
        emoji: '🧠',
        count: 1,
        description: `Think better`,
        value: 2000,
        sellable: false,
        cake_bonus: 1.05,
        max_stack: 1
    },
    CANDY: {
        id: 'candy',
        displayName: 'Halloween Candy',
        emoji: '🍬',
        count: 1,
        description: `Yummy candy`,
        value: 100,
        sellable: true,
        max_stack: 99
    }
}
