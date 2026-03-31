import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuspenseQueries, Mutation } from '@suspensive/react-query'
import { Suspense, ErrorBoundary } from '@suspensive/react'
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Reservation } from '_tosslib/server/types';
import { myReservationsQueryOptions, roomsQueryOptions } from 'pages/queries';
import { getTodayString } from './utils/formatDate';
import { Divider } from '../../shared/components/Divider';
import { DatePicker } from './components/DatePicker';
import { Timeline } from './components/Timeline';
import { CtaButton } from './components/CtaButton';
import { Card } from "./components/Card";
import { getRoomName, getReservationSpec } from "./domain";
import { useCancelReservation } from "./hooks/useCancelReservation";

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const cancelMutation = useCancelReservation();

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
        <Suspense fallback={<div>로딩 중...</div>}>
          <Timeline selected={selectedDate} />
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
                            top={getRoomName(rooms, reservation.roomId)}
                            bottom={getReservationSpec(reservation)}
                            right={
                              <Card.CancelButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelMutation.mutate(reservation.id);
                                }}
                              />
                            }
                          />
                        </li>
                      ))
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
