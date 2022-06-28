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
import { profit_loss, profit_loss_bn_date } from '../modal';
import PageLoader from '../Page Loader/pageloader';
import ReactToExcel from 'react-html-table-to-excel';
import Headers from '../Header/Headers';

const Profit_loss = () => {
  let history = useHistory();
  let url = baseUrl.url;

  const [directIncomeData, setDirectIncomeData] = useState([]);
  const [primaryIncomeData, setPrimaryIncomeData] = useState([]);
  const [directExpensesData, setDirectExpensesData] = useState([]);
  const [primaryExpensesData, setPrimaryExpensesData] = useState([]);
  const [plDataLoaded, setPlDataLoaded] = useState(false);
  const [totalIncomeData, setTotalIncomeData] = useState();
  const [totalExpensesData, setTotalExpensesData] = useState();
  const [plDataErrorFlag, setPlDataErrorFlag] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);
  const [customFlag, setCustomFlag] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

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

      // let ledger_id = ledgerIdData;

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

      try {
        const result = await profit_loss_bn_date({
          title: '6',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('directIncomeData', result);
        setDirectIncomeData(result);

        const result1 = await profit_loss_bn_date({
          title: '8',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('primaryIncomeData', result1);
        setPrimaryIncomeData(result1);

        const result2 = await profit_loss_bn_date({
          title: '7',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('directExpensesData', result2);
        setDirectExpensesData(result2);

        const result3 = await profit_loss_bn_date({
          title: '9',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('primaryExpensesData', result3);
        setPrimaryExpensesData(result3);

        // setTotalIncomeData(
        //   parseFloat(result[0].branch) + parseFloat(result1[0].branch)
        // );

        // setTotalExpensesData(
        //   parseFloat(result2[0].branch) + parseFloat(result3[0].branch)
        // );

        setTotalIncomeData(
          parseFloat(result[0] != null ? result[0].branch : '0.00') +
            parseFloat(result1[0] != null ? result1[0].branch : '0.00')
        );

        setTotalExpensesData(
          parseFloat(result2[0] != null ? result2[0].branch : '0.00') +
            parseFloat(result3[0] != null ? result3[0].branch : '0.00')
        );

        setPlDataLoaded(true);
        setPlDataErrorFlag(false);
      } catch (error) {
        setPlDataErrorFlag(true);
      }
    }
  });

  const filterFun = async () => {
    let dateVal = localStorage.getItem('P&LdateFilter');

    ///////////////////new code//////////////////

    // let mgrDate = localStorage.getItem('migrationDate');

    // console.log(`mgrDate`, mgrDate);

    //////////////////////////////////////////////

    var startdate = new Date();
    var enddate = new Date();

    console.log('current date ', startdate);

    if (dateVal === '0') {
      startdate.setDate(1);
    }

    if (dateVal === '1') {
      startdate.setMonth(startdate.getMonth() - dateVal);
    }

    if (dateVal === '2') {
      startdate.setMonth(3);
      startdate.setDate(1);

      enddate.setMonth(2);
      enddate.setDate(31);

      var today = new Date();

      if (today.getMonth() + 1 <= 3) {
        startdate.setFullYear(today.getFullYear() - 1);
        enddate.setFullYear(today.getFullYear());
      } else {
        startdate.setFullYear(today.getFullYear());

        enddate.setFullYear(today.getFullYear() + 1);
      }
    }

    if (dateVal === '3') {
      startdate.setMonth(3);
      startdate.setDate(1);

      enddate.setMonth(2);
      enddate.setDate(31);

      var today = new Date();

      if (today.getMonth() + 1 <= 3) {
        startdate.setFullYear(today.getFullYear() - 2);
        enddate.setFullYear(today.getFullYear() - 1);
      } else {
        startdate.setFullYear(today.getFullYear() - 1);

        enddate.setFullYear(today.getFullYear());
      }
    }

    ///////////////////new code//////////////////

    // if (dateVal === '2' && mgrDate !== '') {
    //   // console.log(`inserted 1`);
    //   let k = mgrDate;
    //   console.log(k.split('-'));
    //   let i = new Date(k.split('-')[0], k.split('-')[1] - 1, k.split('-')[2]);
    //   startdate = i;

    //   enddate.setMonth(2);
    //   enddate.setDate(31);

    //   var today = new Date();

    //   if (i.getMonth() + 1 <= 3) {
    //     // startdate.setFullYear(today.getFullYear() - 1);
    //     enddate.setFullYear(i.getFullYear());
    //   } else {
    //     // startdate.setFullYear(today.getFullYear());

    //     enddate.setFullYear(i.getFullYear() + 1);
    //   }
    // }

    // if (dateVal === '2' && mgrDate === '') {
    //   //console.log(`inserted 2`);
    //   startdate.setMonth(3);
    //   startdate.setDate(1);

    //   enddate.setMonth(2);
    //   enddate.setDate(31);

    //   var today = new Date();

    //   if (today.getMonth() + 1 <= 3) {
    //     startdate.setFullYear(today.getFullYear() - 1);
    //     enddate.setFullYear(today.getFullYear());
    //   } else {
    //     startdate.setFullYear(today.getFullYear());

    //     enddate.setFullYear(today.getFullYear() + 1);
    //   }
    // }

    // if (dateVal === '3' && mgrDate !== '') {
    //   let k = mgrDate;
    //   console.log(k.split('-'));
    //   let i = new Date(k.split('-')[0], k.split('-')[1] - 1, k.split('-')[2]);
    //   startdate = i;
    //   startdate.setFullYear(i.getFullYear() - 1);

    //   enddate.setMonth(2);
    //   enddate.setDate(31);

    //   var today = new Date();

    //   if (i.getMonth() + 1 <= 3) {
    //     // startdate.setFullYear(today.getFullYear() - 1);
    //     enddate.setFullYear(i.getFullYear());
    //   } else {
    //     // startdate.setFullYear(today.getFullYear());

    //     enddate.setFullYear(i.getFullYear() + 1);
    //   }
    // }

    // if (dateVal === '3' && mgrDate === '') {
    //   startdate.setMonth(3);
    //   startdate.setDate(1);

    //   enddate.setMonth(2);
    //   enddate.setDate(31);

    //   var today = new Date();

    //   if (today.getMonth() + 1 <= 3) {
    //     startdate.setFullYear(today.getFullYear() - 2);
    //     enddate.setFullYear(today.getFullYear() - 1);
    //   } else {
    //     startdate.setFullYear(today.getFullYear() - 1);

    //     enddate.setFullYear(today.getFullYear());
    //   }
    // }

    //////////////////////////////////////////

    // let ledger_id = ledgerIdData;

    if (startdate.getDate() < 10) {
      var currentDay = '0' + startdate.getDate();
    } else {
      var currentDay = startdate.getDate();
    }

    if (startdate.getMonth() + 1 < 10) {
      var currentMonth = '0' + (startdate.getMonth() + 1);
    } else {
      var currentMonth = startdate.getMonth() + 1;
    }

    var sDate = startdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

    if (enddate.getDate() < 10) {
      var currentDay = '0' + enddate.getDate();
    } else {
      var currentDay = enddate.getDate();
    }

    if (enddate.getMonth() + 1 < 10) {
      var currentMonth = '0' + (enddate.getMonth() + 1);
    } else {
      var currentMonth = enddate.getMonth() + 1;
    }

    var eDate = enddate.getFullYear() + '-' + currentMonth + '-' + currentDay;

    console.log(sDate, '', eDate);

    try {
      const result = await profit_loss_bn_date({
        title: '6',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('directIncomeData', result);
      setDirectIncomeData(result);

      const result1 = await profit_loss_bn_date({
        title: '8',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('primaryIncomeData', result1);
      setPrimaryIncomeData(result1);

      const result2 = await profit_loss_bn_date({
        title: '7',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('directExpensesData', result2);
      setDirectExpensesData(result2);

      const result3 = await profit_loss_bn_date({
        title: '9',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('primaryExpensesData', result3);
      setPrimaryExpensesData(result3);

      // setTotalIncomeData(
      //   parseFloat(result[0].branch) + parseFloat(result1[0].branch)
      // );

      // setTotalExpensesData(
      //   parseFloat(result2[0].branch) + parseFloat(result3[0].branch)
      // );

      setTotalIncomeData(
        parseFloat(result[0] != null ? result[0].branch : '0.00') +
          parseFloat(result1[0] != null ? result1[0].branch : '0.00')
      );

      setTotalExpensesData(
        parseFloat(result2[0] != null ? result2[0].branch : '0.00') +
          parseFloat(result3[0] != null ? result3[0].branch : '0.00')
      );

      setPlDataLoaded(true);
      setPlDataErrorFlag(false);
    } catch (error) {
      setPlDataErrorFlag(true);
    }
  };

  const dataLoading = async () => {
    try {
      const result = await profit_loss({
        title: '6',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('directIncomeData', result);
      setDirectIncomeData(result);

      const result1 = await profit_loss({
        title: '8',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('primaryIncomeData', result1);
      setPrimaryIncomeData(result1);

      const result2 = await profit_loss({
        title: '7',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('directExpensesData', result2);
      setDirectExpensesData(result2);

      const result3 = await profit_loss({
        title: '9',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('primaryExpensesData', result3);
      setPrimaryExpensesData(result3);

      // setTotalIncomeData(
      //   parseFloat(result[0].branch) + parseFloat(result1[0].branch)
      // );

      // setTotalExpensesData(
      //   parseFloat(result2[0].branch) + parseFloat(result3[0].branch)
      // );

      setTotalIncomeData(
        parseFloat(result[0] != null ? result[0].branch : '0.00') +
          parseFloat(result1[0] != null ? result1[0].branch : '0.00')
      );

      setTotalExpensesData(
        parseFloat(result2[0] != null ? result2[0].branch : '0.00') +
          parseFloat(result3[0] != null ? result3[0].branch : '0.00')
      );

      setPlDataLoaded(true);
      setPlDataErrorFlag(false);
    } catch (error) {
      setPlDataErrorFlag(true);
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

  function addCommas(nStr) {
    // nStr += '';
    // var x = nStr.split('.');
    // var x1 = x[0];
    // var x2 = x.length > 1 ? '.' + x[1] : '.00';
    // var rgx = /(\d+)(\d{3})/;
    // while (rgx.test(x1)) {
    //   x1 = x1.replace(rgx, '$1' + ',' + '$2');
    // }

    // console.log(`x2 `, x2);

    // if (x2.length === 2) {
    //   x2 = x2 + '0';
    // }

    // return x1 + x2;

    return format(parseFloat(nStr));
  }

  const format = (num, decimals) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  function prints(el) {
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById('id2').innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;
    window.location.reload();
  }

  return (
    <div>
      <Headers />

      {/* {plDataLoaded ? ( */}
      <div className="container-fluid" id="content">
        <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
          <div className="container-fluid">
            <div className="page-header">
              <div className="pull-left">
                <h1>Profit &amp; Loss</h1>
              </div>
            </div>

            <br />
            <div className="col-sm-12">
              <form className="form-horizontal" method="post">
                <div className="row">
                  <div className="col-sm-2 form-group">
                    <select
                      id="srch_by_mnths"
                      className="form-control"
                      name="srch_by_mnths"
                      onChange={(e) => {
                        if (e.target.value === '4') {
                          setCustomFlag(true);
                        } else {
                          setCustomFlag(false);

                          localStorage.setItem('P&LdateFilter', e.target.value);

                          filterFun(e.target.value);
                        }
                      }}
                    >
                      <option value=""> -- select time slot -- </option>
                      <option value={0}>This month</option>
                      <option value={1}>Last month</option>
                      <option value={2}>This Financial Year</option>
                      <option value={3}>Last Financial Year</option>
                      <option value={4}>Custom</option>
                    </select>
                  </div>
                  {customFlag && (
                    <>
                      <div className="col-sm-4 form-group">
                        <label
                          htmlFor="textfield"
                          className="control-label col-sm-2"
                        >
                          Start Date
                        </label>
                        <div className="col-sm-9">
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
                      <div className="col-sm-4 form-group">
                        <label
                          htmlFor="textfield"
                          className="control-label col-sm-2"
                        >
                          End Date
                        </label>
                        <div className="col-sm-9">
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
                          onClick={(e) => {
                            e.preventDefault();
                            submitFinal();
                          }}
                          defaultValue="Search"
                        />
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="box box-color box-bordered blue">
                  <div className="box-title">
                    <h3>
                      <i className="fa fa-table" />
                      Profit &amp; Loss
                    </h3>
                  </div>
                  <div className="box-content nopadding">
                    <br />
                    <div className="col-sm-6">
                      <table className="table-responsive  table table-hover">
                        <caption>
                          <h3>Income</h3>
                        </caption>
                        <tbody>
                          <tr>
                            <th>
                              <h5>
                                <b>Direct Income</b>
                              </h5>
                            </th>
                            <th />
                          </tr>
                          {directIncomeData.map((item) => {
                            return (
                              item.amount != 0 && (
                                <tr>
                                  <td align="left">
                                    <a
                                      style={{
                                        color: 'black',
                                      }}
                                      onClick={(e) => {
                                        history.push({
                                          pathname: '/view_statement',
                                          post: item.id,
                                        });
                                        localStorage.setItem(
                                          'AccStmtLedger_id',
                                          item.id
                                        );
                                      }}
                                    >
                                      {item.ledger_name}
                                    </a>
                                  </td>

                                  <td align="right">
                                    {addCommas(item.amount)}
                                  </td>
                                </tr>
                              )
                            );
                          })}
                          <tr>
                            <th>Total</th>
                            <th>
                              <div className="pull-right">
                                {directIncomeData.length > 0
                                  ? addCommas(directIncomeData[0].branch)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>
                              <h5>
                                <b>Primary Income</b>
                              </h5>
                              <h5 />
                            </th>
                            <th />
                          </tr>
                          {primaryIncomeData.map((item) => {
                            return (
                              item.amount != 0 && (
                                <tr>
                                  <td align="left">
                                    <a
                                      style={{ color: 'black' }}
                                      onClick={(e) => {
                                        history.push({
                                          pathname: '/view_statement',
                                          post: item.id,
                                        });
                                        localStorage.setItem(
                                          'AccStmtLedger_id',
                                          item.id
                                        );
                                      }}
                                    >
                                      {item.ledger_name}
                                    </a>
                                  </td>
                                  <td align="right">
                                    {addCommas(item.amount)}
                                  </td>
                                </tr>
                              )
                            );
                          })}
                          <tr>
                            <th>Total</th>
                            <th>
                              <div className="pull-right">
                                {primaryIncomeData.length > 0
                                  ? addCommas(primaryIncomeData[0].branch)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>Total Income</th>
                            <th>
                              <div className="pull-right">
                                {totalIncomeData !== '' ||
                                totalIncomeData !== null ||
                                totalIncomeData !== undefined
                                  ? addCommas(totalIncomeData)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-sm-6">
                      <table className="table-responsive  table table-hover">
                        <caption>
                          <h3>Expense</h3>
                        </caption>
                        <tbody>
                          <tr>
                            <th>
                              <h5>
                                <b>Direct Expenses</b>
                              </h5>
                            </th>
                            <th />
                          </tr>
                          {directExpensesData.map((item) => {
                            return (
                              item.amount != 0 && (
                                <tr>
                                  <td align="left">{item.ledger_name}</td>
                                  <td align="right">
                                    {addCommas(item.amount)}
                                  </td>
                                </tr>
                              )
                            );
                          })}
                          <tr>
                            <th>Total</th>
                            <th>
                              <div className="pull-right">
                                {directExpensesData.length > 0
                                  ? addCommas(directExpensesData[0].branch)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>Primary Expenses</th>
                            <th />
                          </tr>
                          {primaryExpensesData.map((item) => {
                            return (
                              item.amount != 0 && (
                                <tr>
                                  <td align="left">
                                    <a
                                      style={{ color: 'black' }}
                                      onClick={(e) => {
                                        history.push({
                                          pathname: '/view_statement',
                                          post: item.id,
                                        });
                                        localStorage.setItem(
                                          'AccStmtLedger_id',
                                          item.id
                                        );
                                      }}
                                    >
                                      {item.ledger_name}
                                    </a>
                                  </td>
                                  <td align="right">
                                    {addCommas(item.amount)}
                                  </td>
                                </tr>
                              )
                            );
                          })}
                          <tr>
                            <th>Total</th>
                            <th>
                              <div className="pull-right">
                                {primaryExpensesData.length > 0
                                  ? addCommas(primaryExpensesData[0].branch)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>Total Expenses</th>
                            <th>
                              <div className="pull-right">
                                {totalExpensesData !== '' ||
                                totalExpensesData !== null ||
                                totalExpensesData !== undefined
                                  ? addCommas(totalExpensesData)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p />
                    <p />
                    <div className="col-sm-12">
                      <table className="table-responsive  table table-hover">
                        <tbody>
                          <tr>
                            <td>
                              <h4>
                                <b>
                                  <div className="pull-left">
                                    {totalIncomeData > totalExpensesData
                                      ? 'Net Profit'
                                      : 'Net Loss'}
                                  </div>
                                </b>
                              </h4>
                            </td>
                            <td>
                              <h4>
                                <b>
                                  <div className="pull-right">
                                    {totalIncomeData > totalExpensesData
                                      ? addCommas(
                                          parseFloat(totalIncomeData) -
                                            parseFloat(totalExpensesData)
                                        )
                                      : addCommas(
                                          parseFloat(totalExpensesData) -
                                            parseFloat(totalIncomeData)
                                        )}
                                  </div>
                                </b>
                              </h4>
                            </td>
                          </tr>
                          <br></br>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <table border="1px" id="id1" hidden>
                      <tbody>
                        <tr>
                          <td>
                            <table border="1px">
                              <tbody>
                                <tr>
                                  <td align="center" colSpan={2}>
                                    <h3>Income</h3>
                                  </td>
                                </tr>
                                <tr>
                                  <th align="left" colSpan={2}>
                                    <h5>
                                      <b>Direct Income</b>
                                    </h5>
                                  </th>
                                </tr>
                                {directIncomeData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr>
                                        <td align="left">
                                          <a
                                            style={{
                                              color: 'black',
                                            }}
                                            onClick={(e) => {
                                              history.push({
                                                pathname: '/view_statement',
                                                post: item.id,
                                              });
                                              localStorage.setItem(
                                                'AccStmtLedger_id',
                                                item.id
                                              );
                                            }}
                                          >
                                            {item.ledger_name}
                                          </a>
                                        </td>

                                        <td align="right">
                                          {addCommas(item.amount)}
                                        </td>
                                      </tr>
                                    )
                                  );
                                })}

                                <tr>
                                  <th align="left">Total</th>
                                  <th>
                                    <div className="pull-right">
                                      {directIncomeData.length > 0
                                        ? addCommas(directIncomeData[0].branch)
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <th align="left" colSpan={2}>
                                    <h5>
                                      <b>Primary Income</b>
                                    </h5>
                                    <h5 />
                                  </th>
                                </tr>
                                {primaryIncomeData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr>
                                        <td align="left">
                                          <a
                                            style={{ color: 'black' }}
                                            onClick={(e) => {
                                              history.push({
                                                pathname: '/view_statement',
                                                post: item.id,
                                              });
                                              localStorage.setItem(
                                                'AccStmtLedger_id',
                                                item.id
                                              );
                                            }}
                                          >
                                            {item.ledger_name}
                                          </a>
                                        </td>
                                        <td align="right">
                                          {addCommas(item.amount)}
                                        </td>
                                      </tr>
                                    )
                                  );
                                })}
                                <tr>
                                  <th align="left">Total</th>
                                  <th>
                                    <div className="pull-right">
                                      {primaryIncomeData.length > 0
                                        ? addCommas(primaryIncomeData[0].branch)
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <th align="left">Total Income</th>
                                  <th>
                                    <div className="pull-right">
                                      {totalIncomeData !== '' ||
                                      totalIncomeData !== null ||
                                      totalIncomeData !== undefined
                                        ? addCommas(totalIncomeData)
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td style={{ border: 'none' }} />
                          <td>
                            <table border="1px">
                              <tbody>
                                <tr>
                                  <td align="center" colSpan={2}>
                                    <h3>Expense</h3>
                                  </td>
                                </tr>
                                <tr>
                                  <th align="left" colSpan={2}>
                                    <h5>
                                      <b>Direct Expenses</b>
                                    </h5>
                                  </th>
                                </tr>
                                {directExpensesData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr>
                                        <td align="left">{item.ledger_name}</td>
                                        <td align="right">
                                          {addCommas(item.amount)}
                                        </td>
                                      </tr>
                                    )
                                  );
                                })}
                                <tr>
                                  <th align="left">Total</th>
                                  <th>
                                    <div className="pull-right">
                                      {directExpensesData.length > 0
                                        ? addCommas(
                                            directExpensesData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td align="left" colSpan={2}>
                                    Primary Expenses
                                  </td>
                                </tr>
                                {primaryExpensesData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr>
                                        <td align="left">
                                          <a
                                            style={{ color: 'black' }}
                                            onClick={(e) => {
                                              history.push({
                                                pathname: '/view_statement',
                                                post: item.id,
                                              });
                                              localStorage.setItem(
                                                'AccStmtLedger_id',
                                                item.id
                                              );
                                            }}
                                          >
                                            {item.ledger_name}
                                          </a>
                                        </td>
                                        <td align="right">
                                          {addCommas(item.amount)}
                                        </td>
                                      </tr>
                                    )
                                  );
                                })}
                                <tr>
                                  <th align="left">Total</th>
                                  <th>
                                    <div className="pull-right">
                                      {primaryExpensesData.length > 0
                                        ? addCommas(
                                            primaryExpensesData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <th align="left">Total Expenses</th>
                                  <th>
                                    <div className="pull-right">
                                      {totalExpensesData !== '' ||
                                      totalExpensesData !== null ||
                                      totalExpensesData !== undefined
                                        ? addCommas(totalExpensesData)
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        <table border="1px">
                          <tbody>
                            <tr>
                              <td colSpan={4}>
                                <h4>
                                  <b>
                                    {' '}
                                    <div className="pull-left">
                                      {totalIncomeData > totalExpensesData
                                        ? 'Net Profit'
                                        : 'Net Loss'}
                                    </div>
                                  </b>
                                </h4>
                              </td>
                              <td>
                                <h4>
                                  <b>
                                    <div className="pull-right">
                                      {totalIncomeData > totalExpensesData
                                        ? addCommas(
                                            parseFloat(totalIncomeData) -
                                              parseFloat(totalExpensesData)
                                          )
                                        : addCommas(
                                            parseFloat(totalExpensesData) -
                                              parseFloat(totalIncomeData)
                                          )}
                                    </div>
                                  </b>
                                </h4>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </tbody>
                    </table>
                  </div>
                  {/* ////////////////////pdf export code///////////////// */}
                  <div id="id2" hidden>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="box box-color box-bordered blue">
                          <div className="box-title">
                            <h3>
                              <i className="fa fa-table" />
                              Profit &amp; Loss
                            </h3>
                          </div>
                          <div className="box-content nopadding">
                            <br />
                            <div className="col-sm-6">
                              <table className="table-responsive  table table-hover">
                                <caption>
                                  <h3>Income</h3>
                                </caption>
                                <tbody>
                                  <tr>
                                    <th>
                                      <h5>
                                        <b>Direct Income</b>
                                      </h5>
                                    </th>
                                    <th />
                                  </tr>
                                  {directIncomeData.map((item) => {
                                    return (
                                      item.amount != 0 && (
                                        <tr>
                                          <td align="left">
                                            <a
                                              style={{
                                                color: 'black',
                                              }}
                                              onClick={(e) => {
                                                history.push({
                                                  pathname: '/view_statement',
                                                  post: item.id,
                                                });
                                                localStorage.setItem(
                                                  'AccStmtLedger_id',
                                                  item.id
                                                );
                                              }}
                                            >
                                              {item.ledger_name}
                                            </a>
                                          </td>

                                          <td align="right">
                                            {addCommas(item.amount)}
                                          </td>
                                        </tr>
                                      )
                                    );
                                  })}
                                  <tr>
                                    <th>Total</th>
                                    <th>
                                      <div className="pull-right">
                                        {directIncomeData.length > 0
                                          ? addCommas(
                                              directIncomeData[0].branch
                                            )
                                          : '0.00'}
                                      </div>
                                    </th>
                                  </tr>
                                  <tr>
                                    <th>
                                      <h5>
                                        <b>Primary Income</b>
                                      </h5>
                                      <h5 />
                                    </th>
                                    <th />
                                  </tr>
                                  {primaryIncomeData.map((item) => {
                                    return (
                                      item.amount != 0 && (
                                        <tr>
                                          <td align="left">
                                            <a
                                              style={{ color: 'black' }}
                                              onClick={(e) => {
                                                history.push({
                                                  pathname: '/view_statement',
                                                  post: item.id,
                                                });
                                                localStorage.setItem(
                                                  'AccStmtLedger_id',
                                                  item.id
                                                );
                                              }}
                                            >
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {addCommas(item.amount)}
                                          </td>
                                        </tr>
                                      )
                                    );
                                  })}
                                  <tr>
                                    <th>Total</th>
                                    <th>
                                      <div className="pull-right">
                                        {primaryIncomeData.length > 0
                                          ? addCommas(
                                              primaryIncomeData[0].branch
                                            )
                                          : '0.00'}
                                      </div>
                                    </th>
                                  </tr>
                                  <tr>
                                    <th>Total Income</th>
                                    <th>
                                      <div className="pull-right">
                                        {totalIncomeData !== '' ||
                                        totalIncomeData !== null ||
                                        totalIncomeData !== undefined
                                          ? addCommas(totalIncomeData)
                                          : '0.00'}
                                      </div>
                                    </th>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-sm-6">
                              <table className="table-responsive  table table-hover">
                                <caption>
                                  <h3>Expense</h3>
                                </caption>
                                <tbody>
                                  <tr>
                                    <th>
                                      <h5>
                                        <b>Direct Expenses</b>
                                      </h5>
                                    </th>
                                    <th />
                                  </tr>
                                  {directExpensesData.map((item) => {
                                    return (
                                      item.amount != 0 && (
                                        <tr>
                                          <td align="left">
                                            {item.ledger_name}
                                          </td>
                                          <td align="right">
                                            {addCommas(item.amount)}
                                          </td>
                                        </tr>
                                      )
                                    );
                                  })}
                                  <tr>
                                    <th>Total</th>
                                    <th>
                                      <div className="pull-right">
                                        {directExpensesData.length > 0
                                          ? addCommas(
                                              directExpensesData[0].branch
                                            )
                                          : '0.00'}
                                      </div>
                                    </th>
                                  </tr>
                                  <tr>
                                    <th>Primary Expenses</th>
                                    <th />
                                  </tr>
                                  {primaryExpensesData.map((item) => {
                                    return (
                                      item.amount != 0 && (
                                        <tr>
                                          <td align="left">
                                            <a
                                              style={{ color: 'black' }}
                                              onClick={(e) => {
                                                history.push({
                                                  pathname: '/view_statement',
                                                  post: item.id,
                                                });
                                                localStorage.setItem(
                                                  'AccStmtLedger_id',
                                                  item.id
                                                );
                                              }}
                                            >
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {addCommas(item.amount)}
                                          </td>
                                        </tr>
                                      )
                                    );
                                  })}
                                  <tr>
                                    <th>Total</th>
                                    <th>
                                      <div className="pull-right">
                                        {primaryExpensesData.length > 0
                                          ? addCommas(
                                              primaryExpensesData[0].branch
                                            )
                                          : '0.00'}
                                      </div>
                                    </th>
                                  </tr>
                                  <tr>
                                    <th>Total Expenses</th>
                                    <th>
                                      <div className="pull-right">
                                        {totalExpensesData !== '' ||
                                        totalExpensesData !== null ||
                                        totalExpensesData !== undefined
                                          ? addCommas(totalExpensesData)
                                          : '0.00'}
                                      </div>
                                    </th>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <p />
                            <p />
                            <div className="col-sm-12">
                              <table className="table-responsive  table table-hover">
                                <tbody>
                                  <tr>
                                    <td>
                                      <h4>
                                        <b>
                                          <div className="pull-left">
                                            {totalIncomeData > totalExpensesData
                                              ? 'Net Profit'
                                              : 'Net Loss'}
                                          </div>
                                        </b>
                                      </h4>
                                    </td>
                                    <td>
                                      <h4>
                                        <b>
                                          <div className="pull-right">
                                            {totalIncomeData > totalExpensesData
                                              ? addCommas(
                                                  parseFloat(totalIncomeData) -
                                                    parseFloat(
                                                      totalExpensesData
                                                    )
                                                )
                                              : addCommas(
                                                  parseFloat(
                                                    totalExpensesData
                                                  ) -
                                                    parseFloat(totalIncomeData)
                                                )}
                                          </div>
                                        </b>
                                      </h4>
                                    </td>
                                  </tr>
                                  <br></br>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row" align="center">
                    <br />
                    <ReactToExcel
                      table="id1"
                      filename="profit_loss_excelFileIntuisyz"
                      sheet="sheet 1"
                      buttonText=" Export Excel"
                      className="btn btn-primary"
                    />
                    &nbsp;
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        prints('printrec');
                      }}
                    >
                      Export pdf
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ) : plDataErrorFlag ? (
        <div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <h2 align="center">Error on data fetching......</h2>
        </div>
      ) : (
        <PageLoader />
      )} */}
    </div>
  );
};

export default Profit_loss;
