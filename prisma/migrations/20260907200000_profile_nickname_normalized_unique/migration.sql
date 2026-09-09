-- Keep the original display spelling and canonical numeric profile ID. Reject
-- existing normalization collisions rather than renaming or deleting accounts.
CREATE UNIQUE INDEX "User_username_normalized_key"
ON "User" (lower(normalize(btrim("username"), NFKC)))
WHERE "username" IS NOT NULL;
