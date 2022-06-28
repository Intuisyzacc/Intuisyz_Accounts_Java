import { Request } from '../utils';

export const balanceSheetDataBnDates = async (data) => {
  const result = await Request.get('balanceSheetDataBnDates', data);
  return result;
};

export const balanceSheetProfitLossDataBnDates = async (data) => {
  const result = await Request.get('balanceSheetProfitLossDataBnDates', data);
  return result;
};
