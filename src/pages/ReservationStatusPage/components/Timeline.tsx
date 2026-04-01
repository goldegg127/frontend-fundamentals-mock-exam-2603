import { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

// 제네릭 타입 정의 - 도메인 독립적
// 컨벤션: row와 각 cell은 id 필드를 가져야 함
// 컨벤션: cell은 start, end 필드를 가져야 함 (시간 정보)
export interface TimelineData<TRow extends { id: string }, TCell extends { id: string; start: string; end: string }> {
  row: TRow;
  cells: TCell[];
}

type LabelInterval = 'hour' | 'halfHour';

interface TimeRange {
  start: number;
  end: number;
  labelInterval?: LabelInterval;
}

interface TimelineProps<TRow extends { id: string }, TCell extends { id: string; start: string; end: string }> {
  data: TimelineData<TRow, TCell>[];
  getRowLabel: (row: TRow) => string;
  timeRange?: TimeRange;
  renderCell: (
    cell: TCell,
    row: TRow,
    isActive: boolean,
    onToggle: () => void
  ) => React.ReactNode;
}

export function Timeline<TRow extends { id: string }, TCell extends { id: string; start: string; end: string }>({
  data,
  getRowLabel,
  renderCell,
  timeRange = { start: 9, end: 20, labelInterval: 'hour' },
}: TimelineProps<TRow, TCell>) {
  const [activeCellKey, setActiveCellKey] = useState<string | null>(null);

  const { start: timelineStart, end: timelineEnd, labelInterval = 'hour' } = timeRange;

  // position 계산을 직접 수행 (UI 책임)
  const totalMinutes = (timelineEnd - timelineStart) * 60;

  const calculatePosition = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return ((h - timelineStart) * 60 + m) / totalMinutes * 100;
  };

  // colLabels 자동 생성
  const colLabels = useMemo(() => {
    const labels: string[] = [];
    for (let h = timelineStart; h <= timelineEnd; h++) {
      labels.push(`${String(h).padStart(2, '0')}:00`);
      if (labelInterval === 'halfHour' && h < timelineEnd) {
        labels.push(`${String(h).padStart(2, '0')}:30`);
      }
    }
    return labels;
  }, [timelineStart, timelineEnd, labelInterval]);

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
          label={getRowLabel(item.row)}
          isFirst={index === 0}
        >
          {item.cells.map((cell) => {
            const isActive = activeCellKey === cell.id;
            const left = calculatePosition(cell.start);
            const width = calculatePosition(cell.end) - left;

            return (
              <TimelineCell
                key={cell.id}
                position={{ left, width }}
              >
                {renderCell(
                  cell,
                  item.row,
                  isActive,
                  () => setActiveCellKey(isActive ? null : cell.id)
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
