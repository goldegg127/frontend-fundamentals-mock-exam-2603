import { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Room, Reservation } from '_tosslib/server/types';
import { getRooms, getReservations } from 'pages/remotes';
import { TIME_SLOTS } from '../../utils/timeUtils';
import { TimelineHeader } from './TimelineHeader';
import { TimelineRow } from './TimelineRow';

interface ReservationTimelineProps {
  title: string;
  date: string;
}

export function ReservationTimeline({ title = '예약 현황', date }: ReservationTimelineProps) {
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null);

  const { data: rooms } = useSuspenseQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5,
  });

  const { data: reservations } = useSuspenseQuery<Reservation[]>({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
    staleTime: 1000 * 60 * 1,
  });

  // 시간 헤더 (00분만)
  const hourLabels = useMemo(
    () => TIME_SLOTS.filter((t) => t.endsWith(':00')),
    []
  );

  // 회의실별 예약 데이터
  const timelineData = useMemo(() => {
    return rooms.map((room) => ({
      room,
      reservations: reservations.filter((r) => r.roomId === room.id),
    }));
  }, [rooms, reservations]);

  return (
    <section aria-label={`${date} 날짜의 회의실 예약 타임라인`}>
      <header>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          {title}
        </Text>
      </header>
      <Spacing size={16} />

      <div
        role="table"
        aria-label="회의실별 예약 타임라인"
        css={css`
          background: ${colors.grey50};
          border-radius: 14px;
          padding: 16px;
        `}
      >
        <TimelineHeader hourLabels={hourLabels} />

        {timelineData.map((data, index) => (
          <TimelineRow
            key={data.room.id}
            room={data.room}
            reservations={data.reservations}
            activeReservationId={activeReservationId}
            onReservationClick={setActiveReservationId}
            isFirst={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
