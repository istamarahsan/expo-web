import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        NEXTAUTH_SECRET:
            process.env.NODE_ENV === "production"
                ? z.string().min(1)
                : z.string().min(1).optional(),
        NEXTAUTH_URL: z.preprocess(
            (str) => process.env.VERCEL_URL ?? str,
            process.env.VERCEL ? z.string().min(1) : z.string().url()
        ),
        DISCORD_CLIENT_ID: z.string().nonempty(),
        DISCORD_CLIENT_SECRET: z.string().nonempty(),
        GSHEETS_JSON_KEY_64: z.string().nonempty(),
        TARGET_SPREADSHEET_ID: z.string().nonempty(),
    },

    client: {},

    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
        GSHEETS_JSON_KEY_64: process.env.GSHEETS_JSON_KEY_64,
        TARGET_SPREADSHEET_ID: process.env.TARGET_SPREADSHEET_ID,
    },

    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
