import Image from "next/image";

export default async function Home() {
    // 메인 섹션들 padding py-24 px-16 사용 필수
    return (
        <div className="flex flex-col">
            <section className="py-24 px-16 flex flex-col text-center items-center justify-center bg-dark-tertiary">
                <div className="size-20 rounded-fill overflow-hidden relative">
                    <Image src={"/logo.png"} alt="logo" fill />
                </div>
                <h1 className="flex flex-col text-5xl gap-2">
                    <span className="font-thin">Welcome to</span>
                    <p className="font-medium">NosLog</p>
                </h1>
                <span className="font-normal text-base pt-8 max-w-[21rem]">
                    NosLog는 NOSTALGIA의 유저 정보를 제공해주는 팬사이트 입니다.
                </span>
            </section>
            <section className="py-24 px-16 flex flex-col items-center text-center">
                <h2 className="text-2xl font-semibold">
                    NosLog는 어떻게 이용하나요?
                </h2>
            </section>
            <section className="px-16 flex flex-col gap-24">
                <article className="flex flex-col items-center text-center gap-4">
                    <h3 className="text-xl font-medium">가입</h3>
                    <span className="text-lg font-thin">
                        NosLog는 Kakao 소셜 로그인을 지원합니다.
                    </span>
                    <div className="w-full max-w-lg h-60 bg-dark-secondary rounded-xl" />
                </article>
                <article className="flex flex-col items-center text-center gap-4">
                    <h3 className="text-xl font-medium">BEMANI 데이터 전송</h3>
                    <span className="text-lg font-thin">
                        JS Console 입력을 통해 BEMANI 데이터를 NosLog로
                        전송합니다.
                    </span>
                    <div className="w-full max-w-lg h-60 bg-dark-secondary rounded-xl" />
                </article>
                <article className="flex flex-col items-center text-center gap-4">
                    <h3 className="text-xl font-medium">
                        NosLog의 다양한 서비스 이용
                    </h3>
                    <span className="text-lg font-thin">
                        악곡, 유저랭킹, 빙고 등 NosLog의 다양한 서비스를
                        이용해보세요.
                    </span>
                    <div className="mb-24 w-full max-w-lg h-60 bg-dark-secondary rounded-xl" />
                </article>
            </section>
        </div>
    );
}
