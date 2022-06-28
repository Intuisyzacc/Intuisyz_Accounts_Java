import { Request } from '../utils';

// export const list_account_statement = async (data) => {
//   const result = await Request.get('list_account_statement', data);
//   return result;
// };

export const ledger_searchAc = async (data) => {
  const result = await Request.get('ledger_search', data);
  return result;
};

export const list_account_statement_transaction = async (data) => {
  const result = await Request.get('list_account_statement_transaction', data);
  return result;
};
