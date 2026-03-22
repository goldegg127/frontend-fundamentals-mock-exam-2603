import { css } from '@emotion/react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { Equipment, Room } from '_tosslib/server/types';
import { Text, Select, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms } from 'pages/remotes';
import { TIME_SLOTS, EQUIPMENT_LABELS, ALL_EQUIPMENT } from '../constants';
import { validateBookingFilter } from '../domain/validateBooking';

export interface BookingFilterValue {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

interface BookingFilterContextValue {
  filter: BookingFilterValue;
  setDate: (date: string) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setAttendees: (count: number) => void;
  setEquipment: (equipment: Equipment[]) => void;
  setPreferredFloor: (floor: number | null) => void;
  floors: number[];
  validation: ValidationResult;
}

const BookingFilterContext = createContext<BookingFilterContextValue | null>(null);

function useBookingFilterContext() {
  const context = useContext(BookingFilterContext);
  if (!context) {
    throw new Error('BookingFilter 컴포넌트는 BookingFilter 내부에서만 사용할 수 있습니다.');
  }
  return context;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTodayString(): string {
  return formatDate(new Date());
}

interface BookingFilterProps {
  children: React.ReactNode;
  onFilterChange: (filter: BookingFilterValue | null) => void;
}

export function BookingFilter({ children, onFilterChange }: BookingFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 내부에서 데이터 페칭
  const { data: rooms } = useSuspenseQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5,
  });

  // 상태 관리
  const [date, setDate] = useState(searchParams.get('date') || getTodayString());
  const [startTime, setStartTime] = useState(searchParams.get('startTime') || '');
  const [endTime, setEndTime] = useState(searchParams.get('endTime') || '');
  const [attendees, setAttendees] = useState(Number(searchParams.get('attendees')) || 1);
  const [equipment, setEquipment] = useState<Equipment[]>(
    (searchParams.get('equipment')?.split(',').filter(Boolean) || []) as Equipment[]
  );
  const [preferredFloor, setPreferredFloor] = useState<number | null>(
    searchParams.get('floor') ? Number(searchParams.get('floor')) : null
  );

  const floors = useMemo(() => {
    return [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);
  }, [rooms]);

  // URL 동기화
  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor !== null) params.floor = String(preferredFloor);

    setSearchParams(params, { replace: true });
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, setSearchParams]);

  // Validation
  const validation = useMemo(
    () => validateBookingFilter(startTime, endTime, attendees),
    [startTime, endTime, attendees]
  );

  // 필터 변경 통지
  useEffect(() => {
    if (validation.isValid && startTime && endTime) {
      onFilterChange({
        date,
        startTime,
        endTime,
        attendees,
        equipment,
        preferredFloor,
      });
    } else {
      onFilterChange(null);
    }
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, validation.isValid, onFilterChange]);

  const filter: BookingFilterValue = {
    date,
    startTime,
    endTime,
    attendees,
    equipment,
    preferredFloor,
  };

  return (
    <BookingFilterContext.Provider
      value={{
        filter,
        setDate,
        setStartTime,
        setEndTime,
        setAttendees,
        setEquipment,
        setPreferredFloor,
        floors,
        validation,
      }}
    >
      <section>{children}</section>
    </BookingFilterContext.Provider>
  );
}

BookingFilter.Title = function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text typography="t5" fontWeight="bold" color={colors.grey900}>
      {children}
    </Text>
  );
};

BookingFilter.DateInput = function DateInput({ label }: { label: string }) {
  const { filter, setDate } = useBookingFilterContext();

  return (
    <>
      <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          {label}
        </Text>

        <input
          type="date"
          value={filter.date}
          min={getTodayString()}
          onChange={(e) => setDate(e.target.value)}
          aria-label={label}
          css={css`
            box-sizing: border-box;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.5;
            height: 48px;
            background-color: ${colors.grey50};
            border-radius: 12px;
            color: ${colors.grey800};
            width: 100%;
            border: 1px solid ${colors.grey200};
            padding: 0 16px;
            outline: none;
            transition: border-color 0.15s;
            &:focus {
              border-color: ${colors.blue500};
            }
          `}
        />
      </div>
    </>
  );
};

BookingFilter.TimeRange = function TimeRange({
  startLabel,
  endLabel,
}: {
  startLabel: string;
  endLabel: string;
}) {
  const { filter, setStartTime, setEndTime } = useBookingFilterContext();

  return (
    <>
      <div css={css`display: flex; gap: 12px;`}>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            {startLabel}
          </Text>
          <Select
            value={filter.startTime}
            onChange={(e) => setStartTime(e.target.value)}
            aria-label={startLabel}
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(0, -1).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            {endLabel}
          </Text>
          <Select
            value={filter.endTime}
            onChange={(e) => setEndTime(e.target.value)}
            aria-label={endLabel}
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(1).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

BookingFilter.Attendees = function Attendees({ label }: { label: string }) {
  const { filter, setAttendees } = useBookingFilterContext();

  return (
    <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      <input
        type="number"
        min={1}
        value={filter.attendees}
        onChange={(e) => setAttendees(Math.max(1, Number(e.target.value)))}
        aria-label={label}
        css={css`
          box-sizing: border-box;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          height: 48px;
          background-color: ${colors.grey50};
          border-radius: 12px;
          color: ${colors.grey800};
          width: 100%;
          border: 1px solid ${colors.grey200};
          padding: 0 16px;
          outline: none;
          transition: border-color 0.15s;
          &:focus {
            border-color: ${colors.blue500};
          }
        `}
      />
    </div>
  );
};

BookingFilter.FloorSelect = function FloorSelect({ label }: { label: string }) {
  const { filter, setPreferredFloor, floors } = useBookingFilterContext();

  return (
    <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      <Select
        value={filter.preferredFloor ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          setPreferredFloor(val === '' ? null : Number(val));
        }}
        aria-label={label}
      >
        <option value="">전체</option>
        {floors.map((f) => (
          <option key={f} value={f}>
            {f}층
          </option>
        ))}
      </Select>
    </div>
  );
};

BookingFilter.Equipment = function Equipment({ label }: { label: string }) {
  const { filter, setEquipment } = useBookingFilterContext();

  const handleToggle = (eq: Equipment) => {
    const selected = filter.equipment.includes(eq);
    const next = selected ? filter.equipment.filter((e) => e !== eq) : [...filter.equipment, eq];
    setEquipment(next);
  };

  return (
    <>
      <div>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          {label}
        </Text>
        
        <Spacing size={8} />

        <div css={css`display: flex; gap: 8px; flex-wrap: wrap;`}>
          {ALL_EQUIPMENT.map((eq) => {
            const selected = filter.equipment.includes(eq);
            return (
              <button
                key={eq}
                type="button"
                onClick={() => handleToggle(eq)}
                aria-label={EQUIPMENT_LABELS[eq]}
                aria-pressed={selected}
                css={css`
                  padding: 8px 16px;
                  border-radius: 20px;
                  border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                  background: ${selected ? colors.blue50 : colors.grey50};
                  color: ${selected ? colors.blue600 : colors.grey700};
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.15s;
                  &:hover {
                    border-color: ${selected ? colors.blue500 : colors.grey400};
                  }
                `}
              >
                {EQUIPMENT_LABELS[eq]}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

BookingFilter.ValidationError = function ValidationError() {
  const { validation } = useBookingFilterContext();

  if (!validation.error) return null;

  return (
    <>
      <span css={css`color: ${colors.red500}; font-size: 14px;`} role="alert">
        {validation.error}
      </span>
    </>
  );
};
