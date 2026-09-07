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
    discoveryQuery: string;
    setDiscoveryQuery: (query: string) => void;
    setOrigin: (origin: ArcadeOrigin) => void;
    setBounds: (bounds: ArcadeBounds | null) => void;
    select: (selectedId: number | null) => void;
}>((set) => ({
    origin: null,
    bounds: null,
    selectedId: null,
    discoveryQuery: "",
    setDiscoveryQuery: (discoveryQuery) => set({ discoveryQuery }),
    setOrigin: (origin) => set({ origin }),
    setBounds: (bounds) => set({ bounds }),
    select: (selectedId) => set({ selectedId }),
}));
