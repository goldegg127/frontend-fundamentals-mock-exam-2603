import type { Room, Reservation } from '_tosslib/server/types';
import { formatEquipmentList } from './utils/formatEquipment';

export const getRoomName = (rooms: Room[], findId: string) => {
  return rooms.find((r) => r.id === findId)?.name ?? findId;
};

export const getReservationSpec = (reservation: Reservation) => {
  return `${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${formatEquipmentList(reservation.equipment)}`;
};
