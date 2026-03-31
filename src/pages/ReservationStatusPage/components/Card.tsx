import { css } from '@emotion/react';
import { Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { ReactNode } from 'react';

interface CardProps {
  top: string;
  bottom: string;
  right?: ReactNode;
}

export function Card({ top, bottom, right }: CardProps) {
  return (
    <article
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-radius: 14px;
        background: ${colors.grey50};
        border: 1px solid ${colors.grey200};
      `}
    >
      <div css={css`flex: 1; min-width: 0;`}>
        <div
          css={css`
            font-size: 15px;
            font-weight: bold;
            color: ${colors.grey900};
            margin-bottom: 4px;
          `}
        >
          {top}
        </div>
        <div
          css={css`
            font-size: 13px;
            color: ${colors.grey600};
          `}
        >
          {bottom}
        </div>
      </div>
      
      {right && (
        <div css={css`margin-left: 12px; flex-shrink: 0;`}>
          {right}
        </div>
      )}
    </article>
  );
}

interface CancelButtonProps {
  label?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

Card.CancelButton = function CancelButton({ label = '취소', onClick, disabled }: CancelButtonProps) {
  return (
    <Button type="danger" style="weak" size="small" onClick={onClick} disabled={disabled}>
      {label}
    </Button>
  );
};

Card.Empty = function () {
  return (
    <div
      css={css`
        padding: 40px 0;
        text-align: center;
        background: ${colors.grey50};
        border-radius: 14px;
        color: ${colors.grey500};
      `}
    >
      예약 내역이 없습니다.
  </div>
  );
}

Card.Loading = function () {
  return <div>로딩 중...</div>;
}

Card.Error = function () {
  return <div>에러가 발생했습니다. 다시 시도해주세요.</div>;
}
