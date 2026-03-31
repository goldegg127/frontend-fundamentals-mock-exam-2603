/**
 * 시간 간격 타입
 */
export type TimeInterval = 'hour' | 'halfHour';

/**
 * 시작 시간부터 종료 시간까지 지정된 간격으로 시간 레이블을 생성합니다.
 * (순수 유틸 함수 - 도메인 무관)
 *
 * @param startHour - 시작 시간 (0-23)
 * @param endHour - 종료 시간 (0-23)
 * @param interval - 시간 간격 ('hour': 1시간 단위, 'halfHour': 30분 단위)
 * @returns 시간 레이블 배열 (예: ['09:00', '10:00', ...])
 *
 * @example
 * generateTimeLabels(9, 20, 'hour')      // ['09:00', '10:00', ..., '20:00']
 * generateTimeLabels(9, 20, 'halfHour')  // ['09:00', '09:30', '10:00', ..., '20:00']
 * generateTimeLabels(6, 23, 'hour')      // ['06:00', '07:00', ..., '23:00']
 */
export function generateTimeLabels(
  startHour: number,
  endHour: number,
  interval: TimeInterval = 'hour'
): string[] {
  const labels: string[] = [];

  for (let h = startHour; h <= endHour; h++) {
    labels.push(`${String(h).padStart(2, '0')}:00`);

    if (interval === 'halfHour' && h < endHour) {
      labels.push(`${String(h).padStart(2, '0')}:30`);
    }
  }

  return labels;
}
