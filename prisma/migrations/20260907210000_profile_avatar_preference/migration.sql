-- An explicit removal must remain a generated avatar after later Discord login.
-- Existing custom image URLs are also preserved by the OAuth source check.
ALTER TABLE "User" ADD COLUMN "avatar_user_managed" BOOLEAN NOT NULL DEFAULT false;
