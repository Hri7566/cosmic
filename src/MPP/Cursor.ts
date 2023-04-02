/**
 * COSMIC PROJECT
 *
 * MPP cursor module
 */

/**
 * Imports
 */

import { CosmicClientMPP } from "./CosmicClientMPP";
import { Vector2 } from "../util/CosmicTypes";
const Client = require("mppclone-client");

/**
 * Module-level declarations
 */

const CURSOR_SEND_RATE = 15;
const CURSOR_UPDATE_RATE = 60;

export class Cursor {
    public cl: typeof Client;

    public sendInterval: any;
    public updateInterval: any;
    public pos: Vector2;
    public vel: Vector2;
    public angle: number;
    public follow: string | undefined;
    public scale: number;
    public speed: number;

    constructor(cl: CosmicClientMPP) {
        this.cl = cl;
        this.pos = { x: 50, y: 50 };
        this.vel = { x: 0, y: 0 };
        this.angle = 0;
        this.scale = 10;
        this.speed = 1;
    }

    public started: boolean = false;

    start() {
        if (this.started) return;
        this.started = true;
        this.sendInterval = setInterval(() => {
            this.cl.setCursorPos(this.pos.x, this.pos.y);
        }, 1000 / CURSOR_SEND_RATE);

        this.updateInterval = setInterval(() => {
            let followPos: Vector2 = {
                x: 50,
                y: 50,
            };

            try {
                if (this.cl.getPart(this.follow)) {
                    followPos = {
                        x: parseFloat(this.cl.getPart(this.follow).x),
                        y: parseFloat(this.cl.getPart(this.follow).y),
                    };
                }
            } finally {
                this.angle += this.speed;
                if (this.angle > 360) this.angle -= 360;
                this.pos.y =
                    Math.cos(this.angle * (Math.PI / 180) * 3) * this.scale +
                    followPos.y;
                this.pos.x =
                    Math.sin(this.angle * (Math.PI / 180)) * this.scale +
                    followPos.x;
            }
        }, 1000 / CURSOR_UPDATE_RATE);
    }

    stop() {
        clearInterval(this.sendInterval);
        clearInterval(this.updateInterval);
    }
}
