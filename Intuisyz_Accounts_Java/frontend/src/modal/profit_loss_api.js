import { Request } from '../utils';

export const profit_loss = async (data) => {
  const result = await Request.get('profit_loss', data);
  return result;
};

export const profit_loss_bn_date = async (data) => {
  const result = await Request.get('profit_loss_bn_date', data);
  return result;
};
