import { colors } from '_tosslib/constants/colors';
import { css } from '@emotion/react';

export function Header({children} : {children: React.ReactNode}) {
  return <header 
    css={css`
      padding: 0 24px;
      font-size: 22px;
      line-height: 31px;
      color: ${colors.grey900};
      word-break: keep-all;
      white-space: pre-line;
      font-weight: bold;
    `}
  >
    {children}
  </header>
}
