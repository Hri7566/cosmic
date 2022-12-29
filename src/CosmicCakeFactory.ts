/**
 * COSMIC PROJECT
 * 
 * Cake factory module
 * 
 * Cake generator for money game
 */

import { CosmicClient, CosmicClientDiscord } from "./CosmicClient";
import { CosmicData } from "./CosmicData";
import { ITEMS } from "./CosmicItems";
import { CosmicLogger, red } from "./CosmicLogger";
import { Cosmic, User } from "./CosmicTypes";
import { CosmicUtil } from "./CosmicUtil";
import { FoodItem, Item } from './CosmicTypes';

import { cakes, uncommon_cakes, rare_cakes, ultra_rare_cakes, secret_cakes } from './CosmicCakes';

const CHECK_INTERVAL = 15000;
const RANDOM_CHANCE = 0.02;

class CosmicCakeFactory {
    public static bakingUsers = [];
    public static DEFAULT_CAKE_VALUE = 15;

    public static logger = new CosmicLogger('Cake Factory', red);

    public static async generateRandomCake() {
        const rarity = Math.random();
        let c: Cosmic.Cake = await CosmicUtil.getRandomValueFromArray(cakes);
        if (rarity < 0.1) {
            c = await CosmicUtil.getRandomValueFromArray(uncommon_cakes);
        }
        if (rarity < 0.05) {
            c = await CosmicUtil.getRandomValueFromArray(rare_cakes);
        }
        if (rarity < 0.01) {
            c = await CosmicUtil.getRandomValueFromArray(ultra_rare_cakes);
        }
        return c;
    }

    public static startBaking(user: User, cl: CosmicClient, isDM: boolean = false): string {
        let response: string = `${user.name} started baking.`;

        if (this.isAlreadyBaking(user._id)) {
            const already_answers = [
                `You are already baking.`,
                `Baking, you already are.`,
                `You're already baking.`,
                `Keep trying.`,
                `The oven is already full.`,
                `The oven has cake in it already.`,
                `The oven is full of cake.`,
                `You can't bake more, the oven still has cake.`
            ];

            return already_answers[Math.floor(Math.random() * already_answers.length)];
        }

        this.bakingUsers.push({
            _id: user._id,
            name: user.name,
            start: Date.now(),
            cl: cl,
            channel: cl.platform == 'discord' ? (cl as CosmicClientDiscord).previousChannel : undefined,
            dm: isDM
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

        let cake = await this.generateRandomCake();
        await CosmicData.addItem(user._id, cake);

        this.bakingUsers.splice(this.bakingUsers.indexOf(user), 1);

        const cakeMessage = `${cake.emoji || ''}${cake.displayName} (x${cake.count})`;

        if (user.hasOwnProperty('cl')) {
            if (user.dm) {
                // user.cl.sendChat(`${user.name} finished baking and got: ${CosmicUtil.formatItemString(cake.displayName, cake.emoji, cake.count)}`, user.channel);
                user.cl.emit('send chat message', {
                    type: 'chat',
                    sender: {
                        name: 'internal',
                        _id: 'internal',
                        color: '#ffffff'
                    },
                    dm: user._id,
                    timestamp: Date.now(),
                    message: `${CosmicUtil.formatUserString(user)} finished baking and got: ${cakeMessage}`
                });
            } else {
                user.cl.sendChat(`${user.name} finished baking and got: ${cakeMessage}`);
            }
        }
    }

    public static isAlreadyBaking(_id: string): boolean {
        return typeof this.bakingUsers.find(u => u._id == _id) !== 'undefined';
    }
}

setInterval(async () => {
    let r = Math.random();
    
    let u = CosmicCakeFactory.bakingUsers[Math.floor(Math.random() * CosmicCakeFactory.bakingUsers.length)];

    if (u) {
        let inv = await CosmicData.getInventory(u._id);
        let bias = 1;

        for (let upgradeItem of Object.values(ITEMS)) {
            if (!upgradeItem.id.startsWith('upgrade_')) continue;
            if (await CosmicData.hasItem(u._id, upgradeItem.id)) {
                if (upgradeItem.hasOwnProperty('cake_bonus')) {
                    bias *= upgradeItem['cake_bonus'];
                }
            }
        }

        let biasedRando = r / bias;
        // console.log(`${r} / ${bias} = ${biasedRando}`);

        if (r * biasedRando < RANDOM_CHANCE * CosmicCakeFactory.bakingUsers.length) {
            CosmicCakeFactory.finishBaking(u._id);
        }
    }
}, CHECK_INTERVAL);

export {
    CosmicCakeFactory
}
