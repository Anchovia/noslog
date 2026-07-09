import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    // 메인 섹션들 padding py-24 px-16 사용 필수
    return (
        <div className="flex flex-col">
            <section className="bg-dark-tertiary flex flex-col items-center justify-center px-16 py-24 text-center">
                <div className="rounded-fill relative size-20 overflow-hidden">
                    <Image src={"/logo.png"} alt="logo" fill />
                </div>
                <h1 className="flex flex-col gap-2 text-5xl">
                    <span className="font-thin">Welcome to</span>
                    <p className="font-medium">NosLog</p>
                </h1>
                <span className="max-w-84 pt-8 text-base font-normal">
                    NosLog는 NOSTALGIA의 유저 정보를 제공해주는 팬사이트 입니다.
                </span>
            </section>
            <section className="flex flex-col items-center px-16 py-24 text-center">
                <h2 className="text-2xl font-semibold">
                    NosLog는 어떻게 이용하나요?
                </h2>
            </section>
            <section className="flex flex-col gap-24 px-16">
                <article className="flex flex-col items-center gap-4 text-center">
                    <h3 className="text-xl font-medium">가입</h3>
                    <span className="text-lg font-thin">
                        NosLog는 Kakao 소셜 로그인을 지원합니다.
                    </span>
                    <Link
                        href={"/login"}
                        className="relative h-72 w-80 rounded-xl"
                    >
                        <Image
                            src={"/main_signup.png"}
                            alt="signup"
                            fill
                            className="bg-auto bg-center"
                        />
                    </Link>
                </article>
                <article className="flex flex-col items-center gap-4 text-center">
                    <h3 className="text-xl font-medium">BEMANI 데이터 전송</h3>
                    <span className="text-lg font-thin">
                        JS Console 입력을 통해 BEMANI 데이터를 NosLog로
                        전송합니다.
                    </span>
                    <Link
                        href={"/bookmarklet"}
                        className="bg-dark-secondary h-60 w-full max-w-lg rounded-xl"
                    ></Link>
                </article>
                <article className="flex flex-col items-center gap-4 text-center">
                    <h3 className="text-xl font-medium">
                        NosLog의 다양한 서비스 이용
                    </h3>
                    <span className="text-lg font-thin">
                        악곡, 유저랭킹, 빙고 등 NosLog의 다양한 서비스를
                        이용해보세요.
                    </span>
                    <div className="bg-dark-secondary mb-24 h-60 w-full max-w-lg rounded-xl" />
                </article>
            </section>
        </div>
    );
}
