import {
  createEnumDelimitedArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from 'serialize-query-params';
import { getTodayString } from '../shared/utils/formatDate';
import { ALL_EQUIPMENT } from './constants';

export const bookingFilterQueryParams = {
  date: withDefault(StringParam, getTodayString()),
  startTime: withDefault(StringParam, ''),
  endTime: withDefault(StringParam, ''),
  attendees: withDefault(NumberParam, 1),
  equipment: withDefault(createEnumDelimitedArrayParam([...ALL_EQUIPMENT]), []),
  floor: NumberParam,
};
