import { css } from '@emotion/react';
import type { Equipment } from '_tosslib/server/types';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS } from '../constants';

interface MultiSelectProps {
  value: Equipment[];
  data: readonly Equipment[];
  onChange: (value: Equipment[]) => void;
}

export function MultiSelect({ value, data, onChange }: MultiSelectProps) {
  return (
    <div css={css`display: flex; gap: 8px; flex-wrap: wrap;`}>
      {data.map((equipment) => {
        const isSelected = value.includes(equipment);

        return (
          <button
            key={equipment}
            type="button"
            aria-label={EQUIPMENT_LABELS[equipment]}
            aria-pressed={isSelected}
            onClick={() => {
              const nextValue = isSelected
                ? value.filter((item) => item !== equipment)
                : [...value, equipment];
              onChange(nextValue);
            }}
            css={css`
              padding: 8px 16px;
              border-radius: 20px;
              border: 1px solid ${isSelected ? colors.blue500 : colors.grey200};
              background: ${isSelected ? colors.blue50 : colors.grey50};
              color: ${isSelected ? colors.blue600 : colors.grey700};
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.15s;

              &:hover {
                border-color: ${isSelected ? colors.blue500 : colors.grey400};
              }
            `}
          >
            {EQUIPMENT_LABELS[equipment]}
          </button>
        );
      })}
    </div>
  );
}
