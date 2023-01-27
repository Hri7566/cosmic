export interface Level {
    displayName: string;
    requiredExp: number;
}

export class CosmicExperience {
    public static levels: Level[] = [];

    public static getLevelFromExperience(exp: number) {
        return this.levels.filter(level => exp >= level.requiredExp)[0] || this.levels[0];
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
            displayName: 'Squirrel',
            requiredExp: 700
        });

        this.addLevel({
            displayName: '',
            requiredExp: 400
        });
    }
}

CosmicExperience.registerDefaultLevels();
