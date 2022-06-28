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

const Ledger_list = () => {
  let history = useHistory();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [ledgerData, setLedgerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ledgerSortFlag, setLedgerSortFlag] = useState(1);
  const [balanceSortFlag, setBalanceSortFlag] = useState(0);
  const [underSortFlag, setUnderSortFlag] = useState(0);
  const [mobileSortFlag, setMobileSortFlag] = useState(0);
  const [emailSortFlag, setEmailSortFlag] = useState(0);
  const [bankSortFlag, setBankSortFlag] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
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

  let url = baseUrl.url;

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(ledgerData.length / usersPerPage);

  console.log(
    'pagesVisited',
    pagesVisited,
    '',
    'pageCount',
    pageCount,
    'pageNumber',
    pageNumber
  );

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
        <tr key={item.id}>
          <td>{item.ledger_name}</td>
          <td>{item.ac_group}</td>
          <td>{item.open_balance}</td>
          <td>{item.mobile}</td>
          <td>{item.email}</td>
          <td>{item.bank}</td>
          <td width="210px;">
            <a
              className="btn"
              title="view"
              onClick={(e) => {
                history.push({
                  pathname: '/view_ledger',
                  post: item,
                });
              }}
            >
              <button className="btn-danger">View </button>
            </a>
            &nbsp;
            <a
              className="btn"
              title="Edit"
              onClick={(e) => {
                history.push({
                  pathname: '/edit_ledger',
                  post: item,
                });
              }}
            >
              <button className="btn-danger">Edit </button>
            </a>
            &nbsp;
            {item.id != sessionStorage.getItem('cashIdVal') &&
              item.id != sessionStorage.getItem('gstIdVal') &&
              item.id != sessionStorage.getItem('tdsIdVal') && (
                <a
                  onClick={(e) => {
                    confirmAlert({
                      title: 'Confirm to Delete',
                      message: 'Are you sure to do this.',
                      buttons: [
                        {
                          label: 'Yes',
                          onClick: () => deleting(item.id),
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
                  <button className="btn-danger">Delete</button>
                </a>
              )}
          </td>
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
      } else if (
        val.ac_group.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (
        val.open_balance.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (val.mobile.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (val.email.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (val.bank.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.ledger_name}</td>
          <td>{item.ac_group}</td>
          <td>{item.open_balance}</td>
          <td>{item.mobile}</td>
          <td>{item.email}</td>
          <td>{item.bank}</td>
          <td width="210px;">
            <a
              className="btn"
              title="view"
              onClick={(e) => {
                history.push({
                  pathname: '/view_ledger',
                  post: item,
                });
              }}
            >
              <button className="btn-danger">View </button>
            </a>
            &nbsp;
            <a
              className="btn"
              title="Edit"
              onClick={(e) => {
                history.push({
                  pathname: '/edit_ledger',
                  post: item,
                });
              }}
            >
              <button className="btn-danger">Edit </button>
            </a>
            &nbsp;
            {item.id != sessionStorage.getItem('cashIdVal') &&
              item.id != sessionStorage.getItem('gstIdVal') &&
              item.id != sessionStorage.getItem('tdsIdVal') && (
                <a
                  onClick={(e) => {
                    confirmAlert({
                      title: 'Confirm to Delete',
                      message: 'Are you sure to do this.',
                      buttons: [
                        {
                          label: 'Yes',
                          onClick: () => deleting(item.id),
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
                  <button className="btn-danger">Delete</button>
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
        //.get(`http://localhost:8080/ledger_bn_date?start=${sDate}&end=${eDate}`)
        .get(
          url +
            `ledger_bn_date?start=${sDate}&end=${eDate}&CompanyName=${sessionStorage.getItem(
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
  });

  function sorting(field, type) {
    console.log(field, type);
    axios
      //.get(`http://localhost:8080/ledger_sorting?field=${field}&type=${type}`)
      .get(
        url +
          `ledger_sorting?field=${field}&type=${type}&CompanyName=${sessionStorage.getItem(
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

  function deleting(ledgerId) {
    let id, ledgerAmount, finalAmount;

    var currentdate = new Date();

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

    axios
      .delete(url + `ledger_delete/${ledgerId}`)
      .then(({ data }) => {
        console.log(data);
        successToast('Deleted Succesfully');
        // setTimeout(function () {
        //   history.push({
        //     pathname: '/view_group',
        //   });
        // }, 500);
        dataLoading();
        axios
          .get(url + `ledger_transaction_search?dbt_ac=${ledgerId}&&crdt_ac=31`)
          .then(({ data }) => {
            console.log('transaction data', data);
            id = data[0].tranID;
            axios
              .get(url + `journal_search?tranId=${id}`)
              .then(({ data }) => {
                ledgerAmount = data[0].amount;
                let ledgerID11 = data[0].dbt_ac;
                let crdtAmountac = data[0].crdt_ac;
                // let a1 = data[0].amount;

                //////////////////////////updatesLedger1 calculation/////////////
                axios
                  .get(url + `ledger_search?ledgerId=${ledgerID11}`)
                  .then(({ data }) => {
                    console.log('ledgerID11 data', data);

                    let previousAmount = data[0].amount;
                    finalAmount =
                      parseFloat(previousAmount) - parseFloat(ledgerAmount);

                    let finalObj1 = {};

                    // data for account_ledger_v3 table
                    finalObj1.id = ledgerID11;
                    finalObj1.ledger_name = data[0].ledger_name;

                    finalObj1.ac_group = data[0].ac_group;
                    finalObj1.name = data[0].name;
                    finalObj1.address = data[0].address;
                    finalObj1.state = data[0].state;
                    finalObj1.pin = data[0].pin;
                    finalObj1.contact = data[0].contact;
                    finalObj1.mobile = data[0].mobile;
                    finalObj1.fax = data[0].fax;
                    finalObj1.email = data[0].email;
                    finalObj1.acc_number = data[0].acc_number;
                    finalObj1.bank = data[0].bank;
                    finalObj1.branch = data[0].branch;
                    finalObj1.ifsc_code = data[0].ifsc_code;
                    finalObj1.open_balance = data[0].open_balance;
                    finalObj1.amount = finalAmount;
                    //account id
                    finalObj1.created_date = cDate;
                    finalObj1.time = cTime;
                    //userId
                    finalObj1.balance_type = data[0].balance_type;
                    finalObj1.ledger_date = data[0].ledger_date;

                    finalObj1.company_name =
                      sessionStorage.getItem('CompanyName');
                    finalObj1.cust_id = sessionStorage.getItem('CustId');

                    axios
                      .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
                      .then(({ data }) => {
                        console.log('grpId', data);

                        // setFlag(data);
                        finalObj1.ac_type = data[0].ac_type;
                        finalObj1.ac_title = data[0].ac_title;

                        axios
                          .put(url + `ledger_update/${finalObj1.id}`, finalObj1)
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

                        console.log('updatesLedger1 finalObj1', finalObj1);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
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

                    finalObj2.company_name =
                      sessionStorage.getItem('CompanyName');
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

                        console.log('updatesLedger2 finalObj2', finalObj2);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });

                setTimeout(function () {
                  axios
                    .delete(url + `journal_delete/${id}`)
                    .then(({ data }) => {
                      console.log(data);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }, 2000);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function dataLoading() {
    axios
      //.get('http://localhost:8080/transactionDate')
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
      //.get('http://localhost:8080/list_ledger')
      .get(
        url +
          `list_ledger?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);
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
                  <h1>View Ledger</h1>
                </div>
                <div className="pull-right"></div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="col-sm-12">
                    <form>
                      <div className="row">
                        <div className="col-sm-5 form-group">
                          <label
                            htmlFor="textfield"
                            className="control-label col-sm-3"
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
                            className="control-label col-sm-3"
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
                        </div>
                        <div className="col-sm-2">
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
                    </form>
                  </div>
                  <br />
                  {/*-form ends here-*/}
                  <div className="row" style={{ paddingLeft: '22px' }}>
                    <div className="col-sm-12">
                      <div className="box box-color box-bordered">
                        <div className="box-title">
                          <h3>View Ledger</h3>
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
                              // style={{ width: '1039px' }}
                            >
                              <thead>
                                <tr role="row">
                                  <th
                                    className={
                                      (ledgerSortFlag == 0 && 'sorting') ||
                                      (ledgerSortFlag == 1 && 'sorting_asc') ||
                                      (ledgerSortFlag == 2 && 'sorting_desc')
                                    }
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Ledger Name: activate to sort column descending"
                                    style={{ width: '94px' }}
                                    aria-sort={
                                      (ledgerSortFlag == 0 && '') ||
                                      (ledgerSortFlag == 1 && ' ascending') ||
                                      (ledgerSortFlag == 2 && 'descending')
                                    }
                                    onClick={(e) => {
                                      if (ledgerSortFlag == 0) {
                                        setLedgerSortFlag(1);
                                        setUnderSortFlag(0);
                                        setBalanceSortFlag(0);
                                        setMobileSortFlag(0);
                                        setEmailSortFlag(0);
                                        setBankSortFlag(0);
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
                                    Ledger Name
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
                                    aria-label="Under group: activate to sort column ascending"
                                    style={{ width: '89px' }}
                                    aria-sort={
                                      (underSortFlag == 0 && '') ||
                                      (underSortFlag == 1 && ' ascending') ||
                                      (underSortFlag == 2 && 'descending')
                                    }
                                    onClick={(e) => {
                                      if (underSortFlag == 0) {
                                        setLedgerSortFlag(0);
                                        setUnderSortFlag(1);
                                        setBalanceSortFlag(0);
                                        setMobileSortFlag(0);
                                        setEmailSortFlag(0);
                                        setBankSortFlag(0);
                                        sorting('ac_group', 'ASC');
                                      }
                                      if (underSortFlag == 1) {
                                        setUnderSortFlag(2);
                                        sorting('ac_group', 'DESC');
                                      }
                                      if (underSortFlag == 2) {
                                        setUnderSortFlag(1);
                                        sorting('ac_group', 'ASC');
                                      }
                                    }}
                                  >
                                    Under group
                                  </th>
                                  <th
                                    className={
                                      (balanceSortFlag == 0 && 'sorting') ||
                                      (balanceSortFlag == 1 && 'sorting_asc') ||
                                      (balanceSortFlag == 2 && 'sorting_desc')
                                    }
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Opening Balance: activate to sort column ascending"
                                    style={{ width: '117px' }}
                                    aria-sort={
                                      (balanceSortFlag == 0 && '') ||
                                      (balanceSortFlag == 1 && ' ascending') ||
                                      (balanceSortFlag == 2 && 'descending')
                                    }
                                    onClick={(e) => {
                                      if (balanceSortFlag == 0) {
                                        setLedgerSortFlag(0);
                                        setUnderSortFlag(0);
                                        setBalanceSortFlag(1);
                                        setMobileSortFlag(0);
                                        setEmailSortFlag(0);
                                        setBankSortFlag(0);
                                        sorting('open_balance', 'ASC');
                                      }
                                      if (balanceSortFlag == 1) {
                                        setBalanceSortFlag(2);
                                        sorting('open_balance', 'DESC');
                                      }
                                      if (balanceSortFlag == 2) {
                                        setBalanceSortFlag(1);
                                        sorting('open_balance', 'ASC');
                                      }
                                    }}
                                  >
                                    Opening Balance
                                  </th>
                                  <th
                                    className={
                                      (mobileSortFlag == 0 && 'sorting') ||
                                      (mobileSortFlag == 1 && 'sorting_asc') ||
                                      (mobileSortFlag == 2 && 'sorting_desc')
                                    }
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Mobile: activate to sort column ascending"
                                    style={{ width: '50px' }}
                                    aria-sort={
                                      (mobileSortFlag == 0 && '') ||
                                      (mobileSortFlag == 1 && ' ascending') ||
                                      (mobileSortFlag == 2 && 'descending')
                                    }
                                    onClick={(e) => {
                                      if (mobileSortFlag == 0) {
                                        setLedgerSortFlag(0);
                                        setUnderSortFlag(0);
                                        setBalanceSortFlag(0);
                                        setMobileSortFlag(1);
                                        setEmailSortFlag(0);
                                        setBankSortFlag(0);
                                        sorting('mobile', 'ASC');
                                      }
                                      if (mobileSortFlag == 1) {
                                        setMobileSortFlag(2);
                                        sorting('mobile', 'DESC');
                                      }
                                      if (mobileSortFlag == 2) {
                                        setMobileSortFlag(1);
                                        sorting('mobile', 'ASC');
                                      }
                                    }}
                                  >
                                    Mobile
                                  </th>
                                  <th
                                    className={
                                      (emailSortFlag == 0 && 'sorting') ||
                                      (emailSortFlag == 1 && 'sorting_asc') ||
                                      (emailSortFlag == 2 && 'sorting_desc')
                                    }
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Email: activate to sort column ascending"
                                    style={{ width: '39px' }}
                                    aria-sort={
                                      (emailSortFlag == 0 && '') ||
                                      (emailSortFlag == 1 && ' ascending') ||
                                      (emailSortFlag == 2 && 'descending')
                                    }
                                    onClick={(e) => {
                                      if (emailSortFlag == 0) {
                                        setLedgerSortFlag(0);
                                        setUnderSortFlag(0);
                                        setBalanceSortFlag(0);
                                        setMobileSortFlag(0);
                                        setEmailSortFlag(1);
                                        setBankSortFlag(0);
                                        sorting('email', 'ASC');
                                      }
                                      if (emailSortFlag == 1) {
                                        setEmailSortFlag(2);
                                        sorting('email', 'DESC');
                                      }
                                      if (emailSortFlag == 2) {
                                        setEmailSortFlag(1);
                                        sorting('email', 'ASC');
                                      }
                                    }}
                                  >
                                    Email
                                  </th>
                                  <th
                                    className={
                                      (bankSortFlag == 0 && 'sorting') ||
                                      (bankSortFlag == 1 && 'sorting_asc') ||
                                      (bankSortFlag == 2 && 'sorting_desc')
                                    }
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Bank Details: activate to sort column ascending"
                                    style={{ width: '87px' }}
                                    aria-sort={
                                      (bankSortFlag == 0 && '') ||
                                      (bankSortFlag == 1 && ' ascending') ||
                                      (bankSortFlag == 2 && 'descending')
                                    }
                                    onClick={(e) => {
                                      if (bankSortFlag == 0) {
                                        setLedgerSortFlag(0);
                                        setUnderSortFlag(0);
                                        setBalanceSortFlag(0);
                                        setMobileSortFlag(0);
                                        setEmailSortFlag(0);
                                        setBankSortFlag(1);
                                        sorting('bank', 'ASC');
                                      }
                                      if (bankSortFlag == 1) {
                                        setBankSortFlag(2);
                                        sorting('bank', 'DESC');
                                      }
                                      if (bankSortFlag == 2) {
                                        setBankSortFlag(1);
                                        sorting('bank', 'ASC');
                                      }
                                    }}
                                  >
                                    Bank Details
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Action: activate to sort column ascending"
                                    style={{ width: '171px' }}
                                  >
                                    Action
                                  </th>
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
                    <ToastContainer />
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

export default Ledger_list;
