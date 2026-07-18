"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
    return (
        <html lang="ko">
            <body className="bg-bg text-text-primary">
                <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
                    <div>
                        <h1 className="text-xl font-semibold">
                            NosLog를 불러오지 못했습니다.
                        </h1>
                        <p className="text-text-secondary mt-2 text-sm">
                            잠시 후 다시 시도해주세요.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={reset}
                        className="border-border bg-surface text-text-primary h-10 cursor-pointer rounded-md border px-4 text-sm font-semibold"
                    >
                        다시 시도
                    </button>
                </main>
            </body>
        </html>
    );
}
