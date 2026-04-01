import type { Room } from '_tosslib/server/types';
import { EQUIPMENT_LABELS } from '../constants';

export function formatRoomDescription(room: Room): string {
  const equipmentText =
    room.equipment.length === 0
      ? '장비 없음'
      : room.equipment.map((equipment) => EQUIPMENT_LABELS[equipment]).join(', ');

  return `${room.floor}층 · ${room.capacity}명 · ${equipmentText}`;
}
