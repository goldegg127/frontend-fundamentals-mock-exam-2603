import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { css } from '@emotion/react';
import { SuspenseQueries } from '@suspensive/react-query'
import { Suspense, ErrorBoundary } from '@suspensive/react'
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Reservation } from '_tosslib/server/types';
import { Divider } from '../../shared/components/Divider';
import { myReservationsQueryOptions, roomsQueryOptions, reservationsQueryOptions } from 'pages/queries';
import { getTodayString } from './utils/formatDate';
import { TIMELINE_END, TIMELINE_START, buildRoomReservationTimelineData } from './domain';
import { findRoomName, formatReservationSummary } from './utils/reservationDisplay';
import { useCancelReservation } from "./hooks/useCancelReservation";

import { DatePicker } from './components/DatePicker';
import { Timeline } from './components/Timeline';
import { ReservationCell } from './components/ReservationCell';
import { CtaButton } from './components/CtaButton';
import { Card } from "./components/Card";
import { MessageBanner, type Message } from "./components/MessageBanner";

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
                timeRange={{ start: TIMELINE_START, end: TIMELINE_END, labelInterval: 'halfHour' }}
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
        <h2>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>
          <Spacing size={16} />
        </h2>

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
                <ItemsContainer>
                  {isEmpty
                    ? <Card.Empty />
                    : reservations.map((reservation) => (
                        <li key={reservation.id}>
                          <Card
                            top={findRoomName(rooms, reservation.roomId)}
                            bottom={formatReservationSummary(reservation)}
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
              )}
            </SuspenseQueries>
        </Suspense>
      </Section>

      <Divider />

      <Section>
        <CtaButton onClick={() => navigate('/booking')}>
          예약하기
        </CtaButton>
      </Section>

      <Spacing size={24} />
    </div>
  );
}

function Header({children} : {children: React.ReactNode}) {
  return <header 
    css={css`
      padding: 0 24px;
      font-size: 22px;
      line-height: 31px;
      color: ${colors.grey900};
      word-break: keep-all;
      white-space: pre-line;
      font-weight: bold;
    `}
  >
    {children}
  </header>
}

function Section({children} : {children: React.ReactNode}) {
  return <section css={css`padding: 0 24px;`}>
    {children}
  </section>
}

function ItemsContainer({children} : {children: React.ReactNode}) {
  return (
    <ul 
      css={css`
        list-style: none; 
        padding: 0; 
        margin: 0; 
        display: flex; 
        flex-direction: column; 
        gap: 10px;`
      }>
      {children}
    </ul>
  );
}
