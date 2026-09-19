-- Read-only: verify schema and preserved full-import baselines.
SELECT table_name, column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND ((table_name IN ('PlayData', 'ChartRecordSnapshot', 'UserBestGrade') AND column_name = 'grade_recital')
    OR (table_name = 'User' AND column_name = 'last_full_record_at')
    OR (table_name = 'ChartPlayHistory' AND column_name = 'record_applied'))
ORDER BY table_name, column_name;
SELECT COUNT(*) AS users_with_full_baseline FROM "User" WHERE last_full_record_at IS NOT NULL;
SELECT record_applied, COUNT(*) AS plays FROM "ChartPlayHistory" GROUP BY record_applied;
SELECT id, sync_scope, status, received_plays, inserted_plays, changed_records, completed_at
FROM "DataSync" ORDER BY id DESC LIMIT 10;
