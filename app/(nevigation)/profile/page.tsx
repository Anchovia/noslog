import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function Profile() {
    // 쿠키 확인해 유저 데이터 가져오기
    const user = await getUser();

    // todo: 유저 닉네임 미설정시 유저 닉네임 설정 무조건 필요
    return <>{user?.username ? <div></div> : redirect("/profile/settings")}</>;
}
