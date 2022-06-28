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
import Customer from './customer';
import Vendor from './vendor';
import Headers from '../Header/Headers';

const Index = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ledgerSortFlag, setLedgerSortFlag] = useState(1);
  const [acTypeSortFlag, setAcTypeSortFlag] = useState(0);
  const [closingBalanceSortFlag, setClosingBalanceSortFlag] = useState(0);

  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadedError, setDataLoadedError] = useState(false);
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false);
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);

  const [descriptionDropDownFlag, setDescriptionDropDownFlag] = useState(true);
  const [acTypeDropDownFlag, setAcTypeDropDownFlag] = useState(true);
  const [balanceDropDownFlag, setBalanceDropDownFlag] = useState(true);

  const [dropdownFlag, setDropdownFlag] = useState(false);

  let url = baseUrl.url;

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(ledgerData.length / usersPerPage);

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

  const displayUsers = ledgerData
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
          {descriptionDropDownFlag && (
            <td align="left" className="sorting_1">
              {item.ledger_name}
              {/* <a href="view_statement.php?id=30">Cash </a> */}
            </td>
          )}
          {acTypeDropDownFlag && (
            <td align="left">
              {item.ac_type === '1'
                ? 'Asset'
                : item.ac_type === '2'
                ? 'Liability'
                : item.ac_type === '3'
                ? 'Income'
                : item.ac_type === '4'
                ? 'Expense'
                : ''}
            </td>
          )}
          {balanceDropDownFlag && (
            <td align="right">
              {addCommas(item.amount)}{' '}
              {(item.contact === 'Liability' || item.contact === 'Income') &&
                '- Debit'}
              {(item.contact === 'Asset' || item.contact === 'Expense') &&
                '- Credit'}
            </td>
          )}
        </tr>
      );
    });

  // console.log('displayUsers', displayUsers);

  const displayUsersOnSearch = ledgerData
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
      } else if (val.contact.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (val.amount.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.id} role="row" className="odd">
          {descriptionDropDownFlag && (
            <td align="left" className="sorting_1">
              {item.ledger_name}
              {/* <a href="view_statement.php?id=30">Cash </a> */}
            </td>
          )}

          {acTypeDropDownFlag && (
            <td align="left">
              {/* {item.ac_type === '1'
              ? 'Asset'
              : item.ac_type === '2'
              ? 'Liability'
              : item.ac_type === '3'
              ? 'Income'
              : item.ac_type === '4'
              ? 'Expense'
              : ''} */}
              {item.contact}
            </td>
          )}
          {balanceDropDownFlag && (
            <td align="right">
              {addCommas(item.amount)}{' '}
              {(item.contact === 'Liability' || item.contact === 'Income') &&
                '- Debit'}
              {(item.contact === 'Asset' || item.contact === 'Expense') &&
                '- Credit'}
            </td>
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
          `list_ledger?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);

        for (let i = 0; i < data.length; i++) {
          if (data[i].ac_type === '1') {
            data[i].contact = 'Asset';
          } else if (data[i].ac_type === '2') {
            data[i].contact = 'Liability';
          } else if (data[i].ac_type === '3') {
            data[i].contact = 'Income';
          } else if (data[i].ac_type === '4') {
            data[i].contact = 'Expense';
          } else {
            data[i].contact = '';
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
            setLedgerData(data);
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
            setLedgerData(data);
          }
        }

        if (field === 'acType') {
          if (type === 'ASC') {
            data.sort((a, b) => {
              let fa = a.contact.toLowerCase(),
                fb = b.contact.toLowerCase();

              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
            setLedgerData(data);
          } else {
            data.sort((a, b) => {
              let fa = a.contact.toLowerCase(),
                fb = b.contact.toLowerCase();

              if (fa > fb) {
                return -1;
              }
              if (fa < fb) {
                return 1;
              }
              return 0;
            });
            setLedgerData(data);
          }
        }

        if (field === 'closing balance') {
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
            setLedgerData(data);
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
            setLedgerData(data);
          }
        }

        setLedgerData(data);

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
          `list_ledger?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);

        if (data.length > 0) {
          if (
            data[0].ledger_date === null ||
            data[0].ledger_date === undefined
          ) {
            localStorage.setItem('migrationDate', '');
          } else {
            localStorage.setItem('migrationDate', data[0].ledger_date);
          }
        }

        for (let i = 0; i < data.length; i++) {
          if (data[i].ac_type === '1') {
            data[i].contact = 'Asset';
          } else if (data[i].ac_type === '2') {
            data[i].contact = 'Liability';
          } else if (data[i].ac_type === '3') {
            data[i].contact = 'Income';
          } else if (data[i].ac_type === '4') {
            data[i].contact = 'Expense';
          } else {
            data[i].contact = '';
          }
        }

        setLedgerData(data);

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
  let history = useHistory();

  useEffect(() => {
    console.log('window.location.pathname', window.location.hash);

    if (window.location.hash === '#/') {
      window.addEventListener('popstate', (e) => {
        // Nope, go back to your page
        history.go(1);
      });
    }
    if (sessionStorage.getItem('logDetails') === 'true') {
      dataLoading();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  return (
    <div>
      <Headers />
      <div className="row">
        <div className="col-sm-12">
          <div className="box box-bordered box-color lightgrey">
            <div className>
              <h3 align="center">Accounts Dashboard</h3>
            </div>

            <div id className="col-sm-1" />
            {/* <div id="note" className="col-sm-10">
              <img src="images/noti.png" style={{ height: '35px' }} />
              <label id="wrn">
                <a
                  className="link"
                  href="payable.php"
                  style={{ textDecoration: 'none' }}
                >
                  Today you have matured cheques.{' '}
                </a>
              </label>
              <a id="close" />
            </div> */}
            <div id className="col-sm-1" />

            <div className="box-content nopadding">
              <div className="tabs-container">
                <ul
                  className="tabs tabs-inline tabs-left"
                  style={{ width: '180px ! important' }}
                >
                  <li className="active">
                    <a href="#first" data-toggle="tab">
                      <i className="fa fa-globe" />
                      Business Status
                    </a>
                  </li>
                  <li>
                    <a href="#second" data-toggle="tab">
                      <i className="fa fa-user" />
                      Vendor &amp; Purchases
                    </a>
                  </li>
                  <li>
                    <a href="#thirds" data-toggle="tab">
                      <i className="fa fa-twitter" />
                      Customer &amp; Sales
                    </a>
                  </li>
                </ul>
              </div>
              <div
                className="tab-content padding tab-content-inline"
                style={{ marginLeft: '180px ! important' }}
              >
                {/* First ***************************************************************************/}
                <div className="tab-pane active" id="first">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="box box-color box-bordered red">
                        <div className="box-title">
                          <h3>
                            <i className="fa fa-user" />
                            Account Balances
                          </h3>
                        </div>
                        <div className="box-content nopadding">
                          <div
                            id="DataTables_Table_0_wrapper"
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
                                  Show/hide columns{' '}
                                  <i className="fa fa-angle-down" />
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
                                        checked={
                                          descriptionDropDownFlag && 'true'
                                        }
                                        onClick={() => {
                                          if (
                                            descriptionDropDownFlag === true
                                          ) {
                                            setDescriptionDropDownFlag(false);
                                          } else {
                                            setDescriptionDropDownFlag(true);
                                          }
                                        }}
                                      />
                                      Account Descriptions
                                    </label>
                                  </li>
                                  <li>
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={acTypeDropDownFlag && 'true'}
                                        onClick={() => {
                                          if (acTypeDropDownFlag === true) {
                                            setAcTypeDropDownFlag(false);
                                          } else {
                                            setAcTypeDropDownFlag(true);
                                          }
                                        }}
                                      />
                                      Account Type
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
                                      Closing Balance
                                    </label>
                                  </li>
                                </ul>
                              )}
                            </div>
                            <div
                              className="dataTables_length"
                              id="DataTables_Table_0_length"
                            >
                              <label>
                                Show{' '}
                                <select
                                  name="DataTables_Table_0_length"
                                  aria-controls="DataTables_Table_0"
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
                            <div
                              id="DataTables_Table_0_filter"
                              className="dataTables_filter"
                            >
                              <label>
                                Search:
                                <input
                                  type="search"
                                  className
                                  placeholder
                                  aria-controls="DataTables_Table_0"
                                  onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                  }}
                                />
                              </label>
                            </div>
                            <table
                              className="table table-hover table-nomargin table-striped table-bordered dataTable dataTable-colvis no-footer"
                              id="DataTables_Table_0"
                              role="grid"
                              aria-describedby="DataTables_Table_0_info"
                              // style={{ width: '843px' }}
                            >
                              <thead>
                                <tr role="row">
                                  {descriptionDropDownFlag && (
                                    <th
                                      className={
                                        (ledgerSortFlag == 0 && 'sorting') ||
                                        (ledgerSortFlag == 1 &&
                                          'sorting_asc') ||
                                        (ledgerSortFlag == 2 && 'sorting_desc')
                                      }
                                      tabIndex={0}
                                      aria-controls="DataTables_Table_0"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Account Descriptions: activate to sort column descending"
                                      style={{ width: '295px' }}
                                      aria-sort={
                                        (ledgerSortFlag == 0 && '') ||
                                        (ledgerSortFlag == 1 && ' ascending') ||
                                        (ledgerSortFlag == 2 && 'descending')
                                      }
                                      onClick={(e) => {
                                        if (ledgerSortFlag == 0) {
                                          setLedgerSortFlag(1);
                                          setAcTypeSortFlag(0);
                                          setClosingBalanceSortFlag(0);

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
                                      Account Descriptions
                                    </th>
                                  )}
                                  {acTypeDropDownFlag && (
                                    <th
                                      className={
                                        (acTypeSortFlag == 0 && 'sorting') ||
                                        (acTypeSortFlag == 1 &&
                                          'sorting_asc') ||
                                        (acTypeSortFlag == 2 && 'sorting_desc')
                                      }
                                      tabIndex={0}
                                      aria-controls="DataTables_Table_0"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Account Type: activate to sort column ascending"
                                      style={{ width: '201px' }}
                                      aria-sort={
                                        (acTypeSortFlag == 0 && '') ||
                                        (acTypeSortFlag == 1 && ' ascending') ||
                                        (acTypeSortFlag == 2 && 'descending')
                                      }
                                      onClick={(e) => {
                                        if (acTypeSortFlag == 0) {
                                          setLedgerSortFlag(0);
                                          setAcTypeSortFlag(1);
                                          setClosingBalanceSortFlag(0);
                                          sorting('acType', 'ASC');
                                        }
                                        if (acTypeSortFlag == 1) {
                                          setAcTypeSortFlag(2);
                                          sorting('acType', 'DESC');
                                        }
                                        if (acTypeSortFlag == 2) {
                                          setAcTypeSortFlag(1);
                                          sorting('acType', 'ASC');
                                        }
                                      }}
                                    >
                                      Account Type
                                    </th>
                                  )}

                                  {balanceDropDownFlag && (
                                    <th
                                      className={
                                        (closingBalanceSortFlag == 0 &&
                                          'sorting') ||
                                        (closingBalanceSortFlag == 1 &&
                                          'sorting_asc') ||
                                        (closingBalanceSortFlag == 2 &&
                                          'sorting_desc')
                                      }
                                      tabIndex={0}
                                      aria-controls="DataTables_Table_0"
                                      rowSpan={1}
                                      colSpan={1}
                                      aria-label="Closing Balance: activate to sort column ascending"
                                      style={{ width: '228px' }}
                                      aria-sort={
                                        (closingBalanceSortFlag == 0 && '') ||
                                        (closingBalanceSortFlag == 1 &&
                                          ' ascending') ||
                                        (closingBalanceSortFlag == 2 &&
                                          'descending')
                                      }
                                      onClick={(e) => {
                                        if (closingBalanceSortFlag == 0) {
                                          setLedgerSortFlag(0);
                                          setAcTypeSortFlag(0);
                                          setClosingBalanceSortFlag(1);
                                          sorting('closing balance', 'ASC');
                                        }
                                        if (closingBalanceSortFlag == 1) {
                                          setClosingBalanceSortFlag(2);
                                          sorting('closing balance', 'DESC');
                                        }
                                        if (closingBalanceSortFlag == 2) {
                                          setClosingBalanceSortFlag(1);
                                          sorting('closing balance', 'ASC');
                                        }
                                      }}
                                    >
                                      Closing Balance
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              {searchTerm == '' && (
                                <tbody>{displayUsers}</tbody>
                              )}

                              {searchTerm !== '' && (
                                <tbody>{displayUsersOnSearch}</tbody>
                              )}
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
                                    {ledgerData.length - pagesVisited <
                                    parseInt(usersPerPage)
                                      ? pagesVisited +
                                        (ledgerData.length - pagesVisited)
                                      : pagesVisited * 1 +
                                        parseInt(usersPerPage)}{' '}
                                    of {ledgerData.length} entries
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
                                  previousLinkClassName={
                                    'paginate_button previous disabled'
                                  }
                                  nextLinkClassName={
                                    'paginate_button next disabled'
                                  }
                                  activeClassName={'paginationActive'}
                                />
                              </div>
                            )}
                          </div>

                          {/* <table className="table table-hover table-nomargin table-striped table-bordered dataTable dataTable-colvis">
                            <thead>
                              <tr>
                                <th>Account Descriptions</th>
                                <th>Account Type</th>
                                <th>Closing Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td align="left"></td>
                                <td align="left"></td>
                                <td align="right"></td>
                              </tr>
                            </tbody>
                          </table> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-6">
                      <Customer />
                      {/* <div className="box box-color box-bordered red">
                        <div className="box-title">
                          <h3>
                            <i className="fa fa-user" />
                            Customers
                          </h3>
                        </div>
                        <div className="box-content nopadding">
                          <table className="table table-hover table-nomargin table-striped table-bordered dataTable dataTable-colvis">
                            <thead>
                              <tr>
                                <th>CustomerID</th>
                                <th>Customer Name</th>
                                <th className="hidden-350">Phone</th>
                                <th className="hidden-1024">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                    <div className="col-sm-6">
                      <Vendor />
                      {/* <div className="box box-color box-bordered red">
                        <div className="box-title">
                          <h3>
                            <i className="fa fa-user" />
                            Vendors
                          </h3>
                        </div>
                        <div className="box-content nopadding">
                          <table className="table table-hover table-nomargin table-striped table-bordered dataTable dataTable-colvis">
                            <thead>
                              <tr>
                                <th>VendorID</th>
                                <th>Vendor Name</th>
                                <th className="hidden-350">Phone</th>
                                <th className="hidden-1024">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="box box-color green box-small box-bordered">
                        <div className="box-title">
                          <h5>
                            <i className="fa fa-bars" />
                            Customer Aged Receivables
                          </h5>
                        </div>
                      </div>
                      <div className="box-content">
                        <img
                          alt="Pie chart"
                          src="generated/2.png"
                          className="img-responsive"
                          style={{ border: '1px solid gray', width: '700px' }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="box box-color green box-small box-bordered">
                        <div className="box-title">
                          <h5>
                            <i className="fa fa-bars" />
                            Vendor Aged Payables
                          </h5>
                        </div>
                      </div>
                      <div className="box-content">
                        <img
                          alt="Pie chart"
                          src="generated/1.png"
                          className="img-responsive"
                          style={{ border: '1px solid gray', width: '700px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="second">
                  <div className="row">
                    <div className="col-sm-12">
                      <Vendor />
                      {/* <div className="box box-color box-bordered red">
                        <div className="box-title">
                          <h3>
                            <i className="fa fa-user" />
                            Vendors
                          </h3>
                        </div>
                        <div className="box-content nopadding">
                          <table className="table table-hover table-nomargin table-striped table-bordered dataTable dataTable-colvis">
                            <thead>
                              <tr>
                                <th>VendorID</th>
                                <th>Vendor Name</th>
                                <th className="hidden-350">Phone</th>
                                <th className="hidden-1024">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                    <div className="col-sm-"></div>
                    <div className="col-sm-12">
                      <div className="box box-color green box-small box-bordered">
                        <div className="box-title">
                          <h5>
                            <i className="fa fa-bars" />
                            Vendor Aged Payables
                          </h5>
                        </div>
                      </div>
                      <div className="box-content">
                        <img
                          alt="Pie chart"
                          src="generated/1.png"
                          className="img-responsive"
                          style={{ border: '1px solid gray', width: '700px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="thirds">
                  <div className="row">
                    <div className="col-sm-12">
                      <Customer />
                      {/* <div className="box box-color box-bordered red">
                        <div className="box-title">
                          <h3>
                            <i className="fa fa-user" />
                            Customers
                          </h3>
                        </div>
                        <div className="box-content nopadding">
                          <table className="table table-hover table-nomargin table-striped table-bordered dataTable dataTable-colvis">
                            <thead>
                              <tr>
                                <th>CustomerID</th>
                                <th>Customer Name</th>
                                <th className="hidden-350">Phone</th>
                                <th className="hidden-1024">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                    </div>
                    <div className="col-sm-"></div>
                    <div className="col-sm-12">
                      <div className="box box-color green box-small box-bordered">
                        <div className="box-title">
                          <h5>
                            <i className="fa fa-bars" />
                            Customer Aged receivables
                          </h5>
                        </div>
                      </div>
                      <div className="box-content">
                        <img
                          alt="Pie chart"
                          src="generated/2.png"
                          className="img-responsive"
                          style={{ border: '1px solid gray', width: '700px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
