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
        icing: 'pink',
        filling: 'chocolate',
        topping: 'strawberry',
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
        id: 'cake_birthday',
        displayName: 'Birthday Cake',
        emoji: '🎂',
        count: 1,
        edible: true,
        icing: 'chocolate',
        filling: 'chocolate',
        topping: 'candle',
        value: 30
    }
];

export const bakingStages = [
    {
        displayName: 'Preheat',
        
    }
];
