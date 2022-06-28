import { Request } from '../utils';

export const list_account_statement = async (data) => {
  const result = await Request.get(
    `list_account_statement?CompanyName=${sessionStorage.getItem(
      'CompanyName'
    )}&CustId=${sessionStorage.getItem('CustId')}`,
    data
  );
  return result;
};

export const ledger_search = async (data) => {
  const result = await Request.get('ledger_search', data);
  return result;
};

export const grp_by_id = async (data) => {
  const result = await Request.get('grp_by_id', data);
  return result;
};

export const list_acTitle = async (data) => {
  const result = await Request.get('list_acTitle', data);
  return result;
};
