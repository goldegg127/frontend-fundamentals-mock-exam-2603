import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKey, cancelReservationMutationOptions } from "../../queries";

/**
 * 예약을 취소합니다.
 */
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...cancelReservationMutationOptions(),
    onMutate: async (reservationId) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: [queryKey.MyReservations] });

      const previous = queryClient.getQueryData([queryKey.MyReservations]);

      queryClient.setQueryData([queryKey.MyReservations], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter((r) => r.id !== reservationId);
      });

      return { previous };
    },
    onError: (_err, _variables, context: any) => {
      // 에러 시 롤백
      if (context?.previous) {
        queryClient.setQueryData([queryKey.MyReservations], context.previous);
      }
    },
    onSettled: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [queryKey.MyReservations] });
      queryClient.invalidateQueries({ queryKey: [queryKey.reservations] });
    },
  });
}
