import { useState } from 'react';
import { css } from '@emotion/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Room, Reservation } from '_tosslib/server/types';
import { getRooms, getMyReservations } from 'pages/remotes';
import { ReservationItem } from './ReservationItem';
import { MessageBanner } from './MessageBanner';
import { useCancelReservation } from './hooks/useCancelReservation';

interface MyReservationsProps {
  title: string;
}

export function MyReservations({ title }: MyReservationsProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  return (
    <section aria-labelledby="my-reservations-heading">
      <header css={css`display: flex; align-items: baseline; gap: 6px;`}>
        <Text
          id="my-reservations-heading"
          typography="t5"
          fontWeight="bold"
          color={colors.grey900}
        >
          {title}
        </Text>
  
        {reservations.length > 0 && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {reservations.length}건
          </Text>
        )}
      </header>

      <Spacing size={16} />

      {/* 메시지 배너 */}
      {message && (
        <>
          <MessageBanner type={message.type} text={message.text} />
          <Spacing size={12} />
        </>
      )}

      {reservations.length === 0 ? (
        <div
          css={css`
            padding: 40px 0;
            text-align: center;
            background: ${colors.grey50};
            border-radius: 14px;
          `}
        >
          <Text typography="t6" color={colors.grey500}>
            예약 내역이 없습니다.
          </Text>
        </div>
      ) : (
        <div
          role="list"
          css={css`display: flex; flex-direction: column; gap: 10px;`}
        >
          {reservations.map((reservation) => (
            <div key={reservation.id} role="listitem">
              <ReservationItem
                reservation={reservation}
                roomName={getRoomName(reservation.roomId)}
                onCancel={handleCancel}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
