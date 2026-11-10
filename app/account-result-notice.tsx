"use client";

import type { ReactNode } from "react";

import useAccountResultNotice from "@/features/settings/hooks/use-account-result-notice";

export default function AccountResultNotice({
    children,
}: {
    children: ReactNode;
}) {
    useAccountResultNotice();
    return children;
}
