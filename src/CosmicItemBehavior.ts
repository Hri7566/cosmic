/**
 * COSMIC PROJECT
 *
 * Item behavior module
 */

import { BehaviorMessage } from "./util/CosmicTypes";

type BehaviorCallback = (msg: BehaviorMessage) => string | void;

export class CosmicItemBehavior {
    constructor(
        public id: string,
        public bh: BehaviorCallback,
        public consume: boolean = true
    ) {}
}

const ITEM_BEHAVIORS = new Map();

function addBehavior(id: string, bh: BehaviorCallback, consume?: boolean) {
    ITEM_BEHAVIORS.set(id, new CosmicItemBehavior(id, bh, consume));
}

addBehavior("hot_sauce", (msg: BehaviorMessage) => {
    return "burning hot fire!!!";
});

export { ITEM_BEHAVIORS };
