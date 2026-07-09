import Image from "next/image";
import Link from "next/link";

export default function Login() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-8">
            <h1 className="text-primary">Log in</h1>
            <Link
                href={"/kakao/start"}
                className="relative h-12 w-48 rounded-xl bg-yellow-500"
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
