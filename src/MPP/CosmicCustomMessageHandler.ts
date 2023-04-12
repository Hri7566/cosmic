import { EventEmitter } from "events";
import { CosmicClientMPP } from "./CosmicClientMPP";

export interface Target {
    mode: "subscribed" | "id" | "ids";
    global: boolean;
}

export interface TargetSubscribed extends Target {
    mode: "subscribed";
}

export interface TargetID extends Target {
    mode: "id";
    id: string;
}

export interface TargetIDs extends Target {
    mode: "ids";
    ids: string[];
}

export type AnyTarget = Target | TargetSubscribed | TargetID | TargetIDs;

export interface OutgoingCustomMessage {
    m: "custom";
    data: unknown;
    target: AnyTarget;
}

export interface IncomingCustomMessage {
    m: "custom";
    data: unknown;
    p: string;
}

export class CosmicCustomMessageHandler {
    public eventBus = new EventEmitter();

    constructor(public client: CosmicClientMPP) {}

    public handleCustomMessage(msg: IncomingCustomMessage) {
        if (typeof msg.data !== "object" || Array.isArray(msg.data)) return;
        if (!msg.data.hasOwnProperty("m")) return;

        this.eventBus.emit(msg.m, msg.data, msg.p);
    }
}
