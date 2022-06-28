import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  useHistory,
  useLocation,
  Redirect,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { successToast } from '../common/global';
import baseUrl from '../Base Url/baseUrl';
import { ToastContainer, toast } from 'react-toastify';

const Customer = () => {
  const [customerData, setCustomerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ledgerSortFlag, setLedgerSortFlag] = useState(0);
  const [customerIdSortFlag, setCustomerIdSortFlag] = useState(1);
  const [phoneSortFlag, setPhoneSortFlag] = useState(0);
  const [balanceSortFlag, setBalanceSortFlag] = useState(0);

  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadedError, setDataLoadedError] = useState(false);
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false);
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);

  const [custIdDropDownFlag, setCustIdDropDownFlag] = useState(true);
  const [custNameDropDownFlag, setCustNameDropDownFlag] = useState(true);
  const [phoneDropDownFlag, setPhoneDropDownFlag] = useState(true);
  const [balanceDropDownFlag, setBalanceDropDownFlag] = useState(true);

  const [dropdownFlag, setDropdownFlag] = useState(false);

  let url = baseUrl.url;

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(customerData.length / usersPerPage);

  // console.log(
  //   'pagesVisited',
  //   pagesVisited,
  //   '',
  //   'pageCount',
  //   pageCount,
  //   'pageNumber',
  //   pageNumber
  // );

  function addCommas(nStr) {
    return format(parseFloat(nStr));
  }

  const format = (num, decimals) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const displayUsers = customerData
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (
        val.ledger_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        //    let k = val.ledger_name;
        //    let i  = val.ac_group;
        // if(k==searchTerm)
        // {
        //   return val;
        // }

        // else if(i==searchTerm)
        // {
        //
        // }
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.id} role="row" className="odd">
          {custIdDropDownFlag && (
            <td align="left" className="sorting_1">
              {item.account_id}
              {/* <a href="view_statement.php?id=30">Cash </a> */}
            </td>
          )}
          {custNameDropDownFlag && <td align="left">{item.ledger_name}</td>}
          {phoneDropDownFlag && <td align="left">{item.mobile}</td>}
          {balanceDropDownFlag && (
            <td align="right">{addCommas(item.amount)}</td>
          )}
        </tr>
      );
    });

  // console.log('displayUsers', displayUsers);

  const displayUsersOnSearch = customerData
    // .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (
        val.ledger_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        //    let k = val.ledger_name;
        //    let i  = val.ac_group;
        // if(k==searchTerm)
        // {
        //   return val;
        // }

        // else if(i==searchTerm)
        // {
        //
        // }
        return val;
      } else if (val.mobile.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (val.amount.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.id} role="row" className="odd">
          {custIdDropDownFlag && (
            <td align="left" className="sorting_1">
              {item.account_id}
              {/* <a href="view_statement.php?id=30">Cash </a> */}
            </td>
          )}
          {custNameDropDownFlag && <td align="left">{item.ledger_name}</td>}
          {phoneDropDownFlag && <td align="left">{item.mobile}</td>}
          {balanceDropDownFlag && (
            <td align="right">{addCommas(item.amount)}</td>
          )}
        </tr>
      );
    });

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    // console.log('selected', selected);
  };

  function sorting(field, type) {
    console.log(field, type);

    axios
      .get(
        url +
          `index_customer_vendorApi?grp=${'4'}&CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);

        for (let i = 0; i < data.length; i++) {
          if (data[i].account_id === null) {
            data[i].account_id = '';
          }
        }

        if (field === 'ledger_name') {
          if (type === 'ASC') {
            data.sort((a, b) => {
              let fa = a.ledger_name.toLowerCase(),
                fb = b.ledger_name.toLowerCase();

              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
            setCustomerData(data);
          } else {
            data.sort((a, b) => {
              let fa = a.ledger_name.toLowerCase(),
                fb = b.ledger_name.toLowerCase();

              if (fa > fb) {
                return -1;
              }
              if (fa < fb) {
                return 1;
              }
              return 0;
            });
            setCustomerData(data);
          }
        }

        if (field === 'customerId') {
          if (type === 'ASC') {
            data.sort((a, b) => {
              let fa = a.account_id.toLowerCase(),
                fb = b.account_id.toLowerCase();

              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
            setCustomerData(data);
          } else {
            data.sort((a, b) => {
              let fa = a.account_id.toLowerCase(),
                fb = b.account_id.toLowerCase();

              if (fa > fb) {
                return -1;
              }
              if (fa < fb) {
                return 1;
              }
              return 0;
            });
            setCustomerData(data);
          }
        }

        if (field === 'balance') {
          if (type === 'ASC') {
            data.sort((a, b) => {
              let fa = parseFloat(a.amount),
                fb = parseFloat(b.amount);

              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
            setCustomerData(data);
          } else {
            data.sort((a, b) => {
              let fa = parseFloat(a.amount),
                fb = parseFloat(b.amount);

              if (fa > fb) {
                return -1;
              }
              if (fa < fb) {
                return 1;
              }
              return 0;
            });
            setCustomerData(data);
          }
        }

        if (field === 'phone') {
          if (type === 'ASC') {
            data.sort((a, b) => {
              let fa = parseFloat(a.mobile),
                fb = parseFloat(b.mobile);

              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
            setCustomerData(data);
          } else {
            data.sort((a, b) => {
              let fa = parseFloat(a.mobile),
                fb = parseFloat(b.mobile);

              if (fa > fb) {
                return -1;
              }
              if (fa < fb) {
                return 1;
              }
              return 0;
            });
            setCustomerData(data);
          }
        }

        setCustomerData(data);

        if (data.length < 1) {
          setDataLoaded(false);
        } else {
          setDataLoaded(true);
        }
        setDataLoadedError(false);
        setDataLoadedFlag(true);
      })
      .catch((err) => {
        console.log(err);
        setDataLoadedError(true);
        setDataLoadedFlag(true);
      });
  }

  function dataLoading() {
    axios
      .get(
        url +
          `index_customer_vendorApi?grp=${'4'}&CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);

        setCustomerData(data);

        if (data.length < 1) {
          setDataLoaded(false);
        } else {
          setDataLoaded(true);
        }
        setDataLoadedError(false);
        setDataLoadedFlag(true);
      })
      .catch((err) => {
        console.log(err);
        setDataLoadedError(true);
        setDataLoadedFlag(true);
      });
  }

  useEffect(() => {
    dataLoading();
  }, []);

  return (
    <div className="box box-color box-bordered red">
      <div className="box-title">
        <h3>
          <i className="fa fa-user" />
          Customers
        </h3>
      </div>
      <div className="box-content nopadding">
        <div
          id="DataTables_Table_1_wrapper"
          className="dataTables_wrapper no-footer"
        >
          <div className="ColVis">
            <button
              className="ColVis_Button ColVis_MasterButton"
              onClick={() => {
                if (dropdownFlag === true) {
                  setDropdownFlag(false);
                } else {
                  setDropdownFlag(true);
                }
              }}
            >
              <span>
                Show/hide columns <i className="fa fa-angle-down" />
              </span>
            </button>
            {dropdownFlag && (
              <ul
                className="ColVis_collection"
                style={{
                  display: 'block',
                  opacity: 1,
                  // position: 'absolute',
                  // top: '509px',
                  // left: '965px',
                }}
                align="left"
              >
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={custIdDropDownFlag && 'true'}
                      onClick={() => {
                        if (custIdDropDownFlag === true) {
                          setCustIdDropDownFlag(false);
                        } else {
                          setCustIdDropDownFlag(true);
                        }
                      }}
                    />
                    CustomerID
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={custNameDropDownFlag && 'true'}
                      onClick={() => {
                        if (custNameDropDownFlag === true) {
                          setCustNameDropDownFlag(false);
                        } else {
                          setCustNameDropDownFlag(true);
                        }
                      }}
                    />
                    Customer Name
                  </label>
                </li>

                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={phoneDropDownFlag && 'true'}
                      onClick={() => {
                        if (phoneDropDownFlag === true) {
                          setPhoneDropDownFlag(false);
                        } else {
                          setPhoneDropDownFlag(true);
                        }
                      }}
                    />
                    Phone
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={balanceDropDownFlag && 'true'}
                      onClick={() => {
                        if (balanceDropDownFlag === true) {
                          setBalanceDropDownFlag(false);
                        } else {
                          setBalanceDropDownFlag(true);
                        }
                      }}
                    />
                    Balance
                  </label>
                </li>
              </ul>
            )}
          </div>
          <div className="dataTables_length" id="DataTables_Table_1_length">
            <label>
              Show{' '}
              <select
                name="DataTables_Table_1_length"
                aria-controls="DataTables_Table_1"
                className
                onChange={(e) => {
                  setCountPerPage(e.target.value);
                  setPageNumber(0);
                  //  changePage({selected:'0'})
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>{' '}
              entries
            </label>
          </div>
          <div id="DataTables_Table_1_filter" className="dataTables_filter">
            <label>
              Search:
              <input
                type="search"
                className
                placeholder
                aria-controls="DataTables_Table_1"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </label>
          </div>
          <table
            className="table table-hover table-nomargin table-striped table-bordered dataTable dataTable-colvis no-footer"
            id="DataTables_Table_1"
            role="grid"
            aria-describedby="DataTables_Table_1_info"
            style={{ width: '100%' }}
          >
            <thead>
              <tr role="row">
                {custIdDropDownFlag && (
                  <th
                    className={
                      (customerIdSortFlag == 0 && 'sorting') ||
                      (customerIdSortFlag == 1 && 'sorting_asc') ||
                      (customerIdSortFlag == 2 && 'sorting_desc')
                    }
                    tabIndex={0}
                    aria-controls="DataTables_Table_1"
                    rowSpan={1}
                    colSpan={1}
                    aria-sort="ascending"
                    aria-label="CustomerID: activate to sort column descending"
                    style={{ width: '88.0079px' }}
                    aria-sort={
                      (customerIdSortFlag == 0 && '') ||
                      (customerIdSortFlag == 1 && ' ascending') ||
                      (customerIdSortFlag == 2 && 'descending')
                    }
                    onClick={(e) => {
                      if (customerIdSortFlag == 0) {
                        setLedgerSortFlag(0);
                        setCustomerIdSortFlag(1);
                        setPhoneSortFlag(0);
                        setBalanceSortFlag(0);

                        sorting('customerId', 'ASC');
                      }
                      if (customerIdSortFlag == 1) {
                        setCustomerIdSortFlag(2);
                        sorting('customerId', 'DESC');
                      }
                      if (customerIdSortFlag == 2) {
                        setCustomerIdSortFlag(1);
                        sorting('customerId', 'ASC');
                      }
                    }}
                  >
                    CustomerID
                  </th>
                )}

                {custNameDropDownFlag && (
                  <th
                    className={
                      (ledgerSortFlag == 0 && 'sorting') ||
                      (ledgerSortFlag == 1 && 'sorting_asc') ||
                      (ledgerSortFlag == 2 && 'sorting_desc')
                    }
                    tabIndex={0}
                    aria-controls="DataTables_Table_1"
                    rowSpan={1}
                    colSpan={1}
                    aria-label="Customer Name: activate to sort column ascending"
                    style={{ width: '117.016px' }}
                    aria-sort={
                      (ledgerSortFlag == 0 && '') ||
                      (ledgerSortFlag == 1 && ' ascending') ||
                      (ledgerSortFlag == 2 && 'descending')
                    }
                    onClick={(e) => {
                      if (ledgerSortFlag == 0) {
                        setLedgerSortFlag(1);
                        setCustomerIdSortFlag(0);
                        setPhoneSortFlag(0);
                        setBalanceSortFlag(0);

                        sorting('ledger_name', 'ASC');
                      }
                      if (ledgerSortFlag == 1) {
                        setLedgerSortFlag(2);
                        sorting('ledger_name', 'DESC');
                      }
                      if (ledgerSortFlag == 2) {
                        setLedgerSortFlag(1);
                        sorting('ledger_name', 'ASC');
                      }
                    }}
                  >
                    Customer Name
                  </th>
                )}
                {phoneDropDownFlag && (
                  <th
                    className={
                      (phoneSortFlag == 0 && 'sorting') ||
                      (phoneSortFlag == 1 && 'sorting_asc') ||
                      (phoneSortFlag == 2 && 'sorting_desc')
                    }
                    tabIndex={0}
                    aria-controls="DataTables_Table_1"
                    rowSpan={1}
                    colSpan={1}
                    aria-label="Phone: activate to sort column ascending"
                    style={{ width: '49.0159px' }}
                    aria-sort={
                      (phoneSortFlag == 0 && '') ||
                      (phoneSortFlag == 1 && ' ascending') ||
                      (phoneSortFlag == 2 && 'descending')
                    }
                    onClick={(e) => {
                      if (phoneSortFlag == 0) {
                        setLedgerSortFlag(0);
                        setCustomerIdSortFlag(0);
                        setPhoneSortFlag(1);
                        setBalanceSortFlag(0);

                        sorting('phone', 'ASC');
                      }
                      if (phoneSortFlag == 1) {
                        setPhoneSortFlag(2);
                        sorting('phone', 'DESC');
                      }
                      if (phoneSortFlag == 2) {
                        setPhoneSortFlag(1);
                        sorting('phone', 'ASC');
                      }
                    }}
                  >
                    Phone
                  </th>
                )}

                {balanceDropDownFlag && (
                  <th
                    className={
                      (balanceSortFlag == 0 && 'sorting') ||
                      (balanceSortFlag == 1 && 'sorting_asc') ||
                      (balanceSortFlag == 2 && 'sorting_desc')
                    }
                    tabIndex={0}
                    aria-controls="DataTables_Table_1"
                    rowSpan={1}
                    colSpan={1}
                    aria-label="Balance: activate to sort column ascending"
                    style={{ width: '59.0079px' }}
                    aria-sort={
                      (balanceSortFlag == 0 && '') ||
                      (balanceSortFlag == 1 && ' ascending') ||
                      (balanceSortFlag == 2 && 'descending')
                    }
                    onClick={(e) => {
                      if (balanceSortFlag == 0) {
                        setLedgerSortFlag(0);
                        setCustomerIdSortFlag(0);
                        setPhoneSortFlag(0);
                        setBalanceSortFlag(1);

                        sorting('balance', 'ASC');
                      }
                      if (balanceSortFlag == 1) {
                        setBalanceSortFlag(2);
                        sorting('balance', 'DESC');
                      }
                      if (balanceSortFlag == 2) {
                        setBalanceSortFlag(1);
                        sorting('balance', 'ASC');
                      }
                    }}
                  >
                    Balance
                  </th>
                )}
              </tr>
            </thead>
            {searchTerm == '' && <tbody>{displayUsers}</tbody>}

            {searchTerm !== '' && <tbody>{displayUsersOnSearch}</tbody>}
          </table>

          <div
            className="dataTables_info"
            id="DataTables_Table_0_info"
            role="status"
            aria-live="polite"
          >
            {!dataLoadedError ? (
              !dataLoaded ? (
                <h4>No data fetch</h4>
              ) : (
                <>
                  Showing {pagesVisited * 1 + 1} to{' '}
                  {customerData.length - pagesVisited < parseInt(usersPerPage)
                    ? pagesVisited + (customerData.length - pagesVisited)
                    : pagesVisited * 1 + parseInt(usersPerPage)}{' '}
                  of {customerData.length} entries
                </>
              )
            ) : (
              <h4>Error on data fetch</h4>
            )}
          </div>
          {dataLoaded && (
            <div
              className="dataTables_paginate paging_simple_numbers"
              id="DataTables_Table_0_paginate"
            >
              <ReactPaginate
                previousLabel={' Previous'}
                nextLabel={'Next'}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={'paginationBttns'}
                previousLinkClassName={'paginate_button previous disabled'}
                nextLinkClassName={'paginate_button next disabled'}
                activeClassName={'paginationActive'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customer;
