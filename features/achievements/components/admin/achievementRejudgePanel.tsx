"use client";

import { Award } from "lucide-react";
import { useState, useTransition } from "react";

import { rejudgeAchievements } from "@/app/admin/syncs/actions";
import { adminSecondaryButtonClass } from "@/components/admin/adminForm";

/**
 * 관리자 「업적 다시 판정」(2026-09-25 B1) — 동기화 내역 화면에 기존 관리자 모양으로 칸 하나.
 * 배포 뒤 첫 판정 · 기준 수치를 바꾼 뒤에 누른다. 50명씩 끝까지 이어서 돌고 진행 수를 보인다.
 */
export default function AchievementRejudgePanel() {
    const [pending, startTransition] = useTransition();
    const [status, setStatus] = useState<string | null>(null);
    const [failed, setFailed] = useState(false);

    function run() {
        setFailed(false);
        startTransition(async () => {
            let cursor: number | null = 0;
            let judged = 0;
            let awarded = 0;
            while (cursor !== null) {
                const result = await rejudgeAchievements(cursor);
                if (!result.success) {
                    setFailed(true);
                    setStatus(
                        `${result.message} (${judged.toLocaleString("ko-KR")}명까지 판정됨)`
                    );
                    return;
                }
                judged += result.judged;
                awarded += result.awarded;
                cursor = result.nextCursor;
                setStatus(
                    `${judged.toLocaleString("ko-KR")}명 판정 · 새 단계 ${awarded.toLocaleString("ko-KR")}개${cursor === null ? " · 끝" : " · 진행 중"}`
                );
            }
        });
    }

    return (
        <section className="bg-surface rounded-card flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="min-w-0">
                <p className="text-sm font-bold">업적 다시 판정</p>
                <p className="text-caption mt-1">
                    기록이 있는 사용자 모두의 업적을 지금 기준으로 판정합니다.
                    얻은 단계는 빼지 않습니다.
                </p>
                {status ? (
                    <p
                        role="status"
                        className={`mt-1 text-xs ${failed ? "text-danger" : "text-text-secondary"}`}
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
                <Award className="size-4" aria-hidden />
                {pending ? "판정 중..." : "다시 판정"}
            </button>
        </section>
    );
}
