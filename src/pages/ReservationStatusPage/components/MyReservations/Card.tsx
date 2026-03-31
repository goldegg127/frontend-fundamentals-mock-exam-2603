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
  onClick?: (e: React.MouseEvent) => void;
}

Card.CancelButton = function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <Button type="danger" style="weak" size="small" onClick={onClick}>
      취소
    </Button>
  );
};
