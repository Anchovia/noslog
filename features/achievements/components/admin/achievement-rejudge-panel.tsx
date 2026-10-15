"use client";

import { Award } from "lucide-react";
import { useState, useTransition } from "react";

import { rejudgeAchievements } from "@/app/admin/syncs/actions";
import { adminSecondaryButtonClass } from "@/components/admin/admin-form";

/**
 * 관리자 「업적 다시 판정」(2026-09-25 B1) — 동기화 내역 화면에 기존 관리자 모양으로 칸 하나.
 * 배포 뒤 첫 판정 · 기준 수치를 바꾼 뒤에 누른다. 50명씩 끝까지 이어서 돌고 진행 수를 보인다.
 * 「기준에 못 미치는 단계도 빼기」(2026-09-25 R1, 기본 꺼짐) — 기준을 바꾼 날에만 켠다.
 */
export default function AchievementRejudgePanel() {
    const [pending, startTransition] = useTransition();
    const [status, setStatus] = useState<string | null>(null);
    const [failed, setFailed] = useState(false);
    const [prune, setPrune] = useState(false);

    function run() {
        setFailed(false);
        startTransition(async () => {
            let cursor: number | null = 0;
            let judged = 0;
            let awarded = 0;
            let removed = 0;
            while (cursor !== null) {
                const result = await rejudgeAchievements(cursor, prune);
                if (!result.success) {
                    setFailed(true);
                    setStatus(
                        `${result.message} (${judged.toLocaleString("ko-KR")}명까지 판정됨)`
                    );
                    return;
                }
                judged += result.judged;
                awarded += result.awarded;
                removed += result.removed;
                cursor = result.nextCursor;
                setStatus(
                    `${judged.toLocaleString("ko-KR")}명 판정 · 새 단계 ${awarded.toLocaleString("ko-KR")}개${prune ? ` · 뺀 단계 ${removed.toLocaleString("ko-KR")}개` : ""}${cursor === null ? " · 끝" : " · 진행 중"}`
                );
            }
        });
    }

    return (
        <section className="flex flex-wrap items-center justify-between gap-nl-12 rounded-nl-container bg-nl-surface p-nl-12">
            <div className="min-w-0">
                <p className="nl-emphasis-label">업적 다시 판정</p>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    기록이 있는 사용자 모두의 업적을 지금 기준으로 판정합니다.
                    얻은 단계는 빼지 않습니다.
                </p>
                <label className="nl-metadata mt-nl-8 flex cursor-pointer items-center gap-nl-8 text-nl-subdued">
                    <input
                        type="checkbox"
                        checked={prune}
                        disabled={pending}
                        onChange={(event) => setPrune(event.target.checked)}
                        className="size-nl-16"
                    />
                    기준에 못 미치는 단계도 빼기(기준을 바꾼 뒤에만)
                </label>
                {status ? (
                    <p
                        role="status"
                        className={`nl-metadata mt-nl-4 ${failed ? "text-nl-error" : "text-nl-subdued"}`}
                    >
                        {status}
                    </p>
                ) : null}
            </div>
            <button
                type="button"
                onClick={run}
                disabled={pending}
                className={adminSecondaryButtonClass}
            >
                <Award className="nl-icon-small" aria-hidden />
                {pending ? "판정 중..." : "다시 판정"}
            </button>
        </section>
    );
}
