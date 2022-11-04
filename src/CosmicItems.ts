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
        displayName: 'Seasonal Candy',
        emoji: '🍬',
        count: 1,
        description: `Yummy candy`,
        value: 100,
        sellable: true,
        max_stack: 99
    },
    ANONYPPLE: {
        id: 'anonypple',
        displayName: 'Anonypple',
        emoji: '🍎',
        count: 1,
        description: 'Why am I even making this?',
        value: 25,
        sellable: true,
        max_stack: 999
    },
    SAND: {
        id: 'sand',
        displayName: 'Sand',
        count: 1,
        description: 'No yeeting.',
        value: 0,
        sellable: true,
        max_stack: 9999
    },
    DEKU_SHIELD: {
        id: 'shield_deku',
        displayName: 'Deku Shield',
        emoji: '🪵',
        count: 1,
        value: 250,
        sellable: true,
        max_stack: 1
    },
    HYLIAN_SHIELD: {
        id: 'shield_hylian',
        displayName: 'Hylian Shield',
        emoji: '🛡️',
        count: 1,
        value: 250,
        sellable: true,
        max_stack: 1
    },
    FAIRY_OCARINA: {
        id: 'ocarina_fairy',
        displayName: 'Fairy Ocarina',
        count: 1,
        value: 1000,
        sellable: true,
        max_stack: 1
    },
    OCARINA_OF_TIME: {
        id: 'ocarina_time',
        displayName: 'Ocarina of Time',
        count: 1,
        value: 5000,
        sellable: true,
        max_stack: 1
    },
    DEKU_STICK: {
        id: 'deku_stick',
        displayName: 'Deku Stick',
        count: 1,
        value: 101,
        sellable: true,
        max_stack: 10
    },
    RED_POTION: {
        id: 'potion_health',
        displayName: 'Red Potion',
        count: 1,
        value: 500,
        sellable: true,
        max_stack: 1
    },
    HOT_SAUCE: {
        id: 'hot_sauce',
        displayName: 'Hot Sauce',
        count: 1,
        value: 500,
        sellable: false,
        max_stack: 3
    }
}
