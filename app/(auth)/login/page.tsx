import { KakaoLogin } from "./action";

export default function Login() {
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <form
                action={KakaoLogin}
                className="px-4 py-2.5 bg-yellow-400 rounded-xl"
            >
                <button className="text-sm text-black">
                    카카오 계정으로 로그인 하기
                </button>
            </form>
        </div>
    );
}
