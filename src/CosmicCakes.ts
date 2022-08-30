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
        filling: 'chocolate'
    },
    {
        id: 'cake_vanilla',
        displayName: 'Vanilla Cake',
        emoji: '🍰',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'vanilla',
        topping: 'cherry'
    },
    {
        id: 'cupcake_strawberry',
        displayName: 'Strawberry Cupcake',
        emoji: '🧁',
        count: 1,
        edible: true,
        icing: 'pink',
        filling: 'chocolate',
        topping: 'strawberry'
    },
    {
        id: 'cake_angel',
        displayName: 'Angel Food Cake',
        emoji: '😇',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'vanilla',
        topping: 'fruit'
    },
    {
        id: 'cake_carrot',
        displayName: 'Carrot Cake',
        emoji: '🥕',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'carrot'
    },
    {
        id: 'cake_velvet',
        displayName: 'Red Velvet Cake',
        emoji: '❤',
        count: 1,
        edible: true,
        icing: 'white',
        filling: 'red'
    },
    {
        id: 'cake_sponge',
        displayName: 'Sponge Cake',
        emoji: '🧽',
        count: 1,
        edible: true,
        icing: 'none',
        filling: 'lemon'
    },
    {
        id: 'cake_pineapple',
        displayName: 'Pineapple Upside-Down Cake',
        emoji: '🍍',
        count: 1,
        edible: true,
        icing: 'none',
        filling: 'pineapple',
        topping: 'pineapple'
    },
    {
        id: 'cake_fruit',
        displayName: 'Fruit Cake',
        emoji: '🎄',
        count: 1,
        edible: true,
        icing: 'none',
        filling: 'fruit',
        topping: 'nuts'
    },
    {
        id: 'cake_birthday',
        displayName: 'Birthday Cake',
        emoji: '🎂',
        count: 1,
        edible: true,
        icing: 'chocolate',
        filling: 'chocolate',
        topping: 'candle'
    }
];
