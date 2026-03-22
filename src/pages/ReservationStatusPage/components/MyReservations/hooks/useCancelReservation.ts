import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelReservation } from 'pages/remotes';

/**
 * 예약을 취소합니다.
 */
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) => cancelReservation(reservationId),
    onMutate: async (reservationId) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ['myReservations'] });

      const previous = queryClient.getQueryData(['myReservations']);

      queryClient.setQueryData(['myReservations'], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter((r) => r.id !== reservationId);
      });

      return { previous };
    },
    onError: (err, variables, context: any) => {
      // 에러 시 롤백
      if (context?.previous) {
        queryClient.setQueryData(['myReservations'], context.previous);
      }
    },
    onSettled: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}
