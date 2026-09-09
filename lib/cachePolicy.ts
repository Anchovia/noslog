// Public data is refreshed on demand through cache tags after writes.
// The one-hour fallback bounds staleness if data changes outside those paths.
export const PUBLIC_DATA_REVALIDATE_SECONDS = 60 * 60;
