-- 이미지 업로드 토큰 발급 횟수를 사용자와 용도별로 제한함
CREATE TABLE "UploadTokenGrant" (
    "id" SERIAL NOT NULL,
    "purpose" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "UploadTokenGrant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UploadTokenGrant_user_id_purpose_created_at_idx"
ON "UploadTokenGrant"("user_id", "purpose", "created_at");

ALTER TABLE "UploadTokenGrant"
ADD CONSTRAINT "UploadTokenGrant_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
