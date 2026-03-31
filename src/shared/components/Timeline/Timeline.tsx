import { useState } from 'react';
import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

// 제네릭 타입 정의 - 도메인 독립적
// 컨벤션: row와 각 cell은 id 필드를 가져야 함
// 컨벤션: cell은 left, width 필드를 가져야 함 (위치 정보)
export interface TimelineData<TRow extends { id: string }, TCell extends { id: string; left: number; width: number }> {
  row: TRow;
  cells: TCell[];
}

interface TimelineProps<TRow extends { id: string }, TCell extends { id: string; left: number; width: number }> {
  data: TimelineData<TRow, TCell>[];
  colLabels: string[];
  rowLabel: (row: TRow) => string;
  children?: (cell: TCell, row: TRow, isActive: boolean, onClick: () => void) => React.ReactNode;
}

export function Timeline<TRow extends { id: string }, TCell extends { id: string; left: number; width: number }>({
  data,
  colLabels,
  rowLabel,
  children,
}: TimelineProps<TRow, TCell>) {
  const [activeCellKey, setActiveCellKey] = useState<string | null>(null);

  return (
    <div
      role="table"
      aria-label="타임라인"
      css={css`
        background: ${colors.grey50};
        border-radius: 14px;
        padding: 16px;
      `}
    >
      <TimelineHeader colLabels={colLabels} />

      {data.map((item, index) => (
        <TimelineRow
          key={item.row.id}
          label={rowLabel(item.row)}
          isFirst={index === 0}
        >
          {item.cells.map((cell) => {
            const isActive = activeCellKey === cell.id;

            return (
              <TimelineCell
                key={cell.id}
                position={{ left: cell.left, width: cell.width }}
              >
                {children ? (
                  children(
                    cell,
                    item.row,
                    isActive,
                    () => setActiveCellKey(isActive ? null : cell.id)
                  )
                ) : (
                  <DefaultCellBlock
                    isActive={isActive}
                    onClick={() => setActiveCellKey(isActive ? null : cell.id)}
                  />
                )}
              </TimelineCell>
            );
          })}
        </TimelineRow>
      ))}
    </div>
  );
}

Timeline.Loading = function TimelineLoading() {
  return <div>로딩 중...</div>;
};

interface TimelineHeaderProps {
  colLabels: string[];
}

function TimelineHeader({ colLabels }: TimelineHeaderProps) {
  return (
    <div css={css`display: flex; align-items: flex-end; margin-bottom: 8px;`}>
      <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`} />
      <div css={css`flex: 1; position: relative; height: 18px;`}>
        {colLabels.map((label, index) => {
          // 균등 분배 (첫 시간이 0%, 마지막 시간이 100%)
          const left = (index / (colLabels.length - 1)) * 100;

          return (
            <Text
              key={label}
              typography="t7"
              fontWeight="regular"
              color={colors.grey400}
              css={css`
                position: absolute;
                left: ${left}%;
                transform: translateX(-50%);
                font-size: 10px;
                letter-spacing: -0.3px;
              `}
            >
              {label.slice(0, 2)}
            </Text>
          );
        })}
      </div>
    </div>
  );
}

interface TimelineRowProps {
  label: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

function TimelineRow({ label, children, isFirst = false }: TimelineRowProps) {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        height: 32px;
        ${!isFirst && 'margin-top: 4px;'}
      `}
    >
      <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`}>
        <Text
          typography="t7"
          fontWeight="medium"
          color={colors.grey700}
          ellipsisAfterLines={1}
          css={css`font-size: 12px;`}
        >
          {label}
        </Text>
      </div>
      <div
        css={css`
          flex: 1;
          height: 24px;
          background: ${colors.white};
          border-radius: 6px;
          position: relative;
          overflow: visible;
        `}
      >
        {children}
      </div>
    </div>
  );
}

interface TimelineCellProps {
  position: { left: number; width: number };
  children: React.ReactNode;
}

function TimelineCell({ position, children }: TimelineCellProps) {
  return (
    <div
      css={css`
        position: absolute;
        left: ${position.left}%;
        width: ${position.width}%;
        height: 100%;
      `}
    >
      {children}
    </div>
  );
}

// 기본 셀 렌더링 (커스터마이징 안 했을 때)
interface DefaultCellBlockProps {
  isActive: boolean;
  onClick: () => void;
}

function DefaultCellBlock({ isActive, onClick }: DefaultCellBlockProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      css={css`
        width: 100%;
        height: 100%;
        background: ${colors.blue400};
        border-radius: 4px;
        opacity: ${isActive ? 1 : 0.75};
        cursor: pointer;
        transition: opacity 0.15s;
        &:hover {
          opacity: 1;
        }
        &:focus {
          outline: 2px solid ${colors.blue600};
          outline-offset: 2px;
        }
      `}
    />
  );
}
