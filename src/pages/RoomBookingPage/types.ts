import type { Equipment } from '_tosslib/server/types';

export interface BookingFilter {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}
