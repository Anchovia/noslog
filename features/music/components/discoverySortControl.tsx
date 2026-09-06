"use client";

import * as Popover from "@radix-ui/react-popover";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import {
    discoveryQuerySchema,
    getDiscoverySort,
} from "@/features/music/schemas/discoverySchema";
import type { DiscoveryQuery } from "@/features/music/schemas/discoverySchema";
import { DiscoverySortFields } from "@/features/music/components/discoveryFilters";

export default function DiscoverySortControl({
    query,
    signedIn,
    onChange,
}: {
    query: DiscoveryQuery;
    signedIn: boolean;
    onChange: (query: DiscoveryQuery) => void;
}) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(query);
    return (
        <Popover.Root
            open={open}
            onOpenChange={(open) => {
                if (open) setDraft(query);
                setOpen(open);
            }}
        >
            <Popover.Trigger asChild>
                <ActionButton
                    variant="secondary"
                    className="nl-filter-trigger"
                    aria-label={t("discovery.sortLabel")}
                >
                    <ArrowUpDown className="nl-icon-small" aria-hidden />
                    {t(`discovery.sort.${getDiscoverySort(query)}`)}
                    <ChevronDown className="nl-icon-small" aria-hidden />
                </ActionButton>
            </Popover.Trigger>
            <Popover.Portal>
                <div className="noslog-ui">
                    <Popover.Content
                        className="nl-discovery-sort"
                        align="end"
                        sideOffset={8}
                        collisionPadding={16}
                        aria-label={t("discovery.sortLabel")}
                    >
                        <DiscoverySortFields
                            query={draft}
                            signedIn={signedIn}
                            onChange={(next) => {
                                setDraft(next);
                                if (
                                    discoveryQuerySchema.safeParse(next).success
                                )
                                    onChange(next);
                            }}
                        />
                    </Popover.Content>
                </div>
            </Popover.Portal>
        </Popover.Root>
    );
}
