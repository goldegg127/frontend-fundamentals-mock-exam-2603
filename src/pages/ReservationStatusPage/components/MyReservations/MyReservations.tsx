import { useState } from 'react';
import { css } from '@emotion/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Spacing, Text } from '_tosslib/components';
import type { Room, Reservation } from '_tosslib/server/types';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getMyReservations } from 'pages/remotes';
import { formatEquipmentList } from '../../utils/formatEquipment';
import { useCancelReservation } from '../../hooks/useCancelReservation';
import { Card } from '../Card';

export function MyReservations() {
  const [message, setMessage] = useState<string | null>(null);
  const cancelMutation = useCancelReservation();

  const { data: rooms } = useSuspenseQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5,
  });

  const { data: reservations } = useSuspenseQuery<Reservation[]>({
    queryKey: ['myReservations'],
    queryFn: getMyReservations,
    staleTime: 1000 * 60 * 1,
  });

  const getRoomName = (roomId: string): string => {
    return rooms.find((r) => r.id === roomId)?.name ?? roomId;
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage('예약이 취소되었습니다.');
    } catch {
      setMessage('취소에 실패했습니다.');
    }
  };

  if (reservations.length === 0) {
    return (
      <div
        css={css`
          padding: 40px 0;
          text-align: center;
          background: ${colors.grey50};
          border-radius: 14px;
          color: ${colors.grey500};
        `}
      >
        예약 내역이 없습니다.
      </div>
    );
  }

  return <>
      {message && (
      <>
        <div
          css={css`
            padding: 10px 14px;
            border-radius: 10px;
            background: ${colors.red50};
            display: flex;
            align-items: center;
            gap: 8px;
          `}
        >
          <Text typography="t7" fontWeight="medium" color={colors.red500}>
            {message}
          </Text>
        </div>

        <Spacing size={12} />
      </>
    )}

    <ul css={css`list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;`}>
      {reservations.map((reservation) => {

        return (
          <li key={reservation.id}>
            <Card
              top={getRoomName(reservation.roomId)}
              bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${formatEquipmentList(reservation.equipment)}`}
              right={<Card.CancelButton onClick={(e) => {
                e.stopPropagation();
                handleCancel(reservation.id);
              }} />}
            />
          </li>
        );
      })}
    </ul>
  </>;
}
