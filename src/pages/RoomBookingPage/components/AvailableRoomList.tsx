import { css } from '@emotion/react';
import { ListRow, Text } from '_tosslib/components';
import type { Room } from '_tosslib/server/types';
import { colors } from '_tosslib/constants/colors';
import { ItemsContainer } from '../../shared/components';
import { formatRoomDescription } from '../utils/formatRoomDescription';

interface AvailableRoomListProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export function AvailableRoomList({
  rooms,
  selectedRoomId,
  onSelectRoom,
}: AvailableRoomListProps) {
  if (rooms.length === 0) {
    return <EmptyState />;
  }

  return (
    <ItemsContainer>
      {rooms.map((room) => {
        const isSelected = selectedRoomId === room.id;

        return (
          <li key={room.id}>
            <div
              role="button"
              onClick={() => onSelectRoom(room.id)}
              aria-pressed={isSelected}
              aria-label={room.name}
              css={css`
                cursor: pointer;
                padding: 14px 16px;
                border-radius: 14px;
                border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
                background: ${isSelected ? colors.blue50 : colors.white};
                transition: all 0.15s;

                &:hover {
                  border-color: ${isSelected ? colors.blue500 : colors.grey300};
                }

                &:focus-within {
                  outline: 2px solid ${colors.blue500};
                  outline-offset: 2px;
                }
              `}
            >
              <ListRow
                contents={
                  <ListRow.Text2Rows
                    top={room.name}
                    topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                    bottom={formatRoomDescription(room)}
                    bottomProps={{ typography: 't7', color: colors.grey600 }}
                  />
                }
                right={
                  isSelected ? (
                    <Text typography="t7" fontWeight="bold" color={colors.blue500}>
                      선택됨
                    </Text>
                  ) : undefined
                }
              />
            </div>
          </li>
        );
      })}
    </ItemsContainer>
  );
}

function EmptyState() {
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
        조건에 맞는 회의실이 없습니다.
      </Text>
    </div>
  );
}
