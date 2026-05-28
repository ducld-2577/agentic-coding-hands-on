// Single source of truth for the event launch datetime.
// Set NEXT_PUBLIC_EVENT_DATETIME in .env.local as an ISO-8601 string, e.g.:
//   NEXT_PUBLIC_EVENT_DATETIME=2025-12-31T18:30:00+07:00
export const EVENT_DATETIME = process.env.NEXT_PUBLIC_EVENT_DATETIME ?? ''
