import { css } from '@emotion/react';
import type { Reservation, Room } from '_tosslib/server/types';
import { colors } from '_tosslib/constants/colors';
import { formatEquipmentList } from '../utils/formatEquipment';

interface ReservationCellProps {
  reservation: Reservation;
  room: Room;
  isActive: boolean;
  onToggle: () => void;
}

export function ReservationCell({
  reservation,
  room,
  isActive,
  onToggle,
}: ReservationCellProps) {
  const tooltipId = `reservation-tooltip-${reservation.id}`;
  const hasEquipment = reservation.equipment.length > 0;

  return (
    <>
      <button
        type="button"
        aria-label={`${room.name} ${reservation.start}-${reservation.end} 예약 상세`}
        aria-expanded={isActive}
        aria-describedby={isActive ? tooltipId : undefined}
        onClick={onToggle}
        css={css`
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
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
          id={tooltipId}
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
          <div>{reservation.start} ~ {reservation.end}</div>
          <div>{reservation.attendees}명</div>
          {hasEquipment && (
            <div>{formatEquipmentList(reservation.equipment)}</div>
          )}
        </div>
      )}
    </>
  );
}
