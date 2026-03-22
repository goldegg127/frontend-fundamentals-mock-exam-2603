/**
 * 타임라인 상수
 */
export const TIMELINE_START = 9; // 09:00
export const TIMELINE_END = 20; // 20:00
export const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;

/**
 * 시간 슬롯 배열 생성
 */
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 20; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 20) {
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
  return slots;
}

export const TIME_SLOTS = generateTimeSlots();

/**
 * 시간을 타임라인 시작 기준 분으로 변환합니다.
 * @param time - HH:mm 형식의 시간
 * @returns 타임라인 시작(09:00) 기준 경과 분
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

/**
 * 시간 범위의 너비를 백분율로 계산합니다.
 */
export function calculateTimelineWidth(start: string, end: string): number {
  return ((timeToMinutes(end) - timeToMinutes(start)) / TOTAL_MINUTES) * 100;
}

/**
 * 시간의 타임라인 내 위치를 백분율로 계산합니다.
 */
export function calculateTimelinePosition(time: string): number {
  return (timeToMinutes(time) / TOTAL_MINUTES) * 100;
}
