import { readFileSync } from "fs";
import { ServicesConfig } from "../Cosmic";
import { ChannelConstructionPreset, CosmicClientToken } from "../CosmicClient";
import { CosmicCommandHandler } from "../CosmicCommandHandler";
import { env } from "../util/env";
import * as YAML from "yaml";
import { Client } from "switchchat";
import { CosmicForeignMessageHandler } from "../foreign/CosmicForeignMessageHandler";

const servicesFile = readFileSync("config/services.yml").toString();
const services: ServicesConfig = YAML.parse(servicesFile);
const { NODE_ENV } = env;

export class CosmicClientSC extends CosmicClientToken {
    protected started: boolean = false;

    protected desiredUser = {
        name: `🟇 Cosmic (${CosmicCommandHandler.prefixes[0].prefix}${
            CosmicCommandHandler.commands.find(cmd => cmd.id == "help")
                .accessors[0]
        })${NODE_ENV == "production" ? "" : " [non-production]"}`,
        color: "#1d0054"
    };

    public client: Client;
    public platform: string = "switchchat2";
    // public cmapi: typeof cmapi;
    public dmOnlyCommands: string[];
    public disabledCommands: string[];

    constructor(token: string, ClientClass: any = Client) {
        super();
        this.client = new ClientClass(token);
        // this.desiredChannel = channel;
        this.bindEventListeners();
    }

    /**
     * Start the client
     * @returns undefined
     */
    public start(): void {
        if (this.started == true) return;

        this.logger.log(`Starting SwitchChat client...`);
        this.started = true;
        this.client.connect();
    }

    /**
     * Stop the client
     */
    public stop(): void {
        this.logger.log("Stopping...");
        this.started = false;
        this.client.close();
    }

    public last_dm: string;

    protected override bindEventListeners() {
        super.bindEventListeners();

        this.client.on("chat_ingame", msg => {
            // process.stdout.write(`[${msg.p._id.substring(0, 6)}] ${msg.p.name}: ${msg.a}\n`);
            // ffi broke :(
            // console.log(CosmicFFI.clib.red(msg.a));

            let newmsg = CosmicForeignMessageHandler.convertMessage(
                "chat",
                msg
            );
            this.emit("chat", newmsg);
        });

        this.client.on("command", msg => {
            (msg as any).original_channel = {
                dm_id: msg.user.uuid
            };

            (msg as any).p = {
                _id: msg.user.uuid,
                name: msg.user.displayName,
                color: "#000000"
            };

            this.last_dm = (msg as any).p;

            let newmsg = CosmicForeignMessageHandler.convertMessage(
                "chat",
                msg
            );

            this.emit("chat", newmsg);
        });

        this.client.on("ready", () => {
            this.client.defaultName = this.desiredUser.name;
            this.client.defaultFormattingMode = "markdown";

            this.logger.log(`Connected to SwitchChat`);
        });

        this.on("send chat message", msg => {
            console.log(msg);
        });

        // this.cmapi.on("?hat", msg => {
        //     // this.logger.debug('cmapi hat');
        //     this.cmapi.sendArray(
        //         [
        //             {
        //                 m: "update hat",
        //                 url: "minecraft/item/nether_star"
        //             }
        //         ],
        //         { mode: "id", id: msg._original_sender, global: false }
        //     );
        // });

        // this.cmapi.on("cosmic", msg => {
        //     // TODO implement cosmic message
        //     //? for userscript?
        // });
    }

    /**
     * Send a chat message
     * @param str Chat message
     */
    public sendChat(str: string): void {
        // this.emit("send chat message", {
        //     type: "chat",
        //     sender: this.client.getOwnParticipant(),
        //     platform: "mpp",
        //     // message: str.split("*").join("\\*").split("_").join("\\_")
        //     message: `\u034f${str}`
        // });

        console.log(str);
    }

    // public setSeasonalInfo(): void {
    //     const season = CosmicSeasonDetection.getSeason();
    //     const holiday = CosmicSeasonDetection.getHoliday();

    //     let desiredSuffix: string = "";

    //     if (holiday) {
    //         if (this.desiredUser.name.endsWith(holiday.emoji)) return;
    //         desiredSuffix = ` ${holiday.emoji}`;
    //     } else {
    //         if (this.desiredUser.name.endsWith(season.emoji)) return;
    //         desiredSuffix = ` ${season.emoji}`;
    //     }

    //     this.desiredUser.name += desiredSuffix;
    // }
}
