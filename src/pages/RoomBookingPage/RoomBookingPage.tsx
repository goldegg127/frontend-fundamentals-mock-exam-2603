import axios from 'axios';
import { css } from '@emotion/react';
import { Suspense, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SuspenseQueries } from '@suspensive/react-query';
import { useQueryParams } from 'use-query-params';
import { Spacing, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { DatePicker, Divider, Section, Header } from '../shared/components';
import { formatDate } from '../shared/utils/formatDate';
import { createReservationMutationOptions, queryKey, reservationsQueryOptions, roomsQueryOptions } from 'pages/queries';
import { ALL_EQUIPMENT } from './constants';
import { filterAvailableRooms, validateBookingFilter } from './domain';
import type { BookingFilter } from './types';
import { AvailableRoomList, MultiSelect, NumberInput, NumberSelect, TimeSelect } from './components';
import { bookingFilterQueryParams } from './queryParams';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [queryFilter, setQueryFilter] = useQueryParams(bookingFilterQueryParams, {
    removeDefaultsFromUrl: true,
  });

  const filter = useMemo<BookingFilter>(
    () => ({
      date: queryFilter.date,
      startTime: queryFilter.startTime,
      endTime: queryFilter.endTime,
      attendees: queryFilter.attendees,
      equipment: queryFilter.equipment,
      preferredFloor: queryFilter.floor ?? null,
    }),
    [queryFilter]
  );

  const validation = useMemo(
    () => validateBookingFilter(filter.startTime, filter.endTime, filter.attendees),
    [filter.startTime, filter.endTime, filter.attendees]
  );

  const isFilterComplete =
    validation.isValid && filter.startTime !== '' && filter.endTime !== '';

  const updateFilter = (updates: Partial<BookingFilter>) => {
    const { preferredFloor, ...rest } = updates;

    setQueryFilter(
      {
        ...rest,
        ...(preferredFloor !== undefined ? { floor: preferredFloor } : {}),
      },
      'replaceIn'
    );
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const createMutation = useMutation(createReservationMutationOptions());

  const handleBook = async () => {
    if (!isFilterComplete) {
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
        queryClient.invalidateQueries({ queryKey: [queryKey.reservations, filter.date] });
        queryClient.invalidateQueries({ queryKey: [queryKey.MyReservations] });
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
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Spacing size={12} />

      <Header>
        <BackButton onClick={() => navigate('/')}>
          ← 예약 현황으로
        </BackButton>
        <Spacing size={24} />

        <h1>예약하기</h1>
      </Header>

      <Spacing size={24} />

      <Section>
        <section>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            예약 조건
          </Text>
          <Spacing size={16} />

          <form>
            <label>
              <Text as="span" typography="t7" fontWeight="medium" color={colors.grey600}>
                날짜
              </Text>
              <Spacing size={6} />

              <DatePicker
                value={filter.date}
                onChange={(date) => updateFilter({ date })}
                min={formatDate(new Date())}
              />
            </label>

            <Spacing size={14} />

            <Grid>
              <label>
                <Text as="span" typography="t7" fontWeight="medium" color={colors.grey600}>
                  시작 시간
                </Text>
                <Spacing size={6} />

                <TimeSelect
                  value={filter.startTime}
                  onChange={(startTime) => updateFilter({ startTime })}
                  ariaLabel="시작 시간"
                  excludeLastOption
                />
              </label>

              <label>
                <Text as="span" typography="t7" fontWeight="medium" color={colors.grey600}>
                  종료 시간
                </Text>
                <Spacing size={6} />

                <TimeSelect
                  value={filter.endTime}
                  onChange={(endTime) => updateFilter({ endTime })}
                  ariaLabel="종료 시간"
                  excludeFirstOption
                />
              </label>
            </Grid>

            <Spacing size={14} />

            <Grid>
              <label>
                <Text as="span" typography="t7" fontWeight="medium" color={colors.grey600}>
                  참석 인원
                </Text>
                <Spacing size={6} />

                <NumberInput
                  value={filter.attendees}
                  onChange={(attendees) => updateFilter({ attendees })}
                />
              </label>

              <label>
                <Text as="span" typography="t7" fontWeight="medium" color={colors.grey600}>
                  선호 층
                </Text>
                <Spacing size={6} />

                <Suspense fallback>
                  <SuspenseQueries queries={[roomsQueryOptions()]}>
                    {([{ data: rooms }]) => {
                      const floors = [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b);

                      return (
                        <NumberSelect
                          value={filter.preferredFloor}
                          options={floors}
                          onChange={(preferredFloor) => updateFilter({ preferredFloor })}
                          placeholder="전체"
                          suffix="층"
                        />
                      );
                    }}
                  </SuspenseQueries>
                </Suspense>
              </label>
            </Grid>

            <Spacing size={14} />

            <fieldset
              css={css`
                margin: 0;
                padding: 0;
                border: 0;
                min-width: 0;
              `}
            >
              <Text as="legend" typography="t7" fontWeight="medium" color={colors.grey600}>
                필요 장비
              </Text>
              <Spacing size={8} />

              <MultiSelect
                value={filter.equipment}
                data={ALL_EQUIPMENT}
                onChange={(equipment) => updateFilter({ equipment })}
              />
            </fieldset>
          </form>

          {validation.error && (
            <>
              <Spacing size={16} />
              <div role="alert" css={css`color: ${colors.red500}; font-size: 14px;`}>
                {validation.error}
              </div>
            </>
          )}
        </section>
      </Section>

      <Divider />

      {isFilterComplete && (
        <Suspense fallback={<div>로딩 중..</div>}>
          <SuspenseQueries
            queries={[roomsQueryOptions(), reservationsQueryOptions(filter.date)]}
          >
            {([{ data: rooms }, { data: reservations }]) => {
              const availableRooms = filterAvailableRooms(rooms, reservations, filter);

              return (
                <Section>
                  <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
                    <h2>
                      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                        예약 가능 회의실
                      </Text>
                    </h2>
                    <Text typography="t7" fontWeight="medium" color={colors.grey500}>
                      {availableRooms.length}개
                    </Text>
                  </div>
                  <Spacing size={16} />

                  <AvailableRoomList
                    rooms={availableRooms}
                    selectedRoomId={selectedRoomId}
                    onSelectRoom={setSelectedRoomId}
                  />
              
                  <Spacing size={16} />

                  <Button display="full" onClick={handleBook} disabled={createMutation.isPending || !selectedRoomId}>
                    {createMutation.isPending ? '예약 중...' : '확정'}
                  </Button>
                </Section>
              );
            }}
          </SuspenseQueries>
        </Suspense>
      )}

      {errorMessage && (
        <>
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
        </>
      )}

      <Spacing size={24} />
    </div>
  );
}

function BackButton({ children, onClick } : { children : React.ReactNode, onClick : () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
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
      `}>
      {children}
    </button>
  );
}

function Grid({ children } : { children : React.ReactNode }) {
  return <div css={css`display: grid; gap: 12px; grid-template-columns: repeat(2, 1fr);`}>
    {children}
  </div>
}
