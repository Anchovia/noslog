"use client";

import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { openMyChartDraft } from "@/app/(site)/music/[index]/[difficulty]/draft-actions";
import ChartTimingEditor, {
    type ChartEditorMetadata,
} from "@/components/admin/chart-pattern/chartTimingEditor";
import { useTranslations } from "@/components/i18n/locale-provider";
import ButtonLink from "@/components/ui/button-link";
import ResultState from "@/components/ui/result-state";
import { LoadingStatus } from "@/components/ui/skeleton";
import { USER_DRAFT_MAX_OPEN } from "@/features/contributions/schemas/chart-draft-schema";
import type { MyChartDraft } from "@/features/contributions/server/chart-draft-service";

type OpenState =
    | { kind: "opening" }
    | { kind: "open"; draft: MyChartDraft }
    | { kind: "missing" }
    | { kind: "limit" }
    | { kind: "failed"; error: unknown };

/** 고칠 초안이 없으면 서버 액션으로 열고(같은 출처 요청만 쓴다) 에디터를 보여 준다 */
export default function ChartDraftEditor({
    metadata,
    initialDraft,
    backHref,
    profileHref,
}: {
    metadata: ChartEditorMetadata;
    initialDraft: MyChartDraft | null;
    backHref: string;
    /** 한도에 닿았을 때 초안을 지우러 가는 내 프로필 「기여」 구역 */
    profileHref: string;
}) {
    const t = useTranslations();
    const [state, setState] = useState<OpenState>(
        initialDraft
            ? { kind: "open", draft: initialDraft }
            : { kind: "opening" }
    );
    // 개발 모드의 effect 두 번 실행이 초안을 두 번 만들지 않게 한다
    const opened = useRef(initialDraft !== null);

    useEffect(() => {
        if (opened.current) return;
        opened.current = true;
        openMyChartDraft(metadata.chartId).then(
            (draft) =>
                setState(
                    draft === "limit"
                        ? { kind: "limit" }
                        : draft
                          ? { kind: "open", draft }
                          : { kind: "missing" }
                ),
            (error: unknown) => setState({ kind: "failed", error })
        );
    }, [metadata.chartId]);

    if (state.kind === "missing") notFound();
    if (state.kind === "failed") throw state.error;
    if (state.kind === "limit")
        return (
            <ResultState
                message={t("contribution.draft.limit", {
                    count: USER_DRAFT_MAX_OPEN,
                })}
                action={
                    <div className="flex flex-wrap gap-nl-12">
                        <ButtonLink href={profileHref} variant="secondary">
                            {t("contribution.draft.limitMine")}
                        </ButtonLink>
                        <ButtonLink href={backHref} variant="secondary">
                            {t("editor.back")}
                        </ButtonLink>
                    </div>
                }
            />
        );
    if (state.kind === "opening")
        return (
            <div aria-busy="true">
                <LoadingStatus label={t("editor.myDraft")} />
            </div>
        );
    const { draft } = state;
    return (
        <ChartTimingEditor
            metadata={metadata}
            initialDocument={draft.document}
            draftVersion={draft.version}
            savedRevision={0}
            publishedRevision={null}
            updatedAt={draft.updatedAt}
            mode={{
                kind: "contributor",
                draftId: draft.id,
                status: draft.status,
                backHref,
            }}
        />
    );
}
