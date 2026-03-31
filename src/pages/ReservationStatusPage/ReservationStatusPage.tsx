import { css } from '@emotion/react';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getTodayString } from './utils/formatDate';
import { Divider } from '../../shared/components/Divider';
import { DatePicker } from './components/DatePicker';
import { Timeline } from './components/Timeline';
import { CtaButton } from './components/CtaButton';
import { MyReservations } from "./components/MyReservations";

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Spacing size={24} />

      <Header>
        <h1>회의실 예약</h1>
      </Header>

      <Spacing size={24} />

      <Section>
        <h2>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            날짜 선택
          </Text>
        </h2>

        <Spacing size={16} />

        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          min={getTodayString()}
        />
      </Section>

      <Divider />

      <Section>
        <h2>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            예약 현황
          </Text>
        </h2>

        <Spacing size={16} />

        <Suspense fallback={<div>로딩 중...</div>}>
          <Timeline selected={selectedDate} />
        </Suspense>
      </Section>

      <Divider />

      <Section>
        <h2>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>
        </h2>

        <Spacing size={16} />

        <Suspense fallback={<div>로딩 중...</div>}>
          <MyReservations />
        </Suspense>
      </Section>

      <Divider />

      <Section>
        <CtaButton onClick={() => navigate('/booking')}>
          예약하기
        </CtaButton>
      </Section>

      <Spacing size={24} />
    </div>
  );
}

function Header({children} : {children: React.ReactNode}) {
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

function Section({children} : {children: React.ReactNode}) {
  return <section css={css`padding: 0 24px;`}>
    {children}
  </section>
}
