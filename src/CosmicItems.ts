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
    },
    CARE_A: {
        id: 'care_a',
        displayName: 'Care A',
        description: "When the emergency began, you were all looking for Care A.",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 1
    },
    CARE_B: {
        id: 'care_b',
        displayName: 'Care B',
        description: "Care B is scared and pounding on the door.",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 1
    },
    CARE_NLM: {
        id: 'care_nlm',
        displayName: 'Care NLM',
        description: "Care NLM escaped from the school's basement and wandered the Newmaker Plane for days.",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 1
    },
    HEROS_BOW: {
        id: 'bow_hero',
        displayName: "Hero's Bow",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 1
    },
    FIRE_ARROW: {
        id: 'arrow_fire',
        displayName: "Fire Arrow",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 30
    },
    ICE_ARROW: {
        id: 'arrow_ice',
        displayName: "Ice Arrow",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 30
    },
    LIGHT_ARROW: {
        id: 'arrow_light',
        displayName: "Light Arrow",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 30
    },
    BOMB: {
        id: 'bomb',
        displayName: "Bomb",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 20
    },
    LENS_OF_TRUTH: {
        id: 'lens_of_truth',
        displayName: "Lens of Truth",
        count: 1,
        value: 0,
        sellable: false,
        max_stack: 1
    },
    HOOKSHOT: {
        id: 'hookshot',
        displayName: "Hookshot",
        count: 1,
        value: 100000,
        sellable: false,
        max_stack: 1
    },
    GREAT_FAIRY_SWORD: {
        id: 'sword_great_fairy',
        displayName: "Great Fairy's Sword",
        count: 1,
        value: 10_000_000,
        sellable: false,
        max_stack: 1
    },
    BOTTLE: {
        id: 'bottle',
        displayName: "Bottle",
        count: 6,
        value: 500000,
        max_stack: 1,
        sellable: false
    },
    PICTOGRAPH_BOX: {
        id: 'pictograph_box',
        displayName: "Pictograph Box",
        count: 1,
        value: 250000,
        max_stack: 1,
        sellable: false
    },
    RECYCLE_BIN: {
        id: 'recycle_bin',
        displayName: "Recycle Bin",
        count: 1,
        value: 500,
        max_stack: 1,
        sellable: false
    },
    GOLD_SPRING: {
        id: 'spring_gold',
        displayName: "Gold Spring",
        count: 1,
        value: 250,
        max_stack: 1,
        sellable: false
    },
    SILVER_SPRING: {
        id: 'spring_silver',
        displayName: "Silver Spring",
        count: 1,
        value: 250,
        max_stack: 1,
        sellable: false
    }
}
