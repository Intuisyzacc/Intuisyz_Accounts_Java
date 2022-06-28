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
import { cashBookData, cashBookBnDates } from '../modal';
import PageLoader from '../Page Loader/pageloader';
import ReactToExcel from 'react-html-table-to-excel';
import { ToastContainer, toast } from 'react-toastify';
import Headers from '../Header/Headers';

const TransactionHistory = () => {
  let history = useHistory();
  let url = baseUrl.url;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);
  const [transactionHistoryData, setTransactionHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [accountStatementData, setAccountStatementData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dateSortFlag, setDateSortFlag] = useState(1);
  const [amountSortFlag, setAmountSortFlag] = useState(0);
  const [voucherTypeSortFlag, setVoucherTypeSortFlag] = useState(0);
  const [voucherNoSortFlag, setVoucherNoSortFlag] = useState(0);
  const [narrationSortFlag, setNarrationSortFlag] = useState(0);
  const [debitSortFlag, setDebitSortFlag] = useState(0);
  const [creditSortFlag, setCreditSortFlag] = useState(0);
  const [loadViewFlag, setLoadViewFlag] = useState(true);
  const [dateViewFlag, setDateViewFlag] = useState(false);
  const [debitAcData, setDebitAcData] = useState([]);
  const [creditAcData, setCreditAcData] = useState([]);

  const [dataLoadedError, setDataLoadedError] = useState(true);
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false);

  const [debitDataLoadedFlag, setDebitDataLoadedFlag] = useState(false);
  const [creditDataLoadedFlag, setCreditDataLoadedFlag] = useState(false);
  const [dropdownFlag, setDropdownFlag] = useState(false);

  const [dateDropDownFlag, setDateDropDownFlag] = useState(true);
  const [amountDropDownFlag, setAmountDropDownFlag] = useState(true);

  const [narrationDropDownFlag, setNarrationDropDownFlag] = useState(true);
  const [debitDropDownFlag, setDebitDropDownFlag] = useState(true);
  const [creditDropDownFlag, setCreditDropDownFlag] = useState(true);

  const [narrationTextBoxFlag, setNarrationTextBoxFlag] = useState(false);
  const [amountTextBoxFlag, setAmountTextBoxFlag] = useState(false);
  const [groupTextBoxFlag, setGroupTextBoxFlag] = useState(false);

  const [grpName, setGrpName] = useState([]);
  const [grpNameLoad, setGrpNameLoad] = useState(false);

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(transactionHistoryData.length / usersPerPage);

  // console.log(
  //   'pagesVisited',
  //   pagesVisited,
  //   '',
  //   'pageCount',
  //   pageCount,
  //   'pageNumber',
  //   pageNumber
  // );

  const displayUsers = transactionHistoryData
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (val.branch.toLowerCase().includes(searchTerm.toLowerCase())) {
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
        item.description !== 'ledger creation' && (
          <tr key={item.tranID}>
            {dateDropDownFlag && <td>{item.tran_Date}</td>}
            {debitDropDownFlag && (
              <td>
                {item.type === 'Receipt' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_receipt',
                        post: item,
                      });
                    }}
                  >
                    {item.branch !== 'Nil' && item.branch}
                  </a>
                )}

                {item.type === 'Voucher' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_voucher',
                        post: item,
                      });
                    }}
                  >
                    {item.branch !== 'Nil' && item.branch}
                  </a>
                )}

                {item.type === 'Contra' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_journal',
                        post: item,
                      });
                    }}
                  >
                    {item.branch !== 'Nil' && item.branch}
                  </a>
                )}

                {item.type === 'Nil' && item.branch !== 'Nil' && (
                  <a>{item.branch}</a>
                )}
              </td>
            )}
            {creditDropDownFlag && (
              <td>
                {item.type === 'Receipt' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_receipt',
                        post: item,
                      });
                    }}
                  >
                    {item.chq_date !== 'Nil' && item.chq_date}
                  </a>
                )}

                {item.type === 'Voucher' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_voucher',
                        post: item,
                      });
                    }}
                  >
                    {item.chq_date !== 'Nil' && item.chq_date}
                  </a>
                )}

                {item.type === 'Contra' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_journal',
                        post: item,
                      });
                    }}
                  >
                    {item.chq_date !== 'Nil' && item.chq_date}
                  </a>
                )}
                {item.type === 'Nil' && item.chq_date !== 'Nil' && (
                  <a>{item.chq_date}</a>
                )}
              </td>
            )}
            {amountDropDownFlag && <td>{addCommas(item.amount)}</td>}

            {narrationDropDownFlag && <td>{item.description}</td>}
            <td>
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
              >
                <button className="btn">Delete</button>
              </a>
            </td>
          </tr>
        )
      );
    });

  // console.log('displayUsers', displayUsers);

  const displayUsersOnSearch = transactionHistoryData
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (val.branch.toLowerCase().includes(searchTerm.toLowerCase())) {
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
        val.tran_Date.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (
        val.chq_date.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (val.amount.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (
        val.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      }
    })
    .map((item) => {
      return (
        item.description !== 'ledger creation' && (
          <tr key={item.tranID}>
            {dateDropDownFlag && <td>{item.tran_Date}</td>}
            {debitDropDownFlag && (
              <td>
                {item.type === 'Receipt' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_receipt',
                        post: item,
                      });
                    }}
                  >
                    {item.branch !== 'Nil' && item.branch}
                  </a>
                )}

                {item.type === 'Voucher' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_voucher',
                        post: item,
                      });
                    }}
                  >
                    {item.branch !== 'Nil' && item.branch}
                  </a>
                )}

                {item.type === 'Contra' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_journal',
                        post: item,
                      });
                    }}
                  >
                    {item.branch !== 'Nil' && item.branch}
                  </a>
                )}

                {item.type === 'Nil' && item.branch !== 'Nil' && (
                  <a>{item.branch}</a>
                )}
              </td>
            )}
            {creditDropDownFlag && (
              <td>
                {item.type === 'Receipt' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_receipt',
                        post: item,
                      });
                    }}
                  >
                    {item.chq_date !== 'Nil' && item.chq_date}
                  </a>
                )}

                {item.type === 'Voucher' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_voucher',
                        post: item,
                      });
                    }}
                  >
                    {item.chq_date !== 'Nil' && item.chq_date}
                  </a>
                )}

                {item.type === 'Contra' && (
                  <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/edit_journal',
                        post: item,
                      });
                    }}
                  >
                    {item.chq_date !== 'Nil' && item.chq_date}
                  </a>
                )}
                {item.type === 'Nil' && item.chq_date !== 'Nil' && (
                  <a>{item.chq_date}</a>
                )}
              </td>
            )}
            {amountDropDownFlag && <td>{addCommas(item.amount)}</td>}

            {narrationDropDownFlag && <td>{item.description}</td>}
            <td>
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
              >
                <button className="btn">Delete</button>
              </a>
            </td>
          </tr>
        )
      );
    });

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    // console.log('selected', selected);
  };

  const submitFinal = handleSubmit(async (data) => {
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

      console.log('data loaded', dataLoaded);
      console.log('dataLoadedError', dataLoadedError);
      console.log('dataLoadedFlag', dataLoadedFlag);

      console.log('input_narration val', data.input_narration);
      console.log('input_amount_start val', data.input_amount_start);
      console.log('input_amount_end val', data.input_amount_end);
      console.log('filters_group val', data.filters_group);

      let field, val;

      if (narrationTextBoxFlag) {
        field = 'narration';
        val = data.input_narration;
      }

      if (amountTextBoxFlag) {
        field = 'amount';
        val = data.input_amount_start + ',' + data.input_amount_end;
      }

      if (groupTextBoxFlag) {
        field = 'group';
        val = data.filters_group;
      }

      setDateViewFlag(true);
      setLoadViewFlag(false);

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

      console.log('credit ', data.credit, ' debit ', data.debit);
      let c;
      if (data.credit !== '') {
        c = data.credit;
      } else {
        c = 'null';
      }

      let d;
      if (data.debit !== '') {
        d = data.debit;
      } else {
        d = 'null';
      }

      setDataLoadedFlag(false);
      console.log('dataLoadedFlag', dataLoadedFlag);
      axios
        .get(
          url +
            `transactionHistory_searching?start=${sDate}&end=${eDate}&debit=${d}&credit=${c}&field=${field}&val=${val}&CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
        .then(({ data }) => {
          console.log('data loaded', dataLoaded);
          console.log('dataLoadedError', dataLoadedError);

          console.log('data', data);
          setTransactionHistoryData(data);
          if (data[0] !== undefined) {
            setDataLoaded(true);
          }

          setDataLoadedError(false);
          setDataLoadedFlag(true);
        })
        .catch((err) => {
          setDataLoadedError(true);
          setDataLoadedFlag(true);
        });
    }
  });

  function sorting(field, type) {
    setDataLoaded(false);
    setDataLoadedError(true);
    console.log(field, type);
    setDataLoaded(false);
    setDataLoadedError(true);
    console.log(field, type);
    axios
      .get(
        url +
          `daybook_sorting?field=${field}&type=${type}&CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);

        if (field === 'debit') {
          if (type === 'ASC') {
            data.sort((a, b) => {
              let fa = a.branch.toLowerCase(),
                fb = b.branch.toLowerCase();

              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
            setTransactionHistoryData(data);
          } else {
            data.sort((a, b) => {
              let fa = a.branch.toLowerCase(),
                fb = b.branch.toLowerCase();

              if (fa > fb) {
                return -1;
              }
              if (fa < fb) {
                return 1;
              }
              return 0;
            });
            setTransactionHistoryData(data);
          }
        } else if (field === 'credit') {
          if (type === 'ASC') {
            data.sort((a, b) => {
              let fa = a.chq_date.toLowerCase(),
                fb = b.chq_date.toLowerCase();

              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
            setTransactionHistoryData(data);
          } else {
            data.sort((a, b) => {
              let fa = a.chq_date.toLowerCase(),
                fb = b.chq_date.toLowerCase();

              if (fa > fb) {
                return -1;
              }
              if (fa < fb) {
                return 1;
              }
              return 0;
            });
            setTransactionHistoryData(data);
          }
        } else {
          setTransactionHistoryData(data);
        }

        if (data[0].tranID !== null || data[0].tranID !== undefined) {
          setDataLoaded(true);
        }
        setDataLoadedError(false);

        setDataLoadedFlag(true);
        setDateViewFlag(false);
        setLoadViewFlag(true);
      })
      .catch((err) => {
        console.log(err);
        setDataLoadedError(true);
        setDataLoadedFlag(true);
      });
  }

  function deleting(tranId) {
    console.log(`tranId val`, tranId);
    axios
      .get(url + `dayBookDelete?tranId=${tranId}`)
      .then(({ data }) => {
        console.log('deleted data', data);
        if (data[0].user_bank === "can't") {
          successToast('We can not delete this data...try something else ');
        } else {
          successToast('Delete successfully');
        }
        accountLoading();
        accountLoading2();
        dataLoading();
      })
      .catch((error) => {});
  }

  const dataLoading = () => {
    axios
      .get(
        url +
          `dayBookData?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log('result ', data);
        setTransactionHistoryData(data);
        console.log('data', data);

        if (data[0].tranID !== null || data[0].tranID !== undefined) {
          setDataLoaded(true);
        }
        setDataLoadedError(false);

        setDateViewFlag(false);
        setLoadViewFlag(true);
        setDataLoadedFlag(true);
      })
      .catch((err) => {
        console.log(err);
        setDataLoadedError(true);
        setDataLoadedFlag(true);
      });
  };

  let finalArray1 = [];
  let finalArray2 = [];

  const unique = (value, index, self) => {
    // value = value.split(' ')[0];
    // console.log('value ', value, 'index ', index.value, 'self ', self);
    return self.indexOf(value) === index;
  };

  const accountLoading = () => {
    axios
      .get(
        url +
          `debitAcData?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        let arr = [];
        console.log(data);

        data.map((item) => {
          if (item.branch != '')
            arr.push({
              id: item.dbt_ac,
              name: item.branch,
            });
        });

        console.log('debitAc data', arr);
        let arr2 = [];
        let arr3 = [];
        for (let i = 0; i <= arr.length; i++) {
          for (let j = 0; j <= arr.length; j++) {
            if (arr[i].name === arr[j].name) {
              if (arr2.includes(arr[i].name)) {
                break;
              } else {
                arr2.push(arr[i].name);

                finalArray1.push({
                  id: arr[i].id,
                  name: arr[i].name,
                });
                setDebitAcData(finalArray1);
                break;
              }
            }
          }
          if (i === arr.length - 1) {
            setDebitDataLoadedFlag(true);
          }
        }
      })
      .catch((err) => {});
  };

  function accountLoading2() {
    axios
      .get(
        url +
          `creditAcData?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        let arr = [];

        data.map((item) => {
          if (item.branch != '')
            arr.push({
              id: item.crdt_ac,
              name: item.branch,
            });
        });

        let arr2 = [];
        let arr3 = [];
        for (let i = 0; i <= arr.length; i++) {
          for (let j = 0; j <= arr.length; j++) {
            if (arr[i].name === arr[j].name) {
              if (arr2.includes(arr[i].name)) {
                break;
              } else {
                arr2.push(arr[i].name);

                finalArray2.push({
                  id: arr[i].id,
                  name: arr[i].name,
                });
                // console.log(arr[i].name);
                setCreditAcData(finalArray2);
                break;
              }
            }
          }
          // console.log('finalArray2', finalArray2);
          if (i === arr.length - 1) {
            setCreditDataLoadedFlag(true);
          }
        }
      })
      .catch(({ error }) => {});
  }

  function grpLoading() {
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
        setGrpName(data);
        setGrpNameLoad(true);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      accountLoading();
      accountLoading2();
      dataLoading();
      grpLoading();

      let mgrDate = localStorage.getItem('migrationDate');

      if (mgrDate !== null && mgrDate !== undefined && mgrDate !== '') {
        let k = mgrDate;
        console.log(k.split('-'));
        let i = new Date(k.split('-')[0], k.split('-')[1] - 1, k.split('-')[2]);
        console.log(i);
        setStartDate(i);
      }
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '.00';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    if (x2.length === 2) {
      x2 = x2 + '0';
    }
    return x1 + x2;
  }

  function dateReset() {
    window.location.reload();
  }

  // function dataSearch(nStr) {
  //   axios
  //     .get(url + `transactionHistory_searching?field=${field}&val=${type}`)
  //     .then(({ data }) => {
  //       console.log(`data search`, data);
  //     })
  //     .catch(({ error }) => {});

  //   // let Arr = [];
  //   // for (let i = 0; i < transactionHistoryData.length; i++) {
  //   //   if (transactionHistoryData[i].description === nStr) {
  //   //     console.log(`Item Found`);
  //   //     Arr[i] = transactionHistoryData[i];
  //   //   }
  //   // }
  //   // console.log('Arr ', Arr);
  //   // // setTransactionHistoryData(Arr);
  // }

  return (
    <div>
      <Headers />
      {/* {dataLoadedFlag && debitDataLoadedFlag && creditDataLoadedFlag ? ( */}
      <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
        <div className="container-fluid">
          <div className="page-header">
            <div className="pull-left">
              <h1>Transaction History</h1>
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
                        <div className="col-sm-6">
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
                        <div className="col-sm-6">
                          <DatePicker
                            className="form-control"
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
                        <input
                          type="submit"
                          name="submit"
                          className="btn btn-primary btn-lg"
                          defaultValue="Search"
                          onClick={(e) => {
                            setDataLoaded(false);
                            setDataLoadedError(true);
                            // setDataLoadedFlag(false);
                            e.preventDefault();
                            submitFinal();
                          }}
                        />
                        &nbsp;
                        <input
                          type="button"
                          name="reset"
                          className="btn btn-light btn-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            dateReset();
                          }}
                          defaultValue="Reset"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-5 form-group">
                        <label
                          htmlFor="textfield"
                          className="control-label col-sm-2"
                        >
                          Debit A/c
                        </label>
                        <div className="col-sm-6">
                          <select
                            name="debit"
                            className="form-control"
                            {...register('debit')}
                          >
                            <option value="">select A/c</option>
                            {debitDataLoadedFlag &&
                              debitAcData.map((item) => {
                                return (
                                  item.name !== 'Nil' && (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  )
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-5 form-group">
                        <label
                          htmlFor="textfield"
                          className="control-label col-sm-2"
                        >
                          Credit A/c
                        </label>
                        <div className="col-sm-6">
                          <select
                            name="credit"
                            className="form-control"
                            {...register('credit')}
                          >
                            {console.log('dd', finalArray1)}
                            <option value="">select A/c</option>
                            {creditDataLoadedFlag &&
                              creditAcData.map((item) => {
                                return (
                                  item.name !== 'Nil' && (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  )
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-5 form-group">
                        <label
                          htmlFor="textfield"
                          className="control-label col-sm-2"
                        >
                          Filters
                        </label>
                        <div className="col-sm-5">
                          <select
                            size={3}
                            name="filters"
                            className="form-control"
                            id="filters"
                          >
                            <option
                              value="description"
                              // onMouseEnter={(e) => {
                              //   setNarrationTextBoxFlag(true);
                              //   setAmountTextBoxFlag(false);
                              //   setGroupTextBoxFlag(false);
                              // }}

                              onClick={(e) => {
                                setNarrationTextBoxFlag(true);
                                setAmountTextBoxFlag(false);
                                setGroupTextBoxFlag(false);
                              }}
                            >
                              Narration
                            </option>
                            <option
                              value="amount"
                              onClick={(e) => {
                                setAmountTextBoxFlag(true);
                                setNarrationTextBoxFlag(false);
                                setGroupTextBoxFlag(false);
                              }}
                            >
                              Amount
                            </option>
                            <option
                              value="ac_groups"
                              onClick={(e) => {
                                setGroupTextBoxFlag(true);
                                setAmountTextBoxFlag(false);
                                setNarrationTextBoxFlag(false);
                              }}
                            >
                              Account Groups
                            </option>
                          </select>
                        </div>
                      </div>
                      <div id="filtersinput" className="col-sm-2">
                        {narrationTextBoxFlag && (
                          <input
                            id="input_narration"
                            name="input_narration"
                            className="form-control type="
                            placeholder="Narration"
                            // onKeyPress={(e) => {
                            //   dataSearch(e.target.value);
                            // }}
                            {...register('input_narration')}
                          />
                        )}
                        {amountTextBoxFlag && (
                          <input
                            id="input_amount_start"
                            name="input_amount_start"
                            className="form-control type="
                            placeholder="from"
                            {...register('input_amount_start')}
                          />
                        )}
                        {amountTextBoxFlag && (
                          <input
                            id="input_amount_end"
                            name="input_amount_end"
                            className="form-control type="
                            placeholder="to"
                            {...register('input_amount_end')}
                          />
                        )}

                        {groupTextBoxFlag && grpNameLoad && (
                          <select
                            name="filters_group"
                            className="form-control"
                            id="filters_group"
                            {...register('filters_group')}
                          >
                            <option value style={{ display: 'none' }}>
                              groups
                            </option>
                            {grpName.map((item) => {
                              return (
                                <option
                                  key={item.group_id}
                                  value={item.group_id}
                                >
                                  {item.group_name}
                                </option>
                              );
                            })}
                            {/* <option value={1}>sundry creditors</option>
                            <option value={3}>Bank</option>
                            <option value={5}>sundry debtors</option>
                            <option value={97}>Direct Expenses</option>
                            <option value={99}>Current Asset</option>
                            <option value={100}>
                              Loans and Advances (liability)
                            </option>
                            <option value={109}>Indirect Expense</option>
                            <option value={121}>Cash in Hand</option>
                            <option value={137}>Sales</option>
                            <option value={138}>Suspense Account</option>
                            <option value={139}>Current Laibility</option>
                            <option value={140}>Duties &amp; Taxes</option>
                            <option value={141}>Capital account</option>
                            <option value={142}>Direct Income</option>
                            <option value={143}>Indirect Income</option>
                            <option value={144}>Investment</option>
                            <option value={146}>Server Expense</option>
                            <option value={147}>Fixed Asset</option> */}
                          </select>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row" style={{ paddingLeft: '22px' }}>
            <div className="col-sm-12">
              <div className="box box-color box-bordered">
                <div className="box-title">
                  <h3>
                    <i className="fa fa-table" />
                    Transaction History
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
                    >
                      <thead>
                        <tr role="row">
                          <th
                            className={
                              (dateSortFlag == 0 && 'sorting') ||
                              (dateSortFlag == 1 && 'sorting_asc') ||
                              (dateSortFlag == 2 && 'sorting_desc')
                            }
                            width={250}
                            tabIndex={0}
                            aria-controls="DataTables_Table_0"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Date: activate to sort column descending"
                            style={{ width: '30px' }}
                            aria-sort={
                              (dateSortFlag == 0 && '') ||
                              (dateSortFlag == 1 && ' ascending') ||
                              (dateSortFlag == 2 && 'descending')
                            }
                            onClick={(e) => {
                              if (dateSortFlag == 0) {
                                setDateSortFlag(1);
                                setAmountSortFlag(0);
                                setVoucherTypeSortFlag(0);
                                setVoucherNoSortFlag(0);
                                setNarrationSortFlag(0);
                                setDebitSortFlag(0);
                                setCreditSortFlag(0);

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
                            width={250}
                            className={
                              (debitSortFlag == 0 && 'sorting') ||
                              (debitSortFlag == 1 && 'sorting_asc') ||
                              (debitSortFlag == 2 && 'sorting_desc')
                            }
                            tabIndex={0}
                            aria-controls="DataTables_Table_0"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Debit: activate to sort column ascending"
                            style={{ width: '56px' }}
                            aria-sort={
                              (debitSortFlag == 0 && '') ||
                              (debitSortFlag == 1 && ' ascending') ||
                              (debitSortFlag == 2 && 'descending')
                            }
                            onClick={(e) => {
                              if (debitSortFlag == 0) {
                                setDateSortFlag(0);
                                setAmountSortFlag(0);
                                setVoucherTypeSortFlag(0);
                                setVoucherNoSortFlag(0);
                                setDebitSortFlag(1);
                                setCreditSortFlag(0);
                                setNarrationSortFlag(0);

                                sorting('debit', 'ASC');
                              }
                              if (debitSortFlag == 1) {
                                setDebitSortFlag(2);
                                sorting('debit', 'DESC');
                              }
                              if (debitSortFlag == 2) {
                                setDebitSortFlag(1);
                                sorting('debit', 'ASC');
                              }
                            }}
                          >
                            Debit Account
                          </th>

                          <th
                            width={250}
                            className={
                              (creditSortFlag == 0 && 'sorting') ||
                              (creditSortFlag == 1 && 'sorting_asc') ||
                              (creditSortFlag == 2 && 'sorting_desc')
                            }
                            tabIndex={0}
                            aria-controls="DataTables_Table_0"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Credit: activate to sort column ascending"
                            style={{ width: '56px' }}
                            aria-sort={
                              (creditSortFlag == 0 && '') ||
                              (creditSortFlag == 1 && ' ascending') ||
                              (creditSortFlag == 2 && 'descending')
                            }
                            onClick={(e) => {
                              if (creditSortFlag == 0) {
                                setDateSortFlag(0);
                                setAmountSortFlag(0);
                                setVoucherTypeSortFlag(0);
                                setVoucherNoSortFlag(0);
                                setDebitSortFlag(0);
                                setCreditSortFlag(1);
                                setNarrationSortFlag(0);

                                sorting('credit', 'ASC');
                              }
                              if (creditSortFlag == 1) {
                                setCreditSortFlag(2);
                                sorting('credit', 'DESC');
                              }
                              if (creditSortFlag == 2) {
                                setCreditSortFlag(1);
                                sorting('credit', 'ASC');
                              }
                            }}
                          >
                            Credit Account
                          </th>

                          <th
                            width={250}
                            className={
                              (amountSortFlag == 0 && 'sorting') ||
                              (amountSortFlag == 1 && 'sorting_asc') ||
                              (amountSortFlag == 2 && 'sorting_desc')
                            }
                            tabIndex={0}
                            aria-controls="DataTables_Table_0"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Ledger: activate to sort column ascending"
                            style={{ width: '47px' }}
                            aria-sort={
                              (amountSortFlag == 0 && '') ||
                              (amountSortFlag == 1 && ' ascending') ||
                              (amountSortFlag == 2 && 'descending')
                            }
                            onClick={(e) => {
                              if (amountSortFlag == 0) {
                                setDateSortFlag(0);
                                setAmountSortFlag(1);
                                setVoucherTypeSortFlag(0);
                                setVoucherNoSortFlag(0);
                                setDebitSortFlag(0);
                                setCreditSortFlag(0);
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
                            width={250}
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
                            style={{ width: '60px' }}
                            aria-sort={
                              (narrationSortFlag == 0 && '') ||
                              (narrationSortFlag == 1 && ' ascending') ||
                              (narrationSortFlag == 2 && 'descending')
                            }
                            onClick={(e) => {
                              if (narrationSortFlag == 0) {
                                setDateSortFlag(0);
                                setAmountSortFlag(0);
                                setVoucherTypeSortFlag(0);
                                setVoucherNoSortFlag(0);
                                setDebitSortFlag(0);
                                setCreditSortFlag(0);
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
                            tabIndex={0}
                            aria-controls="DataTables_Table_0"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Action: activate to sort column ascending"
                            style={{ width: '47px' }}
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
                            {transactionHistoryData.length - pagesVisited <
                            parseInt(usersPerPage)
                              ? pagesVisited +
                                (transactionHistoryData.length - pagesVisited)
                              : pagesVisited * 1 + parseInt(usersPerPage)}{' '}
                            of {transactionHistoryData.length} entries
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
                          nextLinkClassName={'paginate_button next disabled'}
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
      {/* ) : (
        <PageLoader />
      )} */}
    </div>
  );
};

export default TransactionHistory;
