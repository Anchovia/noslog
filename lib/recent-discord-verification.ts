export const DISCORD_VERIFICATION_WINDOW_MS = 10 * 60 * 1000;

export function hasRecentDiscordVerification(
    verification:
        { userId: number; discordId: string; verifiedAt: number } | undefined,
    userId: number,
    discordId: string | null,
    now = Date.now()
) {
    return Boolean(
        verification &&
        discordId &&
        verification.userId === userId &&
        verification.discordId === discordId &&
        Number.isFinite(verification.verifiedAt) &&
        verification.verifiedAt <= now &&
        now - verification.verifiedAt < DISCORD_VERIFICATION_WINDOW_MS
    );
}
