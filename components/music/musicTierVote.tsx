"use client";

import {
    deleteChartEvaluation,
    submitChartEvaluation,
    toggleChartEvaluationReaction,
} from "@/app/(nevigation)/music/[index]/[difficulty]/action";
import { useForm, useWatch } from "react-hook-form";
import { useState, useTransition } from "react";
import MusicEvaluationForm from "./musicEvaluationForm";
import MusicOpinionList from "./musicOpinionList";
import MusicTierSummary from "./musicTierSummary";
import type {
    EvaluationFormValues,
    MusicTierVoteProps,
} from "./musicTierVoteTypes";

// 악곡별 서열 투표 상태와 서버 액션을 한곳에서 관리함
export default function MusicTierVote({
    chartId,
    canVote,
    difficulty,
    level,
    officialConstant,
    tierConstant,
    constantHistory,
    community,
    currentEvaluation,
    opinionCount,
    opinions,
}: MusicTierVoteProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [isCommentExpanded, setIsCommentExpanded] = useState(false);
    const refreshDetail = () =>
        window.dispatchEvent(new Event("music-detail:invalidate"));
    const defaultConstant = difficulty === "Real" ? level + 10 : level;
    const fallbackConstant = Math.min(
        14,
        Math.max(1, officialConstant ?? defaultConstant)
    );
    const initialConstant = Math.min(
        14,
        Math.max(1, currentEvaluation?.perceived_constant ?? fallbackConstant)
    );
    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EvaluationFormValues>({
        defaultValues: {
            perceivedConstant: initialConstant,
            stairs: currentEvaluation?.stairs ?? null,
            chord: currentEvaluation?.chord ?? null,
            trill: currentEvaluation?.trill ?? null,
            glissando: currentEvaluation?.glissando ?? null,
            repetition: currentEvaluation?.repetition ?? null,
            comment: currentEvaluation?.comment ?? "",
        },
    });
    const perceivedInput = useWatch({
        control,
        name: "perceivedConstant",
    });
    const parsedPerceivedConstant = Number(perceivedInput);
    const isPerceivedConstantValid =
        Number.isFinite(parsedPerceivedConstant) &&
        parsedPerceivedConstant >= 1 &&
        parsedPerceivedConstant <= 14 &&
        Number.isInteger(parsedPerceivedConstant * 10);

    const changeConstant = (amount: number) => {
        const current = isPerceivedConstantValid
            ? parsedPerceivedConstant
            : initialConstant;
        const next = Math.min(
            14,
            Math.max(1, Math.round((current + amount) * 10) / 10)
        );

        setValue("perceivedConstant", next, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const submitVote = (data: EvaluationFormValues) => {
        if (!canVote) {
            setMessage("해당 채보의 플레이 기록 연동 후 투표할 수 있습니다.");
            return;
        }

        startTransition(async () => {
            const result = await submitChartEvaluation({
                chartId,
                perceivedConstant: data.perceivedConstant,
                stairs: data.stairs!,
                chord: data.chord!,
                trill: data.trill!,
                glissando: data.glissando!,
                repetition: data.repetition!,
                comment: data.comment,
            });

            setMessage(result.message);
            if (result.success) refreshDetail();
        });
    };

    const reactToOpinion = (evaluationId: number, value: 1 | -1) => {
        startTransition(async () => {
            const result = await toggleChartEvaluationReaction({
                evaluationId,
                value,
            });

            setMessage(result.message);
            if (result.success) refreshDetail();
        });
    };

    const deleteEvaluation = (evaluationId: number) => {
        if (!window.confirm("체감 난이도, 패턴 투표와 의견을 모두 삭제할까요?"))
            return;

        startTransition(async () => {
            const result = await deleteChartEvaluation({ evaluationId });

            setMessage(result.message);
            if (result.success) {
                reset({
                    perceivedConstant: fallbackConstant,
                    stairs: null,
                    chord: null,
                    trill: null,
                    glissando: null,
                    repetition: null,
                    comment: "",
                });
                setIsCommentExpanded(false);
                refreshDetail();
            }
        });
    };

    const perceivedConstantField = register("perceivedConstant", {
        valueAsNumber: true,
        required: "체감 난이도를 입력해 주세요.",
        min: {
            value: 1,
            message: "체감 난이도는 1.0 이상이어야 합니다.",
        },
        max: {
            value: 14,
            message: "체감 난이도는 14.0 이하여야 합니다.",
        },
        validate: (value) =>
            Number.isInteger(value * 10) ||
            "체감 난이도는 0.1 단위로 입력해 주세요.",
    });
    const commentField = register("comment", {
        required: "코멘트를 입력해 주세요.",
        validate: (value) =>
            value.trim().length > 0 || "코멘트를 입력해 주세요.",
        maxLength: {
            value: 120,
            message: "코멘트는 120자 이하로 입력해 주세요.",
        },
    });

    return (
        <div className="flex flex-col gap-3">
            <MusicTierSummary
                tierConstant={tierConstant}
                constantHistory={constantHistory}
                community={community}
            />

            <MusicEvaluationForm
                canVote={canVote}
                isPending={isPending}
                hasCurrentEvaluation={Boolean(currentEvaluation)}
                isCommentExpanded={isCommentExpanded}
                message={message}
                control={control}
                errors={errors}
                perceivedConstantField={perceivedConstantField}
                commentField={commentField}
                onChangeConstant={changeConstant}
                onCommentExpandedChange={setIsCommentExpanded}
                onSubmit={handleSubmit(submitVote)}
            />

            <MusicOpinionList
                opinionCount={opinionCount}
                opinions={opinions}
                isPending={isPending}
                onReact={reactToOpinion}
                onDelete={deleteEvaluation}
            />
        </div>
    );
}
