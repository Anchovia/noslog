import Image from "next/image";
import Link from "next/link";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
            <Link
                href={"/google/start"}
                className="px-4 py-2.5 bg-orange-500 rounded-xl"
            >
                구글 계정으로 로그인하기
            </Link>
            <Link
                href={"/kakao/start"}
                className="w-48 h-12 bg-yellow-500 rounded-xl relative"
            >
                <Image
                    src={"/kakao_login_large_narrow.png"}
                    alt="카카오 로그인"
                    fill
                />
            </Link>
        </div>
    );
}
