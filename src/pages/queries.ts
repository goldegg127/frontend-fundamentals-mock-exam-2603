import { queryOptions } from '@tanstack/react-query';
import { mutationOptions } from '@suspensive/react-query';
import {
  getRooms,
  getReservations,
  getMyReservations,
  cancelReservation,
  createReservation,
} from 'pages/remotes';

export const queryKey = {
  rooms: 'rooms',
  reservations: 'reservations',
  MyReservations: 'my-reservations',
}

export const roomsQueryOptions = () => queryOptions(
  {
    queryKey: [queryKey.rooms],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5,
  }
);

export const reservationsQueryOptions = (yymmdd: string) => queryOptions(
  {
    queryKey: [queryKey.reservations, yymmdd],
    queryFn: () => getReservations(yymmdd),
    staleTime: 1000 * 60 * 1,
  }
);

export const myReservationsQueryOptions = () => queryOptions(
  {
    queryKey: [queryKey.MyReservations],
    queryFn: getMyReservations,
    staleTime: 1000 * 60 * 1,
  }
);

export const cancelReservationMutationOptions = () => mutationOptions({
  mutationFn: (reservationId: string) => cancelReservation(reservationId),
});

export const createReservationMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: Parameters<typeof createReservation>[0]) => createReservation(data),
  });
