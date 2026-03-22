/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅합니다.
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환합니다.
 */
export function getTodayString(): string {
  return formatDate(new Date());
}
