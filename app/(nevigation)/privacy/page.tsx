import Link from "next/link";

import { createPageMetadata } from "@/lib/metadata/site";

export const metadata = createPageMetadata({
    title: "개인정보처리방침",
    description:
        "NosLog가 처리하는 개인정보의 항목, 목적, 보유 기간과 이용자의 권리를 안내합니다.",
    path: "/privacy",
});

const policySections = [
    {
        title: "1. 처리하는 개인정보와 이용 목적",
        content: (
            <div className="flex flex-col gap-3">
                <PolicyItem
                    label="Discord 로그인"
                    body="Discord 사용자 식별자, 표시 이름, 사용자 이름을 받아 회원 식별과 로그인에 사용합니다. Discord 비밀번호와 액세스 토큰은 저장하지 않습니다."
                />
                <PolicyItem
                    label="프로필 및 게임 기록"
                    body="닉네임, 노스텔지어 플레이어명, 국가, 선호 오락실, 프로필 공개 설정, 플레이·판정·레이팅·동기화 기록을 프로필과 기록 서비스를 제공하는 데 사용합니다."
                />
                <PolicyItem
                    label="검정 및 피드백"
                    body="검정 합격 증빙 이미지, 심사 결과·메모, 피드백 내용과 첨부 이미지를 제출 심사와 문의 처리에 사용합니다."
                />
                <PolicyItem
                    label="자동 생성 정보"
                    body="접속 IP, 브라우저·기기 정보, 접속 시각, 요청 및 오류 로그가 서비스 보안, 장애 대응과 운영 과정에서 생성될 수 있습니다."
                />
            </div>
        ),
    },
    {
        title: "2. 개인정보의 수집 방법",
        content: (
            <p>
                Discord 로그인, 이용자가 직접 입력하거나 업로드한 정보, BEMANI
                기록 동기화 기능, 서비스 이용 중 자동으로 생성되는 로그를 통해
                수집합니다.
            </p>
        ),
    },
    {
        title: "3. 보유 및 이용 기간",
        content: (
            <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>
                    계정, 프로필, 플레이 및 동기화 기록: 회원 탈퇴 또는 삭제
                    요청 시까지
                </li>
                <li>아바타: 교체·삭제하거나 회원 탈퇴할 때까지</li>
                <li>
                    처리 완료된 피드백: 완료일로부터 6개월 후 내용과 첨부 이미지
                    전체 삭제
                </li>
                <li>
                    승인된 검정 제출: 심사 완료 6개월 후 증빙 이미지와 심사 메모
                    삭제, 합격 이력은 회원 탈퇴 시까지 보관
                </li>
                <li>
                    반려된 검정 제출: 심사 완료 6개월 후 제출 기록과 증빙 이미지
                    전체 삭제
                </li>
            </ul>
        ),
    },
    {
        title: "4. 개인정보의 제3자 제공",
        content: (
            <p>
                NosLog는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지
                않습니다. 다만 이용자가 별도로 동의하거나 법령에 근거가 있는
                경우에는 예외로 합니다.
            </p>
        ),
    },
    {
        title: "5. 처리 업무의 위탁 및 국외 이전",
        content: (
            <div className="flex flex-col gap-3">
                <PolicyItem
                    label="Vercel"
                    body="웹 호스팅, 서버 실행과 운영 로그 처리를 맡깁니다. 서버 실행 리전은 싱가포르(sin1)이며, 서비스 이용 시 네트워크를 통해 전송되어 서비스 제공 기간 동안 처리됩니다."
                />
                <PolicyItem
                    label="Vercel Blob"
                    body="아바타와 제출 이미지를 저장합니다. 저장 리전은 대한민국 서울(icn1)이며, 검정 증빙과 피드백 이미지는 비공개 저장소에 보관합니다."
                />
                <PolicyItem
                    label="Neon"
                    body="회원과 서비스 데이터를 PostgreSQL 데이터베이스에 저장합니다. 저장 리전은 싱가포르(Southeast, sin1)이며 서비스 제공 기간 동안 처리됩니다."
                />
                <PolicyItem
                    label="Discord"
                    body="로그인과 계정 식별을 위해 미국 소재 Discord와 인증 정보를 주고받습니다. 로그인 시 네트워크를 통해 전송되며, Discord가 처리하는 정보에는 Discord의 정책이 적용됩니다."
                />
                <PolicyItem
                    label="Kakao Maps"
                    body="오락실 지도 제공을 위해 대한민국 소재 카카오 지도 서비스를 사용합니다. 지도 이용 과정에서 접속 정보가 처리될 수 있습니다."
                />
                <p>
                    국외 이전을 원하지 않으면 Discord 로그인을 진행하지 않거나
                    회원 탈퇴를 요청할 수 있습니다. 다만 이 경우 로그인 기반
                    기능을 이용할 수 없습니다.
                </p>
            </div>
        ),
    },
    {
        title: "6. 개인정보의 파기",
        content: (
            <p>
                보유 기간이 끝나거나 처리 목적을 달성한 개인정보는 지체 없이
                삭제합니다. 데이터베이스 기록은 복구하기 어려운 방식으로
                삭제하고, 업로드 파일은 저장소에서 함께 삭제합니다. 법령에 따라
                별도 보관이 필요한 경우에는 해당 정보만 분리해 정해진 기간 동안
                보관합니다.
            </p>
        ),
    },
    {
        title: "7. 이용자와 법정대리인의 권리",
        content: (
            <div className="flex flex-col gap-2">
                <p>
                    이용자 또는 법정대리인은 개인정보 열람, 정정, 삭제, 처리
                    정지를 요청할 수 있습니다. 프로필 설정에서 직접 정보를
                    수정하거나 회원 탈퇴를 할 수 있으며, 아래 이메일로도 요청할
                    수 있습니다.
                </p>
                <p>
                    회원 탈퇴 시 계정과 플레이·동기화 기록, 커뮤니티 활동,
                    피드백, 검정 제출과 업로드 파일이 즉시 영구 삭제됩니다. 이후
                    같은 Discord 계정으로 로그인하면 새 계정으로 가입합니다.
                </p>
            </div>
        ),
    },
    {
        title: "8. 쿠키와 세션",
        content: (
            <p>
                로그인 상태 유지를 위해 필수 세션 쿠키
                <span className="text-text-primary font-medium">
                    {" "}
                    user_session_cookie
                </span>
                를 사용합니다. 쿠키는 최대 14일간 유지되며 HttpOnly,
                SameSite=Lax와 운영 환경의 Secure 속성을 적용합니다. 브라우저
                설정에서 쿠키를 거부할 수 있지만 로그인 기능이 제한됩니다.
            </p>
        ),
    },
    {
        title: "9. 안전성 확보 조치",
        content: (
            <p>
                접근 권한을 필요한 운영자로 제한하고, 전송 구간 암호화, 관리자
                권한 확인, 비공개 증빙 저장소, 업로드 형식·용량 검증과 세션 보호
                조치를 적용합니다.
            </p>
        ),
    },
] as const;

function PolicyItem({ label, body }: { label: string; body: string }) {
    return (
        <div>
            <h3 className="text-label">{label}</h3>
            <p className="mt-1">{body}</p>
        </div>
    );
}

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <header>
                <h1 className="text-title">개인정보처리방침</h1>
                <p className="text-caption mt-1">시행일 2026년 7월 27일</p>
            </header>

            <section className="bg-surface rounded-card p-4">
                <p className="text-body-muted">
                    NosLog 운영자는 이용자의 개인정보를 중요하게 생각하며, 관련
                    법령에 따라 다음과 같이 개인정보처리방침을 공개합니다.
                </p>
            </section>

            {policySections.map((section) => (
                <section
                    key={section.title}
                    className="bg-surface rounded-card p-4"
                >
                    <h2 className="text-section">{section.title}</h2>
                    <div className="text-body-muted mt-3">
                        {section.content}
                    </div>
                </section>
            ))}

            <section className="bg-surface rounded-card p-4">
                <h2 className="text-section">
                    10. 개인정보 보호 책임자 및 문의
                </h2>
                <dl className="text-body-muted mt-3 grid grid-cols-[5rem_1fr] gap-y-2">
                    <dt>운영자</dt>
                    <dd className="text-text-primary">NosLog 운영자</dd>
                    <dt>이메일</dt>
                    <dd>
                        <a
                            href="mailto:sodacandy77@naver.com"
                            className="text-text-primary underline underline-offset-4"
                        >
                            sodacandy77@naver.com
                        </a>
                    </dd>
                </dl>
                <p className="text-caption mt-3">
                    개인정보 관련 요청은 내용을 확인한 뒤 지체 없이
                    처리하겠습니다.
                </p>
            </section>

            <section className="bg-surface rounded-card p-4">
                <h2 className="text-section">11. 방침 변경 안내</h2>
                <p className="text-body-muted mt-3">
                    내용이 변경되면 시행 전에 서비스 공지사항을 통해 안내합니다.
                    현재 방침은 2026년 7월 27일부터 시행합니다.
                </p>
            </section>

            <Link
                href="/"
                className="border-border text-text-secondary hover:text-text-primary rounded-card flex h-11 items-center justify-center border text-sm font-semibold transition-colors"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
