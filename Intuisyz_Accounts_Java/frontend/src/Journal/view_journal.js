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
import Headers from '../Header/Headers';

const View_journal = () => {
  let history = useHistory();
  let url = baseUrl.url;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [journalData, setJournalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);

  const [dateSortFlag, setDateSortFlag] = useState(1);
  const [debitSortFlag, setDebitSortFlag] = useState(0);
  const [creditSortFlag, setCreditSortFlag] = useState(0);
  const [amountSortFlag, setAmountSortFlag] = useState(0);
  const [narrationSortFlag, setNarrationSortFlag] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadedError, setDataLoadedError] = useState(false);
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false);
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(journalData.length / usersPerPage);

  console.log(
    'pagesVisited',
    pagesVisited,
    '',
    'pageCount',
    pageCount,
    'pageNumber',
    pageNumber
  );

  const displayUsers = journalData
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (val.dbt_ac.toLowerCase().includes(searchTerm.toLowerCase())) {
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
        <tr key={item.tranID}>
          <td>{item.tran_Date}</td>
          <td>{item.dbt_ac}</td>
          <td>{item.crdt_ac}</td>
          <td>{item.amount}</td>
          <td>{item.description}</td>
          {/* <td>Paid</td> */}
          <td>{item.status === '1' ? '' : item.status}</td>
          <td width="210px;">
            <a
              className="btn"
              title="Edit"
              onClick={(e) => {
                history.push({
                  pathname: '/edit_journal',
                  post: item,
                });
              }}
            >
              Edit
            </a>
            &nbsp;
            {item.filepath !== 'Nil' && item.filepath !== '' && (
              <a
                onClick={(e) => {
                  const response1 = axios.get(
                    url + `fileDownload?fileName=${item.filepath}`
                  );

                  console.log('response1', response1);

                  window.location.href =
                    url + `fileDownload?fileName=${item.filepath}`;

                  // window.open(
                  //   `http://intz.live:8080/fileDownload?fileName=${item.filepath}`,
                  //   '_blank'
                  // );
                }}
              >
                Download
              </a>
            )}
            &nbsp;
            <a
              onClick={(e) => {
                confirmAlert({
                  title: 'Confirm to Delete',
                  message: 'Are you sure to do this.',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: () => deleting(item.tranID),
                    },
                    {
                      label: 'No',
                      // onClick: () => alert('Click No')
                    },
                  ],
                });
              }}
              className="btn"
              title="Delete"
            >
              Delete
            </a>
          </td>
        </tr>
      );
    });

  // console.log('displayUsers', displayUsers);

  const displayUsersOnSearch = journalData
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (val.dbt_ac.toLowerCase().includes(searchTerm.toLowerCase())) {
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
      } else if (val.crdt_ac.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (
        val.tran_Date.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (val.amount.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (
        val.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (val.status.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.tranID}>
          <td>{item.tran_Date}</td>
          <td>{item.dbt_ac}</td>
          <td>{item.crdt_ac}</td>
          <td>{item.amount}</td>
          <td>{item.description}</td>
          {/* <td>Paid</td> */}
          <td>{item.status === '1' ? '' : item.status}</td>
          <td width="210px;">
            <a
              className="btn"
              title="Edit"
              onClick={(e) => {
                history.push({
                  pathname: '/edit_journal',
                  post: item,
                });
              }}
            >
              <button className="btn">Edit </button>
            </a>
            &nbsp;
            {item.filepath !== 'Nil' && item.filepath !== '' && (
              <a
                onClick={(e) => {
                  const response1 = axios.get(
                    url + `fileDownload?fileName=${item.filepath}`
                  );

                  console.log('response1', response1);

                  window.location.href =
                    url + `fileDownload?fileName=${item.filepath}`;

                  // window.open(
                  //   `http://intz.live:8080/fileDownload?fileName=${item.filepath}`,
                  //   '_blank'
                  // );
                }}
              >
                <button className="btn">Download</button>
              </a>
            )}
            &nbsp;
            <a
              onClick={(e) => {
                confirmAlert({
                  title: 'Confirm to Delete',
                  message: 'Are you sure to do this.',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: () => deleting(item.tranID),
                    },
                    {
                      label: 'No',
                      // onClick: () => alert('Click No')
                    },
                  ],
                });
              }}
              className="btn"
              title="Delete"
            >
              <button className="btn">Delete</button>
            </a>
          </td>
        </tr>
      );
    });

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    // console.log('selected', selected);
  };

  const submitFinal = handleSubmit((data) => {
    if (startDate === null || startDate === undefined) {
      setStartDateFlag(true);
      if (endDate === null || endDate === undefined) {
        setEndDateFlag(true);
      } else {
        setEndDateFlag(false);
      }
    } else if (endDate === null || endDate === undefined) {
      setEndDateFlag(true);
      if (startDate === null || startDate === undefined) {
        setStartDateFlag(true);
      } else {
        setStartDateFlag(false);
      }
    } else {
      setStartDateFlag(false);
      setEndDateFlag(false);

      if (startDate.getDate() < 10) {
        var currentDay = '0' + startDate.getDate();
      } else {
        var currentDay = startDate.getDate();
      }

      if (startDate.getMonth() + 1 < 10) {
        var currentMonth = '0' + (startDate.getMonth() + 1);
      } else {
        var currentMonth = startDate.getMonth() + 1;
      }

      var sDate =
        startDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

      if (endDate.getDate() < 10) {
        var currentDay = '0' + endDate.getDate();
      } else {
        var currentDay = endDate.getDate();
      }

      if (endDate.getMonth() + 1 < 10) {
        var currentMonth = '0' + (endDate.getMonth() + 1);
      } else {
        var currentMonth = endDate.getMonth() + 1;
      }

      var eDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

      console.log(sDate, '', eDate);

      axios
        .get(
          url +
            `journal_bn_date?start=${sDate}&end=${eDate}&CompanyName=${sessionStorage.getItem(
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

          if (data.length < 1) {
            setDataLoaded(false);
          } else {
            for (let i = 0; i < data.length; i++) {
              if (data[i].dbt_ac === null || data[i].dbt_ac === undefined) {
                data[i].dbt_ac = '';
              }

              if (data[i].crdt_ac === null || data[i].crdt_ac === undefined) {
                data[i].crdt_ac = '';
              }
            }

            setDataLoaded(true);
          }

          setJournalData(data);
          setDataLoadedError(false);
          setDataLoadedFlag(true);
        })
        .catch((err) => {
          console.log(err);
          setDataLoadedError(true);
          setDataLoadedFlag(true);
        });
    }
  });

  function sorting(field, type) {
    console.log(field, type);
    axios
      .get(
        url +
          `journal_sorting?field=${field}&type=${type}&CompanyName=${sessionStorage.getItem(
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

        if (data.length < 1) {
          setDataLoaded(false);
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].dbt_ac === null || data[i].dbt_ac === undefined) {
              data[i].dbt_ac = '';
            }

            if (data[i].crdt_ac === null || data[i].crdt_ac === undefined) {
              data[i].crdt_ac = '';
            }
          }

          setDataLoaded(true);
        }

        setJournalData(data);
        setDataLoadedError(false);
        setDataLoadedFlag(true);
      })
      .catch((err) => {
        console.log(err);
        setDataLoadedError(true);
        setDataLoadedFlag(true);
      });
  }

  function deleting(tranID) {
    axios
      .get(url + `journal_search?tranId=${tranID}`)
      .then(({ data }) => {
        var currentdate = new Date();
        console.log('upload data', data.upload);
        if (currentdate.getDate() < 10) {
          var currentDay = '0' + currentdate.getDate();
        } else {
          var currentDay = currentdate.getDate();
        }

        if (currentdate.getMonth() + 1 < 10) {
          var currentMonth = '0' + (currentdate.getMonth() + 1);
        } else {
          var currentMonth = currentdate.getMonth() + 1;
        }

        var cDate =
          currentdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

        if (currentdate.getHours() < 10) {
          var currentHour = '0' + currentdate.getHours();
        } else {
          var currentHour = currentdate.getHours();
        }

        if (currentdate.getMinutes() < 10) {
          var currentMinutes = '0' + currentdate.getMinutes();
        } else {
          var currentMinutes = currentdate.getMinutes();
        }

        if (currentdate.getSeconds() < 10) {
          var currentSeconds = '0' + currentdate.getSeconds();
        } else {
          var currentSeconds = currentdate.getSeconds();
        }

        var cTime = currentHour + ':' + currentMinutes + ':' + currentSeconds;

        console.log('date', cTime, cDate);

        console.log('deleted data', data);

        let finalAmount;

        let ledgerAmount = data[0].amount;
        let ledgerID11 = data[0].dbt_ac;

        let crdtAmountac = data[0].crdt_ac;
        let a1 = data[0].amount;

        ///////////////updatesLedger1 calculation //////////////
        axios
          .get(url + `ledger_search?ledgerId=${ledgerID11}`)
          .then(({ data }) => {
            console.log(data);

            let previousAmount = data[0].amount;
            finalAmount = parseFloat(previousAmount) - parseFloat(ledgerAmount);

            let finalObj = {};

            // data for account_ledger_v3 table
            finalObj.id = ledgerID11;
            finalObj.ledger_name = data[0].ledger_name;

            finalObj.ac_group = data[0].ac_group;
            finalObj.name = data[0].name;
            finalObj.address = data[0].address;
            finalObj.state = data[0].state;
            finalObj.pin = data[0].pin;
            finalObj.contact = data[0].contact;
            finalObj.mobile = data[0].mobile;
            finalObj.fax = data[0].fax;
            finalObj.email = data[0].email;
            finalObj.acc_number = data[0].acc_number;
            finalObj.bank = data[0].bank;
            finalObj.branch = data[0].branch;
            finalObj.ifsc_code = data[0].ifsc_code;
            finalObj.open_balance = data[0].open_balance;
            finalObj.amount = finalAmount;
            //account id
            finalObj.created_date = cDate;
            finalObj.time = cTime;
            //userId
            finalObj.balance_type = data[0].balance_type;
            finalObj.ledger_date = data[0].ledger_date;

            finalObj.company_name = sessionStorage.getItem('CompanyName');
            finalObj.cust_id = sessionStorage.getItem('CustId');

            axios
              .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
              .then(({ data }) => {
                console.log('grpId', data);

                // setFlag(data);
                finalObj.ac_type = data[0].ac_type;
                finalObj.ac_title = data[0].ac_title;

                axios
                  .put(url + `ledger_update/${finalObj.id}`, finalObj)
                  .then(() => {
                    console.log('updatesLedger1 Updated Successfully');
                    // reset();
                    // setTimeout(function () {
                    //   history.push({
                    //     pathname: '/view_journal',
                    //   });
                    // }, 1000);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });

            console.log('updatesLedger1 finalObj', finalObj);
          })
          .catch((err) => {
            console.log(err);
          });

        //////////////////////////updatesLedger2 calculation/////////////

        axios
          .get(url + `ledger_search?ledgerId=${crdtAmountac}`)
          .then(({ data }) => {
            console.log(data);
            let finalAmount1;
            let type = data[0].ac_type;
            if (type === '2' || type === '3') {
              let previousAmount1 = data[0].amount;
              finalAmount1 =
                parseFloat(previousAmount1) - parseFloat(ledgerAmount);
            } else {
              let previousAmount1 = data[0].amount;
              finalAmount1 =
                parseFloat(previousAmount1) + parseFloat(ledgerAmount);
            }

            let finalObj2 = {};

            // data for account_ledger_v3 table
            finalObj2.id = crdtAmountac;
            finalObj2.ledger_name = data[0].ledger_name;

            finalObj2.ac_group = data[0].ac_group;
            finalObj2.name = data[0].name;
            finalObj2.address = data[0].address;
            finalObj2.state = data[0].state;
            finalObj2.pin = data[0].pin;
            finalObj2.contact = data[0].contact;
            finalObj2.mobile = data[0].mobile;
            finalObj2.fax = data[0].fax;
            finalObj2.email = data[0].email;
            finalObj2.acc_number = data[0].acc_number;
            finalObj2.bank = data[0].bank;
            finalObj2.branch = data[0].branch;
            finalObj2.ifsc_code = data[0].ifsc_code;
            finalObj2.open_balance = data[0].open_balance;
            finalObj2.amount = finalAmount1;
            //account id
            finalObj2.created_date = cDate;
            finalObj2.time = cTime;
            //userId
            finalObj2.balance_type = data[0].balance_type;
            finalObj2.ledger_date = data[0].ledger_date;

            finalObj2.company_name = sessionStorage.getItem('CompanyName');
            finalObj2.cust_id = sessionStorage.getItem('CustId');

            axios
              .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
              .then(({ data }) => {
                console.log('grpId', data);

                // setFlag(data);
                finalObj2.ac_type = data[0].ac_type;
                finalObj2.ac_title = data[0].ac_title;

                axios
                  .put(url + `ledger_update/${finalObj2.id}`, finalObj2)
                  .then(() => {
                    console.log('updatesLedger2 Updated Successfully');
                    // reset();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });

            console.log('updatesLedger2 finalObj2', finalObj2);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .delete(url + `journal_delete/${tranID}`)
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
      .get(url + 'transactionDate')
      .then(({ data }) => {
        console.log(data[0].tran_Date);
        // setStartDate(data[0].tran_Date);

        let k = data[0].tran_Date;
        console.log(k.split('-'));
        let i = new Date(k.split('-')[0], k.split('-')[1] - 1, k.split('-')[2]);
        console.log(i);
        setStartDate(i);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(
        url +
          `list_journal?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);

        if (data.length < 1) {
          setDataLoaded(false);
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].dbt_ac === null || data[i].dbt_ac === undefined) {
              data[i].dbt_ac = '';
            }

            if (data[i].crdt_ac === null || data[i].crdt_ac === undefined) {
              data[i].crdt_ac = '';
            }
          }

          setDataLoaded(true);
        }

        setJournalData(data);
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
                  <h1>View Journal</h1>
                </div>
                <div className="pull-right"></div>
              </div>
              <div className="box">
                <div className="box-title">
                  <div className="col-md-12">
                    <div className="box-content">
                      <form className="form-horizontal" method="post">
                        <div className="row">
                          <div className="col-sm-5 form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-2"
                            >
                              Start Date
                            </label>
                            <div className="col-sm-5">
                              <DatePicker
                                name="start"
                                className="form-control datepicker"
                                dateFormat="dd/MM/yyyy"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                defaultValue=""
                              />
                              <div style={{ color: 'red' }}>
                                {startDateFlag && <p>Date is required.</p>}
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-5 form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-2"
                            >
                              End Date
                            </label>
                            <div className="col-sm-5">
                              <DatePicker
                                name="end"
                                className="form-control datepicker"
                                dateFormat="dd/MM/yyyy"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                defaultValue=""
                              />
                              <div style={{ color: 'red' }}>
                                {endDateFlag && <p>Date is required.</p>}
                              </div>
                            </div>
                            <div className="col-sm-2">
                              {/* <input
                              type="submit"
                              name="submit"
                              className="btn btn-primary btn-lg"
                              defaultValue="Search"
                            /> */}

                              <button
                                type="submit"
                                name="search"
                                className="btn btn-primary btn-lg"
                                style={{ borderRadius: '4px' }}
                                onClick={(e) => {
                                  e.preventDefault();

                                  submitFinal();
                                }}
                              >
                                Search
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              {/*-form ends here-*/}
              <div className="row" style={{ paddingLeft: '22px' }}>
                <div className="col-sm-12">
                  <div className="box box-color box-bordered">
                    <div className="box-title">
                      <h3>
                        <i className="fa fa-table" />
                        Journal List
                      </h3>
                    </div>
                    <div className="box-content nopadding" id="search_result">
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
                          // style={{ width: '1039px' }}
                        >
                          <thead>
                            <tr role="row">
                              <th
                                className={
                                  (dateSortFlag == 0 && 'sorting') ||
                                  (dateSortFlag == 1 && 'sorting_asc') ||
                                  (dateSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Date: activate to sort column descending"
                                style={{ width: '46px' }}
                                aria-sort={
                                  (dateSortFlag == 0 && '') ||
                                  (dateSortFlag == 1 && ' ascending') ||
                                  (dateSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (dateSortFlag == 0) {
                                    setDateSortFlag(1);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(0);
                                    setAmountSortFlag(0);
                                    setNarrationSortFlag(0);
                                    sorting('tran_Date', 'ASC');
                                  }
                                  if (dateSortFlag == 1) {
                                    setDateSortFlag(2);
                                    sorting('tran_Date', 'DESC');
                                  }
                                  if (dateSortFlag == 2) {
                                    setDateSortFlag(1);
                                    sorting('tran_Date', 'ASC');
                                  }
                                }}
                              >
                                Date
                              </th>
                              <th
                                className={
                                  (debitSortFlag == 0 && 'sorting') ||
                                  (debitSortFlag == 1 && 'sorting_asc') ||
                                  (debitSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Debit Account: activate to sort column ascending"
                                style={{ width: '84px' }}
                                aria-sort={
                                  (debitSortFlag == 0 && '') ||
                                  (debitSortFlag == 1 && ' ascending') ||
                                  (debitSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (debitSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setDebitSortFlag(1);
                                    setCreditSortFlag(0);
                                    setAmountSortFlag(0);
                                    setNarrationSortFlag(0);
                                    sorting('dbt_ac', 'ASC');
                                  }
                                  if (debitSortFlag == 1) {
                                    setDebitSortFlag(2);
                                    sorting('dbt_ac', 'DESC');
                                  }
                                  if (debitSortFlag == 2) {
                                    setDebitSortFlag(1);
                                    sorting('dbt_ac', 'ASC');
                                  }
                                }}
                              >
                                Debit Account
                              </th>
                              <th
                                className={
                                  (creditSortFlag == 0 && 'sorting') ||
                                  (creditSortFlag == 1 && 'sorting_asc') ||
                                  (creditSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Credit Account: activate to sort column ascending"
                                style={{ width: '88px' }}
                                aria-sort={
                                  (creditSortFlag == 0 && '') ||
                                  (creditSortFlag == 1 && ' ascending') ||
                                  (creditSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (creditSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(1);
                                    setAmountSortFlag(0);
                                    setNarrationSortFlag(0);
                                    sorting('crdt_ac', 'ASC');
                                  }
                                  if (creditSortFlag == 1) {
                                    setCreditSortFlag(2);
                                    sorting('crdt_ac', 'DESC');
                                  }
                                  if (creditSortFlag == 2) {
                                    setCreditSortFlag(1);
                                    sorting('crdt_ac', 'ASC');
                                  }
                                }}
                              >
                                Credit Account
                              </th>
                              <th
                                className={
                                  (amountSortFlag == 0 && 'sorting') ||
                                  (amountSortFlag == 1 && 'sorting_asc') ||
                                  (amountSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Amount: activate to sort column ascending"
                                style={{ width: '47px' }}
                                aria-sort={
                                  (amountSortFlag == 0 && '') ||
                                  (amountSortFlag == 1 && ' ascending') ||
                                  (amountSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (amountSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(0);
                                    setAmountSortFlag(1);
                                    setNarrationSortFlag(0);
                                    sorting('amount', 'ASC');
                                  }
                                  if (amountSortFlag == 1) {
                                    setAmountSortFlag(2);
                                    sorting('amount', 'DESC');
                                  }
                                  if (amountSortFlag == 2) {
                                    setAmountSortFlag(1);
                                    sorting('amount', 'ASC');
                                  }
                                }}
                              >
                                Amount
                              </th>
                              <th
                                className={
                                  (narrationSortFlag == 0 && 'sorting') ||
                                  (narrationSortFlag == 1 && 'sorting_asc') ||
                                  (narrationSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Narration: activate to sort column ascending"
                                style={{ width: '58px' }}
                                aria-sort={
                                  (narrationSortFlag == 0 && '') ||
                                  (narrationSortFlag == 1 && ' ascending') ||
                                  (narrationSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (narrationSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(0);
                                    setAmountSortFlag(0);
                                    setNarrationSortFlag(1);
                                    sorting('description', 'ASC');
                                  }
                                  if (narrationSortFlag == 1) {
                                    setNarrationSortFlag(2);
                                    sorting('description', 'DESC');
                                  }
                                  if (narrationSortFlag == 2) {
                                    setNarrationSortFlag(1);
                                    sorting('description', 'ASC');
                                  }
                                }}
                              >
                                Narration
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Payment Status: activate to sort column ascending"
                                style={{ width: '94px' }}
                              >
                                Payment Status
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Action: activate to sort column ascending"
                                style={{ width: '196px' }}
                              >
                                Action
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
                                {journalData.length - pagesVisited <
                                parseInt(usersPerPage)
                                  ? pagesVisited +
                                    (journalData.length - pagesVisited)
                                  : pagesVisited * 1 +
                                    parseInt(usersPerPage)}{' '}
                                of {journalData.length} entries
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
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View_journal;
