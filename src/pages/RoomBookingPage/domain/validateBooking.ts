interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateTimeRange(startTime: string, endTime: string): ValidationResult {
  if (!startTime || !endTime) {
    return { isValid: false, error: null };
  }

  if (endTime <= startTime) {
    return { isValid: false, error: '종료 시간은 시작 시간보다 늦어야 합니다.' };
  }

  return { isValid: true, error: null };
}

export function validateAttendees(attendees: number): ValidationResult {
  if (attendees < 1) {
    return { isValid: false, error: '참석 인원은 1명 이상이어야 합니다.' };
  }

  return { isValid: true, error: null };
}

export function validateBookingFilter(
  startTime: string,
  endTime: string,
  attendees: number
): ValidationResult {
  const timeResult = validateTimeRange(startTime, endTime);
  if (!timeResult.isValid && timeResult.error) {
    return timeResult;
  }

  const attendeesResult = validateAttendees(attendees);
  if (!attendeesResult.isValid) {
    return attendeesResult;
  }

  return { isValid: true, error: null };
}
