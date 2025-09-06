import { redirect } from "next/navigation";

export function GET() {
    const authorizeParams = new URLSearchParams({
        response_type: "code",
        client_id: process.env.KAKAO_REST_API_KEY!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    }).toString();
    const authorizeURL = `https://kauth.kakao.com/oauth/authorize?${authorizeParams}`;
    return redirect(authorizeURL);
}
