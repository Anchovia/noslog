"use client";

import {
    deleteChartEvaluation,
    submitChartEvaluation,
    toggleChartEvaluationReaction,
} from "@/app/(nevigation)/music/[index]/[difficulty]/action";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useTransition } from "react";
import MusicEvaluationForm from "./musicEvaluationForm";
import MusicOpinionList from "./musicOpinionList";
import MusicTierSummary from "./musicTierSummary";
import type { MusicTierVoteProps } from "./musicTierVoteTypes";
import {
    createChartEvaluationFormSchema,
    createChartEvaluationInput,
    type ChartEvaluationFormValues,
    type ChartEvaluationValues,
} from "@/features/music/schemas/chartEvaluationSchema";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

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
    const locale = useLocale();
    const t = useTranslations();
    const evaluationFormSchema = useMemo(
        () => createChartEvaluationFormSchema(t),
        [t]
    );
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
    } = useForm<ChartEvaluationFormValues, unknown, ChartEvaluationValues>({
        resolver: zodResolver(evaluationFormSchema),
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
        evaluationFormSchema.shape.perceivedConstant.safeParse(
            parsedPerceivedConstant
        ).success;

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

    const submitVote = (data: ChartEvaluationValues) => {
        if (!canVote) {
            setMessage(t("music.tier.playRequired"));
            return;
        }

        startTransition(async () => {
            const result = await submitChartEvaluation(
                createChartEvaluationInput(chartId, data),
                locale
            );

            setMessage(result.message);
            if (result.success) refreshDetail();
        });
    };

    const reactToOpinion = (evaluationId: number, value: 1 | -1) => {
        startTransition(async () => {
            const result = await toggleChartEvaluationReaction(
                { evaluationId, value },
                locale
            );

            setMessage(result.message);
            if (result.success) refreshDetail();
        });
    };

    const deleteEvaluation = (evaluationId: number) => {
        if (!window.confirm(t("music.tier.confirmDelete"))) return;

        startTransition(async () => {
            const result = await deleteChartEvaluation(
                { evaluationId },
                locale
            );

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
    });
    const commentField = register("comment");

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
