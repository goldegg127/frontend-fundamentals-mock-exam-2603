import { Button } from '_tosslib/components';
import type { ReactNode } from 'react';

interface CtaButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export function CtaButton({ children, onClick }: CtaButtonProps) {
  return (
    <Button display="full" onClick={onClick}>
      {children}
    </Button>
  );
}
