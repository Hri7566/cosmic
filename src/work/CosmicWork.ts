import { CosmicClient } from "../CosmicClient";
import { CosmicData } from "../CosmicData";
import { User } from "../util/CosmicTypes";
import { CosmicUtil } from "../util/CosmicUtil";

const CHECK_INTERVAL = 15000;

export interface WorkingUser {
    user_id: string;
    start_time: number;
    cl: CosmicClient;
    dm: string | undefined;
}

export class CosmicWork {
    public static workingUsers: WorkingUser[] = [];

    public static startWorking(cl: CosmicClient, user: User, isDM: boolean): string {
        if (this.isWorking(user._id)) {
            return `You are already working.`;
        }

        this.workingUsers.push({
            user_id: user._id,
            start_time: Date.now(),
            cl,
            dm: isDM ? user._id : undefined
        });

        return `You started working.`;
    }

    public static isWorking(user_id: string) {
        return this.workingUsers.find(wu => wu.user_id == user_id) !== undefined;
    }

    public static async finishWorking(wu: WorkingUser) {
        let user = await CosmicData.getUser(wu.user_id);
        let amount = (Math.random() * 50) + 50;
        await CosmicData.addBalance(user._id, amount);
        let message = `${CosmicUtil.formatUserString(user)} finished working and earned ${CosmicData.formatBalance(amount)}`;
        wu.cl.emit('send chat message', { dm: wu.dm, message });
        try {
            this.workingUsers.splice(this.workingUsers.indexOf(wu), 1);
        } catch (err) {}
    }
}

setInterval(async () => {
    let r = Math.random();
    let wu = CosmicWork.workingUsers[Math.floor(Math.random() * CosmicWork.workingUsers.length)];

    if (wu && r < 0.1) {
        CosmicWork.finishWorking(wu);
    }
}, CHECK_INTERVAL);
