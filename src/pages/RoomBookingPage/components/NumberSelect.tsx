import { Select } from '_tosslib/components';

interface NumberSelectProps {
  value: number | null;
  options: number[];
  onChange: (value: number | null) => void;
  placeholder?: string;
  suffix?: string;
  ariaLabel?: string;
}

export function NumberSelect({
  value,
  options,
  onChange,
  placeholder = '선택',
  suffix = '',
  ariaLabel,
}: NumberSelectProps) {
  return (
    <Select
      value={value ?? ''}
      onChange={(event) => {
        const nextValue = event.target.value === '' ? null : Number(event.target.value);
        onChange(nextValue);
      }}
      aria-label={ariaLabel}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {`${option}${suffix}`}
        </option>
      ))}
    </Select>
  );
}
