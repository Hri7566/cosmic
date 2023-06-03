/**
 * COSMIC PROJECT
 *
 * Environment configuration module
 */

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

export const env = createEnv({
    isServer: true,
    clientPrefix: "",
    server: {
        DISCORD_TOKEN: z.string(),
        MPPCLONE_TOKEN: z.string(),
        MONGODB_CONNECTION_URI: z.string().url(),
        MONGODB_DATABASE: z.string(),
        NODE_ENV: z.string(),
        PORT: z.string(),
        SSL: z.string()
    },
    client: {},
    runtimeEnv: process.env
});
