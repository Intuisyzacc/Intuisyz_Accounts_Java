import { Request } from '../utils';

export const trial_balance = async (data) => {
  const result = await Request.get('trial_balance', data);
  return result;
};

export const trial_balance_total = async (data) => {
  const result = await Request.get('trial_balance_total', data);
  return result;
};

export const trial_balanceBnDates = async (data) => {
  const result = await Request.get('trial_balanceBnDates', data);
  return result;
};

export const trial_balance_totalBnDates = async (data) => {
  const result = await Request.get('trial_balance_totalBnDates', data);
  return result;
};
