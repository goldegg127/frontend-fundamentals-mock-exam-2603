import { Select } from '_tosslib/components';

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  start?: number;
  end?: number;
  timeInterval?: 30 | 60;
  excludeFirstOption?: boolean;
  excludeLastOption?: boolean;
  ariaLabel: string;
}

function createTimeSlots(start: number, end: number, timeInterval: 30 | 60) {
  const slots: string[] = [];

  for (let hour = start; hour <= end; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (timeInterval === 30 && hour < end) {
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }

  return slots;
}

export function TimeSelect({
  value,
  onChange,
  placeholder = '선택',
  start = 9,
  end = 20,
  timeInterval = 30,
  excludeFirstOption = false,
  excludeLastOption = false,
  ariaLabel,
}: TimeSelectProps) {
  const slots = createTimeSlots(start, end, timeInterval);
  const options = slots.slice(
    excludeFirstOption ? 1 : 0,
    excludeLastOption ? -1 : undefined
  );

  return (
    <Select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
    >
      <option value="">{placeholder}</option>
      {options.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </Select>
  );
}
