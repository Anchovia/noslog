-- NOSTALGIA 플레이어 상태와 장착 브로치를 보존한다.
ALTER TABLE "User"
ADD COLUMN "nostalgia_nos" INTEGER,
ADD COLUMN "nostalgia_fame" TEXT,
ADD COLUMN "nostalgia_last_playtime" TEXT,
ADD COLUMN "equipped_brooch_index" TEXT;

-- NOSTALGIA 브로치 카탈로그와 사용자 보유 관계를 정규화한다.
CREATE TABLE "Brooch" (
    "index" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brooch_pkey" PRIMARY KEY ("index")
);

CREATE TABLE "UserBrooch" (
    "user_id" INTEGER NOT NULL,
    "brooch_index" TEXT NOT NULL,
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBrooch_pkey" PRIMARY KEY ("user_id", "brooch_index")
);

CREATE INDEX "UserBrooch_brooch_index_idx"
ON "UserBrooch"("brooch_index");

CREATE INDEX "User_equipped_brooch_index_idx"
ON "User"("equipped_brooch_index");

ALTER TABLE "User"
ADD CONSTRAINT "User_equipped_brooch_index_fkey"
FOREIGN KEY ("equipped_brooch_index")
REFERENCES "Brooch"("index")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "UserBrooch"
ADD CONSTRAINT "UserBrooch_user_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "UserBrooch"
ADD CONSTRAINT "UserBrooch_brooch_index_fkey"
FOREIGN KEY ("brooch_index")
REFERENCES "Brooch"("index")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- BEMANI 음악 카탈로그가 제공하는 비중복 메타데이터를 보존한다.
ALTER TABLE "Music"
ADD COLUMN "license" TEXT,
ADD COLUMN "unlock_type" INTEGER;

-- 최근 플레이 1건의 판정·타이밍·이전 최고 기록을 보존한다.
ALTER TABLE "ChartPlayHistory"
ADD COLUMN "level" INTEGER,
ADD COLUMN "previous_best_score" INTEGER,
ADD COLUMN "class_basic" TEXT,
ADD COLUMN "fast_count" INTEGER,
ADD COLUMN "slow_count" INTEGER,
ADD COLUMN "is_onehand" BOOLEAN,
ADD COLUMN "judge_sjust" INTEGER,
ADD COLUMN "judge_just" INTEGER,
ADD COLUMN "judge_good" INTEGER,
ADD COLUMN "judge_miss" INTEGER,
ADD COLUMN "judge_near" INTEGER;

DELETE FROM "ChartPlayHistory" newer
USING "ChartPlayHistory" older
WHERE newer."id" > older."id"
  AND newer."user_id" = older."user_id"
  AND newer."chart_id" = older."chart_id"
  AND newer."source_play_time" = older."source_play_time"
  AND newer."score" = older."score"
  AND newer."max_combo" = older."max_combo"
  AND UPPER(newer."rank") = UPPER(older."rank");

UPDATE "ChartPlayHistory"
SET "rank" = UPPER("rank")
WHERE "rank" <> UPPER("rank");

-- 최신 개인 기록과 변경 스냅샷에 세부 판정 및 노트 유형별 성공률을 보존한다.
ALTER TABLE "PlayData"
ADD COLUMN "clear_count" INTEGER,
ADD COLUMN "clear_flag" INTEGER,
ADD COLUMN "judge_sjust" INTEGER,
ADD COLUMN "judge_just" INTEGER,
ADD COLUMN "judge_good" INTEGER,
ADD COLUMN "judge_miss" INTEGER,
ADD COLUMN "judge_near" INTEGER,
ADD COLUMN "note_rate_standard" INTEGER,
ADD COLUMN "note_rate_tenuto" INTEGER,
ADD COLUMN "note_rate_glissando" INTEGER,
ADD COLUMN "note_rate_trill" INTEGER;

ALTER TABLE "ChartRecordSnapshot"
ADD COLUMN "clear_count" INTEGER,
ADD COLUMN "clear_flag" INTEGER,
ADD COLUMN "judge_sjust" INTEGER,
ADD COLUMN "judge_just" INTEGER,
ADD COLUMN "judge_good" INTEGER,
ADD COLUMN "judge_miss" INTEGER,
ADD COLUMN "judge_near" INTEGER,
ADD COLUMN "note_rate_standard" INTEGER,
ADD COLUMN "note_rate_tenuto" INTEGER,
ADD COLUMN "note_rate_glissando" INTEGER,
ADD COLUMN "note_rate_trill" INTEGER;
