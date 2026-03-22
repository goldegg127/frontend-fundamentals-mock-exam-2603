/**
 * 장비 타입에 대한 한글 레이블 매핑
 */
export const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

/**
 * 장비 목록을 한글 레이블로 변환합니다.
 */
export function formatEquipmentList(equipment: string[]): string {
  if (equipment.length === 0) {
    return '장비 없음';
  }
  return equipment.map((e) => EQUIPMENT_LABELS[e] || e).join(', ');
}
