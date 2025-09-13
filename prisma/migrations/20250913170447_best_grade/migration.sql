-- CreateTable
CREATE TABLE "UserBestGrade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "grade_basic" INTEGER NOT NULL,
    "grade_recital" INTEGER NOT NULL,
    "besttime" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "UserBestGrade_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
