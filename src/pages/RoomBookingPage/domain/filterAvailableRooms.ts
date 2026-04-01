import type { Room, Reservation, Equipment } from '_tosslib/server/types';
import type { BookingFilter } from '../types';

export function filterAvailableRooms(
  rooms: Room[],
  reservations: Reservation[],
  filter: BookingFilter
): Room[] {
  return rooms
    .filter((room) => hasCapacity(room, filter.attendees))
    .filter((room) => hasRequiredEquipment(room, filter.equipment))
    .filter((room) => matchesPreferredFloor(room, filter.preferredFloor))
    .filter((room) => isTimeSlotAvailable(room, reservations, filter))
    .sort(sortByFloorAndName);
}

function hasCapacity(room: Room, attendees: number): boolean {
  return room.capacity >= attendees;
}

function hasRequiredEquipment(room: Room, required: Equipment[]): boolean {
  return required.every((eq) => room.equipment.includes(eq));
}

function matchesPreferredFloor(room: Room, preferredFloor: number | null): boolean {
  if (preferredFloor === null) return true;
  return room.floor === preferredFloor;
}

function isTimeSlotAvailable(
  room: Room,
  reservations: Reservation[],
  filter: BookingFilter
): boolean {
  const { date, startTime, endTime } = filter;

  const hasConflict = reservations.some(
    (r) => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
  );

  return !hasConflict;
}

function sortByFloorAndName(a: Room, b: Room): number {
  if (a.floor !== b.floor) return a.floor - b.floor;
  return a.name.localeCompare(b.name);
}
