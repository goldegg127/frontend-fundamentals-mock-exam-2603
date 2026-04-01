import type { Reservation, Room } from '_tosslib/server/types';

/**
 * 회의실별 예약 데이터를 Timeline이 소비할 수 있는 구조로 변환한다.
 */
export function buildRoomReservationTimelineData(
  rooms: Room[],
  reservations: Reservation[]
) {
  return rooms.map((room) => ({
    row: room,
    cells: reservations.filter((reservation) => reservation.roomId === room.id),
  }));
}
