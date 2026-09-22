import "server-only";

import db from "@/lib/db";
import {
    pickLocaleText,
    pollLockedChange,
    validatePollInput,
    type PollInput,
} from "@/features/polls/schemas/pollSchema";
import type { Locale } from "@/lib/i18n/routing";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";

/** 글 하나에 투표 하나 — 어느 글에 딸렸는지 */
export type PollOwner = { announcementId: number } | { eventId: number };

type Prisma = typeof db;
type Tx = Parameters<Parameters<Prisma["$transaction"]>[0]>[0];

const localeTexts = (rows: { locale: string; text?: string }[]) =>
    Object.fromEntries(
        rows
            .filter((row) => SUPPORTED_LOCALES.includes(row.locale as Locale))
            .map((row) => [row.locale, row.text ?? ""])
    ) as Partial<Record<Locale, string>>;

/** 글쓰기 화면이 쓰는 값 — 저장된 투표를 만들기 창 모양으로 돌려준다 */
export async function getPollInput(owner: PollOwner) {
    const poll = await db.poll.findFirst({
        where: owner,
        include: {
            translations: true,
            options: {
                orderBy: { position: "asc" },
                include: {
                    translations: true,
                    _count: { select: { votes: true } },
                },
            },
            _count: { select: { votes: true } },
        },
    });
    if (!poll) return null;
    return {
        id: poll.id,
        votes: poll._count.votes,
        input: {
            question: localeTexts(
                poll.translations.map((row) => ({
                    locale: row.locale,
                    text: row.question,
                }))
            ),
            options: poll.options.map((option) => ({
                id: option.id,
                text: localeTexts(option.translations),
            })),
            multiple: poll.multiple,
            maxChoices: poll.maxChoices,
            closesAt: poll.closesAt
                ? poll.closesAt.toISOString().slice(0, 10)
                : null,
            results: poll.results,
            showVoters: poll.showVoters,
            allowAddOptions: poll.allowAddOptions,
        } satisfies PollInput,
    };
}

export type PollSaveError =
    | "invalid"
    | "locked"
    | "closed"
    | "question"
    | "options"
    | "duplicate"
    | "maxChoices"
    | "closesAt";

/**
 * 글을 저장할 때 투표도 함께 저장한다(2026-09-23 V2).
 * `poll` 이 null 이면 이 글의 투표를 지운다 — 표가 있으면 지우지 않고 「잠김」 으로 돌려준다.
 * 표가 들어온 뒤에는 마감 시각과(허용했다면) 선택지 추가만 받는다.
 */
export async function savePollWithPost(
    tx: Tx,
    owner: PollOwner,
    poll: PollInput | null,
    now = new Date()
): Promise<PollSaveError | null> {
    const current = await tx.poll.findFirst({
        where: owner,
        include: {
            translations: true,
            options: {
                orderBy: { position: "asc" },
                include: { translations: true },
            },
            _count: { select: { votes: true } },
        },
    });
    const votes = current?._count.votes ?? 0;
    const closed = current?.closesAt ? current.closesAt <= now : false;

    if (!poll) {
        if (!current) return null;
        if (votes > 0) return "locked";
        await tx.poll.delete({ where: { id: current.id } });
        return null;
    }

    const invalid = validatePollInput(poll, now);
    if (invalid) return invalid;

    if (current) {
        // 마감한 투표는 아무것도 고치지 못한다(조사한 모든 서비스가 같다)
        if (closed) return "closed";
        if (votes > 0) {
            const locked = pollLockedChange(
                {
                    question: localeTexts(
                        current.translations.map((row) => ({
                            locale: row.locale,
                            text: row.question,
                        }))
                    ),
                    multiple: current.multiple,
                    options: current.options.map((option) => ({
                        id: option.id,
                        text: localeTexts(option.translations),
                    })),
                    allowAddOptions: current.allowAddOptions,
                },
                poll
            );
            if (locked) return "locked";
        }
    }

    const settings = {
        multiple: poll.multiple,
        maxChoices: poll.multiple ? poll.maxChoices : null,
        closesAt: poll.closesAt ? new Date(poll.closesAt) : null,
        results: poll.results,
        showVoters: poll.showVoters,
        allowAddOptions: poll.allowAddOptions,
    };
    const saved = current
        ? await tx.poll.update({ where: { id: current.id }, data: settings })
        : await tx.poll.create({ data: { ...owner, ...settings } });

    // 질문 글 — 채운 언어만 남긴다
    await tx.pollTranslation.deleteMany({ where: { pollId: saved.id } });
    await tx.pollTranslation.createMany({
        data: SUPPORTED_LOCALES.filter((locale) => poll.question[locale]).map(
            (locale) => ({
                pollId: saved.id,
                locale,
                question: poll.question[locale] as string,
            })
        ),
    });

    // 선택지 — 남은 것은 글만 고치고, 빠진 것은 지운다(표가 있으면 위에서 이미 막았다)
    const keptIds = poll.options
        .map((option) => option.id)
        .filter((id): id is number => id !== undefined);
    await tx.pollOption.deleteMany({
        where: {
            pollId: saved.id,
            id: { notIn: keptIds.length ? keptIds : [0] },
        },
    });
    for (const [index, option] of poll.options.entries()) {
        const row = option.id
            ? await tx.pollOption.update({
                  where: { id: option.id },
                  data: { position: index },
              })
            : await tx.pollOption.create({
                  data: { pollId: saved.id, position: index },
              });
        await tx.pollOptionTranslation.deleteMany({
            where: { optionId: row.id },
        });
        await tx.pollOptionTranslation.createMany({
            data: SUPPORTED_LOCALES.filter((locale) => option.text[locale]).map(
                (locale) => ({
                    optionId: row.id,
                    locale,
                    text: option.text[locale] as string,
                })
            ),
        });
    }
    return null;
}

export type PublicPoll = {
    id: number;
    question: string;
    multiple: boolean;
    maxChoices: number | null;
    closesAt: string | null;
    closed: boolean;
    /** 결과를 지금 보여 줄지 — 「투표한 뒤」 · 「마감한 뒤」 규칙까지 계산해 둔다 */
    showResults: boolean;
    showVoters: boolean;
    voterCount: number;
    myOptionIds: number[];
    options: { id: number; text: string; votes: number }[];
};

/** 공개 화면이 쓰는 값 — 로그인하지 않았으면 결과만 보여 주고 투표는 막는다 */
export async function getPublicPoll(
    owner: PollOwner,
    locale: Locale,
    userId: number | null,
    now = new Date()
): Promise<PublicPoll | null> {
    const poll = await db.poll.findFirst({
        where: owner,
        include: {
            translations: true,
            options: {
                orderBy: { position: "asc" },
                include: {
                    translations: true,
                    _count: { select: { votes: true } },
                },
            },
        },
    });
    if (!poll) return null;
    const mine = userId
        ? await db.pollVote.findMany({
              where: { pollId: poll.id, userId },
              select: { optionId: true },
          })
        : [];
    const voters = await db.pollVote.groupBy({
        by: ["userId"],
        where: { pollId: poll.id },
    });
    const closed = poll.closesAt ? poll.closesAt <= now : false;
    const voted = mine.length > 0;
    return {
        id: poll.id,
        question: pickLocaleText(
            localeTexts(
                poll.translations.map((row) => ({
                    locale: row.locale,
                    text: row.question,
                }))
            ),
            locale
        ),
        multiple: poll.multiple,
        maxChoices: poll.maxChoices,
        closesAt: poll.closesAt?.toISOString() ?? null,
        closed,
        showResults:
            poll.results === "ALWAYS" ||
            (poll.results === "AFTER_VOTE" && voted) ||
            (poll.results === "AFTER_CLOSE" && closed),
        showVoters: poll.showVoters,
        voterCount: voters.length,
        myOptionIds: mine.map((row) => row.optionId),
        options: poll.options.map((option) => ({
            id: option.id,
            text: pickLocaleText(localeTexts(option.translations), locale),
            votes: option._count.votes,
        })),
    };
}

export type PollVoteError = "closed" | "unknown-option" | "too-many";

/** 표 내기 — 마감 전에는 바꿀 수 있다(고른 것을 통째로 바꿔 넣는다) */
export async function castVote(
    pollId: number,
    userId: number,
    optionIds: number[],
    now = new Date()
): Promise<PollVoteError | null> {
    const poll = await db.poll.findUnique({
        where: { id: pollId },
        include: { options: { select: { id: true } } },
    });
    if (!poll) return "unknown-option";
    if (poll.closesAt && poll.closesAt <= now) return "closed";
    const known = new Set(poll.options.map((option) => option.id));
    const chosen = [...new Set(optionIds)];
    if (chosen.some((id) => !known.has(id))) return "unknown-option";
    const limit = poll.multiple ? (poll.maxChoices ?? poll.options.length) : 1;
    if (chosen.length > limit) return "too-many";
    await db.$transaction([
        db.pollVote.deleteMany({ where: { pollId, userId } }),
        db.pollVote.createMany({
            data: chosen.map((optionId) => ({ pollId, optionId, userId })),
        }),
    ]);
    return null;
}
