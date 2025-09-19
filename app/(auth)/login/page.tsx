import Image from "next/image";
import Link from "next/link";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen gap-8">
            <h1 className="text-primary">Log in</h1>
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
