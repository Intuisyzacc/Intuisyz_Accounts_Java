import React, { useState, useEffect } from 'react';
import {
  useHistory,
  useLocation,
  Redirect,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { successToast } from '../common/global';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import baseUrl from '../Base Url/baseUrl';
import Headers from '../Header/Headers';

const View_group = () => {
  let history = useHistory();
  const [grpData, setGrpData] = useState([]);
  const [grpSortFlag, setGrpSortFlag] = useState(1);
  const [acTitleSortFlag, setAcTitleSortFlag] = useState(0);
  const [underSortFlag, setUnderSortFlag] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadedError, setDataLoadedError] = useState(false);
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false);

  let url = baseUrl.url;

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(grpData.length / usersPerPage);

  console.log(
    'pagesVisited',
    pagesVisited,
    '',
    'pageCount',
    pageCount,
    'pageNumber',
    pageNumber
  );

  const displayUsers = grpData
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((val) => {
      if (searchTerm == '') {
        return val;
      } else if (
        val.ac_title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.group_id}>
          <td>{item.group_name}</td>
          <td>{item.ac_title}</td>
          <td>{item.ac_type}</td>
          <td align="center">
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/edit_group',
                  post: item,
                });
                // localStorage.setItem('updateId', item.group_id);
              }}
              // href="edit_group.php?<?php echo $random; ?>&&head=<?php echo $heads['group_id'];?>&&<?php echo $random?>&&title=<?php echo $row['ac_id'];?>"
              className="btn"
              rel="tooltip"
              title="Edit"
            >
              <i className="fa fa-edit" />
            </a>
            &nbsp;
            {item.visibility !== 'All' && (
              <a
                onClick={(e) => {
                  confirmAlert({
                    title: 'Confirm to Delete',
                    message: 'Are you sure to do this.',
                    buttons: [
                      {
                        label: 'Yes',
                        onClick: () => deleting(item.group_id),
                      },
                      {
                        label: 'No',
                        // onClick: () => alert('Click No')
                      },
                    ],
                  });
                }}
                className="btn"
                rel="tooltip"
                title="Delete"
              >
                <i className="fa fa-times" />
              </a>
            )}
          </td>
        </tr>
      );
    });

  // console.log('displayUsers', displayUsers);

  const displayUsersOnSearch = grpData
    // .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((val) => {
      if (searchTerm == '') {
        return val;
      } else if (
        val.ac_title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (
        val.group_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (val.ac_type.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.group_id}>
          <td>{item.group_name}</td>
          <td>{item.ac_title}</td>
          <td>{item.ac_type}</td>
          <td align="center">
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/edit_group',
                  post: item,
                });
                // localStorage.setItem('updateId', item.group_id);
              }}
              // href="edit_group.php?<?php echo $random; ?>&&head=<?php echo $heads['group_id'];?>&&<?php echo $random?>&&title=<?php echo $row['ac_id'];?>"
              className="btn"
              rel="tooltip"
              title="Edit"
            >
              <i className="fa fa-edit" />
            </a>
            &nbsp;
            {item.visibility !== 'All' && (
              <a
                onClick={(e) => {
                  confirmAlert({
                    title: 'Confirm to Delete',
                    message: 'Are you sure to do this.',
                    buttons: [
                      {
                        label: 'Yes',
                        onClick: () => deleting(item.group_id),
                      },
                      {
                        label: 'No',
                        // onClick: () => alert('Click No')
                      },
                    ],
                  });
                }}
                className="btn"
                rel="tooltip"
                title="Delete"
              >
                <i className="fa fa-times" />
              </a>
            )}
          </td>
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
      //.get(`http://localhost:8080/grp_sorting?field=${field}&type=${type}`)
      .get(
        url +
          `grp_sorting?field=${field}&type=${type}&CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        // let optionSchoolArray = [];
        // data.map((item) => {
        //   optionSchoolArray.push({
        //     value: item.schoolId,
        //     label: item.schoolName,
        //   });
        // setAcTitle(data);

        console.log(data);
        setGrpData(data);

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

  function deleting(grpId) {
    axios
      //.delete(`http://localhost:8080/grp_delete/${grpId}`)
      .delete(url + `grp_delete/${grpId}`)
      .then(({ data }) => {
        console.log(data);
        successToast('Deleted Succesfully');
        // setTimeout(function () {
        //   history.push({
        //     pathname: '/view_group',
        //   });
        // }, 500);
        dataLoading();
        // window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function dataLoading() {
    axios
      // .get('http://localhost:8080/view_group')
      .get(
        url +
          `view_group?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        // let optionSchoolArray = [];
        // data.map((item) => {
        //   optionSchoolArray.push({
        //     value: item.schoolId,
        //     label: item.schoolName,
        //   });
        // setAcTitle(data);
        setGrpData(data);
        console.log(data);
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
    if (sessionStorage.getItem('logDetails') === 'true') {
      dataLoading();

      // if (window.performance) {
      //   if (performance.navigation.type == 1) {
      //     console.log('reloaded');
      //     history.push({
      //       pathname: '/view_group',
      //     });
      //     dataLoading();
      //   } else {
      //     console.log('This page is not reloaded');
      //   }
      // }
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  return (
    <div>
      <Headers />
      {dataLoadedFlag && (
        <div className="container-fluid" id="content">
          <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
            <div className="container-fluid">
              <div className="page-header">
                <div className="pull-left">
                  <h1>Group List</h1>
                </div>
                <div className="pull-right"></div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="box">
                    <div className="box-title"></div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="box box-color box-bordered">
                    <div className="box-title">
                      <h3>
                        <i className="fa fa-table" />
                      </h3>
                    </div>
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
                        >
                          <thead>
                            <tr>
                              <th
                                className={
                                  (grpSortFlag == 0 && 'sorting') ||
                                  (grpSortFlag == 1 && 'sorting_asc') ||
                                  (grpSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-sort={
                                  (grpSortFlag == 0 && '') ||
                                  (grpSortFlag == 1 && ' ascending') ||
                                  (grpSortFlag == 2 && 'descending')
                                }
                                aria-label="Group Name: activate to sort column ascending"
                                style={{ width: '164px' }}
                                onClick={(e) => {
                                  if (grpSortFlag == 0) {
                                    setGrpSortFlag(1);
                                    setAcTitleSortFlag(0);
                                    setUnderSortFlag(0);
                                    sorting('group_name', 'ASC');
                                  }
                                  if (grpSortFlag == 1) {
                                    setGrpSortFlag(2);
                                    sorting('group_name', 'DESC');
                                  }
                                  if (grpSortFlag == 2) {
                                    setGrpSortFlag(1);
                                    sorting('group_name', 'ASC');
                                  }
                                }}

                                // className="sorting_desc"
                                // tabIndex={0}
                                // aria-sort="descending"
                                // aria-controls="DataTables_Table_0"
                                // rowSpan={1}
                                // colSpan={1}
                                // aria-label="Account Title: activate to sort column descending"
                                // style={{ width: '167px' }}

                                // className="sorting"
                                // tabIndex={0}
                                // aria-controls="DataTables_Table_0"
                                // rowSpan={1}
                                // colSpan={1}
                                // aria-label="Under: activate to sort column ascending"
                                // style={{ width: '93px' }}
                              >
                                Group Name
                              </th>
                              <th
                                className={
                                  (acTitleSortFlag == 0 && 'sorting') ||
                                  (acTitleSortFlag == 1 && 'sorting_asc') ||
                                  (acTitleSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-sort={
                                  (acTitleSortFlag == 0 && '') ||
                                  (acTitleSortFlag == 1 && ' ascending') ||
                                  (acTitleSortFlag == 2 && 'descending')
                                }
                                aria-label="Group Name: activate to sort column ascending"
                                style={{ width: '164px' }}
                                onClick={(e) => {
                                  if (acTitleSortFlag == 0) {
                                    setAcTitleSortFlag(1);
                                    setGrpSortFlag(0);
                                    setUnderSortFlag(0);
                                    sorting('ac_title', 'ASC');
                                  }
                                  if (acTitleSortFlag == 1) {
                                    setAcTitleSortFlag(2);
                                    sorting('ac_title', 'DESC');
                                  }
                                  if (acTitleSortFlag == 2) {
                                    setAcTitleSortFlag(1);
                                    sorting('ac_title', 'ASC');
                                  }
                                }}

                                // className="sorting_desc"
                                // tabIndex={0}
                                // aria-sort="descending"
                                // aria-controls="DataTables_Table_0"
                                // rowSpan={1}
                                // colSpan={1}
                                // aria-label="Account Title: activate to sort column ascending"
                                // style={{ width: '167px' }}
                              >
                                Account Title
                              </th>
                              <th
                                className={
                                  (underSortFlag == 0 && 'sorting') ||
                                  (underSortFlag == 1 && 'sorting_asc') ||
                                  (underSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-sort={
                                  (underSortFlag == 0 && '') ||
                                  (underSortFlag == 1 && ' ascending') ||
                                  (underSortFlag == 2 && 'descending')
                                }
                                aria-label="Group Name: activate to sort column ascending"
                                style={{ width: '164px' }}
                                onClick={(e) => {
                                  if (underSortFlag == 0) {
                                    setUnderSortFlag(1);
                                    setGrpSortFlag(0);
                                    setAcTitleSortFlag(0);
                                    sorting('under', 'ASC');
                                  }
                                  if (underSortFlag == 1) {
                                    setUnderSortFlag(2);
                                    sorting('under', 'DESC');
                                  }
                                  if (underSortFlag == 2) {
                                    setUnderSortFlag(1);
                                    sorting('under', 'ASC');
                                  }
                                }}

                                // className="sorting"
                                // tabIndex={0}
                                // aria-controls="DataTables_Table_0"
                                // rowSpan={1}
                                // colSpan={1}
                                // aria-label="Under: activate to sort column ascending"
                                // style={{ width: '93px' }}
                              >
                                Under
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Action: activate to sort column ascending"
                                style={{ width: '98px' }}
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          {/* <tbody> */}
                          {/* {grpData
                              .filter((val) => {
                                if (searchTerm == '') {
                                  return val;
                                } else if (
                                  val.ac_title
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                ) {
                                  return val;
                                }
                              })
                              .map((item) => {
                                return (
                                  <tr key={item.group_id}>
                                    <td>{item.group_name}</td>
                                    <td>{item.ac_title}</td>
                                    <td>{item.ac_type}</td>
                                    <td align="center">
                                      <a
                                        onClick={(e) => {
                                          history.push({
                                            pathname: '/edit_group',
                                            post: item,
                                          });
                                          // localStorage.setItem('updateId', item.group_id);
                                        }}
                                        // href="edit_group.php?<?php echo $random; ?>&&head=<?php echo $heads['group_id'];?>&&<?php echo $random?>&&title=<?php echo $row['ac_id'];?>"
                                        className="btn"
                                        rel="tooltip"
                                        title="Edit"
                                      >
                                        <i className="fa fa-edit" />
                                      </a>

                                      <a
                                        onClick={(e) => {
                                          confirmAlert({
                                            title: 'Confirm to Delete',
                                            message: 'Are you sure to do this.',
                                            buttons: [
                                              {
                                                label: 'Yes',
                                                onClick: () =>
                                                  deleting(item.group_id),
                                              },
                                              {
                                                label: 'No',
                                                // onClick: () => alert('Click No')
                                              },
                                            ],
                                          });
                                        }}
                                        className="btn"
                                        rel="tooltip"
                                        title="Delete"
                                      >
                                        <i className="fa fa-times" />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })} */}
                          {searchTerm == '' && <tbody>{displayUsers}</tbody>}

                          {searchTerm !== '' && (
                            <tbody>{displayUsersOnSearch}</tbody>
                          )}
                          {/* </tbody> */}
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
                                {grpData.length - pagesVisited <
                                parseInt(usersPerPage)
                                  ? pagesVisited +
                                    (grpData.length - pagesVisited)
                                  : pagesVisited * 1 +
                                    parseInt(usersPerPage)}{' '}
                                of {grpData.length} entries
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
                        {/* <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="DataTables_Table_0_paginate"
                        >
                          <a
                            className="paginate_button previous disabled"
                            aria-controls="DataTables_Table_0"
                            data-dt-idx={0}
                            tabIndex={0}
                            id="DataTables_Table_0_previous"
                          >
                            Previous
                          </a>
                          <span />
                          <a
                            className="paginate_button next disabled"
                            aria-controls="DataTables_Table_0"
                            data-dt-idx={1}
                            tabIndex={0}
                            id="DataTables_Table_0_next"
                          >
                            Next
                          </a>
                        </div> */}
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
                        <ToastContainer />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View_group;
