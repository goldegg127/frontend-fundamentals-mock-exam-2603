import { css } from '@emotion/react';
import { ListRow, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Reservation } from '_tosslib/server/types';
import { formatEquipmentList } from '../../utils/formatEquipment';

interface ReservationItemProps {
  reservation: Reservation;
  roomName: string;
  onCancel: (id: string) => void;
}

export function ReservationItem({
  reservation,
  roomName,
  onCancel,
}: ReservationItemProps) {
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('정말 취소하시겠습니까?')) {
      onCancel(reservation.id);
    }
  };

  const bottomText = `${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${formatEquipmentList(reservation.equipment)}`;

  return (
    <div
      css={css`
        padding: 14px 16px;
        border-radius: 14px;
        background: ${colors.grey50};
        border: 1px solid ${colors.grey200};
      `}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={roomName}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={bottomText}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={
          <Button type="danger" style="weak" size="small" onClick={handleCancel}>
            취소
          </Button>
        }
      />
    </div>
  );
}
