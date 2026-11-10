import { z } from "zod";

export const MUSECAT_FAULT_MESSAGE_MAX = 2000;
export const MUSECAT_FAULT_PHOTO_LIMIT = 3;
export const MUSECAT_FAULT_PHOTO_MAX_BYTES = 15 * 1024 * 1024;
export const MUSECAT_GAME_QUANTITY_MIN = 0;
export const MUSECAT_GAME_QUANTITY_MAX = 50;
export const MUSECAT_GAME_LOCATION_MAX = 100;
export const MUSECAT_GAME_PRICE_LABEL_MAX = 20;
export const MUSECAT_GAME_PRICE_LIMIT = 4;

const remoteId = z.string().min(1).max(128);
// revalidatePath 에 들어가므로 경로를 벗어나는 글자를 받지 않는다
const slugInput = z.string().regex(/^[^/?#\s]{1,128}$/);

export const musecatFaultTargetSchema = z.object({
    slug: slugInput,
    arcade: remoteId,
    gameId: remoteId,
});

export const musecatFaultReactionSchema = z.object({
    slug: slugInput,
    arcade: remoteId,
    flagId: remoteId,
    reaction: z.enum(["fixed", "issue_persist"]),
});

export const musecatFaultWithdrawSchema = z.object({
    slug: slugInput,
    gameId: remoteId,
    flagId: remoteId,
});

export const musecatFavoriteSchema = z.object({
    slug: slugInput,
    arcade: remoteId,
    favorited: z.boolean(),
});

export const musecatCampaignCheckSchema = z.object({
    slug: slugInput,
    arcade: remoteId,
    gameId: remoteId,
    campaignId: remoteId,
    result: z.enum(["still_old", "updated"]),
});

export const musecatGameEditSchema = z.object({
    slug: slugInput,
    gameId: remoteId,
    currency: z.string().max(8),
    quantity: z
        .number()
        .int()
        .min(MUSECAT_GAME_QUANTITY_MIN)
        .max(MUSECAT_GAME_QUANTITY_MAX),
    location: z.string().max(MUSECAT_GAME_LOCATION_MAX),
    prices: z
        .array(
            z.object({
                label: z.string().max(MUSECAT_GAME_PRICE_LABEL_MAX),
                amount: z.number().min(0),
            })
        )
        .max(MUSECAT_GAME_PRICE_LIMIT),
});
