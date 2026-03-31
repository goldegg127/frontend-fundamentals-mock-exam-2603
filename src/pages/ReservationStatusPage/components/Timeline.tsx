import { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Room, Reservation } from '_tosslib/server/types';
import { getRooms, getReservations } from 'pages/remotes';
import { TIME_SLOTS, calculateTimelinePosition, calculateTimelineWidth } from '../utils/timeUtils';
import { formatEquipmentList } from '../utils/formatEquipment';

interface TimelineProps {
  selected: string;
}

export function Timeline({ selected }: TimelineProps) {
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null);

  const { data: rooms } = useSuspenseQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5,
  });

  const { data: reservations } = useSuspenseQuery<Reservation[]>({
    queryKey: ['reservations', selected],
    queryFn: () => getReservations(selected),
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
  );
}


interface TimelineHeaderProps {
  hourLabels: string[];
}

export function TimelineHeader({ hourLabels }: TimelineHeaderProps) {
  return (
    <div css={css`display: flex; align-items: flex-end; margin-bottom: 8px;`}>
      <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`} />
      <div css={css`flex: 1; position: relative; height: 18px;`}>
        {hourLabels.map((time) => {
          const left = calculateTimelinePosition(time);
          
          return (
            <Text
              key={time}
              typography="t7"
              fontWeight="regular"
              color={colors.grey400}
              css={css`
                position: absolute;
                left: ${left}%;
                transform: translateX(-50%);
                font-size: 10px;
                letter-spacing: -0.3px;
              `}
            >
              {time.slice(0, 2)}
            </Text>
          );
        })}
      </div>
    </div>
  );
}


interface TimelineRowProps {
  room: Room;
  reservations: Reservation[];
  activeReservationId: string | null;
  onReservationClick: (id: string) => void;
  isFirst?: boolean;
}

export function TimelineRow({
  room,
  reservations,
  activeReservationId,
  onReservationClick,
  isFirst = false,
}: TimelineRowProps) {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        height: 32px;
        ${!isFirst && 'margin-top: 4px;'}
      `}
    >
      <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`}>
        <Text
          typography="t7"
          fontWeight="medium"
          color={colors.grey700}
          ellipsisAfterLines={1}
          css={css`font-size: 12px;`}
        >
          {room.name}
        </Text>
      </div>
      <div
        css={css`
          flex: 1;
          height: 24px;
          background: ${colors.white};
          border-radius: 6px;
          position: relative;
          overflow: visible;
        `}
      >
        {reservations.map((reservation) => (
          <ReservationBlock
            key={reservation.id}
            reservation={reservation}
            roomName={room.name}
            isActive={activeReservationId === reservation.id}
            onClick={() =>
              onReservationClick(
                activeReservationId === reservation.id ? '' : reservation.id
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

interface ReservationBlockProps {
  reservation: Reservation;
  roomName: string;
  isActive: boolean;
  onClick: () => void;
}

export function ReservationBlock({
  reservation,
  roomName,
  isActive,
  onClick,
}: ReservationBlockProps) {
  const left = calculateTimelinePosition(reservation.start);
  const width = calculateTimelineWidth(reservation.start, reservation.end);

  return (
    <div
      css={css`
        position: absolute;
        left: ${left}%;
        width: ${width}%;
        height: 100%;
      `}
    >
      <div
        role="button"
        aria-label={`${roomName} ${reservation.start}-${reservation.end} 예약 상세`}
        aria-expanded={isActive}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        css={css`
          width: 100%;
          height: 100%;
          background: ${colors.blue400};
          border-radius: 4px;
          opacity: ${isActive ? 1 : 0.75};
          cursor: pointer;
          transition: opacity 0.15s;
          &:hover {
            opacity: 1;
          }
          &:focus {
            outline: 2px solid ${colors.blue600};
            outline-offset: 2px;
          }
        `}
      />
      {isActive && (
        <div
          role="tooltip"
          css={css`
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 6px;
            background: ${colors.grey900};
            color: ${colors.white};
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
            line-height: 1.6;
          `}
        >
          <div>
            {reservation.start} ~ {reservation.end}
          </div>
          
          <div>{reservation.attendees}명</div>

          {reservation.equipment.length > 0 && (
            <div>{formatEquipmentList(reservation.equipment)}</div>
          )}
        </div>
      )}
    </div>
  );
}
