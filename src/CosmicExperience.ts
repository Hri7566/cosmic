import { CosmicUtil } from "./CosmicUtil";

export interface Level {
    displayName: string;
    requiredExp: number;
}

export class CosmicExperience {
    public static levels: Level[] = [];

    public static getLevelFromExperience(exp: number) {
        let expNums = this.levels.map(l => l.requiredExp).sort();
        let closestNum = CosmicUtil.getClosestNumberFromArray(exp, expNums);
        return this.levels.find(l => l.requiredExp == closestNum);
    }

    public static addLevel(level: Level) {
        if (this.levels.indexOf(level) < 0) this.levels.push(level);
    }

    public static alreadyRegistered = false;

    public static registerDefaultLevels() {
        if (this.alreadyRegistered) return;
        this.alreadyRegistered = true;

        this.addLevel({
            displayName: 'Down Quark',
            requiredExp: 0
        });

        this.addLevel({
            displayName: 'Up Quark',
            requiredExp: 100
        });

        this.addLevel({
            displayName: 'Neutron',
            requiredExp: 200
        });

        this.addLevel({
            displayName: 'Calcium Cluster',
            requiredExp: 300
        });

        this.addLevel({
            displayName: 'Unicellular Organism',
            requiredExp: 400
        });

        this.addLevel({
            displayName: 'Eukaryote Bacteria',
            requiredExp: 500
        });

        this.addLevel({
            displayName: 'Appendicular Tetrapod',
            requiredExp: 600
        });

        this.addLevel({
            displayName: 'Hummingbird',
            requiredExp: 700
        });

        this.addLevel({
            displayName: 'Cardinal',
            requiredExp: 800
        });

        this.addLevel({
            displayName: 'Pigeon',
            requiredExp: 900
        });

        this.addLevel({
            displayName: 'Ostrich',
            requiredExp: 1000
        });

        this.addLevel({
            displayName: 'Parrot',
            requiredExp: 1100
        });

        this.addLevel({
            displayName: 'Hawk',
            requiredExp: 1200
        });

        this.addLevel({
            displayName: 'Eagle',
            requiredExp: 1300
        });

        this.addLevel({
            displayName: 'Albatross',
            requiredExp: 1400
        });

        this.addLevel({
            displayName: 'Condor',
            requiredExp: 1500
        });

        this.addLevel({
            displayName: 'Sea Bass',
            requiredExp: 1600
        });

        this.addLevel({
            displayName: 'Horse Mackerel',
            requiredExp: 1700
        });

        this.addLevel({
            displayName: 'Carp',
            requiredExp: 1800
        });

        this.addLevel({
            displayName: 'Cod',
            requiredExp: 1900
        });

        this.addLevel({
            displayName: 'Dace',
            requiredExp: 2000
        });

        this.addLevel({
            displayName: 'Puffer Fish',
            requiredExp: 2100
        });

        this.addLevel({
            displayName: 'Arowana',
            requiredExp: 2200
        });

        this.addLevel({
            displayName: 'Bottlenose Dolphin',
            requiredExp: 2300
        });

        this.addLevel({
            displayName: 'Great White Shark',
            requiredExp: 2400
        });

        this.addLevel({
            displayName: 'Blue Whale',
            requiredExp: 2500
        });

        this.addLevel({
            displayName: 'Termite',
            requiredExp: 2600
        });

        this.addLevel({
            displayName: 'Ladybug',
            requiredExp: 2700
        });

        this.addLevel({
            displayName: 'Ant',
            requiredExp: 2800
        });

        this.addLevel({
            displayName: 'Caterpillar',
            requiredExp: 2900
        });

        this.addLevel({
            displayName: 'Butterfly',
            requiredExp: 3000
        });

        this.addLevel({
            displayName: 'Bee',
            requiredExp: 3100
        });

        this.addLevel({
            displayName: 'Hornet',
            requiredExp: 3200
        });

        this.addLevel({
            displayName: 'Mantis',
            requiredExp: 3300
        });

        this.addLevel({
            displayName: 'Mosquito',
            requiredExp: 3400
        });

        this.addLevel({
            displayName: 'Moth',
            requiredExp: 3500
        });

        this.addLevel({
            displayName: 'Mouse',
            requiredExp: 3600
        });

        this.addLevel({
            displayName: 'Rat',
            requiredExp: 3700
        });

        this.addLevel({
            displayName: 'Squirrel',
            requiredExp: 3800
        });

        this.addLevel({
            displayName: 'Rabbit',
            requiredExp: 3900
        });

        this.addLevel({
            displayName: 'House Cat',
            requiredExp: 4000
        });

        this.addLevel({
            displayName: 'Pomeranian',
            requiredExp: 4100
        });

        this.addLevel({
            displayName: 'Coyote',
            requiredExp: 4200
        });

        this.addLevel({
            displayName: 'Wolf',
            requiredExp: 4300
        });

        this.addLevel({
            displayName: 'Pony',
            requiredExp: 4400
        });

        this.addLevel({
            displayName: 'Horse',
            requiredExp: 4500
        });

        this.addLevel({
            displayName: 'The End',
            requiredExp: 150000000
        });
    }
}

CosmicExperience.registerDefaultLevels();
