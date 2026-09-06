import type { Metadata } from "next";
import Link from "next/link";

import { getServerI18n } from "@/lib/i18n/server";
import { localizePath, type Locale } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";

interface PolicyItem {
    label: string;
    body: string;
}

interface PolicySection {
    title: string;
    paragraphs?: string[];
    items?: PolicyItem[];
    bullets?: string[];
}

interface PolicyCopy {
    title: string;
    description: string;
    effectiveDate: string;
    intro: string;
    sections: PolicySection[];
    contactTitle: string;
    operatorLabel: string;
    operator: string;
    emailLabel: string;
    contactNote: string;
    changesTitle: string;
    changesBody: string;
    backHome: string;
}

const policyByLocale: Record<Locale, PolicyCopy> = {
    ko: {
        title: "개인정보처리방침",
        description:
            "NosLog가 처리하는 개인정보의 항목, 목적, 보유 기간과 이용자의 권리를 안내합니다.",
        effectiveDate: "시행일 2026년 7월 27일",
        intro: "NosLog 운영자는 이용자의 개인정보를 중요하게 생각하며, 관련 법령에 따라 다음과 같이 개인정보처리방침을 공개합니다.",
        sections: [
            {
                title: "1. 처리하는 개인정보와 이용 목적",
                items: [
                    {
                        label: "Discord 로그인",
                        body: "Discord 사용자 식별자, 표시 이름, 사용자 이름을 받아 회원 식별과 로그인에 사용합니다. Discord 비밀번호와 액세스 토큰은 저장하지 않습니다.",
                    },
                    {
                        label: "프로필 및 게임 기록",
                        body: "닉네임, 노스텔지어 플레이어명, 국가, 선호 오락실, 프로필 공개 설정, 플레이·판정·레이팅·동기화 기록을 프로필과 기록 서비스를 제공하는 데 사용합니다.",
                    },
                    {
                        label: "검정 및 피드백",
                        body: "검정 합격 증빙 이미지, 심사 결과·메모, 피드백 내용과 첨부 이미지를 제출 심사와 문의 처리에 사용합니다.",
                    },
                    {
                        label: "자동 생성 정보",
                        body: "접속 IP, 브라우저·기기 정보, 접속 시각, 요청 및 오류 로그가 서비스 보안, 장애 대응과 운영 과정에서 생성될 수 있습니다.",
                    },
                ],
            },
            {
                title: "2. 개인정보의 수집 방법",
                paragraphs: [
                    "Discord 로그인, 이용자가 직접 입력하거나 업로드한 정보, BEMANI 기록 동기화 기능, 서비스 이용 중 자동으로 생성되는 로그를 통해 수집합니다.",
                ],
            },
            {
                title: "3. 보유 및 이용 기간",
                bullets: [
                    "계정, 프로필, 플레이 및 동기화 기록: 회원 탈퇴 또는 삭제 요청 시까지",
                    "아바타: 교체·삭제하거나 회원 탈퇴할 때까지",
                    "처리 완료된 피드백: 완료일로부터 6개월 후 내용과 첨부 이미지 전체 삭제",
                    "승인된 검정 제출: 심사 완료 6개월 후 증빙 이미지와 심사 메모 삭제, 합격 이력은 회원 탈퇴 시까지 보관",
                    "반려된 검정 제출: 심사 완료 6개월 후 제출 기록과 증빙 이미지 전체 삭제",
                ],
            },
            {
                title: "4. 개인정보의 제3자 제공",
                paragraphs: [
                    "NosLog는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만 이용자가 별도로 동의하거나 법령에 근거가 있는 경우에는 예외로 합니다.",
                ],
            },
            {
                title: "5. 처리 업무의 위탁 및 국외 이전",
                items: [
                    {
                        label: "Vercel",
                        body: "웹 호스팅, 서버 실행과 운영 로그 처리를 맡깁니다. 서버 실행 리전은 싱가포르(sin1)이며, 서비스 이용 시 네트워크를 통해 전송되어 서비스 제공 기간 동안 처리됩니다.",
                    },
                    {
                        label: "Vercel Blob",
                        body: "아바타와 제출 이미지를 저장합니다. 저장 리전은 대한민국 서울(icn1)이며, 검정 증빙과 피드백 이미지는 비공개 저장소에 보관합니다.",
                    },
                    {
                        label: "Neon",
                        body: "회원과 서비스 데이터를 PostgreSQL 데이터베이스에 저장합니다. 저장 리전은 싱가포르(Southeast, sin1)이며 서비스 제공 기간 동안 처리됩니다.",
                    },
                    {
                        label: "Discord",
                        body: "로그인과 계정 식별을 위해 미국 소재 Discord와 인증 정보를 주고받습니다. 로그인 시 네트워크를 통해 전송되며, Discord가 처리하는 정보에는 Discord의 정책이 적용됩니다.",
                    },
                    {
                        label: "Kakao Maps",
                        body: "오락실 지도 제공을 위해 대한민국 소재 카카오 지도 서비스를 사용합니다. 지도 이용 과정에서 접속 정보가 처리될 수 있습니다.",
                    },
                ],
                paragraphs: [
                    "국외 이전을 원하지 않으면 Discord 로그인을 진행하지 않거나 회원 탈퇴를 요청할 수 있습니다. 다만 이 경우 로그인 기반 기능을 이용할 수 없습니다.",
                ],
            },
            {
                title: "6. 개인정보의 파기",
                paragraphs: [
                    "보유 기간이 끝나거나 처리 목적을 달성한 개인정보는 지체 없이 삭제합니다. 데이터베이스 기록은 복구하기 어려운 방식으로 삭제하고, 업로드 파일은 저장소에서 함께 삭제합니다. 법령에 따라 별도 보관이 필요한 경우에는 해당 정보만 분리해 정해진 기간 동안 보관합니다.",
                ],
            },
            {
                title: "7. 이용자와 법정대리인의 권리",
                paragraphs: [
                    "이용자 또는 법정대리인은 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 프로필 설정에서 직접 정보를 수정하거나 회원 탈퇴를 할 수 있으며, 아래 이메일로도 요청할 수 있습니다.",
                    "회원 탈퇴 시 계정과 플레이·동기화 기록, 커뮤니티 활동, 피드백, 검정 제출과 업로드 파일이 즉시 영구 삭제됩니다. 이후 같은 Discord 계정으로 로그인하면 새 계정으로 가입합니다.",
                ],
            },
            {
                title: "8. 쿠키와 세션",
                paragraphs: [
                    "로그인 상태 유지를 위해 필수 세션 쿠키 user_session_cookie를 사용합니다. 쿠키는 최대 14일간 유지되며 HttpOnly, SameSite=Lax와 운영 환경의 Secure 속성을 적용합니다. 브라우저 설정에서 쿠키를 거부할 수 있지만 로그인 기능이 제한됩니다.",
                ],
            },
            {
                title: "9. 안전성 확보 조치",
                paragraphs: [
                    "접근 권한을 필요한 운영자로 제한하고, 전송 구간 암호화, 관리자 권한 확인, 비공개 증빙 저장소, 업로드 형식·용량 검증과 세션 보호 조치를 적용합니다.",
                ],
            },
        ],
        contactTitle: "10. 개인정보 보호 책임자 및 문의",
        operatorLabel: "운영자",
        operator: "NosLog 운영자",
        emailLabel: "이메일",
        contactNote:
            "개인정보 관련 요청은 내용을 확인한 뒤 지체 없이 처리하겠습니다.",
        changesTitle: "11. 방침 변경 안내",
        changesBody:
            "내용이 변경되면 시행 전에 서비스 공지사항을 통해 안내합니다. 현재 방침은 2026년 7월 27일부터 시행합니다.",
        backHome: "홈으로 돌아가기",
    },
    ja: {
        title: "プライバシーポリシー",
        description:
            "NosLogが取り扱う個人情報の項目、利用目的、保管期間、およびユーザーの権利について説明します。",
        effectiveDate: "施行日：2026年7月27日",
        intro: "NosLogの運営者はユーザーの個人情報を重視し、関連法令に基づいて以下のとおりプライバシーポリシーを公開します。",
        sections: [
            {
                title: "1. 取り扱う個人情報と利用目的",
                items: [
                    {
                        label: "Discordログイン",
                        body: "Discordのユーザー識別子、表示名、ユーザー名を取得し、会員の識別とログインに使用します。Discordのパスワードおよびアクセストークンは保存しません。",
                    },
                    {
                        label: "プロフィールおよびゲーム記録",
                        body: "ニックネーム、ノスタルジアのプレーヤー名、国・地域、よく利用するゲームセンター、プロフィール公開設定、プレー・判定・レーティング・同期記録を、プロフィールと記録サービスの提供に使用します。",
                    },
                    {
                        label: "検定およびフィードバック",
                        body: "検定合格の証明画像、審査結果・メモ、フィードバック内容と添付画像を、提出内容の審査および問い合わせ対応に使用します。",
                    },
                    {
                        label: "自動的に生成される情報",
                        body: "接続IP、ブラウザー・端末情報、接続時刻、リクエストおよびエラーログが、サービスのセキュリティ、障害対応、運営の過程で生成される場合があります。",
                    },
                ],
            },
            {
                title: "2. 個人情報の収集方法",
                paragraphs: [
                    "Discordログイン、ユーザーが直接入力またはアップロードした情報、BEMANI記録同期機能、およびサービス利用中に自動生成されるログを通じて収集します。",
                ],
            },
            {
                title: "3. 保管および利用期間",
                bullets: [
                    "アカウント、プロフィール、プレーおよび同期記録：退会または削除の依頼まで",
                    "アバター：変更・削除または退会まで",
                    "対応済みのフィードバック：対応完了日から6か月後に内容と添付画像をすべて削除",
                    "承認された検定提出：審査完了から6か月後に証明画像と審査メモを削除し、合格履歴は退会まで保管",
                    "却下された検定提出：審査完了から6か月後に提出記録と証明画像をすべて削除",
                ],
            },
            {
                title: "4. 個人情報の第三者提供",
                paragraphs: [
                    "NosLogは、原則としてユーザーの個人情報を第三者に提供しません。ただし、ユーザーが別途同意した場合、または法令に基づく場合を除きます。",
                ],
            },
            {
                title: "5. 取扱業務の委託および国外移転",
                items: [
                    {
                        label: "Vercel",
                        body: "Webホスティング、サーバー実行、運営ログの処理を委託します。サーバー実行リージョンはシンガポール（sin1）で、サービス利用時にネットワーク経由で送信され、サービス提供期間中に処理されます。",
                    },
                    {
                        label: "Vercel Blob",
                        body: "アバターと提出画像を保存します。保存リージョンは韓国・ソウル（icn1）で、検定の証明画像とフィードバック画像は非公開ストレージに保管します。",
                    },
                    {
                        label: "Neon",
                        body: "会員およびサービスデータをPostgreSQLデータベースに保存します。保存リージョンはシンガポール（Southeast, sin1）で、サービス提供期間中に処理されます。",
                    },
                    {
                        label: "Discord",
                        body: "ログインとアカウント識別のため、米国に所在するDiscordと認証情報を送受信します。ログイン時にネットワーク経由で送信され、Discordが取り扱う情報にはDiscordのポリシーが適用されます。",
                    },
                    {
                        label: "Kakao Maps",
                        body: "ゲームセンターの地図を提供するため、韓国に所在するKakaoの地図サービスを利用します。地図の利用過程で接続情報が処理される場合があります。",
                    },
                ],
                paragraphs: [
                    "国外移転を希望しない場合は、Discordログインを行わないか、退会を依頼できます。ただし、その場合はログインが必要な機能を利用できません。",
                ],
            },
            {
                title: "6. 個人情報の削除",
                paragraphs: [
                    "保管期間が終了した、または取扱目的を達成した個人情報は遅滞なく削除します。データベースの記録は復元が困難な方法で削除し、アップロードファイルもストレージから削除します。法令により別途保管が必要な場合は、該当情報のみを分離して定められた期間保管します。",
                ],
            },
            {
                title: "7. ユーザーおよび法定代理人の権利",
                paragraphs: [
                    "ユーザーまたは法定代理人は、個人情報の開示、訂正、削除、取扱停止を請求できます。プロフィール設定から情報の修正や退会を行えるほか、下記メールアドレスからも請求できます。",
                    "退会すると、アカウント、プレー・同期記録、コミュニティ活動、フィードバック、検定提出、アップロードファイルが直ちに完全削除されます。その後、同じDiscordアカウントでログインした場合は新しいアカウントとして登録されます。",
                ],
            },
            {
                title: "8. Cookieとセッション",
                paragraphs: [
                    "ログイン状態を維持するため、必須のセッションCookie「user_session_cookie」を使用します。Cookieは最長14日間保持され、HttpOnly、SameSite=Lax、および本番環境ではSecure属性を適用します。ブラウザー設定でCookieを拒否できますが、ログイン機能が制限されます。",
                ],
            },
            {
                title: "9. 安全管理措置",
                paragraphs: [
                    "アクセス権限を必要な運営者に限定し、通信の暗号化、管理者権限の確認、非公開の証明画像ストレージ、アップロード形式・容量の検証、セッション保護を実施します。",
                ],
            },
        ],
        contactTitle: "10. 個人情報保護責任者およびお問い合わせ",
        operatorLabel: "運営者",
        operator: "NosLog運営者",
        emailLabel: "メール",
        contactNote:
            "個人情報に関するご依頼は、内容を確認したうえで遅滞なく対応します。",
        changesTitle: "11. ポリシー変更のお知らせ",
        changesBody:
            "内容を変更する場合は、施行前にサービスのお知らせでご案内します。本ポリシーは2026年7月27日から施行します。",
        backHome: "ホームへ戻る",
    },
    en: {
        title: "Privacy Policy",
        description:
            "Learn what personal information NosLog processes, why it is used, how long it is retained, and what rights users have.",
        effectiveDate: "Effective July 27, 2026",
        intro: "The operator of NosLog values users' personal information and publishes this Privacy Policy in accordance with applicable laws.",
        sections: [
            {
                title: "1. Personal information we process and why",
                items: [
                    {
                        label: "Discord login",
                        body: "We receive your Discord user identifier, display name, and username to identify your account and provide login. We do not store your Discord password or access token.",
                    },
                    {
                        label: "Profile and game records",
                        body: "We use your nickname, NOSTALGIA player name, country or region, preferred arcade, profile visibility settings, and play, judgement, rating, and sync records to provide profile and record services.",
                    },
                    {
                        label: "Exams and feedback",
                        body: "We use exam-passing evidence images, review results and notes, feedback text, and attached images to review submissions and respond to inquiries.",
                    },
                    {
                        label: "Automatically generated information",
                        body: "Connection IP addresses, browser and device information, access times, requests, and error logs may be generated for service security, incident response, and operations.",
                    },
                ],
            },
            {
                title: "2. How we collect personal information",
                paragraphs: [
                    "We collect information through Discord login, information users directly enter or upload, the BEMANI record sync feature, and logs automatically generated while using the service.",
                ],
            },
            {
                title: "3. Retention and use periods",
                bullets: [
                    "Account, profile, play, and sync records: until account deletion or a deletion request",
                    "Avatar: until it is replaced or deleted, or until account deletion",
                    "Resolved feedback: all content and attached images are deleted six months after resolution",
                    "Approved exam submissions: evidence images and review notes are deleted six months after review; passing history is retained until account deletion",
                    "Rejected exam submissions: submission records and evidence images are deleted six months after review",
                ],
            },
            {
                title: "4. Sharing personal information with third parties",
                paragraphs: [
                    "As a rule, NosLog does not provide users' personal information to third parties. Exceptions apply where the user separately consents or where disclosure is required by law.",
                ],
            },
            {
                title: "5. Service providers and international transfers",
                items: [
                    {
                        label: "Vercel",
                        body: "Vercel provides web hosting, server execution, and operational log processing. The server execution region is Singapore (sin1). Data is transmitted over the network when the service is used and processed for the duration of service provision.",
                    },
                    {
                        label: "Vercel Blob",
                        body: "Vercel Blob stores avatars and submission images. The storage region is Seoul, South Korea (icn1). Exam evidence and feedback images are kept in private storage.",
                    },
                    {
                        label: "Neon",
                        body: "Neon stores member and service data in a PostgreSQL database. The storage region is Singapore (Southeast, sin1), and data is processed for the duration of service provision.",
                    },
                    {
                        label: "Discord",
                        body: "For login and account identification, authentication information is exchanged with Discord in the United States. It is transmitted over the network at login, and information processed by Discord is subject to Discord's policies.",
                    },
                    {
                        label: "Kakao Maps",
                        body: "We use Kakao's map service in South Korea to provide arcade maps. Connection information may be processed while using the map.",
                    },
                ],
                paragraphs: [
                    "If you do not want your information transferred internationally, you may choose not to use Discord login or request account deletion. Login-based features will then be unavailable.",
                ],
            },
            {
                title: "6. Deletion of personal information",
                paragraphs: [
                    "We delete personal information without undue delay when its retention period ends or its processing purpose has been fulfilled. Database records are deleted in a manner that makes recovery difficult, and uploaded files are deleted from storage. If separate retention is required by law, only the required information is separated and retained for the prescribed period.",
                ],
            },
            {
                title: "7. Rights of users and legal representatives",
                paragraphs: [
                    "Users or their legal representatives may request access to, correction or deletion of, or restriction of processing of personal information. You may update information or delete your account in Profile Settings, or submit a request using the email address below.",
                    "When you delete your account, the account, play and sync records, community activity, feedback, exam submissions, and uploaded files are immediately and permanently deleted. If you later log in with the same Discord account, you will register as a new account.",
                ],
            },
            {
                title: "8. Cookies and sessions",
                paragraphs: [
                    "We use the essential session cookie user_session_cookie to keep you logged in. It is retained for up to 14 days and uses HttpOnly, SameSite=Lax, and Secure in production. You may reject cookies in your browser settings, but login features will be limited.",
                ],
            },
            {
                title: "9. Security measures",
                paragraphs: [
                    "We limit access to necessary operators and apply encryption in transit, administrator authorization checks, private evidence storage, upload type and size validation, and session protection.",
                ],
            },
        ],
        contactTitle: "10. Privacy contact",
        operatorLabel: "Operator",
        operator: "NosLog operator",
        emailLabel: "Email",
        contactNote:
            "We will review and respond to privacy-related requests without undue delay.",
        changesTitle: "11. Changes to this policy",
        changesBody:
            "If this policy changes, we will announce the change through service notices before it takes effect. This policy is effective from July 27, 2026.",
        backHome: "Back to Home",
    },
};

export async function generateMetadata(): Promise<Metadata> {
    const { locale } = await getServerI18n();
    const copy = policyByLocale[locale];

    return createPageMetadata({
        title: copy.title,
        description: copy.description,
        path: localizePath("/privacy", locale),
    });
}

function PolicyItemView({ label, body }: PolicyItem) {
    return (
        <div>
            <h3 className="text-label">{label}</h3>
            <p className="mt-1">{body}</p>
        </div>
    );
}

export default async function PrivacyPolicyPage() {
    const { locale } = await getServerI18n();
    const copy = policyByLocale[locale];

    return (
        <div className="flex flex-col gap-4 py-5">
            <header>
                <h1 className="text-title">{copy.title}</h1>
                <p className="text-caption mt-1">{copy.effectiveDate}</p>
            </header>

            <section className="bg-surface rounded-card p-4">
                <p className="text-body-muted">{copy.intro}</p>
            </section>

            {copy.sections.map((section) => (
                <section
                    key={section.title}
                    className="bg-surface rounded-card p-4"
                >
                    <h2 className="text-section">{section.title}</h2>
                    <div className="text-body-muted mt-3 flex flex-col gap-3">
                        {section.items?.map((item) => (
                            <PolicyItemView key={item.label} {...item} />
                        ))}
                        {section.paragraphs?.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                        {section.bullets ? (
                            <ul className="flex list-disc flex-col gap-2 pl-5">
                                {section.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </section>
            ))}

            <section className="bg-surface rounded-card p-4">
                <h2 className="text-section">{copy.contactTitle}</h2>
                <dl className="text-body-muted mt-3 grid grid-cols-[5rem_1fr] gap-y-2">
                    <dt>{copy.operatorLabel}</dt>
                    <dd className="text-text-primary">{copy.operator}</dd>
                    <dt>{copy.emailLabel}</dt>
                    <dd>
                        <a
                            href="mailto:sodacandy77@naver.com"
                            className="text-text-primary underline underline-offset-4"
                        >
                            sodacandy77@naver.com
                        </a>
                    </dd>
                </dl>
                <p className="text-caption mt-3">{copy.contactNote}</p>
            </section>

            <section className="bg-surface rounded-card p-4">
                <h2 className="text-section">{copy.changesTitle}</h2>
                <p className="text-body-muted mt-3">{copy.changesBody}</p>
            </section>

            <Link
                href={localizePath("/", locale)}
                className="border-border text-text-secondary hover:text-text-primary rounded-card flex h-11 items-center justify-center border text-sm font-semibold transition-colors"
            >
                {copy.backHome}
            </Link>
        </div>
    );
}
