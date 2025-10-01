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
    const result = settingSchema.safeParse(data);
    if (!result.success) {
        console.error("validation 실패");
        return result.error.flatten();
    } else {
        console.info("validation 성공");
        // 세션 불러오기
        const session = await getSession();
        if (session.id) {
            console.info("유저 세션 불러오기 성공");
            // 아바타 처리
            // 기존 사진 삭제
            const prev = await db.user.findUnique({
                where: {
                    id: session.id,
                },
                select: {
                    avatar: true,
                },
            });
            // 기존 사진이 존재할때
            if (prev?.avatar) {
                // cloudflare 이미지 판단
                if (prev.avatar.split("/")[2] === "imagedelivery.net") {
                    // cloudflare 이미지 처리 로직
                    const prevAvatarId = prev.avatar.split("/")[4]; // 구 사진 id만 추출
                    const newAvatarId = result.data.avatar.split("/")[4]; // 신 사진 id만 추출
                    if (prevAvatarId !== newAvatarId) {
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
                            // 이전 사진 삭제 후 아바타 포함 유저 정보 업데이트
                            await db.user.update({
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
                            console.info("유저 정보 업데이트 성공");
                            redirect(`/profile/${session.id}`);
                        }
                    }
                } else {
                    console.warn("cloudFlare 이미지 아님");
                }
                // 아바타 미포함 유저 정보 업데이트
                await db.user.update({
                    where: {
                        id: session.id,
                    },
                    data: {
                        username: result.data.username,
                        discord_name: result.data.discord_name,
                        discord_tag: result.data.discord_tag,
                    },
                });
                console.info("유저 정보 업데이트 성공");
                redirect(`/profile/${session.id}`);
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
