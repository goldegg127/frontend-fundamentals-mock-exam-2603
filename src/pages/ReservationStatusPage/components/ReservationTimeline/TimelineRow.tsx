import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Room, Reservation } from '_tosslib/server/types';
import { ReservationBlock } from './ReservationBlock';

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
