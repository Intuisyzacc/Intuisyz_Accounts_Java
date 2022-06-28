import { Request } from '../utils';

export const cashBookData = async (data) => {
  const result = await Request.get('cashBookData', data);
  return result;
};

export const cashBookBnDates = async (data) => {
  const result = await Request.get('cashBookBnDates', data);
  return result;
};
