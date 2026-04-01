import type { Reservation, Room } from '_tosslib/server/types';
import { formatEquipmentList } from './formatEquipment';

export function findRoomName(rooms: Room[], roomId: string): string {
  return rooms.find((room) => room.id === roomId)?.name ?? roomId;
}

export function formatReservationSummary(reservation: Reservation): string {
  return `${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${formatEquipmentList(reservation.equipment)}`;
}
