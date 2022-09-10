/**
 * COSMIC PROJECT
 * 
 * Cake factory module
 */

import { CosmicClient, CosmicClientDiscord } from "./CosmicClient";
import { CosmicData } from "./CosmicData";
import { User } from "./CosmicTypes";
const { Cake, FoodItem, Item } = require('./CosmicTypes');

const { cakes, uncommon_cakes, rare_cakes, ultra_rare_cakes, secret_cakes } = require('./CosmicCakes');

const CHECK_INTERVAL = 500;
const RANDOM_CHANCE = 0.005;

class CosmicCakeFactory {
    public static bakingUsers = [];
    public static DEFAULT_CAKE_VALUE = 15;

    public static generateRandomCake() {
        const rarity = Math.random();
        let c = cakes[Math.floor(Math.random() * cakes.length)];
        if (rarity < 0.01) {
            c = uncommon_cakes[Math.floor(Math.random() * uncommon_cakes.length)];
        }
        if (rarity < 0.001) {
            c = rare_cakes[Math.floor(Math.random() * rare_cakes.length)];
        }
        if (rarity < 0.0001) {
            c = ultra_rare_cakes[Math.floor(Math.random() * ultra_rare_cakes.length)]
        }
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
            this.bakingUsers.splice(this.bakingUsers.indexOf(user), 1);
            return `${user.name} stopped baking.`;
        } else {
            let replies = [
                `I don't think you're baking.`,
                `No matter how hard you try, you can't stop doing something when you haven't started doing it in the first place.`,
                `Baking is not a thing you're doing.`,
                `Maybe starting is a good thing to do before you stop.`,
                `Stopping... wait, you haven't started.`,
                `Error: start baking first`,
                `Have you ever even baked before?`
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }
    }
    
    public static async finishBaking(_id: string): Promise<void> {
        let user = this.bakingUsers.find(u => u._id == _id);

        let cake = this.generateRandomCake();
        await CosmicData.addItem(user._id, cake);

        this.bakingUsers.splice(this.bakingUsers.indexOf(user), 1);

        user.cl.sendChat(`${user.name} finished baking and got: ${cake.emoji || ''}${cake.displayName} (x${cake.count})`, user.channel);
    }

    public static isAlreadyBaking(_id: string): boolean {
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
