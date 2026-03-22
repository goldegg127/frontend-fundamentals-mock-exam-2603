import { css } from '@emotion/react';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { DatePicker } from './components/DatePicker';
import { ReservationTimeline } from './components/ReservationTimeline';
import { MyReservations } from './components/MyReservations';
import { getTodayString } from './utils/formatDate';
import { Divider } from '../../shared/components/Divider';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  return (
    <main css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <header>
        <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
          회의실 예약
        </Top.Top03>
      </header>

      <section>
        <Spacing size={24} />
        
        <div css={css`padding: 0 24px;`}>
          <DatePicker title='날짜 선택' value={selectedDate} onChange={setSelectedDate} min={getTodayString()} />
        </div>

        <Divider />
        
        <div css={css`padding: 0 24px;`}>
          <Suspense fallback={<div>로딩 중...</div>}>
            <ReservationTimeline title='예약 현황' date={selectedDate} />
          </Suspense>
        </div>

        <Divider />
        
        <div css={css`padding: 0 24px;`}>
          <Suspense fallback={<div>로딩 중...</div>}>
            <MyReservations title='내 예약' />
          </Suspense>
        </div>

        <Divider />
        
        <div css={css`padding: 0 24px;`}>
          <Button display="full" onClick={() => navigate('/booking')}>
            예약하기
          </Button>
        </div>

        <Spacing size={24} />
      </section>
    </main>
  );
}
