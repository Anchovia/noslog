"use client";

import { useTransition } from "react";
import { toast } from "sonner";

export default function useActionToast() {
    const [isPending, startTransition] = useTransition();

    function run<Result extends { success: boolean; message: string }>(
        action: () => Promise<Result>,
        {
            errorMessage,
            onFailure,
            onSuccess,
        }: {
            errorMessage: string;
            onFailure?: (result: Result) => void;
            onSuccess?: () => void;
        }
    ) {
        startTransition(async () => {
            try {
                const result = await action();
                if (!result.success) {
                    toast.error(result.message);
                    onFailure?.(result);
                    return;
                }
                toast.success(result.message);
                onSuccess?.();
            } catch {
                toast.error(errorMessage);
            }
        });
    }

    return { isPending, run };
}
