import { css } from '@emotion/react';
import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations } from 'pages/remotes';
import type { Room, Reservation } from '_tosslib/server/types';
import type { BookingFilterValue } from './BookingFilter';
import { filterAvailableRooms } from '../domain/filterAvailableRooms';
import { EQUIPMENT_LABELS } from '../constants';

interface AvailableRoomListProps {
  filter: BookingFilterValue | null;
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

export function AvailableRoomList({ filter, selectedRoomId, onRoomSelect }: AvailableRoomListProps) {
  const { data: rooms } = useSuspenseQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5,
  });

  const { data: reservations } = useSuspenseQuery<Reservation[]>({
    queryKey: ['reservations', filter?.date || 'none'],
    queryFn: () => (filter ? getReservations(filter.date) : Promise.resolve([])),
    staleTime: 1000 * 60,
  });

  const availableRooms = useMemo(() => {
    if (!filter) return [];
    return filterAvailableRooms(rooms, reservations, filter);
  }, [rooms, reservations, filter]);

  return (
    <section>
      <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 가능 회의실
        </Text>
        {filter && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {availableRooms.length}개
          </Text>
        )}
      </div>
      <Spacing size={16} />

      {!filter ? (
        <EmptyState message="필터 조건을 입력해주세요." />
      ) : availableRooms.length === 0 ? (
        <EmptyState message="조건에 맞는 회의실이 없습니다." />
      ) : (
        <RoomCards rooms={availableRooms} selectedRoomId={selectedRoomId} onRoomSelect={onRoomSelect} />
      )}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      css={css`
        padding: 40px 0;
        text-align: center;
        background: ${colors.grey50};
        border-radius: 14px;
      `}
    >
      <Text typography="t6" color={colors.grey500}>
        {message}
      </Text>
    </div>
  );
}

interface RoomCardsProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

function RoomCards({ rooms, selectedRoomId, onRoomSelect }: RoomCardsProps) {
  return (
    <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
      {rooms.map((room) => {
        const isSelected = selectedRoomId === room.id;

        return (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            css={css`
              cursor: pointer;
              border-radius: 14px;
              border: 2px solid;
              border-color: ${isSelected ? colors.blue500 : colors.grey200};
              background: ${isSelected ? colors.blue50 : colors.white};
              transition: all 0.15s;
              &:hover {
                border-color: ${isSelected ? colors.blue500 : colors.grey400};
              }
            `}
          >
            <div css={css`padding: 16px; display: flex; justify-content: space-between; align-items: center;`}>
              <div css={css`display: flex; flex-direction: column; gap: 4px; flex: 1;`}>
                <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
                  <Text typography="t6" fontWeight="bold" color={colors.grey900}>
                    {room.name}
                  </Text>
                  <Text typography="t7" color={colors.grey600}>
                    {room.floor}층
                  </Text>
                </div>
                <div css={css`display: flex; gap: 4px;`}>
                  <Text typography="t7" color={colors.grey600}>
                    수용 인원: {room.capacity}명
                  </Text>
                </div>
                {room.equipment.length > 0 && (
                  <div css={css`display: flex; gap: 4px; flex-wrap: wrap;`}>
                    {room.equipment.map((eq) => (
                      <span
                        key={eq}
                        css={css`
                          padding: 2px 8px;
                          border-radius: 8px;
                          background: ${colors.grey100};
                          font-size: 12px;
                          color: ${colors.grey700};
                        `}
                      >
                        {EQUIPMENT_LABELS[eq]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {isSelected && (
                <div
                  css={css`
                    padding: 6px 12px;
                    border-radius: 8px;
                    background: ${colors.blue500};
                    color: ${colors.white};
                    font-size: 14px;
                    font-weight: 500;
                  `}
                >
                  선택됨
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
