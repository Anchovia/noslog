"use client";

import { type ComponentType, useEffect, useState } from "react";

import type { FeedbackDialogProps } from "./feedback-dialog";

type FeedbackDialogComponent = ComponentType<FeedbackDialogProps>;

let feedbackDialogModule: Promise<FeedbackDialogComponent> | null = null;
const loadFeedbackDialog = () =>
    (feedbackDialogModule ??= import("./feedback-dialog").then(
        (module) => module.default
    ));

/** 메뉴를 열거나 버튼에 손이 갈 때 미리 받아 첫 열림 지연을 가린다 */
export function preloadFeedbackDialog() {
    void loadFeedbackDialog().catch(() => {
        feedbackDialogModule = null;
    });
}

/**
 * 피드백 창(폼 · 검증 · 업로드)은 처음 열릴 때 받는다 — 모든 화면 셸 번들에 싣지 않게.
 * 한 번 열린 뒤에는 닫혀도 붙여 둔다(닫힘 움직임 · 쓰던 내용 유지).
 */
export default function LazyFeedbackDialog(
    props: FeedbackDialogProps & { open: boolean }
) {
    const [opened, setOpened] = useState(props.open);
    if (props.open && !opened) setOpened(true);
    return opened ? <MountedFeedbackDialog {...props} /> : null;
}

/**
 * 코드가 오면 닫힌 채로 한 번 붙인 뒤 다음 프레임에 연다 — 전에 늘 붙어 있던 창과 같은 순서.
 * 열린 채 처음 붙으면 전체 화면 창의 뒤로 가기 기록(useOverlayHistory)이 개발 모드 이중 실행에서 창을 바로 닫는다.
 */
function MountedFeedbackDialog(props: FeedbackDialogProps & { open: boolean }) {
    const [Dialog, setDialog] = useState<FeedbackDialogComponent | null>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        let active = true;
        loadFeedbackDialog().then(
            (component) => {
                if (active) setDialog(() => component);
            },
            () => {
                feedbackDialogModule = null;
            }
        );
        return () => {
            active = false;
        };
    }, []);
    useEffect(() => {
        if (!Dialog) return;
        const frame = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(frame);
    }, [Dialog]);
    if (!Dialog) return null;
    return <Dialog {...props} open={ready && props.open} trigger={null} />;
}
