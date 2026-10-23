import type { Locale } from "@/lib/i18n/routing";

/**
 * 파트너 연동 문서(/developer, 2026-10-20 「가이드식 문서」) — 실제 구현된 엔드포인트 · 값만 적는다.
 * 셀프 개발자 센터는 두지 않는다. 클라이언트 등록은 협약 뒤 운영자가 한다.
 * 긴 문서라 메시지 카탈로그 대신 개인정보처리방침처럼 언어별 본문을 둔다.
 */
export interface DeveloperDocs {
    title: string;
    description: string;
    body: string;
}

const ko = `NosLog 는 이용자가 동의한 NOSTALGIA 기록을 협약한 파트너 서비스에 OAuth 2.1 로 건넵니다. 공개 셀프 등록은 없고, 협약을 맺은 뒤 운영자가 클라이언트를 등록해 \`client_id\` · \`client_secret\` · 리디렉트 주소를 전달합니다.

## 흐름 한눈에

1. 파트너가 이용자를 \`/oauth/authorize\` 로 보냅니다(PKCE S256).
2. 이용자가 NosLog 에 로그인하고, 보낼 항목을 하나씩 골라 동의합니다(기본은 꺼짐, 기본 프로필만 필수).
3. NosLog 가 \`code\` · \`state\` · \`iss\` 를 붙여 리디렉트 주소로 돌려보냅니다.
4. 파트너 서버가 \`/oauth/token\` 에서 토큰으로 바꾸고, 기록 API 를 부릅니다.
5. 이용자가 항목을 바꾸거나 연결을 끊으면 NosLog 가 파트너에게 알립니다.

## 메타데이터

\`GET /.well-known/oauth-authorization-server\` (RFC 8414). 엔드포인트 주소는 이 응답에서 읽고 손으로 박아 두지 않습니다.

## 1. 인가 요청

\`\`\`
GET /oauth/authorize
  ?response_type=code
  &client_id=…
  &redirect_uri=…        (등록한 값과 글자까지 같아야 함)
  &scope=profile nostalgia:read
  &state=…
  &code_challenge=…      (S256 만)
  &code_challenge_method=S256
  &prompt=consent        (선택 — 이미 동의했어도 동의 화면을 다시 띄움)
\`\`\`

- \`profile\` 은 늘 필요합니다. 기록을 읽으려면 \`nostalgia:read\` 를 더합니다.
- 같은 매개변수를 두 번 보내면 \`invalid_request\` 입니다.
- \`client_id\` · \`redirect_uri\` 가 틀리면 리디렉트하지 않고 NosLog 화면에서 멈춥니다.
- 응답에는 RFC 9207 \`iss\` 가 붙습니다. 메타데이터의 \`issuer\` 와 같은지 꼭 확인하세요.
- 거절하면 \`error=access_denied\` 로 돌아갑니다.

## 2. 토큰

\`POST /oauth/token\` · \`application/x-www-form-urlencoded\` · 클라이언트 인증은 \`client_secret_basic\`.

| grant_type | 보낼 값 |
| --- | --- |
| \`authorization_code\` | \`code\` · \`redirect_uri\` · \`code_verifier\` |
| \`refresh_token\` | \`refresh_token\` · \`scope\`(선택, 넓힐 수 없음) |

\`\`\`json
{
  "access_token": "nla_…",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "nlr_…",
  "scope": "profile nostalgia:read"
}
\`\`\`

- 코드는 2분 동안 한 번만 쓸 수 있습니다. 다시 쓰면 그 연결 전체가 해제됩니다.
- 리프레시 토큰은 쓸 때마다 바뀝니다(회전). 이미 바꾼 토큰을 다시 쓰면 연결 전체가 해제됩니다. 단, 새 토큰을 아직 한 번도 쓰지 않았다면 2분 안의 재시도는 받아 줍니다.
- 연결은 동의한 날부터 최대 90일 이어지고, 그 뒤에는 이용자가 다시 동의해야 합니다.
- 토큰은 저장할 때 암호화하고 로그에 남기지 마세요.

## 3. 기본 프로필

\`GET /oauth/userinfo\` (Bearer, \`profile\`)

\`\`\`json
{ "sub": "nl_…", "name": "닉네임", "services": ["nostalgia"] }
\`\`\`

\`sub\` 는 파트너마다 다른 고정 값입니다. Discord 이름 · 이메일은 보내지 않습니다.

## 4. NOSTALGIA 기록

\`GET /api/partner/v1/records/nostalgia\` (Bearer, \`nostalgia:read\`) — \`musecat-records/v1\` 봉투, \`game_schema\` 는 \`musecat-game/nostalgia/v1\`.

| 이용자 동의 항목 | 봉투에 들어가는 곳 |
| --- | --- |
| Grade · 레이팅 | \`fields\` 의 \`grade\` · \`rating\` · \`noslog.grade_recital\` · \`noslog.rating_recital\` |
| 국내 · 세계 순위 | \`fields\` 의 \`noslog.rank_{basic,recital}_{domestic,global}\` |
| 곡별 기록 | 형식 합의 전 — \`selection\` 에 \`sections: unsupported\` |
| 최근 플레이 | \`recent_plays\`(최신 50개) |

- 고르지 않은 항목은 데이터 없이 \`selection\` 에 \`denied\` 로만 적습니다.
- 이용자가 NosLog 에서 「플레이 점수」를 비공개로 두면 \`visibility: "private"\` 입니다. 다른 사람에게 보여 주지 마세요.
- 「활동」을 비공개로 두면 최근 플레이는 동의했어도 보내지 않습니다.
- 봉투는 256 KiB 를 넘지 않습니다. 응답은 \`Cache-Control: no-store\` 입니다.

## 5. 해제 · 변경 알림

- 파트너가 끊을 때: \`POST /oauth/revoke\` (RFC 7009) 에 리프레시 토큰을 보내면 그 연결 전체가 해제됩니다. 액세스 토큰을 보내면 그 토큰만 해제됩니다.
- 이용자가 NosLog 에서 항목을 줄이면 NosLog 가 파트너의 무효화 주소로 \`X-Request-Id\` 를 붙여 알립니다. 같은 id 는 한 번만 처리해 주세요. 실패하면 26시간 동안 간격을 늘려 다시 보냅니다.
- 이용자가 연결을 끊으면 NosLog 쪽 토큰은 바로 막힙니다. 파트너에게 해제를 알리는 주소는 협약 때 정합니다.

## 오류

| 상황 | 응답 |
| --- | --- |
| 토큰 엔드포인트 클라이언트 인증 실패 | 401 \`invalid_client\` + \`WWW-Authenticate: Basic\` |
| 만료 · 해제된 토큰 | 401 + \`WWW-Authenticate: Bearer error="invalid_token"\` |
| 동의하지 않은 범위 | 403 + \`error="insufficient_scope"\` |
| 잘못된 코드 · 리프레시 토큰 | 400 \`invalid_grant\` |

## 문의

연동 문의와 보안 문제 제보는 협약서에 적은 연락처로 보내 주세요.
`;

const en = `NosLog shares NOSTALGIA records that a user has agreed to share with contracted partner services over OAuth 2.1. There is no public self-registration: after an agreement is signed, an operator registers your client and sends you the \`client_id\`, \`client_secret\` and redirect URIs.

## At a glance

1. Send the user to \`/oauth/authorize\` (PKCE S256).
2. The user logs in to NosLog and picks each item to share (all off by default; only the basic profile is required).
3. NosLog redirects back with \`code\`, \`state\` and \`iss\`.
4. Your server exchanges the code at \`/oauth/token\` and calls the records API.
5. When the user changes items or disconnects, NosLog notifies you.

## Metadata

\`GET /.well-known/oauth-authorization-server\` (RFC 8414). Read endpoint URLs from this document instead of hard-coding them.

## 1. Authorization request

\`\`\`
GET /oauth/authorize
  ?response_type=code
  &client_id=…
  &redirect_uri=…        (must match a registered value exactly)
  &scope=profile nostalgia:read
  &state=…
  &code_challenge=…      (S256 only)
  &code_challenge_method=S256
  &prompt=consent        (optional — show the consent screen again)
\`\`\`

- \`profile\` is always required. Add \`nostalgia:read\` to read records.
- Repeating a parameter returns \`invalid_request\`.
- If \`client_id\` or \`redirect_uri\` is wrong, NosLog stops on its own page and does not redirect.
- Responses carry the RFC 9207 \`iss\` parameter. Check that it equals the metadata \`issuer\`.
- If the user declines you get \`error=access_denied\`.

## 2. Tokens

\`POST /oauth/token\` · \`application/x-www-form-urlencoded\` · client authentication \`client_secret_basic\`.

| grant_type | Parameters |
| --- | --- |
| \`authorization_code\` | \`code\`, \`redirect_uri\`, \`code_verifier\` |
| \`refresh_token\` | \`refresh_token\`, \`scope\` (optional, cannot widen) |

\`\`\`json
{
  "access_token": "nla_…",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "nlr_…",
  "scope": "profile nostalgia:read"
}
\`\`\`

- Codes are single-use and live for 2 minutes. Reusing one revokes the whole connection.
- Refresh tokens rotate on every use. Reusing a rotated token revokes the whole connection — except a retry within 2 minutes while the new token has never been used.
- A connection lasts at most 90 days from consent; after that the user must consent again.
- Encrypt tokens at rest and never log them.

## 3. Basic profile

\`GET /oauth/userinfo\` (Bearer, \`profile\`)

\`\`\`json
{ "sub": "nl_…", "name": "nickname", "services": ["nostalgia"] }
\`\`\`

\`sub\` is stable and different for each partner. Discord names and email addresses are never sent.

## 4. NOSTALGIA records

\`GET /api/partner/v1/records/nostalgia\` (Bearer, \`nostalgia:read\`) — a \`musecat-records/v1\` envelope with \`game_schema\` \`musecat-game/nostalgia/v1\`.

| User consent item | Where it goes |
| --- | --- |
| Grade · rating | \`fields\`: \`grade\`, \`rating\`, \`noslog.grade_recital\`, \`noslog.rating_recital\` |
| Domestic · global ranks | \`fields\`: \`noslog.rank_{basic,recital}_{domestic,global}\` |
| Song records | Format not agreed yet — \`selection\` has \`sections: unsupported\` |
| Recent plays | \`recent_plays\` (latest 50) |

- Items the user did not pick appear only in \`selection\` as \`denied\`, without data.
- If the user keeps "Play scores" private on NosLog the envelope has \`visibility: "private"\`. Do not show it to anyone else.
- If "Activity" is private, recent plays are not sent even when the user agreed.
- Envelopes stay under 256 KiB. Responses are \`Cache-Control: no-store\`.

## 5. Revocation and change notices

- To disconnect from your side, send the refresh token to \`POST /oauth/revoke\` (RFC 7009); that revokes the whole connection. Sending an access token revokes only that token.
- When the user removes items on NosLog, NosLog calls your invalidation URL with an \`X-Request-Id\`. Process each id once. Failed deliveries are retried with growing intervals for 26 hours.
- When the user disconnects, NosLog blocks the tokens immediately. The URL for telling you about it is set in the agreement.

## Errors

| Case | Response |
| --- | --- |
| Client authentication fails at the token endpoint | 401 \`invalid_client\` + \`WWW-Authenticate: Basic\` |
| Expired or revoked token | 401 + \`WWW-Authenticate: Bearer error="invalid_token"\` |
| Scope not granted | 403 + \`error="insufficient_scope"\` |
| Bad code or refresh token | 400 \`invalid_grant\` |

## Contact

Send integration questions and security reports to the contact listed in your agreement.
`;

const ja = `NosLog は、利用者が同意した NOSTALGIA の記録を、契約したパートナーサービスへ OAuth 2.1 で渡します。公開のセルフ登録はありません。契約後に運営者がクライアントを登録し、\`client_id\`・\`client_secret\`・リダイレクト URI をお渡しします。

## 流れ

1. 利用者を \`/oauth/authorize\` へ送ります（PKCE S256）。
2. 利用者が NosLog にログインし、送る項目を一つずつ選んで同意します（既定はすべてオフ、基本プロフィールのみ必須）。
3. NosLog が \`code\`・\`state\`・\`iss\` を付けてリダイレクトします。
4. パートナーのサーバーが \`/oauth/token\` でトークンに交換し、記録 API を呼びます。
5. 利用者が項目を変えたり連携を解除したりすると、NosLog がパートナーに知らせます。

## メタデータ

\`GET /.well-known/oauth-authorization-server\`（RFC 8414）。エンドポイントの URL はこの応答から読み、固定で書き込まないでください。

## 1. 認可リクエスト

\`\`\`
GET /oauth/authorize
  ?response_type=code
  &client_id=…
  &redirect_uri=…        （登録した値と完全一致）
  &scope=profile nostalgia:read
  &state=…
  &code_challenge=…      （S256 のみ）
  &code_challenge_method=S256
  &prompt=consent        （任意 — 同意画面を再表示）
\`\`\`

- \`profile\` は常に必要です。記録を読むには \`nostalgia:read\` を加えます。
- 同じパラメーターを二度送ると \`invalid_request\` です。
- \`client_id\`・\`redirect_uri\` が誤っている場合はリダイレクトせず NosLog の画面で止まります。
- 応答には RFC 9207 の \`iss\` が付きます。メタデータの \`issuer\` と一致するか必ず確認してください。
- 拒否されると \`error=access_denied\` で戻ります。

## 2. トークン

\`POST /oauth/token\`・\`application/x-www-form-urlencoded\`・クライアント認証は \`client_secret_basic\`。

| grant_type | 送る値 |
| --- | --- |
| \`authorization_code\` | \`code\`・\`redirect_uri\`・\`code_verifier\` |
| \`refresh_token\` | \`refresh_token\`・\`scope\`（任意、広げられません） |

\`\`\`json
{
  "access_token": "nla_…",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "nlr_…",
  "scope": "profile nostalgia:read"
}
\`\`\`

- コードは 2 分間、一度だけ使えます。再利用すると連携全体が解除されます。
- リフレッシュトークンは使うたびに入れ替わります。入れ替え済みのトークンを再利用すると連携全体が解除されます。ただし新しいトークンが一度も使われていなければ、2 分以内の再試行は受け付けます。
- 連携は同意から最長 90 日です。その後は利用者の再同意が必要です。
- トークンは暗号化して保存し、ログに残さないでください。

## 3. 基本プロフィール

\`GET /oauth/userinfo\`（Bearer、\`profile\`）

\`\`\`json
{ "sub": "nl_…", "name": "ニックネーム", "services": ["nostalgia"] }
\`\`\`

\`sub\` はパートナーごとに異なる固定値です。Discord の名前やメールアドレスは送りません。

## 4. NOSTALGIA の記録

\`GET /api/partner/v1/records/nostalgia\`（Bearer、\`nostalgia:read\`）— \`musecat-records/v1\` 形式、\`game_schema\` は \`musecat-game/nostalgia/v1\`。

| 利用者の同意項目 | 入る場所 |
| --- | --- |
| Grade・レーティング | \`fields\` の \`grade\`・\`rating\`・\`noslog.grade_recital\`・\`noslog.rating_recital\` |
| 国内・世界順位 | \`fields\` の \`noslog.rank_{basic,recital}_{domestic,global}\` |
| 曲ごとの記録 | 形式未合意 — \`selection\` に \`sections: unsupported\` |
| 最近のプレイ | \`recent_plays\`（最新 50 件） |

- 選ばれなかった項目はデータなしで \`selection\` に \`denied\` とだけ記します。
- 利用者が NosLog で「プレイスコア」を非公開にしている場合は \`visibility: "private"\` です。ほかの人に見せないでください。
- 「アクティビティ」が非公開なら、同意があっても最近のプレイは送りません。
- 形式全体は 256 KiB 以下です。応答は \`Cache-Control: no-store\` です。

## 5. 解除・変更の通知

- パートナー側から解除するときは \`POST /oauth/revoke\`（RFC 7009）にリフレッシュトークンを送ると連携全体が解除されます。アクセストークンを送るとそのトークンだけが解除されます。
- 利用者が NosLog で項目を減らすと、NosLog はパートナーの無効化 URL に \`X-Request-Id\` を付けて知らせます。同じ id は一度だけ処理してください。失敗した場合は 26 時間、間隔を広げながら再送します。
- 利用者が連携を解除すると NosLog 側のトークンはすぐに止まります。パートナーへ解除を知らせる URL は契約時に決めます。

## エラー

| 状況 | 応答 |
| --- | --- |
| トークンエンドポイントでのクライアント認証失敗 | 401 \`invalid_client\` + \`WWW-Authenticate: Basic\` |
| 期限切れ・解除済みのトークン | 401 + \`WWW-Authenticate: Bearer error="invalid_token"\` |
| 同意していない範囲 | 403 + \`error="insufficient_scope"\` |
| 不正なコード・リフレッシュトークン | 400 \`invalid_grant\` |

## お問い合わせ

連携のお問い合わせとセキュリティ上の問題の報告は、契約書に記載の連絡先へお送りください。
`;

const DOCS: Record<Locale, DeveloperDocs> = {
    ko: {
        title: "파트너 연동 문서",
        description:
            "NosLog 이용자가 동의한 NOSTALGIA 기록을 협약 파트너가 OAuth 로 읽는 방법",
        body: ko,
    },
    en: {
        title: "Partner Integration",
        description:
            "How contracted partners read NOSTALGIA records that NosLog users agreed to share, over OAuth",
        body: en,
    },
    ja: {
        title: "パートナー連携ドキュメント",
        description:
            "NosLog 利用者が同意した NOSTALGIA の記録を、契約パートナーが OAuth で読む方法",
        body: ja,
    },
};

export function getDeveloperDocs(locale: Locale) {
    return DOCS[locale];
}
