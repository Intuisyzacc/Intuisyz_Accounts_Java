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
  trial_balance,
  trial_balance_total,
  trial_balanceBnDates,
  trial_balance_totalBnDates,
} from '../modal';
import PageLoader from '../Page Loader/pageloader';
import ReactToExcel from 'react-html-table-to-excel';
import Headers from '../Header/Headers';

const Trial_balance = () => {
  const [assetsData, setAssetsData] = useState([]);
  const [liabilitiesData, setLiabilitiesData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [bsDataLoaded, setBsDataLoaded] = useState(false);
  const [totalIncomeData, setTotalIncomeData] = useState();
  const [totalExpensesData, setTotalExpensesData] = useState();
  const [bsDataErrorFlag, setBsDataErrorFlag] = useState(false);
  const [dbtTotalData, setDbtTotalData] = useState();
  const [crdtTotalData, setCrdtTotalData] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);
  const [dateFlag, setDateFlag] = useState(false);

  let history = useHistory();

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
        const result = await trial_balanceBnDates({
          acType: '1',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('assetsData', result);
        setAssetsData(result);

        const result1 = await trial_balanceBnDates({
          acType: '2',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('liabilitiesData', result1);
        setLiabilitiesData(result1);

        const result2 = await trial_balanceBnDates({
          acType: '3',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('incomeData', result2);
        setIncomeData(result2);

        const result3 = await trial_balanceBnDates({
          acType: '4',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('expenseData', result3);
        setExpenseData(result3);

        const result4 = await trial_balance_totalBnDates({
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('trial_balance_total', result4);

        let r = result4.split(',');
        console.log('r', r);
        setDbtTotalData(r[0]);
        setCrdtTotalData(r[1]);

        // setExpenseData(result4);

        setTotalIncomeData(
          parseFloat(result[0].branch) + parseFloat(result1[0].branch)
        );

        setTotalExpensesData(
          parseFloat(result2[0].branch) + parseFloat(result3[0].branch)
        );

        setDateFlag(true);
        setBsDataLoaded(true);
        setBsDataErrorFlag(false);
      } catch (error) {
        setBsDataErrorFlag(true);
      }
    }
  });

  const dataLoading = async () => {
    try {
      const result = await trial_balance({
        acType: '1',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('assetsData', result);
      setAssetsData(result);

      const result1 = await trial_balance({
        acType: '2',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('liabilitiesData', result1);
      setLiabilitiesData(result1);

      const result2 = await trial_balance({
        acType: '3',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('incomeData', result2);
      setIncomeData(result2);

      const result3 = await trial_balance({
        acType: '4',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('expenseData', result3);
      setExpenseData(result3);

      const result4 = await trial_balance_total({
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('trial_balance_total', result4);

      let r = result4.split(',');
      console.log('r', r);
      setDbtTotalData(r[0]);
      setCrdtTotalData(r[1]);

      // setExpenseData(result4);

      setTotalIncomeData(
        parseFloat(result[0].branch) + parseFloat(result1[0].branch)
      );

      setTotalExpensesData(
        parseFloat(result2[0].branch) + parseFloat(result3[0].branch)
      );

      setBsDataLoaded(true);
      setBsDataErrorFlag(false);
    } catch (error) {
      setBsDataErrorFlag(true);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      dataLoading();
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
    // nStr += '';
    // var x = nStr.split('.');
    // var x1 = x[0];
    // var x2 = x.length > 1 ? '.' + x[1] : '.00';
    // var rgx = /(\d+)(\d{3})/;
    // while (rgx.test(x1)) {
    //   x1 = x1.replace(rgx, '$1' + ',' + '$2');
    // }

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

  function dateReset() {
    window.location.reload();
  }

  return (
    <div>
      <Headers />

      {/* {bsDataLoaded ? ( */}
      <div className="container-fluid" id="content">
        <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
          <div className="container-fluid">
            <div className="page-header">
              <div className="pull-left">
                <h1>Trial Balance</h1>
              </div>
              <div className="pull-right"></div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="box">
                  <div className="box-title">
                    <div className="box-content">
                      <form className="form-horizontal" method="post">
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="txtAlignWrapper">
                              <label
                                htmlFor="textfield"
                                className="control-label"
                              >
                                Start Date
                              </label>
                              <div className="datePickerWrapper">
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
                          </div>
                          <div className="col-sm-4">
                            <div className="txtAlignWrapper">
                              <label
                                htmlFor="textfield"
                                className="control-label"
                              >
                                End Date
                              </label>
                              <div className="datePickerWrapper">
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
                          </div>
                          <div className="col-sm-4">
                            <div className="MultibuttonWrapper">
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
                              <input
                                type="button"
                                name="reset"
                                className="btn btn-secondary btn-lg"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dateReset();
                                }}
                                defaultValue="Reset"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="box box-color box-bordered blue">
                  <div className="box-title">
                    <h3>
                      <i className="fa fa-table" />
                      Trial Balance
                    </h3>
                  </div>
                  <div className="box-content nopadding">
                    <div className="col-sm-12 nopadding">
                      <table className="table-responsive  table table-hover">
                        <tbody>
                          <tr>
                            <th colSpan={5}>
                              <h3 align="center">Assets</h3>
                            </th>
                          </tr>
                          <tr>
                            <th>Account ledger</th>
                            <th>
                              <p align="center">Opening Balance</p>
                            </th>
                            <th>
                              <p align="right">Debit Amount</p>
                            </th>
                            <th>
                              <p align="right">Credit Amount</p>
                            </th>
                            <th>
                              <p align="right">Balance</p>
                            </th>
                          </tr>
                          {assetsData.map((item) => {
                            return !dateFlag
                              ? item.mobile !== '0.0' && (
                                  <tr key={item.id}>
                                    <td align="left">
                                      <a
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
                                        style={{ color: '#428bca' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td>
                                      {' '}
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(
                                            parseFloat(item.address) -
                                              parseFloat(item.ifsc_code)
                                          ) + ' (dr)'
                                        : parseFloat(item.email) -
                                            parseFloat(item.state) >
                                          0
                                        ? addCommas(
                                            parseFloat(item.email) -
                                              parseFloat(item.state)
                                          ) + ' (cr)'
                                        : '0.00'}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(item.ifsc_code)
                                        : addCommas(item.address)}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.email) -
                                        parseFloat(item.state) >
                                      0
                                        ? parseFloat(item.state)
                                        : addCommas(item.email)}
                                    </td>
                                    <td align="right">
                                      {item.mobile < 0
                                        ? addCommas(Math.abs(item.mobile)) +
                                          ' - Credit'
                                        : addCommas(Math.abs(item.mobile)) +
                                          ' - Debit'}
                                    </td>
                                  </tr>
                                )
                              : item.mobile !== '0.0' && (
                                  <>
                                    <tr key={item.id}>
                                      <td align="left">
                                        <a
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
                                          style={{ color: '#428bca' }}
                                        >
                                          {item.ledger_name}
                                        </a>
                                      </td>
                                      <td>
                                        {' '}
                                        {/* {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? parseFloat(item.address) -
                                          parseFloat(item.ifsc_code) +
                                          ' (dr)'
                                        : parseFloat(item.email) -
                                            parseFloat(item.state) >
                                          0
                                        ? parseFloat(item.email) -
                                          parseFloat(item.state) +
                                          ' (cr)'
                                        : '0.00'} */}
                                        {item.open_balance === ''
                                          ? '0.00'
                                          : item.balance_type === 'debit'
                                          ? addCommas(item.open_balance) +
                                            ' (dr)'
                                          : addCommas(item.open_balance) +
                                            ' (cr)'}
                                      </td>
                                      <td align="right">
                                        {parseFloat(item.address) -
                                          parseFloat(item.ifsc_code) >
                                        0
                                          ? addCommas(item.ifsc_code)
                                          : addCommas(item.address)}
                                      </td>
                                      <td align="right">
                                        {parseFloat(item.email) -
                                          parseFloat(item.state) >
                                        0
                                          ? parseFloat(item.state)
                                          : addCommas(item.email)}
                                      </td>
                                      <td align="right">
                                        {item.mobile < 0
                                          ? addCommas(Math.abs(item.mobile)) +
                                            ' - Credit'
                                          : addCommas(Math.abs(item.mobile)) +
                                            ' - Debit'}
                                      </td>
                                    </tr>

                                    {/* <tr key={item.id}>
                                    <td align="left">
                                      <a
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
                                        style={{ color: '#428bca' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td></td>
                                    <td align="right">
                                      {addCommas(item.address)}
                                    </td>
                                    <td align="right">
                                      {addCommas(item.email)}
                                    </td>
                                    <td align="right">
                                      {item.mobile < 0
                                        ? addCommas(Math.abs(item.mobile)) +
                                          ' - Credit'
                                        : addCommas(Math.abs(item.mobile)) +
                                          ' - Debit'}
                                    </td>
                                  </tr> */}
                                  </>
                                );
                          })}

                          <tr>
                            <th colSpan={5}>
                              <h3 align="center">Liabilities</h3>
                            </th>
                          </tr>
                          <tr>
                            <th>Account ledger</th>
                            <th>
                              <p align="center">Opening Balance</p>
                            </th>
                            <th>
                              <p align="right">Debit Amount</p>
                            </th>
                            <th>
                              <p align="right">Credit Amount</p>
                            </th>
                            <th>
                              <p align="right">Balance</p>
                            </th>
                          </tr>
                          {liabilitiesData.map((item) => {
                            return !dateFlag
                              ? item.mobile !== '0.0' && (
                                  <tr key={item.id}>
                                    <td align="left">
                                      <a
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
                                        style={{ color: '#428bca' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td>
                                      {' '}
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(
                                            parseFloat(item.address) -
                                              parseFloat(item.ifsc_code)
                                          ) + ' (dr)'
                                        : parseFloat(item.email) -
                                            parseFloat(item.state) >
                                          0
                                        ? addCommas(
                                            parseFloat(item.email) -
                                              parseFloat(item.state)
                                          ) + ' (cr)'
                                        : '0.00'}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(item.ifsc_code)
                                        : addCommas(item.address)}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.email) -
                                        parseFloat(item.state) >
                                      0
                                        ? parseFloat(item.state)
                                        : addCommas(item.email)}
                                    </td>
                                    <td align="right">
                                      {item.mobile < 0
                                        ? addCommas(Math.abs(item.mobile)) +
                                          ' - Credit'
                                        : addCommas(Math.abs(item.mobile)) +
                                          ' - Debit'}
                                    </td>
                                  </tr>

                                  // <tr key={item.id}>
                                  //   <td align="left">
                                  //     <a
                                  //       onClick={(e) => {
                                  //         history.push({
                                  //           pathname: '/view_statement',
                                  //           post: item.id,
                                  //         });
                                  //         localStorage.setItem(
                                  //           'AccStmtLedger_id',
                                  //           item.id
                                  //         );
                                  //       }}
                                  //       style={{ color: '#428bca' }}
                                  //     >
                                  //       {item.ledger_name}
                                  //     </a>
                                  //   </td>
                                  //   <td></td>
                                  //   <td align="right">
                                  //     {addCommas(item.address)}
                                  //   </td>
                                  //   <td align="right">{addCommas(item.email)}</td>
                                  //   <td align="right">
                                  //     {item.mobile < 0
                                  //       ? addCommas(Math.abs(item.mobile)) +
                                  //         ' - Credit'
                                  //       : addCommas(Math.abs(item.mobile)) +
                                  //         ' - Debit'}
                                  //   </td>
                                  // </tr>
                                )
                              : item.mobile !== '0.0' && (
                                  <tr key={item.id}>
                                    <td align="left">
                                      <a
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
                                        style={{ color: '#428bca' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td>
                                      {' '}
                                      {/* {parseFloat(item.address) -
                                      parseFloat(item.ifsc_code) >
                                    0
                                      ? parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) +
                                        ' (dr)'
                                      : parseFloat(item.email) -
                                          parseFloat(item.state) >
                                        0
                                      ? parseFloat(item.email) -
                                        parseFloat(item.state) +
                                        ' (cr)'
                                      : '0.00'} */}
                                      {item.open_balance === ''
                                        ? '0.00'
                                        : item.balance_type === 'debit'
                                        ? addCommas(item.open_balance) + ' (dr)'
                                        : addCommas(item.open_balance) +
                                          ' (cr)'}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(item.ifsc_code)
                                        : addCommas(item.address)}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.email) -
                                        parseFloat(item.state) >
                                      0
                                        ? parseFloat(item.state)
                                        : addCommas(item.email)}
                                    </td>
                                    <td align="right">
                                      {item.mobile < 0
                                        ? addCommas(Math.abs(item.mobile)) +
                                          ' - Credit'
                                        : addCommas(Math.abs(item.mobile)) +
                                          ' - Debit'}
                                    </td>
                                  </tr>

                                  // <tr key={item.id}>
                                  //   <td align="left">
                                  //     <a
                                  //       onClick={(e) => {
                                  //         history.push({
                                  //           pathname: '/view_statement',
                                  //           post: item.id,
                                  //         });
                                  //         localStorage.setItem(
                                  //           'AccStmtLedger_id',
                                  //           item.id
                                  //         );
                                  //       }}
                                  //       style={{ color: '#428bca' }}
                                  //     >
                                  //       {item.ledger_name}
                                  //     </a>
                                  //   </td>
                                  //   <td></td>
                                  //   <td align="right">
                                  //     {addCommas(item.address)}
                                  //   </td>
                                  //   <td align="right">{addCommas(item.email)}</td>
                                  //   <td align="right">
                                  //     {item.mobile < 0
                                  //       ? addCommas(Math.abs(item.mobile)) +
                                  //         ' - Credit'
                                  //       : addCommas(Math.abs(item.mobile)) +
                                  //         ' - Debit'}
                                  //   </td>
                                  // </tr>
                                );
                          })}

                          <tr>
                            <th colSpan={5}>
                              <h3 align="center">Income</h3>
                            </th>
                          </tr>
                          <tr>
                            <th>Account ledger</th>
                            <th>
                              <p align="center">Opening Balance</p>
                            </th>
                            <th>
                              <p align="right">Debit Amount</p>
                            </th>
                            <th>
                              <p align="right">Credit Amount</p>
                            </th>
                            <th>
                              <p align="right">Balance</p>
                            </th>
                          </tr>
                          {incomeData.map((item) => {
                            return dateFlag
                              ? item.mobile !== '0.0' && (
                                  <tr key={item.id}>
                                    <td align="left">
                                      <a
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
                                        style={{ color: '#428bca' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td>
                                      {' '}
                                      {/* {parseFloat(item.address) -
                                      parseFloat(item.ifsc_code) >
                                    0
                                      ? parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) +
                                        ' (dr)'
                                      : parseFloat(item.email) -
                                          parseFloat(item.state) >
                                        0
                                      ? parseFloat(item.email) -
                                        parseFloat(item.state) +
                                        ' (cr)'
                                      : '0.00'} */}
                                      {item.open_balance === ''
                                        ? '0.00'
                                        : item.balance_type === 'debit'
                                        ? addCommas(item.open_balance) + ' (dr)'
                                        : addCommas(item.open_balance) +
                                          ' (cr)'}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(item.ifsc_code)
                                        : addCommas(item.address)}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.email) -
                                        parseFloat(item.state) >
                                      0
                                        ? parseFloat(item.state)
                                        : addCommas(item.email)}
                                    </td>
                                    <td align="right">
                                      {item.mobile < 0
                                        ? addCommas(Math.abs(item.mobile)) +
                                          ' - Credit'
                                        : addCommas(Math.abs(item.mobile)) +
                                          ' - Debit'}
                                    </td>
                                  </tr>

                                  // <tr key={item.id}>
                                  //   <td align="left">
                                  //     <a
                                  //       onClick={(e) => {
                                  //         history.push({
                                  //           pathname: '/view_statement',
                                  //           post: item.id,
                                  //         });
                                  //         localStorage.setItem(
                                  //           'AccStmtLedger_id',
                                  //           item.id
                                  //         );
                                  //       }}
                                  //       style={{ color: '#428bca' }}
                                  //     >
                                  //       {item.ledger_name}
                                  //     </a>
                                  //   </td>
                                  //   <td></td>
                                  //   <td align="right">
                                  //     {addCommas(item.address)}
                                  //   </td>
                                  //   <td align="right">{addCommas(item.email)}</td>
                                  //   <td align="right">
                                  //     {item.mobile < 0
                                  //       ? addCommas(Math.abs(item.mobile)) +
                                  //         ' - Credit'
                                  //       : addCommas(Math.abs(item.mobile)) +
                                  //         ' - Debit'}
                                  //   </td>
                                  // </tr>
                                )
                              : item.mobile !== '0.0' && (
                                  <tr key={item.id}>
                                    <td align="left">
                                      <a
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
                                        style={{ color: '#428bca' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td>
                                      {' '}
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(
                                            parseFloat(item.address) -
                                              parseFloat(item.ifsc_code)
                                          ) + ' (dr)'
                                        : parseFloat(item.email) -
                                            parseFloat(item.state) >
                                          0
                                        ? addCommas(
                                            parseFloat(item.email) -
                                              parseFloat(item.state)
                                          ) + ' (cr)'
                                        : '0.00'}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(item.ifsc_code)
                                        : addCommas(item.address)}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.email) -
                                        parseFloat(item.state) >
                                      0
                                        ? parseFloat(item.state)
                                        : addCommas(item.email)}
                                    </td>
                                    <td align="right">
                                      {item.mobile < 0
                                        ? addCommas(Math.abs(item.mobile)) +
                                          ' - Credit'
                                        : addCommas(Math.abs(item.mobile)) +
                                          ' - Debit'}
                                    </td>
                                  </tr>

                                  // <tr key={item.id}>
                                  //   <td align="left">
                                  //     <a
                                  //       onClick={(e) => {
                                  //         history.push({
                                  //           pathname: '/view_statement',
                                  //           post: item.id,
                                  //         });
                                  //         localStorage.setItem(
                                  //           'AccStmtLedger_id',
                                  //           item.id
                                  //         );
                                  //       }}
                                  //       style={{ color: '#428bca' }}
                                  //     >
                                  //       {item.ledger_name}
                                  //     </a>
                                  //   </td>
                                  //   <td></td>
                                  //   <td align="right">
                                  //     {addCommas(item.address)}
                                  //   </td>
                                  //   <td align="right">{addCommas(item.email)}</td>
                                  //   <td align="right">
                                  //     {item.mobile < 0
                                  //       ? addCommas(Math.abs(item.mobile)) +
                                  //         ' - Credit'
                                  //       : addCommas(Math.abs(item.mobile)) +
                                  //         ' - Debit'}
                                  //   </td>
                                  // </tr>
                                );
                          })}

                          <tr>
                            <th colSpan={5}>
                              <h3 align="center">Expense</h3>
                            </th>
                          </tr>
                          <tr>
                            <th>Account ledger</th>
                            <th>
                              <p align="center">Opening Balance</p>
                            </th>
                            <th>
                              <p align="right">Debit Amount</p>
                            </th>
                            <th>
                              <p align="right">Credit Amount</p>
                            </th>
                            <th>
                              <p align="right">Balance</p>
                            </th>
                          </tr>
                          {expenseData.map((item) => {
                            return dateFlag
                              ? item.mobile !== '0.0' && (
                                  <tr key={item.id}>
                                    <td align="left">
                                      <a
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
                                        style={{ color: '#428bca' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td>
                                      {' '}
                                      {/* {parseFloat(item.address) -
                                      parseFloat(item.ifsc_code) >
                                    0
                                      ? parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) +
                                        ' (dr)'
                                      : parseFloat(item.email) -
                                          parseFloat(item.state) >
                                        0
                                      ? parseFloat(item.email) -
                                        parseFloat(item.state) +
                                        ' (cr)'
                                      : '0.00'} */}
                                      {item.open_balance === ''
                                        ? '0.00'
                                        : item.balance_type === 'debit'
                                        ? addCommas(item.open_balance) + ' (dr)'
                                        : addCommas(item.open_balance) +
                                          ' (cr)'}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(item.ifsc_code)
                                        : addCommas(item.address)}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.email) -
                                        parseFloat(item.state) >
                                      0
                                        ? parseFloat(item.state)
                                        : addCommas(item.email)}
                                    </td>
                                    <td align="right">
                                      {item.mobile < 0
                                        ? addCommas(Math.abs(item.mobile)) +
                                          ' - Credit'
                                        : addCommas(Math.abs(item.mobile)) +
                                          ' - Debit'}
                                    </td>
                                  </tr>

                                  // <tr key={item.id}>
                                  //   <td align="left">
                                  //     <a
                                  //       onClick={(e) => {
                                  //         history.push({
                                  //           pathname: '/view_statement',
                                  //           post: item.id,
                                  //         });
                                  //         localStorage.setItem(
                                  //           'AccStmtLedger_id',
                                  //           item.id
                                  //         );
                                  //       }}
                                  //       style={{ color: '#428bca' }}
                                  //     >
                                  //       {item.ledger_name}
                                  //     </a>
                                  //   </td>
                                  //   <td></td>
                                  //   <td align="right">
                                  //     {addCommas(item.address)}
                                  //   </td>
                                  //   <td align="right">{addCommas(item.email)}</td>
                                  //   <td align="right">
                                  //     {item.mobile < 0
                                  //       ? addCommas(Math.abs(item.mobile)) +
                                  //         ' - Credit'
                                  //       : addCommas(Math.abs(item.mobile)) +
                                  //         ' - Debit'}
                                  //   </td>
                                  // </tr>
                                )
                              : item.mobile !== '0.0' && (
                                  <tr key={item.id}>
                                    <td align="left">
                                      <a
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
                                        style={{ color: '#428bca' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td>
                                      {' '}
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(
                                            parseFloat(item.address) -
                                              parseFloat(item.ifsc_code)
                                          ) + ' (dr)'
                                        : parseFloat(item.email) -
                                            parseFloat(item.state) >
                                          0
                                        ? addCommas(
                                            parseFloat(item.email) -
                                              parseFloat(item.state)
                                          ) + ' (cr)'
                                        : '0.00'}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.address) -
                                        parseFloat(item.ifsc_code) >
                                      0
                                        ? addCommas(item.ifsc_code)
                                        : addCommas(item.address)}
                                    </td>
                                    <td align="right">
                                      {parseFloat(item.email) -
                                        parseFloat(item.state) >
                                      0
                                        ? parseFloat(item.state)
                                        : addCommas(item.email)}
                                    </td>
                                    <td align="right">
                                      {item.mobile < 0
                                        ? addCommas(Math.abs(item.mobile)) +
                                          ' - Credit'
                                        : addCommas(Math.abs(item.mobile)) +
                                          ' - Debit'}
                                    </td>
                                  </tr>

                                  // <tr key={item.id}>
                                  //   <td align="left">
                                  //     <a
                                  //       onClick={(e) => {
                                  //         history.push({
                                  //           pathname: '/view_statement',
                                  //           post: item.id,
                                  //         });
                                  //         localStorage.setItem(
                                  //           'AccStmtLedger_id',
                                  //           item.id
                                  //         );
                                  //       }}
                                  //       style={{ color: '#428bca' }}
                                  //     >
                                  //       {item.ledger_name}
                                  //     </a>
                                  //   </td>
                                  //   <td></td>
                                  //   <td align="right">
                                  //     {addCommas(item.address)}
                                  //   </td>
                                  //   <td align="right">{addCommas(item.email)}</td>
                                  //   <td align="right">
                                  //     {item.mobile < 0
                                  //       ? addCommas(Math.abs(item.mobile)) +
                                  //         ' - Credit'
                                  //       : addCommas(Math.abs(item.mobile)) +
                                  //         ' - Debit'}
                                  //   </td>
                                  // </tr>
                                );
                          })}

                          <tr>
                            <th>Total</th>
                            <th></th>
                            <th>
                              <p align="right">{addCommas(dbtTotalData)}</p>
                            </th>
                            <th>
                              <p align="right">{addCommas(crdtTotalData)}</p>
                            </th>
                            <th>
                              <p align="right">
                                {addCommas(
                                  parseFloat(
                                    assetsData[0] != null
                                      ? assetsData[0].contact
                                      : '0.00'
                                  ) +
                                    parseFloat(
                                      liabilitiesData[0] != null
                                        ? liabilitiesData[0].contact
                                        : '0.00'
                                    ) +
                                    parseFloat(
                                      incomeData[0] != null
                                        ? incomeData[0].contact
                                        : '0.00'
                                    ) +
                                    parseFloat(
                                      expenseData[0] != null
                                        ? expenseData[0].contact
                                        : '0.00'
                                    )
                                )}
                              </p>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ////////////////////Excel export//////////////////////// */}

                  <div>
                    <table border="1px" id="id1" hidden>
                      <tbody>
                        <tr>
                          <th colSpan={4}>
                            <h3 align="center">Assets</h3>
                          </th>
                        </tr>
                        <tr>
                          <th>Account ledger</th>
                          <th>Opening Balance</th>
                          <th>Debit Amount</th>
                          <th>Credit Amount</th>
                          <th>Balance</th>
                        </tr>
                        {assetsData.map((item) => {
                          return dateFlag ? (
                            (item.address != 0 ||
                              item.email != 0 ||
                              item.bank != 0) && (
                              <tr key={item.id}>
                                <td align="left">
                                  <a style={{ color: '#428bca' }}>
                                    {item.ledger_name}
                                  </a>
                                </td>
                                <td align="right">
                                  {' '}
                                  {/* {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? parseFloat(item.address) -
                                    parseFloat(item.ifsc_code) +
                                    ' (dr)'
                                  : parseFloat(item.email) -
                                      parseFloat(item.state) >
                                    0
                                  ? parseFloat(item.email) -
                                    parseFloat(item.state) +
                                    ' (cr)'
                                  : '0.00'} */}
                                  {item.open_balance === ''
                                    ? '0.00'
                                    : item.balance_type === 'debit'
                                    ? addCommas(item.open_balance) + ' (dr)'
                                    : addCommas(item.open_balance) + ' (cr)'}
                                </td>
                                <td align="right">
                                  {parseFloat(item.address) -
                                    parseFloat(item.ifsc_code) >
                                  0
                                    ? addCommas(item.ifsc_code)
                                    : addCommas(item.address)}
                                </td>
                                <td align="right">
                                  {parseFloat(item.email) -
                                    parseFloat(item.state) >
                                  0
                                    ? parseFloat(item.state)
                                    : addCommas(item.email)}
                                </td>
                                <td align="right">
                                  {item.mobile < 0
                                    ? addCommas(Math.abs(item.mobile)) +
                                      ' - Credit'
                                    : addCommas(Math.abs(item.mobile)) +
                                      ' - Debit'}
                                </td>
                              </tr>

                              // <tr>
                              //   <td align="left">{item.ledger_name}</td>
                              //   <td align="right">{item.address}</td>
                              //   <td align="right">{item.email}</td>
                              //   <td align="right">
                              //     {item.mobile < 0
                              //       ? addCommas(Math.abs(item.mobile)) +
                              //         ' - Credit'
                              //       : addCommas(Math.abs(item.mobile)) +
                              //         ' - Debit'}
                              //   </td>
                              // </tr>
                            )
                          ) : (
                            <tr key={item.id}>
                              <td align="left">
                                <a style={{ color: '#428bca' }}>
                                  {item.ledger_name}
                                </a>
                              </td>
                              <td align="right">
                                {' '}
                                {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? addCommas(
                                      parseFloat(item.address) -
                                        parseFloat(item.ifsc_code)
                                    ) + ' (dr)'
                                  : parseFloat(item.email) -
                                      parseFloat(item.state) >
                                    0
                                  ? addCommas(
                                      parseFloat(item.email) -
                                        parseFloat(item.state)
                                    ) + ' (cr)'
                                  : '0.00'}
                              </td>
                              <td align="right">
                                {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? addCommas(item.ifsc_code)
                                  : addCommas(item.address)}
                              </td>
                              <td align="right">
                                {parseFloat(item.email) -
                                  parseFloat(item.state) >
                                0
                                  ? parseFloat(item.state)
                                  : addCommas(item.email)}
                              </td>
                              <td align="right">
                                {item.mobile < 0
                                  ? addCommas(Math.abs(item.mobile)) +
                                    ' - Credit'
                                  : addCommas(Math.abs(item.mobile)) +
                                    ' - Debit'}
                              </td>
                            </tr>

                            // <tr>
                            //   <td align="left">{item.ledger_name}</td>
                            //   <td align="right">{item.address}</td>
                            //   <td align="right">{item.email}</td>
                            //   <td align="right">
                            //     {item.mobile < 0
                            //       ? addCommas(Math.abs(item.mobile)) + ' - Credit'
                            //       : addCommas(Math.abs(item.mobile)) + ' - Debit'}
                            //   </td>
                            // </tr>
                          );
                        })}

                        <tr>
                          <th colSpan={4}>
                            <h3 align="center">Liabilities</h3>
                          </th>
                        </tr>
                        <tr>
                          <th>Account ledger</th>
                          <th>Opening Balance</th>
                          <th>Debit Amount</th>
                          <th>Credit Amount</th>
                          <th>Balance</th>
                        </tr>
                        {liabilitiesData.map((item) => {
                          return dateFlag ? (
                            (item.address != 0 ||
                              item.email != 0 ||
                              item.bank != 0) && (
                              <tr key={item.id}>
                                <td align="left">
                                  <a style={{ color: '#428bca' }}>
                                    {item.ledger_name}
                                  </a>
                                </td>
                                <td align="right">
                                  {' '}
                                  {/* {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? parseFloat(item.address) -
                                    parseFloat(item.ifsc_code) +
                                    ' (dr)'
                                  : parseFloat(item.email) -
                                      parseFloat(item.state) >
                                    0
                                  ? parseFloat(item.email) -
                                    parseFloat(item.state) +
                                    ' (cr)'
                                  : '0.00'} */}
                                  {item.open_balance === ''
                                    ? '0.00'
                                    : item.balance_type === 'debit'
                                    ? addCommas(item.open_balance) + ' (dr)'
                                    : addCommas(item.open_balance) + ' (cr)'}
                                </td>
                                <td align="right">
                                  {parseFloat(item.address) -
                                    parseFloat(item.ifsc_code) >
                                  0
                                    ? addCommas(item.ifsc_code)
                                    : addCommas(item.address)}
                                </td>
                                <td align="right">
                                  {parseFloat(item.email) -
                                    parseFloat(item.state) >
                                  0
                                    ? parseFloat(item.state)
                                    : addCommas(item.email)}
                                </td>
                                <td align="right">
                                  {item.mobile < 0
                                    ? addCommas(Math.abs(item.mobile)) +
                                      ' - Credit'
                                    : addCommas(Math.abs(item.mobile)) +
                                      ' - Debit'}
                                </td>
                              </tr>

                              // <tr>
                              //   <td align="left">{item.ledger_name}</td>
                              //   <td align="right">{addCommas(item.address)}</td>
                              //   <td align="right">{addCommas(item.email)}</td>
                              //   <td align="right">
                              //     {item.mobile < 0
                              //       ? addCommas(Math.abs(item.mobile)) +
                              //         ' - Credit'
                              //       : addCommas(Math.abs(item.mobile)) +
                              //         ' - Debit'}
                              //   </td>
                              // </tr>
                            )
                          ) : (
                            <tr key={item.id}>
                              <td align="left">
                                <a style={{ color: '#428bca' }}>
                                  {item.ledger_name}
                                </a>
                              </td>
                              <td align="right">
                                {' '}
                                {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? addCommas(
                                      parseFloat(item.address) -
                                        parseFloat(item.ifsc_code)
                                    ) + ' (dr)'
                                  : parseFloat(item.email) -
                                      parseFloat(item.state) >
                                    0
                                  ? addCommas(
                                      parseFloat(item.email) -
                                        parseFloat(item.state)
                                    ) + ' (cr)'
                                  : '0.00'}
                              </td>
                              <td align="right">
                                {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? addCommas(item.ifsc_code)
                                  : addCommas(item.address)}
                              </td>
                              <td align="right">
                                {parseFloat(item.email) -
                                  parseFloat(item.state) >
                                0
                                  ? parseFloat(item.state)
                                  : addCommas(item.email)}
                              </td>
                              <td align="right">
                                {item.mobile < 0
                                  ? addCommas(Math.abs(item.mobile)) +
                                    ' - Credit'
                                  : addCommas(Math.abs(item.mobile)) +
                                    ' - Debit'}
                              </td>
                            </tr>

                            // <tr>
                            //   <td align="left">{item.ledger_name}</td>
                            //   <td align="right">{addCommas(item.address)}</td>
                            //   <td align="right">{addCommas(item.email)}</td>
                            //   <td align="right">
                            //     {item.mobile < 0
                            //       ? addCommas(Math.abs(item.mobile)) + ' - Credit'
                            //       : addCommas(Math.abs(item.mobile)) + ' - Debit'}
                            //   </td>
                            // </tr>
                          );
                        })}

                        <tr>
                          <th colSpan={4}>
                            <h3 align="center">Income</h3>
                          </th>
                        </tr>
                        <tr>
                          <th>Account ledger</th>
                          <th>Opening Balance</th>
                          <th>Debit Amount</th>
                          <th>Credit Amount</th>
                          <th>Balance</th>
                        </tr>
                        {incomeData.map((item) => {
                          return dateFlag ? (
                            (item.address != 0 ||
                              item.email != 0 ||
                              item.bank != 0) && (
                              <tr key={item.id}>
                                <td align="left">
                                  <a style={{ color: '#428bca' }}>
                                    {item.ledger_name}
                                  </a>
                                </td>
                                <td align="right">
                                  {' '}
                                  {/* {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? parseFloat(item.address) -
                                    parseFloat(item.ifsc_code) +
                                    ' (dr)'
                                  : parseFloat(item.email) -
                                      parseFloat(item.state) >
                                    0
                                  ? parseFloat(item.email) -
                                    parseFloat(item.state) +
                                    ' (cr)'
                                  : '0.00'} */}
                                  {item.open_balance === ''
                                    ? '0.00'
                                    : item.balance_type === 'debit'
                                    ? addCommas(item.open_balance) + ' (dr)'
                                    : addCommas(item.open_balance) + ' (cr)'}
                                </td>
                                <td align="right">
                                  {parseFloat(item.address) -
                                    parseFloat(item.ifsc_code) >
                                  0
                                    ? addCommas(item.ifsc_code)
                                    : addCommas(item.address)}
                                </td>
                                <td align="right">
                                  {parseFloat(item.email) -
                                    parseFloat(item.state) >
                                  0
                                    ? parseFloat(item.state)
                                    : addCommas(item.email)}
                                </td>
                                <td align="right">
                                  {item.mobile < 0
                                    ? addCommas(Math.abs(item.mobile)) +
                                      ' - Credit'
                                    : addCommas(Math.abs(item.mobile)) +
                                      ' - Debit'}
                                </td>
                              </tr>

                              // <tr>
                              //   <td align="left">{item.ledger_name}</td>
                              //   <td align="right">{addCommas(item.address)}</td>
                              //   <td align="right">{addCommas(item.email)}</td>
                              //   <td align="right">
                              //     {item.mobile < 0
                              //       ? addCommas(Math.abs(item.mobile)) +
                              //         ' - Credit'
                              //       : addCommas(Math.abs(item.mobile)) +
                              //         ' - Debit'}
                              //   </td>
                              // </tr>
                            )
                          ) : (
                            <tr key={item.id}>
                              <td align="left">
                                <a style={{ color: '#428bca' }}>
                                  {item.ledger_name}
                                </a>
                              </td>
                              <td align="right">
                                {' '}
                                {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? addCommas(
                                      parseFloat(item.address) -
                                        parseFloat(item.ifsc_code)
                                    ) + ' (dr)'
                                  : parseFloat(item.email) -
                                      parseFloat(item.state) >
                                    0
                                  ? addCommas(
                                      parseFloat(item.email) -
                                        parseFloat(item.state)
                                    ) + ' (cr)'
                                  : '0.00'}
                              </td>
                              <td align="right">
                                {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? addCommas(item.ifsc_code)
                                  : addCommas(item.address)}
                              </td>
                              <td align="right">
                                {parseFloat(item.email) -
                                  parseFloat(item.state) >
                                0
                                  ? parseFloat(item.state)
                                  : addCommas(item.email)}
                              </td>
                              <td align="right">
                                {item.mobile < 0
                                  ? addCommas(Math.abs(item.mobile)) +
                                    ' - Credit'
                                  : addCommas(Math.abs(item.mobile)) +
                                    ' - Debit'}
                              </td>
                            </tr>

                            // <tr>
                            //   <td align="left">{item.ledger_name}</td>
                            //   <td align="right">{addCommas(item.address)}</td>
                            //   <td align="right">{addCommas(item.email)}</td>
                            //   <td align="right">
                            //     {item.mobile < 0
                            //       ? addCommas(Math.abs(item.mobile)) + ' - Credit'
                            //       : addCommas(Math.abs(item.mobile)) + ' - Debit'}
                            //   </td>
                            // </tr>
                          );
                        })}

                        <tr>
                          <th colSpan={4}>
                            <h3 align="center">Expense</h3>
                          </th>
                        </tr>
                        <tr>
                          <th>Account ledger</th>
                          <th>Opening Balance</th>
                          <th>Debit Amount</th>
                          <th>Credit Amount</th>
                          <th>Balance</th>
                        </tr>
                        {expenseData.map((item) => {
                          return dateFlag ? (
                            (item.address != 0 ||
                              item.email != 0 ||
                              item.bank != 0) && (
                              <tr key={item.id}>
                                <td align="left">
                                  <a style={{ color: '#428bca' }}>
                                    {item.ledger_name}
                                  </a>
                                </td>
                                <td align="right">
                                  {' '}
                                  {/* {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? parseFloat(item.address) -
                                    parseFloat(item.ifsc_code) +
                                    ' (dr)'
                                  : parseFloat(item.email) -
                                      parseFloat(item.state) >
                                    0
                                  ? parseFloat(item.email) -
                                    parseFloat(item.state) +
                                    ' (cr)'
                                  : '0.00'} */}
                                  {item.open_balance === ''
                                    ? '0.00'
                                    : item.balance_type === 'debit'
                                    ? addCommas(item.open_balance) + ' (dr)'
                                    : addCommas(item.open_balance) + ' (cr)'}
                                </td>
                                <td align="right">
                                  {parseFloat(item.address) -
                                    parseFloat(item.ifsc_code) >
                                  0
                                    ? addCommas(item.ifsc_code)
                                    : addCommas(item.address)}
                                </td>
                                <td align="right">
                                  {parseFloat(item.email) -
                                    parseFloat(item.state) >
                                  0
                                    ? parseFloat(item.state)
                                    : addCommas(item.email)}
                                </td>
                                <td align="right">
                                  {item.mobile < 0
                                    ? addCommas(Math.abs(item.mobile)) +
                                      ' - Credit'
                                    : addCommas(Math.abs(item.mobile)) +
                                      ' - Debit'}
                                </td>
                              </tr>

                              // <tr>
                              //   <td align="left">{item.ledger_name}</td>
                              //   <td align="right">{addCommas(item.address)}</td>
                              //   <td align="right">{addCommas(item.email)}</td>
                              //   <td align="right">
                              //     {item.mobile < 0
                              //       ? addCommas(Math.abs(item.mobile)) +
                              //         ' - Credit'
                              //       : addCommas(Math.abs(item.mobile)) +
                              //         ' - Debit'}
                              //   </td>
                              // </tr>
                            )
                          ) : (
                            <tr key={item.id}>
                              <td align="left">
                                <a style={{ color: '#428bca' }}>
                                  {item.ledger_name}
                                </a>
                              </td>
                              <td align="right">
                                {' '}
                                {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? addCommas(
                                      parseFloat(item.address) -
                                        parseFloat(item.ifsc_code)
                                    ) + ' (dr)'
                                  : parseFloat(item.email) -
                                      parseFloat(item.state) >
                                    0
                                  ? addCommas(
                                      parseFloat(item.email) -
                                        parseFloat(item.state)
                                    ) + ' (cr)'
                                  : '0.00'}
                              </td>
                              <td align="right">
                                {parseFloat(item.address) -
                                  parseFloat(item.ifsc_code) >
                                0
                                  ? addCommas(item.ifsc_code)
                                  : addCommas(item.address)}
                              </td>
                              <td align="right">
                                {parseFloat(item.email) -
                                  parseFloat(item.state) >
                                0
                                  ? parseFloat(item.state)
                                  : addCommas(item.email)}
                              </td>
                              <td align="right">
                                {item.mobile < 0
                                  ? addCommas(Math.abs(item.mobile)) +
                                    ' - Credit'
                                  : addCommas(Math.abs(item.mobile)) +
                                    ' - Debit'}
                              </td>
                            </tr>

                            // <tr>
                            //   <td align="left">{item.ledger_name}</td>
                            //   <td align="right">{addCommas(item.address)}</td>
                            //   <td align="right">{addCommas(item.email)}</td>
                            //   <td align="right">
                            //     {item.mobile < 0
                            //       ? addCommas(Math.abs(item.mobile)) + ' - Credit'
                            //       : addCommas(Math.abs(item.mobile)) + ' - Debit'}
                            //   </td>
                            // </tr>
                          );
                        })}

                        <tr>
                          <th>Total</th>
                          <th></th>
                          <th>
                            <p align="right">{addCommas(dbtTotalData)}</p>
                          </th>
                          <th>
                            <p align="right">{addCommas(crdtTotalData)}</p>
                          </th>
                          <th>
                            <p align="right">
                              {addCommas(
                                parseFloat(
                                  assetsData[0] != null
                                    ? assetsData[0].contact
                                    : '0.00'
                                ) +
                                  parseFloat(
                                    liabilitiesData[0] != null
                                      ? liabilitiesData[0].contact
                                      : '0.00'
                                  ) +
                                  parseFloat(
                                    incomeData[0] != null
                                      ? incomeData[0].contact
                                      : '0.00'
                                  ) +
                                  parseFloat(
                                    expenseData[0] != null
                                      ? expenseData[0].contact
                                      : '0.00'
                                  )
                              )}
                            </p>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* ///////////////////pdf export////////////////// */}
                  <div id="id2" hidden>
                    <div className="col-sm-12">
                      <div className="box box-color box-bordered blue">
                        <div className="box-title">
                          <h3>
                            <i className="fa fa-table" />
                            Trial Balance
                          </h3>
                        </div>
                        <div className="box-content nopadding">
                          <div className="col-sm-12 nopadding">
                            <table className="table-responsive  table table-hover">
                              <tbody>
                                <tr>
                                  <th colSpan={5}>
                                    <h3 align="center">Assets</h3>
                                  </th>
                                </tr>
                                <tr>
                                  <th>Account ledger</th>
                                  <th>
                                    <p align="right">Opening Balance</p>
                                  </th>
                                  <th>
                                    <p align="right">Debit Amount</p>
                                  </th>
                                  <th>
                                    <p align="right">Credit Amount</p>
                                  </th>
                                  <th>
                                    <p align="right">Balance</p>
                                  </th>
                                </tr>
                                {assetsData.map((item) => {
                                  return !dateFlag
                                    ? item.mobile !== '0' && (
                                        <tr key={item.id}>
                                          <td align="left">
                                            <a style={{ color: '#428bca' }}>
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {' '}
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(
                                                  parseFloat(item.address) -
                                                    parseFloat(item.ifsc_code)
                                                ) + ' (dr)'
                                              : parseFloat(item.email) -
                                                  parseFloat(item.state) >
                                                0
                                              ? addCommas(
                                                  parseFloat(item.email) -
                                                    parseFloat(item.state)
                                                ) + ' (cr)'
                                              : '0.00'}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(item.ifsc_code)
                                              : addCommas(item.address)}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.email) -
                                              parseFloat(item.state) >
                                            0
                                              ? parseFloat(item.state)
                                              : addCommas(item.email)}
                                          </td>
                                          <td align="right">
                                            {item.mobile < 0
                                              ? addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Credit'
                                              : addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Debit'}
                                          </td>
                                        </tr>

                                        // <tr key={item.id}>
                                        //   <td align="left">
                                        //     <a
                                        //       onClick={(e) => {
                                        //         history.push({
                                        //           pathname: '/view_statement',
                                        //           post: item.id,
                                        //         });
                                        //         localStorage.setItem(
                                        //           'AccStmtLedger_id',
                                        //           item.id
                                        //         );
                                        //       }}
                                        //       style={{ color: '#428bca' }}
                                        //     >
                                        //       {item.ledger_name}
                                        //     </a>
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.address)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.email)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {item.mobile < 0
                                        //       ? addCommas(Math.abs(item.mobile)) +
                                        //         ' - Credit'
                                        //       : addCommas(Math.abs(item.mobile)) +
                                        //         ' - Debit'}
                                        //   </td>
                                        // </tr>
                                      )
                                    : item.mobile !== 0 && (
                                        <>
                                          <tr key={item.id}>
                                            <td align="left">
                                              <a style={{ color: '#428bca' }}>
                                                {item.ledger_name}
                                              </a>
                                            </td>
                                            <td align="right">
                                              {' '}
                                              {/* {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? parseFloat(item.address) -
                                                parseFloat(item.ifsc_code) +
                                                ' (dr)'
                                              : parseFloat(item.email) -
                                                  parseFloat(item.state) >
                                                0
                                              ? parseFloat(item.email) -
                                                parseFloat(item.state) +
                                                ' (cr)'
                                              : '0.00'} */}
                                              {item.open_balance === ''
                                                ? '0.00'
                                                : item.balance_type === 'debit'
                                                ? addCommas(item.open_balance) +
                                                  ' (dr)'
                                                : addCommas(item.open_balance) +
                                                  ' (cr)'}
                                            </td>
                                            <td align="right">
                                              {parseFloat(item.address) -
                                                parseFloat(item.ifsc_code) >
                                              0
                                                ? addCommas(item.ifsc_code)
                                                : addCommas(item.address)}
                                            </td>
                                            <td align="right">
                                              {parseFloat(item.email) -
                                                parseFloat(item.state) >
                                              0
                                                ? parseFloat(item.state)
                                                : addCommas(item.email)}
                                            </td>
                                            <td align="right">
                                              {item.mobile < 0
                                                ? addCommas(
                                                    Math.abs(item.mobile)
                                                  ) + ' - Credit'
                                                : addCommas(
                                                    Math.abs(item.mobile)
                                                  ) + ' - Debit'}
                                            </td>
                                          </tr>

                                          {/* 
                                        <tr key={item.id}>
                                          <td align="left">
                                            <a
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
                                              style={{ color: '#428bca' }}
                                            >
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {addCommas(item.address)}
                                          </td>
                                          <td align="right">
                                            {addCommas(item.email)}
                                          </td>
                                          <td align="right">
                                            {item.mobile < 0
                                              ? addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Credit'
                                              : addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Debit'}
                                          </td>
                                        </tr> */}
                                        </>
                                      );
                                })}

                                <tr>
                                  <th colSpan={5}>
                                    <h3 align="center">Liabilities</h3>
                                  </th>
                                </tr>
                                <tr>
                                  <th>Account ledger</th>
                                  <th>
                                    <p align="right">Opening Balance</p>
                                  </th>
                                  <th>
                                    <p align="right">Debit Amount</p>
                                  </th>
                                  <th>
                                    <p align="right">Credit Amount</p>
                                  </th>
                                  <th>
                                    <p align="right">Balance</p>
                                  </th>
                                </tr>
                                {liabilitiesData.map((item) => {
                                  return !dateFlag
                                    ? item.mobile !== '0' && (
                                        <tr key={item.id}>
                                          <td align="left">
                                            <a style={{ color: '#428bca' }}>
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {' '}
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(
                                                  parseFloat(item.address) -
                                                    parseFloat(item.ifsc_code)
                                                ) + ' (dr)'
                                              : parseFloat(item.email) -
                                                  parseFloat(item.state) >
                                                0
                                              ? addCommas(
                                                  parseFloat(item.email) -
                                                    parseFloat(item.state)
                                                ) + ' (cr)'
                                              : '0.00'}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(item.ifsc_code)
                                              : addCommas(item.address)}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.email) -
                                              parseFloat(item.state) >
                                            0
                                              ? parseFloat(item.state)
                                              : addCommas(item.email)}
                                          </td>
                                          <td align="right">
                                            {item.mobile < 0
                                              ? addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Credit'
                                              : addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Debit'}
                                          </td>
                                        </tr>

                                        // <tr key={item.id}>
                                        //   <td align="left">
                                        //     <a
                                        //       onClick={(e) => {
                                        //         history.push({
                                        //           pathname: '/view_statement',
                                        //           post: item.id,
                                        //         });
                                        //         localStorage.setItem(
                                        //           'AccStmtLedger_id',
                                        //           item.id
                                        //         );
                                        //       }}
                                        //       style={{ color: '#428bca' }}
                                        //     >
                                        //       {item.ledger_name}
                                        //     </a>
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.address)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.email)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {item.mobile < 0
                                        //       ? addCommas(Math.abs(item.mobile)) +
                                        //         ' - Credit'
                                        //       : addCommas(Math.abs(item.mobile)) +
                                        //         ' - Debit'}
                                        //   </td>
                                        // </tr>
                                      )
                                    : item.mobile !== '0' && (
                                        <tr key={item.id}>
                                          <td align="left">
                                            <a style={{ color: '#428bca' }}>
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {' '}
                                            {/* {parseFloat(item.address) -
                                            parseFloat(item.ifsc_code) >
                                          0
                                            ? parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) +
                                              ' (dr)'
                                            : parseFloat(item.email) -
                                                parseFloat(item.state) >
                                              0
                                            ? parseFloat(item.email) -
                                              parseFloat(item.state) +
                                              ' (cr)'
                                            : '0.00'} */}
                                            {item.open_balance === ''
                                              ? '0.00'
                                              : item.balance_type === 'debit'
                                              ? addCommas(item.open_balance) +
                                                ' (dr)'
                                              : addCommas(item.open_balance) +
                                                ' (cr)'}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(item.ifsc_code)
                                              : addCommas(item.address)}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.email) -
                                              parseFloat(item.state) >
                                            0
                                              ? parseFloat(item.state)
                                              : addCommas(item.email)}
                                          </td>
                                          <td align="right">
                                            {item.mobile < 0
                                              ? addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Credit'
                                              : addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Debit'}
                                          </td>
                                        </tr>

                                        // <tr key={item.id}>
                                        //   <td align="left">
                                        //     <a
                                        //       onClick={(e) => {
                                        //         history.push({
                                        //           pathname: '/view_statement',
                                        //           post: item.id,
                                        //         });
                                        //         localStorage.setItem(
                                        //           'AccStmtLedger_id',
                                        //           item.id
                                        //         );
                                        //       }}
                                        //       style={{ color: '#428bca' }}
                                        //     >
                                        //       {item.ledger_name}
                                        //     </a>
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.address)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.email)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {item.mobile < 0
                                        //       ? addCommas(Math.abs(item.mobile)) +
                                        //         ' - Credit'
                                        //       : addCommas(Math.abs(item.mobile)) +
                                        //         ' - Debit'}
                                        //   </td>
                                        // </tr>
                                      );
                                })}

                                <tr>
                                  <th colSpan={5}>
                                    <h3 align="center">Income</h3>
                                  </th>
                                </tr>
                                <tr>
                                  <th>Account ledger</th>
                                  <th>
                                    <p align="right">Opening Balance</p>
                                  </th>
                                  <th>
                                    <p align="right">Debit Amount</p>
                                  </th>
                                  <th>
                                    <p align="right">Credit Amount</p>
                                  </th>
                                  <th>
                                    <p align="right">Balance</p>
                                  </th>
                                </tr>
                                {incomeData.map((item) => {
                                  return dateFlag
                                    ? item.mobile !== '0' && (
                                        <tr key={item.id}>
                                          <td align="left">
                                            <a style={{ color: '#428bca' }}>
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {' '}
                                            {/* {parseFloat(item.address) -
                                            parseFloat(item.ifsc_code) >
                                          0
                                            ? parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) +
                                              ' (dr)'
                                            : parseFloat(item.email) -
                                                parseFloat(item.state) >
                                              0
                                            ? parseFloat(item.email) -
                                              parseFloat(item.state) +
                                              ' (cr)'
                                            : '0.00'} */}
                                            {item.open_balance === ''
                                              ? '0.00'
                                              : item.balance_type === 'debit'
                                              ? addCommas(item.open_balance) +
                                                ' (dr)'
                                              : addCommas(item.open_balance) +
                                                ' (cr)'}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(item.ifsc_code)
                                              : addCommas(item.address)}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.email) -
                                              parseFloat(item.state) >
                                            0
                                              ? parseFloat(item.state)
                                              : addCommas(item.email)}
                                          </td>
                                          <td align="right">
                                            {item.mobile < 0
                                              ? addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Credit'
                                              : addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Debit'}
                                          </td>
                                        </tr>

                                        // <tr key={item.id}>
                                        //   <td align="left">
                                        //     <a
                                        //       onClick={(e) => {
                                        //         history.push({
                                        //           pathname: '/view_statement',
                                        //           post: item.id,
                                        //         });
                                        //         localStorage.setItem(
                                        //           'AccStmtLedger_id',
                                        //           item.id
                                        //         );
                                        //       }}
                                        //       style={{ color: '#428bca' }}
                                        //     >
                                        //       {item.ledger_name}
                                        //     </a>
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.address)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.email)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {item.mobile < 0
                                        //       ? addCommas(Math.abs(item.mobile)) +
                                        //         ' - Credit'
                                        //       : addCommas(Math.abs(item.mobile)) +
                                        //         ' - Debit'}
                                        //   </td>
                                        // </tr>
                                      )
                                    : item.mobile !== '0' && (
                                        <tr key={item.id}>
                                          <td align="left">
                                            <a style={{ color: '#428bca' }}>
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {' '}
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(
                                                  parseFloat(item.address) -
                                                    parseFloat(item.ifsc_code)
                                                ) + ' (dr)'
                                              : parseFloat(item.email) -
                                                  parseFloat(item.state) >
                                                0
                                              ? addCommas(
                                                  parseFloat(item.email) -
                                                    parseFloat(item.state)
                                                ) + ' (cr)'
                                              : '0.00'}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(item.ifsc_code)
                                              : addCommas(item.address)}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.email) -
                                              parseFloat(item.state) >
                                            0
                                              ? parseFloat(item.state)
                                              : addCommas(item.email)}
                                          </td>
                                          <td align="right">
                                            {item.mobile < 0
                                              ? addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Credit'
                                              : addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Debit'}
                                          </td>
                                        </tr>

                                        // <tr key={item.id}>
                                        //   <td align="left">
                                        //     <a
                                        //       onClick={(e) => {
                                        //         history.push({
                                        //           pathname: '/view_statement',
                                        //           post: item.id,
                                        //         });
                                        //         localStorage.setItem(
                                        //           'AccStmtLedger_id',
                                        //           item.id
                                        //         );
                                        //       }}
                                        //       style={{ color: '#428bca' }}
                                        //     >
                                        //       {item.ledger_name}
                                        //     </a>
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.address)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.email)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {item.mobile < 0
                                        //       ? addCommas(Math.abs(item.mobile)) +
                                        //         ' - Credit'
                                        //       : addCommas(Math.abs(item.mobile)) +
                                        //         ' - Debit'}
                                        //   </td>
                                        // </tr>
                                      );
                                })}

                                <tr>
                                  <th colSpan={5}>
                                    <h3 align="center">Expense</h3>
                                  </th>
                                </tr>
                                <tr>
                                  <th>Account ledger</th>
                                  <th>
                                    <p align="right">Opening Balance</p>
                                  </th>
                                  <th>
                                    <p align="right">Debit Amount</p>
                                  </th>
                                  <th>
                                    <p align="right">Credit Amount</p>
                                  </th>
                                  <th>
                                    <p align="right">Balance</p>
                                  </th>
                                </tr>
                                {expenseData.map((item) => {
                                  return dateFlag
                                    ? item.mobile !== '0' && (
                                        <tr key={item.id}>
                                          <td align="left">
                                            <a style={{ color: '#428bca' }}>
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {' '}
                                            {/* {parseFloat(item.address) -
                                            parseFloat(item.ifsc_code) >
                                          0
                                            ? parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) +
                                              ' (dr)'
                                            : parseFloat(item.email) -
                                                parseFloat(item.state) >
                                              0
                                            ? parseFloat(item.email) -
                                              parseFloat(item.state) +
                                              ' (cr)'
                                            : '0.00'} */}
                                            {item.open_balance === ''
                                              ? '0.00'
                                              : item.balance_type === 'debit'
                                              ? addCommas(item.open_balance) +
                                                ' (dr)'
                                              : addCommas(item.open_balance) +
                                                ' (cr)'}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(item.ifsc_code)
                                              : addCommas(item.address)}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.email) -
                                              parseFloat(item.state) >
                                            0
                                              ? parseFloat(item.state)
                                              : addCommas(item.email)}
                                          </td>
                                          <td align="right">
                                            {item.mobile < 0
                                              ? addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Credit'
                                              : addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Debit'}
                                          </td>
                                        </tr>

                                        // <tr key={item.id}>
                                        //   <td align="left">
                                        //     <a
                                        //       onClick={(e) => {
                                        //         history.push({
                                        //           pathname: '/view_statement',
                                        //           post: item.id,
                                        //         });
                                        //         localStorage.setItem(
                                        //           'AccStmtLedger_id',
                                        //           item.id
                                        //         );
                                        //       }}
                                        //       style={{ color: '#428bca' }}
                                        //     >
                                        //       {item.ledger_name}
                                        //     </a>
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.address)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.email)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {item.mobile < 0
                                        //       ? addCommas(Math.abs(item.mobile)) +
                                        //         ' - Credit'
                                        //       : addCommas(Math.abs(item.mobile)) +
                                        //         ' - Debit'}
                                        //   </td>
                                        // </tr>
                                      )
                                    : item.mobile !== '0' && (
                                        <tr key={item.id}>
                                          <td align="left">
                                            <a style={{ color: '#428bca' }}>
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {' '}
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(
                                                  parseFloat(item.address) -
                                                    parseFloat(item.ifsc_code)
                                                ) + ' (dr)'
                                              : parseFloat(item.email) -
                                                  parseFloat(item.state) >
                                                0
                                              ? addCommas(
                                                  parseFloat(item.email) -
                                                    parseFloat(item.state)
                                                ) + ' (cr)'
                                              : '0.00'}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.address) -
                                              parseFloat(item.ifsc_code) >
                                            0
                                              ? addCommas(item.ifsc_code)
                                              : addCommas(item.address)}
                                          </td>
                                          <td align="right">
                                            {parseFloat(item.email) -
                                              parseFloat(item.state) >
                                            0
                                              ? parseFloat(item.state)
                                              : addCommas(item.email)}
                                          </td>
                                          <td align="right">
                                            {item.mobile < 0
                                              ? addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Credit'
                                              : addCommas(
                                                  Math.abs(item.mobile)
                                                ) + ' - Debit'}
                                          </td>
                                        </tr>

                                        // <tr key={item.id}>
                                        //   <td align="left">
                                        //     <a
                                        //       onClick={(e) => {
                                        //         history.push({
                                        //           pathname: '/view_statement',
                                        //           post: item.id,
                                        //         });
                                        //         localStorage.setItem(
                                        //           'AccStmtLedger_id',
                                        //           item.id
                                        //         );
                                        //       }}
                                        //       style={{ color: '#428bca' }}
                                        //     >
                                        //       {item.ledger_name}
                                        //     </a>
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.address)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {addCommas(item.email)}
                                        //   </td>
                                        //   <td align="right">
                                        //     {item.mobile < 0
                                        //       ? addCommas(Math.abs(item.mobile)) +
                                        //         ' - Credit'
                                        //       : addCommas(Math.abs(item.mobile)) +
                                        //         ' - Debit'}
                                        //   </td>
                                        // </tr>
                                      );
                                })}

                                <tr>
                                  <th>Total</th>
                                  <th></th>
                                  <th>
                                    <p align="right">
                                      {addCommas(dbtTotalData)}
                                    </p>
                                  </th>
                                  <th>
                                    <p align="right">
                                      {addCommas(crdtTotalData)}
                                    </p>
                                  </th>
                                  <th>
                                    <p align="right">
                                      {addCommas(
                                        parseFloat(
                                          assetsData[0] != null
                                            ? assetsData[0].contact
                                            : '0.00'
                                        ) +
                                          parseFloat(
                                            liabilitiesData[0] != null
                                              ? liabilitiesData[0].contact
                                              : '0.00'
                                          ) +
                                          parseFloat(
                                            incomeData[0] != null
                                              ? incomeData[0].contact
                                              : '0.00'
                                          ) +
                                          parseFloat(
                                            expenseData[0] != null
                                              ? expenseData[0].contact
                                              : '0.00'
                                          )
                                      )}
                                    </p>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*//////////////////////////////////////////////////// */}
                  <br />

                  <div className="row" align="center">
                    <ReactToExcel
                      table="id1"
                      filename="trial_balance_excelFileIntuisyz"
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
              </div>{' '}
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

export default Trial_balance;
