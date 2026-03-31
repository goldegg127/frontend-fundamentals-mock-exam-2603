import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import type { Reservation } from '_tosslib/server/types';
import { formatEquipmentList } from '../utils/formatEquipment';

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
  return (
    <>
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
    </>
  );
}
