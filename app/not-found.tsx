import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div>
                <h1 className="text-title">페이지를 찾을 수 없습니다.</h1>
                <p className="text-body-muted mt-2">
                    주소가 변경되었거나 존재하지 않는 페이지입니다.
                </p>
            </div>
            <Link
                href="/"
                className="border-border bg-surface text-text-primary flex h-10 items-center rounded-md border px-4 text-sm font-semibold"
            >
                홈으로 이동
            </Link>
        </div>
    );
}
