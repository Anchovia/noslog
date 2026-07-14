-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "nostalgia_name" TEXT,
    "kakao_id" BIGINT,
    "discord_name" TEXT,
    "discord_tag" TEXT,
    "avatar" TEXT,
    "country" TEXT NOT NULL DEFAULT 'ko-KR',
    "rank_basic" INTEGER,
    "rank_recital" INTEGER,
    "rank_basic_country" INTEGER,
    "rank_recital_country" INTEGER,
    "play_count" INTEGER,
    "score_p" INTEGER,
    "score_f" INTEGER,
    "score_s" INTEGER,
    "score_a2" INTEGER,
    "score_a" INTEGER,
    "score_b2" INTEGER,
    "score_b" INTEGER,
    "score_c" INTEGER,
    "score_d" INTEGER,
    "role" TEXT NOT NULL DEFAULT 'user',
    "grade_basic" INTEGER,
    "grade_recital" INTEGER,
    "exam_basic" INTEGER,
    "exam_recital" INTEGER,
    "sync_token_version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Music" (
    "id" SERIAL NOT NULL,
    "index" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_kana" TEXT NOT NULL,
    "artist" TEXT,
    "category" TEXT NOT NULL,
    "category_short" TEXT NOT NULL,
    "description" TEXT,
    "background" TEXT,
    "sheet_len" INTEGER NOT NULL,
    "difficulty_levels" TEXT NOT NULL,
    "difficulty_name" TEXT NOT NULL,
    "normal" INTEGER NOT NULL,
    "hard" INTEGER NOT NULL,
    "expert" INTEGER NOT NULL,
    "real" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicChart" (
    "id" SERIAL NOT NULL,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "level_constant" DOUBLE PRECISION,
    "bpm_min" INTEGER,
    "bpm_max" INTEGER,
    "note_count" INTEGER,
    "duration_seconds" INTEGER,
    "released_at" TIMESTAMP(3),
    "unlock_condition" TEXT,
    "play_video_url" TEXT,
    "chart_preview_url" TEXT,
    "music_idx" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSync" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "sync_scope" TEXT NOT NULL DEFAULT 'full',
    "received_plays" INTEGER NOT NULL DEFAULT 0,
    "inserted_plays" INTEGER NOT NULL DEFAULT 0,
    "changed_records" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "user_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "DataSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartPlayHistory" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "source_play_time" TEXT NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_sync_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChartPlayHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartRecordSnapshot" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "fc_type" INTEGER NOT NULL,
    "play_count" INTEGER NOT NULL,
    "fullcombo_count" INTEGER NOT NULL,
    "pianistic_count" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "grade_recital" INTEGER NOT NULL,
    "besttime" TEXT NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sync_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChartRecordSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartConstantHistory" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "effective_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chart_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChartConstantHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TierList" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TierList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TierBand" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL,
    "tier_list_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TierBand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TierEntry" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "tier_list_id" INTEGER NOT NULL,
    "tier_band_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TierEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TierPlacementHistory" (
    "id" SERIAL NOT NULL,
    "band_value" DOUBLE PRECISION,
    "effective_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tier_list_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TierPlacementHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartEvaluation" (
    "id" SERIAL NOT NULL,
    "perceived_constant" DOUBLE PRECISION NOT NULL,
    "stairs" INTEGER NOT NULL,
    "chord" INTEGER NOT NULL,
    "trill" INTEGER NOT NULL,
    "glissando" INTEGER NOT NULL,
    "repetition" INTEGER NOT NULL,
    "comment" TEXT,
    "chart_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartEvaluationReaction" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "evaluation_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartEvaluationReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentPlay" (
    "id" SERIAL NOT NULL,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "play_time" TEXT NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "chart_id" INTEGER,

    CONSTRAINT "RecentPlay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBestGrade" (
    "id" SERIAL NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "grade_recital" INTEGER NOT NULL,
    "besttime" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "UserBestGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BasicBestPlay" (
    "id" SERIAL NOT NULL,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "besttime" TEXT NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "fc_type" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "chart_id" INTEGER,

    CONSTRAINT "BasicBestPlay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecitalBestPlay" (
    "id" SERIAL NOT NULL,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "besttime" TEXT NOT NULL,
    "grade_recital" INTEGER NOT NULL,
    "fc_type" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "chart_id" INTEGER,

    CONSTRAINT "RecitalBestPlay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayData" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "fc_type" INTEGER NOT NULL,
    "play_count" INTEGER NOT NULL,
    "fullcombo_count" INTEGER NOT NULL,
    "pianistic_count" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "grade_recital" INTEGER NOT NULL,
    "besttime" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "chart_id" INTEGER,

    CONSTRAINT "PlayData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bingo" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "nos" INTEGER NOT NULL,
    "line" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "music_idx" TEXT NOT NULL,

    CONSTRAINT "Bingo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BingoCell" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "challenge" TEXT NOT NULL,
    "mission_type" TEXT NOT NULL DEFAULT 'record',
    "rule_type" TEXT NOT NULL DEFAULT 'manual',
    "rule_config" JSONB,
    "category_short" TEXT,
    "target_difficulty" TEXT,
    "target_level" INTEGER,
    "music_idx" TEXT,
    "bingo_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BingoCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userBingoCellData" (
    "id" SERIAL NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completion_source" TEXT NOT NULL DEFAULT 'manual',
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bingo_cell_id" INTEGER NOT NULL,

    CONSTRAINT "userBingoCellData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "short_label" TEXT NOT NULL,
    "scoring_type" TEXT NOT NULL DEFAULT 'score',
    "grade" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fee_nos" INTEGER NOT NULL DEFAULT 0,
    "required_grade" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamStage" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT,
    "requirement_type" TEXT NOT NULL DEFAULT 'single',
    "required_value" DOUBLE PRECISION NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamStageChart" (
    "stage_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,

    CONSTRAINT "ExamStageChart_pkey" PRIMARY KEY ("stage_id","chart_id")
);

-- CreateTable
CREATE TABLE "ExamReward" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "exam_id" INTEGER NOT NULL,
    "music_idx" TEXT,

    CONSTRAINT "ExamReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSubmission" (
    "id" SERIAL NOT NULL,
    "proof_image_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewer_note" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,

    CONSTRAINT "ExamSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAchievement" (
    "id" SERIAL NOT NULL,
    "achieved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "submission_id" INTEGER,

    CONSTRAINT "ExamAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_kakao_id_key" ON "User"("kakao_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_tag_key" ON "User"("discord_tag");

-- CreateIndex
CREATE UNIQUE INDEX "Music_index_key" ON "Music"("index");

-- CreateIndex
CREATE INDEX "MusicChart_level_idx" ON "MusicChart"("level");

-- CreateIndex
CREATE INDEX "MusicChart_level_constant_idx" ON "MusicChart"("level_constant");

-- CreateIndex
CREATE UNIQUE INDEX "MusicChart_music_idx_difficulty_key" ON "MusicChart"("music_idx", "difficulty");

-- CreateIndex
CREATE INDEX "DataSync_user_id_started_at_idx" ON "DataSync"("user_id", "started_at");

-- CreateIndex
CREATE INDEX "ChartPlayHistory_user_id_chart_id_source_play_time_idx" ON "ChartPlayHistory"("user_id", "chart_id", "source_play_time");

-- CreateIndex
CREATE UNIQUE INDEX "ChartPlayHistory_user_id_chart_id_source_play_time_score_ma_key" ON "ChartPlayHistory"("user_id", "chart_id", "source_play_time", "score", "max_combo", "rank");

-- CreateIndex
CREATE INDEX "ChartRecordSnapshot_user_id_chart_id_created_at_idx" ON "ChartRecordSnapshot"("user_id", "chart_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ChartRecordSnapshot_sync_id_chart_id_key" ON "ChartRecordSnapshot"("sync_id", "chart_id");

-- CreateIndex
CREATE INDEX "ChartConstantHistory_chart_id_effective_at_idx" ON "ChartConstantHistory"("chart_id", "effective_at");

-- CreateIndex
CREATE UNIQUE INDEX "TierList_slug_key" ON "TierList"("slug");

-- CreateIndex
CREATE INDEX "TierList_mode_status_updated_at_idx" ON "TierList"("mode", "status", "updated_at");

-- CreateIndex
CREATE INDEX "TierBand_tier_list_id_value_idx" ON "TierBand"("tier_list_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "TierBand_tier_list_id_value_key" ON "TierBand"("tier_list_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "TierBand_tier_list_id_position_key" ON "TierBand"("tier_list_id", "position");

-- CreateIndex
CREATE INDEX "TierEntry_tier_list_id_tier_band_id_idx" ON "TierEntry"("tier_list_id", "tier_band_id");

-- CreateIndex
CREATE INDEX "TierEntry_chart_id_idx" ON "TierEntry"("chart_id");

-- CreateIndex
CREATE UNIQUE INDEX "TierEntry_tier_list_id_chart_id_key" ON "TierEntry"("tier_list_id", "chart_id");

-- CreateIndex
CREATE UNIQUE INDEX "TierEntry_tier_band_id_position_key" ON "TierEntry"("tier_band_id", "position");

-- CreateIndex
CREATE INDEX "TierPlacementHistory_tier_list_id_chart_id_effective_at_idx" ON "TierPlacementHistory"("tier_list_id", "chart_id", "effective_at");

-- CreateIndex
CREATE INDEX "TierPlacementHistory_chart_id_effective_at_idx" ON "TierPlacementHistory"("chart_id", "effective_at");

-- CreateIndex
CREATE INDEX "ChartEvaluation_chart_id_perceived_constant_idx" ON "ChartEvaluation"("chart_id", "perceived_constant");

-- CreateIndex
CREATE UNIQUE INDEX "ChartEvaluation_chart_id_user_id_key" ON "ChartEvaluation"("chart_id", "user_id");

-- CreateIndex
CREATE INDEX "ChartEvaluationReaction_evaluation_id_value_idx" ON "ChartEvaluationReaction"("evaluation_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "ChartEvaluationReaction_evaluation_id_user_id_key" ON "ChartEvaluationReaction"("evaluation_id", "user_id");

-- CreateIndex
CREATE INDEX "Bingo_status_starts_at_ends_at_idx" ON "Bingo"("status", "starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "BingoCell_mission_type_idx" ON "BingoCell"("mission_type");

-- CreateIndex
CREATE INDEX "BingoCell_music_idx_idx" ON "BingoCell"("music_idx");

-- CreateIndex
CREATE UNIQUE INDEX "BingoCell_bingo_id_position_key" ON "BingoCell"("bingo_id", "position");

-- CreateIndex
CREATE INDEX "userBingoCellData_bingo_cell_id_idx" ON "userBingoCellData"("bingo_cell_id");

-- CreateIndex
CREATE UNIQUE INDEX "userBingoCellData_user_id_bingo_cell_id_key" ON "userBingoCellData"("user_id", "bingo_cell_id");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_slug_key" ON "Exam"("slug");

-- CreateIndex
CREATE INDEX "Exam_status_idx" ON "Exam"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_mode_grade_key" ON "Exam"("mode", "grade");

-- CreateIndex
CREATE INDEX "ExamStage_music_idx_idx" ON "ExamStage"("music_idx");

-- CreateIndex
CREATE UNIQUE INDEX "ExamStage_exam_id_position_key" ON "ExamStage"("exam_id", "position");

-- CreateIndex
CREATE INDEX "ExamStageChart_chart_id_idx" ON "ExamStageChart"("chart_id");

-- CreateIndex
CREATE INDEX "ExamReward_music_idx_idx" ON "ExamReward"("music_idx");

-- CreateIndex
CREATE UNIQUE INDEX "ExamReward_exam_id_position_key" ON "ExamReward"("exam_id", "position");

-- CreateIndex
CREATE INDEX "ExamSubmission_user_id_exam_id_submitted_at_idx" ON "ExamSubmission"("user_id", "exam_id", "submitted_at");

-- CreateIndex
CREATE INDEX "ExamSubmission_status_submitted_at_idx" ON "ExamSubmission"("status", "submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAchievement_submission_id_key" ON "ExamAchievement"("submission_id");

-- CreateIndex
CREATE INDEX "ExamAchievement_exam_id_achieved_at_idx" ON "ExamAchievement"("exam_id", "achieved_at");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAchievement_user_id_exam_id_key" ON "ExamAchievement"("user_id", "exam_id");

-- AddForeignKey
ALTER TABLE "MusicChart" ADD CONSTRAINT "MusicChart_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSync" ADD CONSTRAINT "DataSync_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPlayHistory" ADD CONSTRAINT "ChartPlayHistory_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPlayHistory" ADD CONSTRAINT "ChartPlayHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPlayHistory" ADD CONSTRAINT "ChartPlayHistory_first_sync_id_fkey" FOREIGN KEY ("first_sync_id") REFERENCES "DataSync"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartRecordSnapshot" ADD CONSTRAINT "ChartRecordSnapshot_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartRecordSnapshot" ADD CONSTRAINT "ChartRecordSnapshot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartRecordSnapshot" ADD CONSTRAINT "ChartRecordSnapshot_sync_id_fkey" FOREIGN KEY ("sync_id") REFERENCES "DataSync"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartConstantHistory" ADD CONSTRAINT "ChartConstantHistory_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierBand" ADD CONSTRAINT "TierBand_tier_list_id_fkey" FOREIGN KEY ("tier_list_id") REFERENCES "TierList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierEntry" ADD CONSTRAINT "TierEntry_tier_list_id_fkey" FOREIGN KEY ("tier_list_id") REFERENCES "TierList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierEntry" ADD CONSTRAINT "TierEntry_tier_band_id_fkey" FOREIGN KEY ("tier_band_id") REFERENCES "TierBand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierEntry" ADD CONSTRAINT "TierEntry_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierPlacementHistory" ADD CONSTRAINT "TierPlacementHistory_tier_list_id_fkey" FOREIGN KEY ("tier_list_id") REFERENCES "TierList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TierPlacementHistory" ADD CONSTRAINT "TierPlacementHistory_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartEvaluation" ADD CONSTRAINT "ChartEvaluation_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartEvaluation" ADD CONSTRAINT "ChartEvaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartEvaluationReaction" ADD CONSTRAINT "ChartEvaluationReaction_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "ChartEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartEvaluationReaction" ADD CONSTRAINT "ChartEvaluationReaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentPlay" ADD CONSTRAINT "RecentPlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentPlay" ADD CONSTRAINT "RecentPlay_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentPlay" ADD CONSTRAINT "RecentPlay_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBestGrade" ADD CONSTRAINT "UserBestGrade_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasicBestPlay" ADD CONSTRAINT "BasicBestPlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasicBestPlay" ADD CONSTRAINT "BasicBestPlay_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasicBestPlay" ADD CONSTRAINT "BasicBestPlay_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecitalBestPlay" ADD CONSTRAINT "RecitalBestPlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecitalBestPlay" ADD CONSTRAINT "RecitalBestPlay_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecitalBestPlay" ADD CONSTRAINT "RecitalBestPlay_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayData" ADD CONSTRAINT "PlayData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayData" ADD CONSTRAINT "PlayData_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayData" ADD CONSTRAINT "PlayData_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bingo" ADD CONSTRAINT "Bingo_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BingoCell" ADD CONSTRAINT "BingoCell_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BingoCell" ADD CONSTRAINT "BingoCell_bingo_id_fkey" FOREIGN KEY ("bingo_id") REFERENCES "Bingo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userBingoCellData" ADD CONSTRAINT "userBingoCellData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userBingoCellData" ADD CONSTRAINT "userBingoCellData_bingo_cell_id_fkey" FOREIGN KEY ("bingo_cell_id") REFERENCES "BingoCell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamStage" ADD CONSTRAINT "ExamStage_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamStage" ADD CONSTRAINT "ExamStage_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamStageChart" ADD CONSTRAINT "ExamStageChart_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "ExamStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamStageChart" ADD CONSTRAINT "ExamStageChart_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamReward" ADD CONSTRAINT "ExamReward_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamReward" ADD CONSTRAINT "ExamReward_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music"("index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAchievement" ADD CONSTRAINT "ExamAchievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAchievement" ADD CONSTRAINT "ExamAchievement_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAchievement" ADD CONSTRAINT "ExamAchievement_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "ExamSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
