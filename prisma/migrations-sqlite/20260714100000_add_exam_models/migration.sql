-- CreateTable
CREATE TABLE "Exam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "grade" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fee_nos" INTEGER NOT NULL DEFAULT 0,
    "required_grade" INTEGER,
    "reward_type" TEXT NOT NULL DEFAULT 'grade',
    "reward_label" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "starts_at" DATETIME,
    "ends_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExamStage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "label" TEXT,
    "requirement_type" TEXT NOT NULL DEFAULT 'single_score',
    "required_score" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ExamStage_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamStage_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExamSubmission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proof_image_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewer_note" TEXT,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    CONSTRAINT "ExamSubmission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamSubmission_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExamAchievement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "achieved_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "submission_id" INTEGER,
    CONSTRAINT "ExamAchievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamAchievement_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamAchievement_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "ExamSubmission" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Exam_slug_key" ON "Exam"("slug");

-- CreateIndex
CREATE INDEX "Exam_mode_grade_idx" ON "Exam"("mode", "grade");

-- CreateIndex
CREATE INDEX "Exam_status_starts_at_ends_at_idx" ON "Exam"("status", "starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "ExamStage_chart_id_idx" ON "ExamStage"("chart_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExamStage_exam_id_position_key" ON "ExamStage"("exam_id", "position");

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
