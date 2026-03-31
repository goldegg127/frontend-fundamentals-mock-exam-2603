import { css } from '@emotion/react';
import { ReactNode, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { createReservation } from 'pages/remotes';
import type { Equipment } from '_tosslib/server/types';
import axios from 'axios';
import { BookingFilter, type BookingFilterValue } from './components/BookingFilter';
import { AvailableRoomList } from './components/AvailableRoomList';
import { Divider } from '../../shared/components/Divider';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<BookingFilterValue | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilterChange = (newFilter: BookingFilterValue | null) => {
    setFilter(newFilter);
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const createMutation = useMutation({
    mutationFn: (data: {
      roomId: string;
      date: string;
      start: string;
      end: string;
      attendees: number;
      equipment: Equipment[];
    }) => createReservation(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });

  const handleBook = async () => {
    if (!filter) {
      setErrorMessage('예약 조건을 입력해주세요.');
      return;
    }

    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date: filter.date,
        start: filter.startTime,
        end: filter.endTime,
        attendees: filter.attendees,
        equipment: filter.equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return (
    <main css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <header>
        <div css={css`padding: 12px 24px 0;`}>
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="뒤로가기"
            css={css`
              background: none;
              border: none;
              padding: 0;
              cursor: pointer;
              font-size: 14px;
              color: ${colors.grey600};
              &:hover {
                color: ${colors.grey900};
              }
            `}
          >
            ← 예약 현황으로
          </button>
        </div>

        <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
          예약하기
        </Top.Top03>
      </header>

      <Spacing size={24} />

      <Section>
        <Suspense fallback={<div>로딩 중...</div>}>
          <BookingFilter onFilterChange={handleFilterChange}>
            <BookingFilter.Title>예약 조건</BookingFilter.Title>
            
            <Spacing size={16} />
            
            <BookingFilter.DateInput label="날짜" />

            <Spacing size={14} />

            <BookingFilter.TimeRange startLabel="시작 시간" endLabel="종료 시간" />
            
            <Spacing size={14} />

            <div css={css`display: flex; gap: 12px;`}>
              <BookingFilter.Attendees label="참석 인원" />
              <BookingFilter.FloorSelect label="선호 층" />
            </div>
            
            <Spacing size={14} />
            
            <BookingFilter.Equipment label="필요 장비" />
            
            <Spacing size={14} />
            <Spacing size={8} />
            
            <BookingFilter.ValidationError />
          </BookingFilter>
        </Suspense>
      </Section>

      <Divider />

      <Section>
        <Suspense fallback={<div>로딩 중...</div>}>
          <AvailableRoomList
            filter={filter}
            selectedRoomId={selectedRoomId}
            onRoomSelect={setSelectedRoomId}
          />
        </Suspense>

        {filter && (
          <>
            <Spacing size={16} />
            <Button display="full" onClick={handleBook} disabled={createMutation.isPending}>
              {createMutation.isPending ? '예약 중...' : '확정'}
            </Button>
          </>
        )}


      {errorMessage && (
        <div css={css`padding: 0 24px;`}>
          <Spacing size={12} />
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
              {errorMessage}
            </Text>
          </div>
        </div>
      )}
      </Section>

      <Spacing size={24} />
    </main>
  );
}

function Section({children} : {children: ReactNode}) {
  return <section css={css`padding: 0 24px;`}>
    {children}
  </section>
}
