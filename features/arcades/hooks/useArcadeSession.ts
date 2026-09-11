"use client";
import { create } from "zustand";
import type {
    ArcadeBounds,
    ArcadeOrigin,
} from "@/features/arcades/types/arcadeGeography";

// Memory only: current location must never enter storage, URLs or server requests.
export const useArcadeSession = create<{
    origin: ArcadeOrigin | null;
    bounds: ArcadeBounds | null;
    selectedId: number | null;
    /** 목록에서 펼친 카드 — 상세에 다녀와도 같은 카드가 펼쳐진 채로 돌아온다 */
    expandedId: number | null;
    discoveryQuery: string;
    setDiscoveryQuery: (query: string) => void;
    setOrigin: (origin: ArcadeOrigin) => void;
    setBounds: (bounds: ArcadeBounds | null) => void;
    select: (selectedId: number | null) => void;
    expand: (expandedId: number | null) => void;
}>((set) => ({
    origin: null,
    bounds: null,
    selectedId: null,
    expandedId: null,
    discoveryQuery: "",
    setDiscoveryQuery: (discoveryQuery) => set({ discoveryQuery }),
    setOrigin: (origin) => set({ origin }),
    setBounds: (bounds) => set({ bounds }),
    select: (selectedId) => set({ selectedId }),
    expand: (expandedId) => set({ expandedId }),
}));
