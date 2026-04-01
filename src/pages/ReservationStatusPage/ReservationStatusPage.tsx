import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { css } from '@emotion/react';
import { SuspenseQueries } from '@suspensive/react-query'
import { Suspense, ErrorBoundary } from '@suspensive/react'
import { Spacing, Text, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Reservation } from '_tosslib/server/types';
import { Divider, Section, Header, ItemsContainer, DatePicker } from '../shared/components';
import { myReservationsQueryOptions, roomsQueryOptions, reservationsQueryOptions } from 'pages/queries';
import { buildRoomReservationTimelineData } from './domain';
import { getTodayString } from '../shared/utils/formatDate';
import { findRoomName, formatReservationSummary } from './utils/reservationDisplay';
import { useCancelReservation } from "./hooks/useCancelReservation";
import { Timeline, ReservationCell, Card, MessageBanner, type Message } from './components';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  const cancelMutation = useCancelReservation();

  const [message, setMessage] = useState<Message | null>(() => {
    const state = location.state as { message?: string } | null;

    return state?.message
      ? { type: 'success', text: state.message }
      : null;
  });

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (!state?.message) return;

    navigate('.', {
      replace: true,
      state: null,
    });
  }, [location.state, navigate]);

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Spacing size={24} />

      <Header>
        <h1>회의실 예약</h1>
      </Header>

      <Spacing size={24} />

      <Section>
        <h2>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            날짜 선택
          </Text>
          <Spacing size={16} />
        </h2>

        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          min={getTodayString()}
        />
      </Section>

      <Divider />

      <Section>
        <h2>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            예약 현황
          </Text>
          <Spacing size={16} />
        </h2>

        <Suspense fallback={<Timeline.Loading />}>
          <SuspenseQueries queries={[roomsQueryOptions(), reservationsQueryOptions(selectedDate)]}>
            {([{ data: rooms }, { data: reservations }]) => (
              <Timeline
                data={buildRoomReservationTimelineData(rooms, reservations)}
                getRowLabel={(room) => room.name}
                renderCell={(cell, room, isActive, onToggle) => (
                  <ReservationCell
                    reservation={cell}
                    room={room}
                    isActive={isActive}
                    onToggle={onToggle}
                  />
                )}
              />
            )}
          </SuspenseQueries>
        </Suspense>
      </Section>

      <Divider />

      <Section>
        {message && (
          <>
            <MessageBanner type={message.type} text={message.text} />

            <Spacing size={12} />
          </>
        )}

        <Suspense fallback={<Card.Loading />}>
          <SuspenseQueries
              queries={[
                {
                  ...myReservationsQueryOptions(),
                  select: (reservations: Reservation[]) => ({
                    items: reservations,
                    isEmpty: reservations.length === 0,
                  }),
                },
                roomsQueryOptions(),
              ]}
            >
              {([{ data: { items: reservations, isEmpty } }, { data: rooms }]) => (
                <>
                  <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
                    <h2>
                      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                        내 예약
                      </Text>
                    </h2>

                    {reservations.length > 0 && (
                      <Text typography="t7" fontWeight="medium" color={colors.grey500}>
                        {reservations.length}건
                      </Text>
                    )}
                  </div>

                  <Spacing size={16} />

                  <ItemsContainer>
                    {isEmpty
                      ? <Card.Empty />
                      : reservations.map((reservation) => (
                          <li key={reservation.id}>
                            <Card
                              title={findRoomName(rooms, reservation.roomId)}
                              description={formatReservationSummary(reservation)}
                              right={
                                <Card.CancelButton
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    cancelMutation.mutate(reservation.id, {
                                      onSuccess: () => {
                                        setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
                                      },
                                      onError: () => {
                                        setMessage({ type: 'error', text: '취소에 실패했습니다.' });
                                      },
                                    });
                                  }}
                                />}
                            />
                          </li>))
                    }
                  </ItemsContainer>
                </>
              )}
            </SuspenseQueries>
        </Suspense>
      </Section>

      <Divider />

      <Section>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </Section>

      <Spacing size={24} />
    </div>
  );
}
