import type { Room, Reservation } from '_tosslib/server/types';
import { formatEquipmentList } from './utils/formatEquipment';
import { calculateTimelinePosition, calculateTimelineWidth } from './utils/timeUtils';

export const getRoomName = (rooms: Room[], findId: string) => {
  return rooms.find((r) => r.id === findId)?.name ?? findId;
};

export const getReservationSpec = (reservation: Reservation) => {
  return `${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${formatEquipmentList(reservation.equipment)}`;
};

export const getRoomBookingStatus = (rooms: Room[], reservations: Reservation[]) => {
  return rooms.map((room) => ({
    row: room,
    cells: reservations
      .filter((r) => r.roomId === room.id)
      .map((reservation) => ({
        ...reservation,
        left: calculateTimelinePosition(reservation.start),
        width: calculateTimelineWidth(reservation.start, reservation.end),
      })),
  }));
}

export const getTimeLabels = (timeSlot: string[], term: string) => {
  return timeSlot.filter((t) => t.endsWith(term));
}
