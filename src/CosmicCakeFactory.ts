/**
 * COSMIC PROJECT
 * 
 * Cake factory module
 */

const { Cake, FoodItem, Item } = require('./CosmicTypes');

const { cakes } = require('./CosmicCakes');

class CosmicCakeFactory {
    static generateRandomCake() {
        let c = cakes[Math.floor(Math.random() * cakes.length)];
        return c;
    }
}

export {
    CosmicCakeFactory
}
