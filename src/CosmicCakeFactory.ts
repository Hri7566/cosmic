/**
 * COSMIC PROJECT
 * 
 * Cake factory module
 */

import { CosmicClient, CosmicClientDiscord } from "./CosmicClient";
import { CosmicData } from "./CosmicData";
import { User } from "./CosmicTypes";
const { Cake, FoodItem, Item } = require('./CosmicTypes');

const { cakes } = require('./CosmicCakes');

const CHECK_INTERVAL = 200;
const RANDOM_CHANCE = 0.005;

class CosmicCakeFactory {
    public static bakingUsers = [];

    public static generateRandomCake() {
        let c = cakes[Math.floor(Math.random() * cakes.length)];
        return c;
    }

    public static startBaking(user: User, cl: CosmicClient): string {
        let response: string = `${user.name} started baking.`;

        if (this.isAlreadyBaking(user._id)) return `You are already baking.`;

        this.bakingUsers.push({
            _id: user._id,
            name: user.name,
            start: Date.now(),
            cl: cl,
            channel: cl.platform == 'discord' ? (cl as CosmicClientDiscord).previousChannel : undefined
        });

        return response;
    }

    public static stopBaking(_id: string) {
        let user = this.bakingUsers.find(u => u._id == _id);
        if (user) {
            return `${user.name} stopped baking`;
        } else {
            return `I don't think you're baking.`;
        }
    }
    
    public static async finishBaking(_id: string) {
        let user = this.bakingUsers.find(u => u._id == _id);
        
        let cake = this.generateRandomCake();
        await CosmicData.addItem(user._id, cake);

        this.bakingUsers.splice(this.bakingUsers.indexOf(user), 1);

        user.cl.sendChat(`${user.name} finished baking and got: ${cake.emoji || ''}${cake.displayName} (x${cake.count})`, user.channel);
    }

    public static isAlreadyBaking(_id: string) {
        return typeof this.bakingUsers.find(u => u._id == _id) !== 'undefined';
    }
}

setInterval(() => {
    let r = Math.random();
    if (r < RANDOM_CHANCE) {
        let u = CosmicCakeFactory.bakingUsers[Math.floor(Math.random() * CosmicCakeFactory.bakingUsers.length)];
        if (u) {
            CosmicCakeFactory.finishBaking(u._id);
        }
    }
}, CHECK_INTERVAL);

export {
    CosmicCakeFactory
}
