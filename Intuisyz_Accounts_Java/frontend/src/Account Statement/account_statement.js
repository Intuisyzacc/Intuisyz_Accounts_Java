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
import {
  grp_by_id,
  ledger_search,
  list_account_statement,
  list_acTitle,
} from '../modal';
import PageLoader from '../Page Loader/pageloader';
import Headers from '../Header/Headers';

const Account_statement = () => {
  let history = useHistory();
  let url = baseUrl.url;

  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [accountStatementData, setAccountStatementData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [dataLoadedError, setDataLoadedError] = useState(false);
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false);

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(accountStatementData.length / usersPerPage);

  console.log(
    'pagesVisited',
    pagesVisited,
    '',
    'pageCount',
    pageCount,
    'pageNumber',
    pageNumber
  );

  const format = (num, decimals) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const displayUsers = accountStatementData
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
        <tr key={item.id}>
          <td>
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/ac_view_ledger',
                  post: item,
                });
              }}
            >
              {item.ledger_name}
            </a>
          </td>
          <td>{item.ac_title}</td>
          {/* <td>{item.group_name}</td> */}
          <td>{item.ac_group}</td>
          <td>{format(parseFloat(item.amount))}</td>

          <td>
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/view_statement',
                  post: item.id,
                });
                localStorage.setItem('AccStmtLedger_id', item.id);
              }}
            >
              View
            </a>
          </td>
        </tr>
      );
    });

  // console.log('displayUsers', displayUsers);

  const displayUsersOnSearch = accountStatementData
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
      } else if (
        val.ac_title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (
        val.ac_group.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (val.amount.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.id}>
          <td>
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/ac_view_ledger',
                  post: item,
                });
              }}
            >
              {item.ledger_name}
            </a>
          </td>
          <td>{item.ac_title}</td>
          {/* <td>{item.group_name}</td> */}
          <td>{item.ac_group}</td>
          <td>{format(parseFloat(item.amount))}</td>

          <td>
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/view_statement',
                  post: item.id,
                });
                localStorage.setItem('AccStmtLedger_id', item.id);
              }}
            >
              View
            </a>
          </td>
        </tr>
      );
    });

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    // console.log('selected', selected);
  };

  ///// for filter unique value
  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  // const dataLoading = async () => {
  //   let acStatementArray = [];
  //   try {
  //     const result = await list_account_statement();

  //     console.log(`result`, result);
  //     const uniqueAges = result.filter(unique);
  //     console.log('uniqueAges.length', uniqueAges.length);

  //     for (let i = 0; i < uniqueAges.length; i++) {
  //       try {
  //         const result1 = await ledger_search({ ledgerId: uniqueAges[i] });
  //         // if (result1.length > 0) {
  //         let ledgerName = result1[0].ledger_name;
  //         let Amount = result1[0].amount;
  //         let Id = result1[0].id;

  //         console.log('4loop 1st api');

  //         try {
  //           const result2 = await grp_by_id({ grpId: result1[0].ac_group });

  //           let grpName = result2[0].group_name;
  //           let acTitle = result2[0].ac_title;

  //           console.log('4loop 2nd api');
  //           try {
  //             const result3 = await list_acTitle({ acId: acTitle });

  //             acStatementArray.push({
  //               id: Id,
  //               ledger_name: ledgerName,
  //               group_name: grpName,
  //               ac_title: result3,
  //               amount: Amount,
  //             });
  //             console.log('4loop 3rd api');
  //             if (acStatementArray.length < 1) {
  //               setDataLoaded(false);
  //             } else {
  //               setDataLoaded(true);
  //             }
  //             setDataLoadedError(false);
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         } catch (error) {
  //           console.log(error);
  //         }
  //         //}
  //         console.log('looping', i);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     console.log('acStatementArray', acStatementArray);
  //     setAccountStatementData(acStatementArray);
  //     setDataLoadedFlag(true);
  //     // setDataLoaded(true);
  //   } catch (error) {
  //     console.log(error);
  //     setDataLoadedError(true);
  //     setDataLoadedFlag(true);
  //   }
  // };

  const dataLoading = async () => {
    try {
      const result = await list_account_statement();

      console.log(`result`, result);

      if (result.length < 1) {
        setDataLoaded(false);
      } else {
        setDataLoaded(true);
      }
      setDataLoadedError(false);

      setAccountStatementData(result);
      setDataLoadedFlag(true);
      // setDataLoaded(true);
    } catch (error) {
      console.log(error);
      setDataLoadedError(true);
      setDataLoadedFlag(true);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      dataLoading();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  console.log('dsdsd', accountStatementData);
  // const display =

  return (
    <div>
      <Headers />
      {dataLoadedFlag ? (
        <div className="container-fluid" id="content">
          <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
            <div className="container-fluid">
              <div className="page-header">
                <div className="pull-left">
                  <h1>Account Statement</h1>
                </div>
              </div>
              <div className="box">
                <div className="box-title">
                  <div className="col-md-20">
                    <div className="box-content nopadding">
                      <div
                        id="DataTables_Table_0_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
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
                          className="table table-hover table-nomargin table-bordered dataTable no-footer"
                          id="DataTables_Table_0"
                          role="grid"
                          aria-describedby="DataTables_Table_0_info"
                          // style={{ width: '1014px' }}
                        >
                          <thead>
                            <tr role="row">
                              <th
                                width={250}
                                className="sorting_asc"
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Ledger Name: activate to sort column descending"
                                style={{ width: '163px' }}
                                aria-sort="ascending"
                              >
                                Ledger Name
                              </th>
                              <th
                                width={250}
                                className="sorting"
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Group Name: activate to sort column ascending"
                                style={{ width: '162px' }}
                              >
                                Group Name
                              </th>
                              <th
                                width={250}
                                className="sorting"
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="A/c Category: activate to sort column ascending"
                                style={{ width: '162px' }}
                              >
                                A/c Category
                              </th>
                              <th
                                width={250}
                                className="sorting"
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Closing balance: activate to sort column ascending"
                                style={{ width: '169px' }}
                              >
                                Closing balance
                              </th>
                              <th
                                width={250}
                                className="sorting"
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Statement: activate to sort column ascending"
                                style={{ width: '157px' }}
                              >
                                Statement
                              </th>
                            </tr>
                          </thead>

                          {searchTerm == '' && <tbody>{displayUsers}</tbody>}

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
                              <h1>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No
                                data fetch&nbsp;&nbsp;&nbsp;&nbsp;
                              </h1>
                            ) : (
                              <>
                                Showing {pagesVisited * 1 + 1} to{' '}
                                {accountStatementData.length - pagesVisited <
                                parseInt(usersPerPage)
                                  ? pagesVisited +
                                    (accountStatementData.length - pagesVisited)
                                  : pagesVisited * 1 +
                                    parseInt(usersPerPage)}{' '}
                                of {accountStatementData.length} entries
                              </>
                            )
                          ) : (
                            <h1>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error
                              on data fetch&nbsp;&nbsp;&nbsp;&nbsp;
                            </h1>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default Account_statement;
