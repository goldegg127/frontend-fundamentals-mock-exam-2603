import type { Equipment } from '_tosslib/server/types';
import type { BookingFilter } from '../types';
import { getTodayString } from '../../shared/utils/formatDate';

export function parseBookingFilter(searchParams: URLSearchParams): BookingFilter {
  return {
    date: searchParams.get('date') || getTodayString(),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: (searchParams.get('equipment')?.split(',').filter(Boolean) || []) as Equipment[],
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };
}

export function buildBookingSearchParams(filter: BookingFilter): Record<string, string> {
  const params: Record<string, string> = {};

  if (filter.date) params.date = filter.date;
  if (filter.startTime) params.startTime = filter.startTime;
  if (filter.endTime) params.endTime = filter.endTime;
  if (filter.attendees > 1) params.attendees = String(filter.attendees);
  if (filter.equipment.length > 0) params.equipment = filter.equipment.join(',');
  if (filter.preferredFloor !== null) params.floor = String(filter.preferredFloor);

  return params;
}
