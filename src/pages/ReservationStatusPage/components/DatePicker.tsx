import { css } from '@emotion/react';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  min?: string;
  title: string;
}

export function DatePicker({ value, onChange, min, title }: DatePickerProps) {
  return (
    <section aria-labelledby="date-picker-label">
      <header>
        <Text
          id="date-picker-label"
          typography="t5"
          fontWeight="bold"
          color={colors.grey900}
        >
          {title}
        </Text>
      </header>

      <Spacing size={16} />
      
      <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          aria-label={title}
          css={css`
            box-sizing: border-box;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.5;
            height: 48px;
            background-color: ${colors.grey50};
            border-radius: 12px;
            color: ${colors.grey800};
            width: 100%;
            border: 1px solid ${colors.grey200};
            padding: 0 16px;
            outline: none;
            transition: border-color 0.15s;
            &:focus {
              border-color: ${colors.blue500};
            }
          `}
        />
      </div>
    </section>
  );
}
