/**
 * COSMIC PROJECT
 * 
 * Cakes
 */

const { Cake } = require('./CosmicTypes');

export const cakes: Array<typeof Cake> = [
    {
        id: 'cake_chocolate',
        displayName: 'Chocolate Cake',
        emoji: '🎂',
        count: 1,
        edible: true,
        icing: 'chocolate',
        filling: 'chocolate',
        value: 15
    },
    {
        id: 'cake_vanilla',
        displayName: 'Vanilla Cake',
        emoji: '🍰',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'vanilla',
        topping: 'cherry',
        value: 18
    },
    {
        id: 'cupcake_strawberry',
        displayName: 'Strawberry Cupcake',
        emoji: '🧁',
        count: 6,
        edible: true,
        icing: 'strawberry',
        filling: 'chocolate',
        value: 2
    },
    {
        id: 'cupcake_vanilla',
        displayName: 'Vanilla Cupcake',
        emoji: '🧁',
        count: 6,
        edible: true,
        icing: 'white',
        filling: 'vanilla',
        value: 2
    },
    {
        id: 'cupcake_strawberry',
        displayName: 'Chocolate Cupcake',
        emoji: '🧁',
        count: 6,
        edible: true,
        icing: 'chocolate',
        filling: 'chocolate',
        topping: '',
        value: 2
    },
    {
        id: 'cupcake_halloween',
        displayName: 'Strawberry Cupcake',
        emoji: '🧁',
        count: 6,
        edible: true,
        icing: 'purple',
        filling: 'chocolate',
        topping: 'plastic',
        value: 2
    },
    {
        id: 'cupcake_valentines',
        displayName: 'Valentine\'s Cupcake',
        emoji: '🧁',
        count: 6,
        edible: true,
        icing: 'pink',
        filling: 'velvet',
        topping: 'strawberries',
        value: 2
    },
    {
        id: 'cupcake_gender_boy',
        displayName: 'Gender Reveal Cupcake (Boy)',
        emoji: '🧁',
        count: 6,
        edible: true,
        icing: 'blue',
        filling: 'chocolate',
        value: 2
    },
    {
        id: 'cupcake_gender_girl',
        displayName: 'Gender Reveal Cupcake (Girl)',
        emoji: '🧁',
        count: 6,
        edible: true,
        icing: 'pink',
        filling: 'vanilla',
        value: 2
    },
    {
        id: 'cake_angel',
        displayName: 'Angel Food Cake',
        emoji: '😇',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'vanilla',
        topping: 'fruit',
        value: 20
    },
    {
        id: 'cake_carrot',
        displayName: 'Carrot Cake',
        emoji: '🥕',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'carrot',
        value: 25
    },
    {
        id: 'cake_velvet',
        displayName: 'Red Velvet Cake',
        emoji: '❤',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'red',
        value: 25
    },
    {
        id: 'cake_sponge',
        displayName: 'Sponge Cake',
        emoji: '🧽',
        count: 1,
        edible: true,
        icing: 'none',
        filling: 'lemon',
        value: 20
    },
    {
        id: 'cake_pineapple',
        displayName: 'Pineapple Upside-Down Cake',
        emoji: '🍍',
        count: 1,
        edible: true,
        icing: 'none',
        filling: 'pineapple',
        topping: 'pineapple',
        value: 15
    },
    {
        id: 'cake_fruit',
        displayName: 'Fruit Cake',
        emoji: '🎄',
        count: 1,
        edible: true,
        icing: 'none',
        filling: 'fruit',
        topping: 'nuts',
        value: 5
    },
    {
        id: 'cake_cheese',
        displayName: 'Cheesecake',
        emoji: '🍰',
        count: 1,
        edible: true,
        icing: 'none',
        filling: 'cream',
        topping: 'graham',
        value: 10
    }
];

export const uncommon_cakes: Array<typeof Cake> = [
    {
        id: 'cake_birthday',
        displayName: 'Birthday Cake',
        emoji: '🎂',
        count: 1,
        edible: true,
        icing: 'chocolate',
        filling: 'chocolate',
        topping: 'candle',
        value: 30
    },
    {
        id: 'cake_crab',
        displayName: 'Crab Cake',
        emoji: '🦀',
        count: 2,
        edible: true,
        icing: 'bread',
        filling: 'crab',
        topping: 'garlic',
        value: 10
    },
    {
        id: 'cake_party',
        displayName: 'Party Cake',
        emoji: '🎉',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'vanilla',
        topping: 'cherries',
        value: 25
    },
    {
        id: 'cake_matcha',
        displayName: 'Matcha Green Tea Cake',
        emoji: '🍵',
        count: 1,
        edible: true,
        icing: 'green',
        filling: 'matcha',
        value: 50
    },
    {
        id: 'cake_oreo',
        displayName: 'Oreo Cake',
        emoji: '🍪',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'chocolate',
        topping: 'oreos',
        value: 50
    },
    {
        id: 'cake_peanut_candy',
        displayName: 'Reese\'s Peanut Butter Cup Cake',
        emoji: '🥜',
        count: 1,
        edible: true,
        icing: 'chocolate',
        filling: 'peanut butter',
        topping: 'reese\'s peanut butter cups',
        value: 50
    },
    {
        id: 'cake_ice_cream',
        displayName: 'Ice Cream Cake',
        emoji: '🍦',
        count: 1,
        edible: true,
        icing: 'ice cream',
        filling: 'ice cream',
        value: 50
    }
];

export const rare_cakes: Array<typeof Cake> = [
    {
        id: 'cake_party',
        displayName: 'Party Cake',
        emoji: '🎉',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'vanilla',
        topping: 'cherries',
        value: 20
    }
];

export const ultra_rare_cakes: Array<typeof Cake> = [

];

export const secret_cakes: Array<typeof Cake> = [
    {
        id: 'cake_cosmic',
        displayName: 'Cosmic Cake',
        emoji: '🟇',
        count: 1,
        edible: true,
        icing: 'space',
        filling: 'galaxies',
        topping: 'stars',
        value: 1_000_000
    }
];
