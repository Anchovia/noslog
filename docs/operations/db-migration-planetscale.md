# 운영 DB 이전 — Neon → PlanetScale 서울

결정은 [운영 DB 를 PlanetScale Postgres 서울로](../decisions/2026-10-28-db-planetscale-seoul.md)에 있다. 이 문서는 이전 날 순서다. 운영 DB 덤프 · 복원 · Vercel 설정은 사용자가 한다. 주소 · 비밀번호는 채팅 · 문서 · 로그에 쓰지 않는다.

## 일정

| 날짜         | 할 일                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 2026-10-28   | 공지 게시(아래 문구) · 이전 · 새 방침 시행. 처리방침 · `vercel.json`(icn1) · `prisma.config.ts` 변경은 이날 `main` 에 병합한다 |
| 이전 뒤 며칠 | PlanetScale Metrics(CPU · 메모리 · OOM 표시) 확인. 운영 Neon 은 되돌리기용으로 남긴다. 지우는 시점은 사용자가 정한다           |

시행일을 바꾸면 `features/privacy/content/policyCopy.json` 세 언어의 `dates`, `privacy-content.ts` 의 2026-09-26 판 `until`, `tests/privacy-history.test.ts` 의 시행일을 함께 바꾼다.

## 준비물

- 로컬 `pg_dump` · `pg_restore` · `psql` 17 이상(Homebrew `postgresql@17`).
- Neon 운영 production 브랜치의 직접 연결 주소(Neon 콘솔 → Connect → Connection pooling 끔). 아래에서는 `NEON_PROD_URL`.
- PlanetScale `noslog` 의 직접 연결 주소(Connect → Direct, 포트 5432)와 PgBouncer 주소(포트 6432). 아래에서는 `PS_DIRECT_URL` · `PS_POOLED_URL`.
- PlanetScale 주소는 `sslmode=verify-full` 이라 `psql` · `pg_restore` 앞에 `PGSSLROOTCERT=system` 을 붙인다.

주소는 터미널에서만 넣는다. 셸 기록에 남지 않게 줄 앞에 공백을 하나 둔다.

```bash
 export NEON_PROD_URL='…'
 export PS_DIRECT_URL='…'
```

## 이전 날 순서

1. 점검 켜기 — Vercel Production 환경 변수 `MAINTENANCE_MODE=true` 로 바꾸고, 지금 운영 배포를 Redeploy 한다. 점검 화면이 뜨면 동기화 · 쓰기가 멈춘다.
2. 운영 덤프 — 점검 화면이 뜬 뒤에 뜬다. 덤프 파일에는 회원 데이터가 들어 있으니 리포 밖에 두고, 이전이 끝나면 지운다.

    ```bash
    pg_dump "$NEON_PROD_URL" -Fc --no-owner --no-privileges -f ~/noslog-prod-2026-10-28.dump
    ```

3. PlanetScale 비우기 — 시험 때 넣은 개발 데이터를 지운다.

    ```bash
    PGSSLROOTCERT=system psql "$PS_DIRECT_URL" -c "drop schema public cascade; create schema public;"
    ```

4. 복원

    ```bash
    PGSSLROOTCERT=system pg_restore --no-owner --no-privileges --single-transaction -d "$PS_DIRECT_URL" ~/noslog-prod-2026-10-28.dump
    ```

5. 표별 행 수 대조 — 두 결과가 같아야 다음으로 간다.

    ```bash
    Q="select relname||'='||(xpath('/row/c/text()', query_to_xml('select count(*) as c from public.'||quote_ident(relname), false, true, '')))[1]::text from pg_stat_user_tables where schemaname='public' order by relname;"
    psql "$NEON_PROD_URL" -X -A -t -c "$Q" > ~/neon-counts.txt
    PGSSLROOTCERT=system psql "$PS_DIRECT_URL" -X -A -t -c "$Q" > ~/ps-counts.txt
    diff ~/neon-counts.txt ~/ps-counts.txt && echo "모든 표 일치"
    ```

6. Vercel Production 환경 변수 바꾸기 — 바꾸기 전 Neon 값은 비밀번호 관리자에 따로 적어 둔다.

    | 변수                     | 새 값                                                        |
    | ------------------------ | ------------------------------------------------------------ |
    | `DATABASE_URL`           | `PS_POOLED_URL`(6432)                                        |
    | `DATABASE_MIGRATION_URL` | `PS_DIRECT_URL`(5432). 새로 추가                             |
    | `DATABASE_EXPECTED_HOST` | 있으면 PlanetScale 호스트 이름(주소의 `@` 뒤부터 `:` 앞까지) |
    | `MAINTENANCE_MODE`       | `false`                                                      |

7. 배포 — 이전 묶음(처리방침 · `vercel.json` · `prisma.config.ts` · 문서)을 `main` 에 병합한다. 배포 빌드가 `prisma migrate deploy` 를 `DATABASE_MIGRATION_URL` 로 돌리고, 함수는 `icn1` 에서 뜬다.
8. 확인 — 홈 · 악곡 상세 · 프로필 · 랭킹 · 서열표를 열고, 로그인 · 동기화를 한 번씩 한다. PlanetScale Metrics 에서 CPU · 메모리와 OOM 표시를 본다. 처리방침 화면의 시행일과 「이전 버전」 목록에 2026년 9월 26일 판이 있는지 본다.
9. 덤프 파일 지우기 — `rm ~/noslog-prod-2026-10-28.dump ~/neon-counts.txt ~/ps-counts.txt`

## 되돌리기

- 6번 전에 멈추면 `MAINTENANCE_MODE=false` 로 바꾸고 Redeploy 한다. Neon 이 그대로 운영 DB 다.
- 7번 뒤에 되돌리면 Vercel 의 `DATABASE_URL` · `DATABASE_EXPECTED_HOST` 를 적어 둔 Neon 값으로 돌리고, `DATABASE_MIGRATION_URL` 을 지운 뒤 Redeploy 한다. 이전 뒤 PlanetScale 에만 쓰인 기록(동기화 · 글)은 Neon 에 없으니, 되돌리기 전에 점검을 켜고 PlanetScale 덤프를 Neon 에 복원할지 정한다.
- 함수 리전(`icn1`)과 처리방침은 되돌릴 때 같이 되돌린다.

## 공지 문구

공지 관리 화면에 세 언어로 올린다.

- ko — 제목: 10월 28일 데이터베이스 이전 점검 · 개인정보처리방침 변경 안내. 본문: 10월 28일 데이터베이스를 서울 리전으로 옮깁니다. 옮기는 동안 점검 화면이 뜨고 동기화와 글쓰기를 잠시 쓸 수 없습니다. 같은 날 개인정보처리방침이 바뀝니다. 데이터베이스 위탁처가 Neon에서 PlanetScale로, 데이터 저장 리전과 서버 실행 리전이 싱가포르에서 대한민국 서울로 바뀝니다. 바뀐 내용은 개인정보처리방침 7번 「위탁 및 국외 이전」에서 볼 수 있습니다.
- ja — 件名: 10月28日 データベース移行メンテナンスとプライバシーポリシー変更のお知らせ。本文: 10月28日にデータベースをソウルリージョンへ移行します。移行中はメンテナンス画面が表示され、同期と投稿を一時的に利用できません。同じ日にプライバシーポリシーを変更します。データベースの委託先がNeonからPlanetScaleに、データ保存リージョンとサーバー実行リージョンがシンガポールから韓国・ソウルに変わります。変更内容はプライバシーポリシー7「委託および国外移転」で確認できます。
- en — Title: Database migration maintenance and privacy policy update on October 28. Body: On October 28 we will move our database to the Seoul region. During the move a maintenance page will appear, and sync and posting will be briefly unavailable. The privacy policy changes on the same day. Our database provider changes from Neon to PlanetScale, and the data storage and server regions change from Singapore to Seoul, South Korea. See section 7, "Service providers and international transfers", in the privacy policy for details.
