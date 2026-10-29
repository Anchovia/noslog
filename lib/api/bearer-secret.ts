import { timingSafeEqual } from "node:crypto";

// cron 이 보내는 비밀값은 앞 글자가 맞는 만큼 빨리 끝나지 않게 같은 시간으로 비교한다
export function hasBearerSecret(request: Request, secret: string | undefined) {
    if (!secret) return false;
    const supplied = Buffer.from(request.headers.get("authorization") ?? "");
    const expected = Buffer.from(`Bearer ${secret}`);
    return (
        supplied.length === expected.length &&
        timingSafeEqual(supplied, expected)
    );
}
