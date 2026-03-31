import type { Room, Reservation } from '_tosslib/server/types';
import { formatEquipmentList } from './utils/formatEquipment';

/**
 * 회의실 영업 시간 (비즈니스 규칙)
 */
export const TIMELINE_START = 9;
export const TIMELINE_END = 20;

/**
 * 회의실 이름
 */
export const getRoomName = (rooms: Room[], findId: string) => {
  return rooms.find((r) => r.id === findId)?.name ?? findId;
};

/**
 * 예약한 회의실의 정보
 */
export const getReservationSpec = (reservation: Reservation) => {
  return `${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${formatEquipmentList(reservation.equipment)}`;
};

/**
 * 회의실별로 예약을 그룹핑
 * (순수 비즈니스 로직 - UI 계산 없음)
 */
export const getBookingRoomTable = (rooms: Room[], reservations: Reservation[]) => {
  return rooms.map((room) => ({
    row: room,
    cells: reservations.filter((r) => r.roomId === room.id),
  }));
}
