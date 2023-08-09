import { CosmicClient } from "../CosmicClient";
import { CosmicData } from "../CosmicData";
import { User } from "../util/CosmicTypes";
import { CosmicUtil } from "../util/CosmicUtil";

const CHECK_INTERVAL = 15000;

export interface loiteringUser {
    user_id: string;
    start_time: number;
    cl: CosmicClient;
    dm: string | undefined;
}

export class CosmicLoitering {
    public static loiteringUsers: loiteringUser[] = [];

    public static startLoitering(
        cl: CosmicClient,
        user: User,
        isDM: boolean
    ): string {
        if (this.isLoitering(user._id)) {
            return `You are already loitering.`;
        }

        this.loiteringUsers.push({
            user_id: user._id,
            start_time: Date.now(),
            cl,
            dm: isDM ? user._id : undefined
        });

        return `You started loitering.`;
    }

    public static isLoitering(user_id: string) {
        return (
            this.loiteringUsers.find(wu => wu.user_id == user_id) !== undefined
        );
    }

    public static async finishLoitering(wu: loiteringUser) {
        let user = await CosmicData.getUser(wu.user_id);
        let amount = Math.random() * 50 + 50;
        await CosmicData.addBalance(user._id, amount);
        let message = `${CosmicUtil.formatUserString(
            user
        )} finished loitering and earned ${CosmicData.formatBalance(amount)}`;
        wu.cl.emit("send chat message", { dm: wu.dm, message });
        try {
            this.loiteringUsers.splice(this.loiteringUsers.indexOf(wu), 1);
        } catch (err) {}
    }
}

setInterval(async () => {
    let r = Math.random();
    let wu =
        CosmicLoitering.loiteringUsers[
            Math.floor(Math.random() * CosmicLoitering.loiteringUsers.length)
        ];

    if (wu && r < 0.1) {
        CosmicLoitering.finishLoitering(wu);
    }
}, CHECK_INTERVAL);
