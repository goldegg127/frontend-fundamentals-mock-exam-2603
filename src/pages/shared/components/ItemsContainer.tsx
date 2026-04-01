import { css } from '@emotion/react';

export function ItemsContainer({children} : {children: React.ReactNode}) {
  return (
    <ul 
      css={css`
        list-style: none; 
        padding: 0; 
        margin: 0; 
        display: flex; 
        flex-direction: column; 
        gap: 10px;`
      }>
      {children}
    </ul>
  );
}
