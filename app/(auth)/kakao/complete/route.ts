import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    // request url params에서 code 가져오기
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return new Response(null, { status: 400 });
    }

    // accessToken 파라미터 가져오기
    const accessTokenParams = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code,
    }).toString();
    // accessTokenURL 제작
    const accessTokenURL = `https://kauth.kakao.com/oauth/token?${accessTokenParams}`;
    // 해당 url로 accessToken 요청
    const accessTokenResponse = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
    });
    // 데이터 처리
    const { error, access_token } = await accessTokenResponse.json();
    if (error) {
        return new Response(null, { status: 400 });
    }

    // 카카오 api에서 유저 데이터 가져오기
    const kakaoUserResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        cache: "no-cache",
    });
    const {
        id,
        properties: { profile_image },
    } = await kakaoUserResponse.json();

    // db에서 user 검색
    const user = await db.user.findUnique({
        where: { kakao_id: id },
        select: { id: true },
    });
    if (user) {
        // user가 있으면 user 쿠키 생성 후 redirect
        const session = await getSession();
        session.id = user.id;
        await session.save();
        return redirect("/");
    } else {
        // user가 없으면 user db에 새로 생성
        const newUser = await db.user.create({
            data: {
                kakao_id: id,
                avatar: profile_image,
            },
            select: { id: true },
        });
        // user 쿠키 생성 후 redirect
        const session = await getSession();
        session.id = newUser.id;
        await session.save();
        return redirect("/");
    }
}
