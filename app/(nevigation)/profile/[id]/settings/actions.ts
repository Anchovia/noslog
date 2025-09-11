"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { settingSchema } from "./schema";

export async function uploadUserSetting(formdata: FormData) {
    // 데이터 받아오기
    const data = {
        username: formdata.get("username"),
        discord_name: formdata.get("discord_name"),
        discord_tag: formdata.get("discord_tag"),
        avatar: formdata.get("avatar"),
    };
    console.info("유저 데이터 서버 전송 완료");

    // zod validation
    console.info("validation 시작");
    const result = settingSchema.safeParse(data);
    if (!result.success) {
        console.error("validation 실패");
        return result.error.flatten();
    } else {
        console.info("validation 성공");

        // 세션 불러오기
        console.info("유저 세션 불러오는 중...");
        const session = await getSession();
        if (session.id) {
            console.info("유저 세션 불러오기 성공");

            // 기존 사진 삭제
            console.info("이전 사진 삭제 중...");
            const prev = await db.user.findUnique({
                where: {
                    id: session.id,
                },
                select: {
                    avatar: true,
                },
            });
            if (prev?.avatar) {
                const prevAvatarId = prev.avatar.split("/")[4]; // 사진 id만 추출
                const response = await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${prevAvatarId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                        },
                    }
                );
                if (response.ok) {
                    console.info("이전 사진 삭제 성공");
                } else {
                    console.error("이전 사진 삭제 실패");
                }
            } else {
                console.warn("이전 사진이 없습니다.");
            }
            // 유저 정보 업데이트
            console.info("유저 정보 업데이트 중...");
            const user = await db.user.update({
                where: {
                    id: session.id,
                },
                data: {
                    username: result.data.username,
                    discord_name: result.data.discord_name,
                    discord_tag: result.data.discord_tag,
                    avatar: `${result.data.avatar}/profile`,
                },
            });
            if (user) {
                console.info("유저 정보 업데이트 성공");
                redirect(`/profile/${user.id}/basic`);
            } else {
                console.error("유저 정보 업데이트 실패");
            }
        }
    }
}

export async function getImageUploadUrl() {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
            },
        }
    );
    const data = await response.json();
    return data;
}
