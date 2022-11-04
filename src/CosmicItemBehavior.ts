import { Cosmic } from "./CosmicTypes";

type BehaviorCallback = (msg: Cosmic.BehaviorMessage) => (string | void);

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

addBehavior('hot_sauce', (msg: Cosmic.BehaviorMessage) => {

});

export { ITEM_BEHAVIORS }
