-- Read-only: inspect existing tables and record counts before deployment.
SELECT table_name, column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND ((table_name IN ('PlayData', 'ChartRecordSnapshot', 'UserBestGrade') AND column_name = 'grade_recital')
    OR (table_name = 'User' AND column_name = 'last_full_record_at')
    OR (table_name = 'ChartPlayHistory' AND column_name = 'record_applied'))
ORDER BY table_name, column_name;
SELECT (SELECT COUNT(*) FROM "PlayData") AS best_records,
       (SELECT COUNT(*) FROM "ChartPlayHistory") AS plays,
       (SELECT COUNT(*) FROM "ChartRecordSnapshot") AS record_snapshots;
