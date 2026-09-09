"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    setBingoCellCompletion,
    resetBingoProgress,
} from "@/app/(nevigation)/bingo/[id]/actions";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type {
    BingoDetail,
    BingoMission,
} from "@/features/bingos/schemas/publicBingoSchema";
import { getBingoProgress } from "@/lib/bingo";

export function useBingoProgress(
    bingo: BingoDetail,
    saveAction = setBingoCellCompletion,
    resetAction = resetBingoProgress
) {
    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();
    const [completed, setCompleted] = useState(
        () => new Set(bingo.completedCellIds)
    );
    const [pending, setPending] = useState<ReadonlySet<number>>(new Set());
    const pendingRef = useRef(new Set<number>());
    const resettingRef = useRef(false);
    const [resetting, setResetting] = useState(false);
    const [resetError, setResetError] = useState("");
    const [hasSavedProgress, setHasSavedProgress] = useState(
        Boolean(bingo.hasSavedProgress || bingo.completedCellIds.length)
    );
    const [failed, setFailed] = useState<{
        cellId: number;
        next: boolean;
        message: string;
    } | null>(null);
    const [message, setMessage] = useState("");
    const [selected, setSelected] = useState<number | null>(null);
    const [filter, setFilter] = useState<
        "all" | "incomplete" | "completed" | "chance"
    >("all");
    const progress = useMemo(
        () =>
            getBingoProgress(
                bingo.cells.map((cell) => ({
                    ...cell,
                    isCompleted: completed.has(cell.id),
                }))
            ),
        [bingo.cells, completed]
    );
    const filtered = bingo.cells.filter(
        (cell) =>
            filter === "all" ||
            (filter === "completed"
                ? completed.has(cell.id)
                : filter === "incomplete"
                  ? !completed.has(cell.id)
                  : progress.richPositions.has(cell.position))
    );

    function select(cell: BingoMission, moveFocus = false) {
        setSelected(cell.id);
        if (!moveFocus) return;
        if (!filtered.some((item) => item.id === cell.id)) setFilter("all");
        requestAnimationFrame(() => {
            const row = document.getElementById(`bingo-mission-${cell.id}`);
            row?.focus({ preventScroll: true });
            row?.scrollIntoView({ block: "nearest", behavior: "instant" });
        });
    }

    async function save(cellId: number, next: boolean) {
        if (
            !bingo.isAuthenticated ||
            resettingRef.current ||
            pendingRef.current.has(cellId)
        )
            return;
        const before = completed.has(cellId);
        pendingRef.current.add(cellId);
        setPending(new Set(pendingRef.current));
        setFailed(null);
        setMessage("");
        setSelected(cellId);
        setCompleted((current) => {
            const updated = new Set(current);
            if (next) updated.add(cellId);
            else updated.delete(cellId);
            return updated;
        });
        const result = await saveAction(cellId, next, locale).catch(() => ({
            success: false as const,
            message: t("bingo.saveError"),
        }));
        pendingRef.current.delete(cellId);
        setPending(new Set(pendingRef.current));
        if (!result.success) {
            setCompleted((current) => {
                const updated = new Set(current);
                if (before) updated.add(cellId);
                else updated.delete(cellId);
                return updated;
            });
            setFailed({ cellId, next, message: result.message });
        } else {
            setMessage(t("bingo.saved"));
            setHasSavedProgress(true);
            router.refresh();
        }
    }
    async function reset() {
        if (
            !bingo.isAuthenticated ||
            resettingRef.current ||
            pendingRef.current.size
        )
            return false;
        resettingRef.current = true;
        setResetting(true);
        setResetError("");
        const response = await resetAction(bingo.id, locale).catch(() => ({
            success: false as const,
            message: t("bingo.resetError"),
        }));
        resettingRef.current = false;
        setResetting(false);
        if (!response.success) {
            setResetError(response.message);
            return false;
        }
        setCompleted(new Set());
        setHasSavedProgress(false);
        setFailed(null);
        setMessage(t("bingo.resetSuccess"));
        router.refresh();
        return true;
    }
    return {
        reset,
        resetting,
        resetError,
        hasSavedProgress,
        completed,
        pending,
        failed,
        message,
        selected,
        filter,
        filtered,
        progress,
        select,
        save,
        setFilter,
    };
}
