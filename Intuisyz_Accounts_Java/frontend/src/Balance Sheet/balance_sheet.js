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
import { profit_loss } from '../modal';
import PageLoader from '../Page Loader/pageloader';
import ReactToExcel from 'react-html-table-to-excel';
import {
  balanceSheetDataBnDates,
  balanceSheetProfitLossDataBnDates,
} from '../modal';
import Headers from '../Header/Headers';

const Balance_sheet = () => {
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

  const [directIncomeData, setDirectIncomeData] = useState([]);
  const [primaryIncomeData, setPrimaryIncomeData] = useState([]);
  const [directExpensesData, setDirectExpensesData] = useState([]);
  const [primaryExpensesData, setPrimaryExpensesData] = useState([]);
  const [plDataLoaded, setPlDataLoaded] = useState(false);
  const [totalIncomeData, setTotalIncomeData] = useState();
  const [totalExpensesData, setTotalExpensesData] = useState();
  const [plDataErrorFlag, setPlDataErrorFlag] = useState(false);
  const [capitalAomuntData, setCapitalAomuntData] = useState([]);
  const [fixedLiabalityAmountData, setFixedLiabalityAmountData] = useState([]);
  const [currentLabilityAmountData, setCurrentLabilityAmountData] = useState(
    []
  );
  const [grantTotalData, setGrantTotalData] = useState([]);

  const [fixedAssetAmountData, setFixedAssetAmountData] = useState([]);

  const [currentAssetAmountData, setCurrentAssetAmountData] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [dateFlag, setDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);
  const [startDate, setStartDate] = useState();
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [customFlag, setCustomFlag] = useState(false);

  // const submitFinal = handleSubmit(async (data) => {
  //   if (startDate === null || startDate === undefined) {
  //     setStartDateFlag(true);
  //     if (endDate === null || endDate === undefined) {
  //       setEndDateFlag(true);
  //     } else {
  //       setEndDateFlag(false);
  //     }
  //   } else if (endDate === null || endDate === undefined) {
  //     setEndDateFlag(true);
  //     if (startDate === null || startDate === undefined) {
  //       setStartDateFlag(true);
  //     } else {
  //       setStartDateFlag(false);
  //     }
  //   } else {
  //     setStartDateFlag(false);
  //     setEndDateFlag(false);

  //     // let ledger_id = ledgerIdData;

  //     if (startDate.getDate() < 10) {
  //       var currentDay = '0' + startDate.getDate();
  //     } else {
  //       var currentDay = startDate.getDate();
  //     }

  //     if (startDate.getMonth() + 1 < 10) {
  //       var currentMonth = '0' + (startDate.getMonth() + 1);
  //     } else {
  //       var currentMonth = startDate.getMonth() + 1;
  //     }

  //     var sDate =
  //       startDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

  //     if (endDate.getDate() < 10) {
  //       var currentDay = '0' + endDate.getDate();
  //     } else {
  //       var currentDay = endDate.getDate();
  //     }

  //     if (endDate.getMonth() + 1 < 10) {
  //       var currentMonth = '0' + (endDate.getMonth() + 1);
  //     } else {
  //       var currentMonth = endDate.getMonth() + 1;
  //     }

  //     var eDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

  //     console.log(sDate, '', eDate);

  //     try {
  //       const result = await balanceSheetProfitLossDataBnDates({
  //         title: '6',
  //         end: eDate,
  //       });
  //       console.log('directIncomeData', result);
  //       setDirectIncomeData(result);

  //       const result1 = await balanceSheetProfitLossDataBnDates({
  //         title: '8',
  //         end: eDate,
  //       });
  //       console.log('primaryIncomeData', result1);
  //       setPrimaryIncomeData(result1);

  //       const result2 = await balanceSheetProfitLossDataBnDates({
  //         title: '7',
  //         end: eDate,
  //       });
  //       console.log('directExpensesData', result2);
  //       setDirectExpensesData(result2);

  //       const result3 = await balanceSheetProfitLossDataBnDates({
  //         title: '9',
  //         end: eDate,
  //       });
  //       console.log('primaryExpensesData', result3);
  //       setPrimaryExpensesData(result3);

  //       const result4 = await profit_loss({
  //         title: '10',
  //         end: eDate,
  //       });
  //       console.log('capitalAomuntData', result4);
  //       setCapitalAomuntData(result4);

  //       const result5 = await balanceSheetDataBnDates({
  //         title: '4',
  //         end: eDate,
  //       });
  //       console.log('fixedLiabalityAmountData', result5);
  //       setFixedLiabalityAmountData(result5);

  //       const result6 = await balanceSheetDataBnDates({
  //         title: '3',
  //         end: eDate,
  //       });
  //       console.log('currentLabilityAmount', result6);
  //       setCurrentLabilityAmountData(result6);

  //       const result7 = await profit_loss({
  //         title: '2',
  //         end: eDate,
  //       });
  //       console.log('fixedAssetAmount', result7);
  //       setFixedAssetAmountData(result7);

  //       const result8 = await balanceSheetDataBnDates({
  //         title: '1',
  //         end: eDate,
  //       });
  //       console.log('currentAssetAmount', result8);
  //       setCurrentAssetAmountData(result8);

  //       console.log('clicked');

  //       setTotalIncomeData(
  //         parseFloat(result[0] != null ? result[0].branch : '0.00') +
  //           parseFloat(result1[0] != null ? result1[0].branch : '0.00')
  //       );

  //       setTotalExpensesData(
  //         parseFloat(result2[0] != null ? result2[0].branch : '0.00') +
  //           parseFloat(result3[0] != null ? result3[0].branch : '0.00')
  //       );

  //       console.log('setTotalIncomeData', totalIncomeData, totalExpensesData);
  //       setDateFlag(true);

  //       // currentAssetAmountData.map((item) => {
  //       //   let s = parseFloat(item.amount) + s;
  //       //   console.log('s', s);
  //       //   setGrantTotalData(s);
  //       // });

  //       ///////////////////////grantTotal////////////////

  //       // let grantTotal =
  //       //   parseFloat(
  //       //     currentLabilityAmountData.length > 0
  //       //       ? currentLabilityAmountData[0].branch
  //       //       : '0.00'
  //       //   ) +
  //       //   parseFloat(
  //       //     fixedLiabalityAmountData.length > 0
  //       //       ? fixedLiabalityAmountData[0].branch
  //       //       : '0.00'
  //       //   ) +
  //       //   parseFloat(
  //       //     capitalAomuntData.length > 0 ? capitalAomuntData[0].branch : '0.00'
  //       //   ) +
  //       //   parseFloat(
  //       //     totalIncomeData > totalExpensesData
  //       //       ? totalIncomeData - totalExpensesData
  //       //       : totalIncomeData - totalExpensesData
  //       //   );

  //       // console.log('grantTotal', grantTotal);

  //       // setGrantTotalData(grantTotal);

  //       setPlDataLoaded(true);
  //       setPlDataErrorFlag(false);
  //     } catch (error) {
  //       setPlDataErrorFlag(true);
  //     }
  //   }
  // });

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
        const result = await balanceSheetProfitLossDataBnDates({
          title: '6',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('directIncomeData', result);
        setDirectIncomeData(result);

        const result1 = await balanceSheetProfitLossDataBnDates({
          title: '8',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('primaryIncomeData', result1);
        setPrimaryIncomeData(result1);

        const result2 = await balanceSheetProfitLossDataBnDates({
          title: '7',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('directExpensesData', result2);
        setDirectExpensesData(result2);

        const result3 = await balanceSheetProfitLossDataBnDates({
          title: '9',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('primaryExpensesData', result3);
        setPrimaryExpensesData(result3);

        const result4 = await balanceSheetDataBnDates({
          title: '10',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('capitalAomuntData', result4);
        setCapitalAomuntData(result4);

        const result5 = await balanceSheetDataBnDates({
          title: '4',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('fixedLiabalityAmountData', result5);
        setFixedLiabalityAmountData(result5);

        const result6 = await balanceSheetDataBnDates({
          title: '3',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('currentLabilityAmount', result6);
        setCurrentLabilityAmountData(result6);

        const result7 = await balanceSheetDataBnDates({
          title: '2',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('fixedAssetAmount', result7);
        setFixedAssetAmountData(result7);

        const result8 = await balanceSheetDataBnDates({
          title: '1',
          start: sDate,
          end: eDate,
          CompanyName: sessionStorage.getItem('CompanyName'),
          CustId: sessionStorage.getItem('CustId'),
        });
        console.log('currentAssetAmount', result8);
        setCurrentAssetAmountData(result8);

        console.log('clicked');

        setTotalIncomeData(
          parseFloat(result[0] != null ? result[0].branch : '0.00') +
            parseFloat(result1[0] != null ? result1[0].branch : '0.00')
        );

        setTotalExpensesData(
          parseFloat(result2[0] != null ? result2[0].branch : '0.00') +
            parseFloat(result3[0] != null ? result3[0].branch : '0.00')
        );

        console.log('setTotalIncomeData', totalIncomeData, totalExpensesData);
        setDateFlag(true);

        // currentAssetAmountData.map((item) => {
        //   let s = parseFloat(item.amount) + s;
        //   console.log('s', s);
        //   setGrantTotalData(s);
        // });

        ///////////////////////grantTotal////////////////

        // let grantTotal =
        //   parseFloat(
        //     currentLabilityAmountData.length > 0
        //       ? currentLabilityAmountData[0].branch
        //       : '0.00'
        //   ) +
        //   parseFloat(
        //     fixedLiabalityAmountData.length > 0
        //       ? fixedLiabalityAmountData[0].branch
        //       : '0.00'
        //   ) +
        //   parseFloat(
        //     capitalAomuntData.length > 0 ? capitalAomuntData[0].branch : '0.00'
        //   ) +
        //   parseFloat(
        //     totalIncomeData > totalExpensesData
        //       ? totalIncomeData - totalExpensesData
        //       : totalIncomeData - totalExpensesData
        //   );

        // console.log('grantTotal', grantTotal);

        // setGrantTotalData(grantTotal);

        setPlDataLoaded(true);
        setPlDataErrorFlag(false);
      } catch (error) {
        setPlDataErrorFlag(true);
      }
    }
  });

  const filterFun = async () => {
    let dateVal = localStorage.getItem('BalanceSheetDateFilter');

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
      const result = await balanceSheetProfitLossDataBnDates({
        title: '6',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('directIncomeData', result);
      setDirectIncomeData(result);

      const result1 = await balanceSheetProfitLossDataBnDates({
        title: '8',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('primaryIncomeData', result1);
      setPrimaryIncomeData(result1);

      const result2 = await balanceSheetProfitLossDataBnDates({
        title: '7',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('directExpensesData', result2);
      setDirectExpensesData(result2);

      const result3 = await balanceSheetProfitLossDataBnDates({
        title: '9',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('primaryExpensesData', result3);
      setPrimaryExpensesData(result3);

      const result4 = await balanceSheetDataBnDates({
        title: '10',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('capitalAomuntData', result4);
      setCapitalAomuntData(result4);

      const result5 = await balanceSheetDataBnDates({
        title: '4',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('fixedLiabalityAmountData', result5);
      setFixedLiabalityAmountData(result5);

      const result6 = await balanceSheetDataBnDates({
        title: '3',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('currentLabilityAmount', result6);
      setCurrentLabilityAmountData(result6);

      const result7 = await balanceSheetDataBnDates({
        title: '2',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('fixedAssetAmount', result7);
      setFixedAssetAmountData(result7);

      const result8 = await balanceSheetDataBnDates({
        title: '1',
        start: sDate,
        end: eDate,
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('currentAssetAmount', result8);
      setCurrentAssetAmountData(result8);

      console.log('clicked');

      setTotalIncomeData(
        parseFloat(result[0] != null ? result[0].branch : '0.00') +
          parseFloat(result1[0] != null ? result1[0].branch : '0.00')
      );

      setTotalExpensesData(
        parseFloat(result2[0] != null ? result2[0].branch : '0.00') +
          parseFloat(result3[0] != null ? result3[0].branch : '0.00')
      );

      console.log('setTotalIncomeData', totalIncomeData, totalExpensesData);
      setDateFlag(true);

      // currentAssetAmountData.map((item) => {
      //   let s = parseFloat(item.amount) + s;
      //   console.log('s', s);
      //   setGrantTotalData(s);
      // });

      ///////////////////////grantTotal////////////////

      // let grantTotal =
      //   parseFloat(
      //     currentLabilityAmountData.length > 0
      //       ? currentLabilityAmountData[0].branch
      //       : '0.00'
      //   ) +
      //   parseFloat(
      //     fixedLiabalityAmountData.length > 0
      //       ? fixedLiabalityAmountData[0].branch
      //       : '0.00'
      //   ) +
      //   parseFloat(
      //     capitalAomuntData.length > 0 ? capitalAomuntData[0].branch : '0.00'
      //   ) +
      //   parseFloat(
      //     totalIncomeData > totalExpensesData
      //       ? totalIncomeData - totalExpensesData
      //       : totalIncomeData - totalExpensesData
      //   );

      // console.log('grantTotal', grantTotal);

      // setGrantTotalData(grantTotal);

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

      const result4 = await profit_loss({
        title: '10',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('capitalAomuntData', result4);
      setCapitalAomuntData(result4);

      const result5 = await profit_loss({
        title: '4',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('fixedLiabalityAmountData', result5);
      setFixedLiabalityAmountData(result5);

      const result6 = await profit_loss({
        title: '3',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('currentLabilityAmount', result6);
      setCurrentLabilityAmountData(result6);

      const result7 = await profit_loss({
        title: '2',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('fixedAssetAmount', result7);
      setFixedAssetAmountData(result7);

      const result8 = await profit_loss({
        title: '1',
        CompanyName: sessionStorage.getItem('CompanyName'),
        CustId: sessionStorage.getItem('CustId'),
      });
      console.log('currentAssetAmount', result8);
      setCurrentAssetAmountData(result8);

      setTotalIncomeData(
        parseFloat(result[0] != null ? result[0].branch : '0.00') +
          parseFloat(result1[0] != null ? result1[0].branch : '0.00')
      );

      setTotalExpensesData(
        parseFloat(result2[0] != null ? result2[0].branch : '0.00') +
          parseFloat(result3[0] != null ? result3[0].branch : '0.00')
      );

      // setTotalIncomeData(
      //   parseFloat(result[0].branch) + parseFloat(result1[0].branch)
      // );

      // setTotalExpensesData(
      //   parseFloat(result2[0].branch) + parseFloat(result3[0].branch)
      // );

      console.log('setTotalIncomeData', totalIncomeData, totalExpensesData);

      currentAssetAmountData.map((item) => {
        let s = parseFloat(item.amount) + s;
        console.log('s', s);
        setGrantTotalData(s);
      });

      ///////////////////////grantTotal////////////////

      // let grantTotal =
      //   parseFloat(
      //     currentLabilityAmountData.length > 0
      //       ? currentLabilityAmountData[0].branch
      //       : '0.00'
      //   ) +
      //   parseFloat(
      //     fixedLiabalityAmountData.length > 0
      //       ? fixedLiabalityAmountData[0].branch
      //       : '0.00'
      //   ) +
      //   parseFloat(
      //     capitalAomuntData.length > 0 ? capitalAomuntData[0].branch : '0.00'
      //   ) +
      //   parseFloat(
      //     totalIncomeData > totalExpensesData
      //       ? totalIncomeData - totalExpensesData
      //       : totalIncomeData - totalExpensesData
      //   );

      // console.log('grantTotal', grantTotal);

      // setGrantTotalData(grantTotal);

      setPlDataLoaded(true);
      setPlDataErrorFlag(false);
    } catch (error) {
      setPlDataErrorFlag(true);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      axios
        .get(url + 'updateledgerbalance')
        .then(({ data }) => {
          console.log(`update ledger balance data`, data);
        })
        .catch((err) => {
          console.log(err);
        });

      dataLoading();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  function prints(el) {
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById('id2').innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;
    window.location.reload();
  }

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

  return (
    <div>
      <Headers />
      {/* {plDataLoaded ? ( */}
      <div className="container-fluid" id="content">
        <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
          <div className="container-fluid">
            <div className="page-header">
              <div className="pull-left">
                <h1>Balance Sheet</h1>
              </div>
              <div className="pull-right"></div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="box-content">
                  <form className="form-horizontal" method="post">
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
                                  localStorage.setItem(
                                    'BalanceSheetDateFilter',
                                    e.target.value
                                  );

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
                          {/* <div className="col-sm-2 form-group"></div> */}
                        </div>
                      </form>
                    </div>
                  </form>
                </div>
              </div>
              <br />
              <div className="col-sm-12">
                <div className="box box-color box-bordered blue">
                  <div className="box-title">
                    <h3>
                      <i className="fa fa-table" />
                      Balance Sheet
                    </h3>
                  </div>
                  <div className="box-content nopadding">
                    {/*============================ Profit Loss ===============================*/}
                    <div className="col-sm-6">
                      <table className="table-responsive  table table-hover">
                        <caption>
                          <h3>Liabilities </h3>
                        </caption>
                        <tbody>
                          <tr>
                            <th>Capital Account</th>
                            <th />
                          </tr>
                          <tr>
                            {totalIncomeData > totalExpensesData && (
                              <>
                                <th> Net Profit </th>
                                <th>
                                  <div className="pull-right">
                                    {addCommas(
                                      parseFloat(totalIncomeData) -
                                        parseFloat(totalExpensesData)
                                    )}
                                  </div>
                                </th>
                              </>
                            )}
                            {/* {totalIncomeData < totalExpensesData && (
                              <>
                                <th>Net Loss</th>
                                <th>
                                  <div className="pull-right">
                                    {addCommas(
                                      parseFloat(totalIncomeData) -
                                        parseFloat(totalExpensesData)
                                    )}
                                  </div>
                                </th>
                              </>
                            )} */}
                            {/* 
                            {totalIncomeData === totalExpensesData && (
                              <>
                                <th>Net Loss</th>
                                <th>
                                  <div className="pull-right">
                                    {addCommas(
                                      parseFloat(totalIncomeData) -
                                        parseFloat(totalExpensesData)
                                    )}
                                  </div>
                                </th>
                              </>
                            )} */}
                          </tr>
                          {capitalAomuntData.map((item) => {
                            return (
                              item.amount != 0 && (
                                <tr key={item.id}>
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
                                {capitalAomuntData.length > 0
                                  ? addCommas(capitalAomuntData[0].branch)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td />
                          </tr>
                          <tr>
                            <th>Fixed Liabilities</th>
                            <th />
                          </tr>

                          {fixedLiabalityAmountData.map((item) => {
                            return (
                              item.amount != 0 && (
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
                                      style={{ color: 'black' }}
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
                                {fixedLiabalityAmountData.length > 0
                                  ? addCommas(
                                      fixedLiabalityAmountData[0].branch
                                    )
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td />
                          </tr>
                          <tr>
                            <th>Current Liabilities</th>
                            <th />
                          </tr>

                          {currentLabilityAmountData.map((item) => {
                            return !dateFlag ? (
                              item.amount != 0 && (
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
                                      style={{ color: 'black' }}
                                    >
                                      {item.ledger_name}
                                    </a>
                                  </td>
                                  <td align="right">
                                    {addCommas(item.amount)}
                                  </td>
                                </tr>
                              )
                            ) : (
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
                                    style={{ color: 'black' }}
                                  >
                                    {item.ledger_name}
                                  </a>
                                </td>
                                <td align="right">{addCommas(item.amount)}</td>
                              </tr>
                            );
                          })}

                          <tr>
                            <th>Total</th>
                            <th>
                              <div className="pull-right">
                                {currentLabilityAmountData.length > 0
                                  ? addCommas(
                                      currentLabilityAmountData[0].branch
                                    )
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td />
                          </tr>
                          <tr>
                            <th>Total</th>
                            <th>
                              <div className="pull-right">
                                {addCommas(
                                  parseFloat(
                                    currentLabilityAmountData.length > 0
                                      ? currentLabilityAmountData[0].branch
                                      : '0.00'
                                  ) +
                                    parseFloat(
                                      fixedLiabalityAmountData.length > 0
                                        ? fixedLiabalityAmountData[0].branch
                                        : '0.00'
                                    ) +
                                    parseFloat(
                                      capitalAomuntData.length > 0
                                        ? capitalAomuntData[0].branch
                                        : '0.00'
                                    ) +
                                    parseFloat(
                                      totalIncomeData > totalExpensesData
                                        ? totalIncomeData - totalExpensesData
                                        : '0.00'
                                    )
                                )}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-sm-6">
                      <table className="table-responsive  table table-hover">
                        <caption>
                          <h3>Assets</h3>
                        </caption>
                        <tbody>
                          <tr>
                            <th>Fixed Assets</th>
                            <th />
                          </tr>

                          {fixedAssetAmountData.map((item) => {
                            return (
                              item.amount != 0 && (
                                <tr key={item.id}>
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
                                {fixedAssetAmountData.length > 0
                                  ? addCommas(fixedAssetAmountData[0].branch)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td />
                          </tr>
                          <tr>
                            <th>Current Assets</th>
                            <th />
                          </tr>

                          {currentAssetAmountData.map((item) => {
                            return !dateFlag
                              ? item.amount != 0 && (
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
                                        style={{ color: 'black' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td align="right">
                                      {addCommas(item.amount)}
                                    </td>
                                  </tr>
                                )
                              : item.amount != 0 && (
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
                                        style={{ color: 'black' }}
                                      >
                                        {item.ledger_name}
                                      </a>
                                    </td>
                                    <td align="right">
                                      {addCommas(item.amount)}
                                    </td>
                                  </tr>
                                );
                          })}

                          <tr>
                            <th>Total</th>
                            <th>
                              <div className="pull-right">
                                {currentAssetAmountData.length > 0
                                  ? addCommas(currentAssetAmountData[0].branch)
                                  : '0.00'}
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <td />
                          </tr>
                          {totalIncomeData < totalExpensesData && (
                            <tr>
                              <th>Net Loss </th>
                              <th>
                                <div className="pull-right">
                                  {addCommas(
                                    parseFloat(totalExpensesData) -
                                      parseFloat(totalIncomeData)
                                  )}
                                </div>
                              </th>
                            </tr>
                          )}
                          <tr>
                            <td />
                          </tr>

                          <tr>
                            <th>
                              <h4>Total</h4>
                            </th>
                            <th>
                              <div className="pull-right">
                                {totalIncomeData < totalExpensesData
                                  ? addCommas(
                                      parseFloat(
                                        fixedAssetAmountData.length > 0
                                          ? fixedAssetAmountData[0].branch
                                          : 0.0
                                      ) +
                                        parseFloat(
                                          currentAssetAmountData.length > 0
                                            ? currentAssetAmountData[0].branch
                                            : 0.0
                                        ) +
                                        parseFloat(
                                          totalExpensesData - totalIncomeData
                                        )
                                    )
                                  : addCommas(
                                      parseFloat(
                                        fixedAssetAmountData.length > 0
                                          ? fixedAssetAmountData[0].branch
                                          : 0.0
                                      ) +
                                        parseFloat(
                                          currentAssetAmountData.length > 0
                                            ? currentAssetAmountData[0].branch
                                            : 0.0
                                        )
                                    )}
                              </div>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* ///////////////////////////excel code////////////////// */}
                  <div hidden>
                    <table border="1px;" style={{ display: 'inline' }} id="id1">
                      <tbody>
                        <tr>
                          <td>
                            <table border="1px;" style={{ display: 'inline' }}>
                              <tbody>
                                <tr>
                                  <td align="center" colSpan={2}>
                                    <h3>Liabilities </h3>
                                  </td>
                                </tr>
                                <tr>
                                  <th align="left" colSpan={2}>
                                    Capital Account
                                  </th>
                                </tr>
                                <tr />
                                <tr>
                                  {totalIncomeData > totalExpensesData && (
                                    <>
                                      <th> Net Profit </th>
                                      <th>
                                        <div className="pull-right">
                                          {addCommas(
                                            parseFloat(totalIncomeData) -
                                              parseFloat(totalExpensesData)
                                          )}
                                        </div>
                                      </th>
                                    </>
                                  )}
                                  {totalIncomeData < totalExpensesData && (
                                    <>
                                      <th>Net Loss</th>
                                      <th>
                                        <div className="pull-right">
                                          {addCommas(
                                            parseFloat(totalIncomeData) -
                                              parseFloat(totalExpensesData)
                                          )}
                                        </div>
                                      </th>
                                    </>
                                  )}
                                </tr>
                                {capitalAomuntData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr key={item.id}>
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
                                      {capitalAomuntData.length > 0
                                        ? addCommas(capitalAomuntData[0].branch)
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                <tr>
                                  <th>Fixed Liabilities</th>
                                  <th />
                                </tr>

                                {fixedLiabalityAmountData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr key={item.id}>
                                        <td>
                                          <a style={{ color: 'black' }}>
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
                                      {fixedLiabalityAmountData.length > 0
                                        ? addCommas(
                                            fixedLiabalityAmountData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                <tr>
                                  <th>Current Liabilities</th>
                                  <th />
                                </tr>

                                {currentLabilityAmountData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr key={item.id}>
                                        <td align="left">
                                          <a style={{ color: 'black' }}>
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
                                      {currentLabilityAmountData.length > 0
                                        ? addCommas(
                                            currentLabilityAmountData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                <tr>
                                  <th>Total</th>
                                  <th>
                                    <div className="pull-right">
                                      {addCommas(
                                        parseFloat(
                                          currentLabilityAmountData.length > 0
                                            ? currentLabilityAmountData[0]
                                                .branch
                                            : '0.00'
                                        ) +
                                          parseFloat(
                                            fixedLiabalityAmountData.length > 0
                                              ? fixedLiabalityAmountData[0]
                                                  .branch
                                              : '0.00'
                                          ) +
                                          parseFloat(
                                            capitalAomuntData.length > 0
                                              ? capitalAomuntData[0].branch
                                              : '0.00'
                                          ) +
                                          parseFloat(
                                            totalIncomeData > totalExpensesData
                                              ? totalIncomeData -
                                                  totalExpensesData
                                              : totalIncomeData -
                                                  totalExpensesData
                                          )
                                      )}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
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
                                    <h3>Assets </h3>
                                  </td>
                                </tr>

                                <tr>
                                  <th>Fixed Assets</th>
                                  <th />
                                </tr>

                                {fixedAssetAmountData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr key={item.id}>
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
                                      {fixedAssetAmountData.length > 0
                                        ? addCommas(
                                            fixedAssetAmountData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                <tr>
                                  <th>Current Assets</th>
                                  <th />
                                </tr>

                                {currentAssetAmountData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr key={item.id}>
                                        <td align="left">
                                          <a style={{ color: 'black' }}>
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
                                      {currentAssetAmountData.length > 0
                                        ? addCommas(
                                            currentAssetAmountData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                {totalIncomeData < totalExpensesData && (
                                  <tr>
                                    <th>Net Loss </th>
                                    <th>
                                      <div className="pull-right">
                                        {addCommas(
                                          parseFloat(totalExpensesData) -
                                            parseFloat(totalIncomeData)
                                        )}
                                      </div>
                                    </th>
                                  </tr>
                                )}
                                <tr>
                                  <td />
                                </tr>

                                <tr>
                                  <th>
                                    <h4>Total</h4>
                                  </th>
                                  <th>
                                    <div className="pull-right">
                                      {totalIncomeData < totalExpensesData
                                        ? addCommas(
                                            parseFloat(
                                              fixedAssetAmountData.length > 0
                                                ? fixedAssetAmountData[0].branch
                                                : 0.0
                                            ) +
                                              parseFloat(
                                                currentAssetAmountData.length >
                                                  0
                                                  ? currentAssetAmountData[0]
                                                      .branch
                                                  : 0.0
                                              ) +
                                              parseFloat(
                                                totalExpensesData -
                                                  totalIncomeData
                                              )
                                          )
                                        : addCommas(
                                            parseFloat(
                                              fixedAssetAmountData.length > 0
                                                ? fixedAssetAmountData[0].branch
                                                : 0.0
                                            ) +
                                              parseFloat(
                                                currentAssetAmountData.length >
                                                  0
                                                  ? currentAssetAmountData[0]
                                                      .branch
                                                  : 0.0
                                              )
                                          )}
                                    </div>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* /////////////////////////pdf code////////////////// */}

                  <div id="id2" hidden>
                    <div className="col-sm-12">
                      <div className="box box-color box-bordered blue">
                        <div className="box-title">
                          <h3>
                            <i className="fa fa-table" />
                            Balance Sheet
                          </h3>
                        </div>
                        <div className="box-content nopadding">
                          {/*============================ Profit Loss ===============================*/}
                          <div className="col-sm-6">
                            <table className="table-responsive  table table-hover">
                              <caption>
                                <h3>Liabilities </h3>
                              </caption>
                              <tbody>
                                <tr>
                                  <th>Capital Account</th>
                                  <th />
                                </tr>
                                <tr>
                                  {totalIncomeData > totalExpensesData && (
                                    <>
                                      <th> Net Profit </th>
                                      <th>
                                        <div className="pull-right">
                                          {addCommas(
                                            parseFloat(totalIncomeData) -
                                              parseFloat(totalExpensesData)
                                          )}
                                        </div>
                                      </th>
                                    </>
                                  )}
                                  {/* {totalIncomeData < totalExpensesData && (
                              <>
                                <th>Net Loss</th>
                                <th>
                                  <div className="pull-right">
                                    {addCommas(
                                      parseFloat(totalIncomeData) -
                                        parseFloat(totalExpensesData)
                                    )}
                                  </div>
                                </th>
                              </>
                            )} */}
                                  {/* 
                            {totalIncomeData === totalExpensesData && (
                              <>
                                <th>Net Loss</th>
                                <th>
                                  <div className="pull-right">
                                    {addCommas(
                                      parseFloat(totalIncomeData) -
                                        parseFloat(totalExpensesData)
                                    )}
                                  </div>
                                </th>
                              </>
                            )} */}
                                </tr>
                                {capitalAomuntData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr key={item.id}>
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
                                      {capitalAomuntData.length > 0
                                        ? addCommas(capitalAomuntData[0].branch)
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                <tr>
                                  <th>Fixed Liabilities</th>
                                  <th />
                                </tr>

                                {fixedLiabalityAmountData.map((item) => {
                                  return (
                                    item.amount != 0 && (
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
                                            style={{ color: 'black' }}
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
                                      {fixedLiabalityAmountData.length > 0
                                        ? addCommas(
                                            fixedLiabalityAmountData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                <tr>
                                  <th>Current Liabilities</th>
                                  <th />
                                </tr>

                                {currentLabilityAmountData.map((item) => {
                                  return !dateFlag ? (
                                    item.amount != 0 && (
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
                                            style={{ color: 'black' }}
                                          >
                                            {item.ledger_name}
                                          </a>
                                        </td>
                                        <td align="right">
                                          {addCommas(item.amount)}
                                        </td>
                                      </tr>
                                    )
                                  ) : (
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
                                          style={{ color: 'black' }}
                                        >
                                          {item.ledger_name}
                                        </a>
                                      </td>
                                      <td align="right">
                                        {addCommas(item.amount)}
                                      </td>
                                    </tr>
                                  );
                                })}

                                <tr>
                                  <th>Total</th>
                                  <th>
                                    <div className="pull-right">
                                      {currentLabilityAmountData.length > 0
                                        ? addCommas(
                                            currentLabilityAmountData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                <tr>
                                  <th>Total</th>
                                  <th>
                                    <div className="pull-right">
                                      {addCommas(
                                        parseFloat(
                                          currentLabilityAmountData.length > 0
                                            ? currentLabilityAmountData[0]
                                                .branch
                                            : '0.00'
                                        ) +
                                          parseFloat(
                                            fixedLiabalityAmountData.length > 0
                                              ? fixedLiabalityAmountData[0]
                                                  .branch
                                              : '0.00'
                                          ) +
                                          parseFloat(
                                            capitalAomuntData.length > 0
                                              ? capitalAomuntData[0].branch
                                              : '0.00'
                                          ) +
                                          parseFloat(
                                            totalIncomeData > totalExpensesData
                                              ? totalIncomeData -
                                                  totalExpensesData
                                              : '0.00'
                                          )
                                      )}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-6">
                            <table className="table-responsive  table table-hover">
                              <caption>
                                <h3>Assets</h3>
                              </caption>
                              <tbody>
                                <tr>
                                  <th>Fixed Assets</th>
                                  <th />
                                </tr>

                                {fixedAssetAmountData.map((item) => {
                                  return (
                                    item.amount != 0 && (
                                      <tr key={item.id}>
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
                                      {fixedAssetAmountData.length > 0
                                        ? addCommas(
                                            fixedAssetAmountData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                <tr>
                                  <th>Current Assets</th>
                                  <th />
                                </tr>

                                {currentAssetAmountData.map((item) => {
                                  return !dateFlag
                                    ? item.amount != 0 && (
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
                                              style={{ color: 'black' }}
                                            >
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {addCommas(item.amount)}
                                          </td>
                                        </tr>
                                      )
                                    : item.amount != 0 && (
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
                                              style={{ color: 'black' }}
                                            >
                                              {item.ledger_name}
                                            </a>
                                          </td>
                                          <td align="right">
                                            {addCommas(item.amount)}
                                          </td>
                                        </tr>
                                      );
                                })}

                                <tr>
                                  <th>Total</th>
                                  <th>
                                    <div className="pull-right">
                                      {currentAssetAmountData.length > 0
                                        ? addCommas(
                                            currentAssetAmountData[0].branch
                                          )
                                        : '0.00'}
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <td />
                                </tr>
                                {totalIncomeData < totalExpensesData && (
                                  <tr>
                                    <th>Net Loss </th>
                                    <th>
                                      <div className="pull-right">
                                        {addCommas(
                                          parseFloat(totalExpensesData) -
                                            parseFloat(totalIncomeData)
                                        )}
                                      </div>
                                    </th>
                                  </tr>
                                )}
                                <tr>
                                  <td />
                                </tr>

                                <tr>
                                  <th>
                                    <h4>Total</h4>
                                  </th>
                                  <th>
                                    <div className="pull-right">
                                      {totalIncomeData < totalExpensesData
                                        ? addCommas(
                                            parseFloat(
                                              fixedAssetAmountData.length > 0
                                                ? fixedAssetAmountData[0].branch
                                                : 0.0
                                            ) +
                                              parseFloat(
                                                currentAssetAmountData.length >
                                                  0
                                                  ? currentAssetAmountData[0]
                                                      .branch
                                                  : 0.0
                                              ) +
                                              parseFloat(
                                                totalExpensesData -
                                                  totalIncomeData
                                              )
                                          )
                                        : addCommas(
                                            parseFloat(
                                              fixedAssetAmountData.length > 0
                                                ? fixedAssetAmountData[0].branch
                                                : 0.0
                                            ) +
                                              parseFloat(
                                                currentAssetAmountData.length >
                                                  0
                                                  ? currentAssetAmountData[0]
                                                      .branch
                                                  : 0.0
                                              )
                                          )}
                                    </div>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div id="id2" hidden>
                    <table border="1px;" style={{ display: 'inline' }}>
                      <tbody>
                        <tr>
                          <td align="center" colSpan={2}>
                            <h3>Liabilities </h3>
                          </td>
                        </tr>
                        <tr>
                          <th align="left" colSpan={2}>
                            Capital Account
                          </th>
                        </tr>
                        <tr />
                        <tr>
                          {totalIncomeData > totalExpensesData && (
                            <>
                              <th> Net Profit </th>
                              <th>
                                <div className="pull-right">
                                  {addCommas(
                                    parseFloat(totalIncomeData) -
                                      parseFloat(totalExpensesData)
                                  )}
                                </div>
                              </th>
                            </>
                          )}
                          {totalIncomeData < totalExpensesData && (
                            <>
                              <th>Net Loss</th>
                              <th>
                                <div className="pull-right">
                                  {addCommas(
                                    parseFloat(totalIncomeData) -
                                      parseFloat(totalExpensesData)
                                  )}
                                </div>
                              </th>
                            </>
                          )}
                        </tr>
                        {capitalAomuntData.map((item) => {
                          return (
                            item.amount != 0 && (
                              <tr key={item.id}>
                                <td align="left">{item.ledger_name}</td>
                                <td align="right">{addCommas(item.amount)}</td>
                              </tr>
                            )
                          );
                        })}

                        <tr>
                          <th>Total</th>
                          <th>
                            <div className="pull-right">
                              {capitalAomuntData.length > 0
                                ? addCommas(capitalAomuntData[0].branch)
                                : '0.00'}
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td />
                        </tr>
                        <tr>
                          <th>Fixed Liabilities</th>
                          <th />
                        </tr>

                        {fixedLiabalityAmountData.map((item) => {
                          return (
                            item.amount != 0 && (
                              <tr key={item.id}>
                                <td>
                                  <a style={{ color: 'black' }}>
                                    {item.ledger_name}
                                  </a>
                                </td>
                                <td align="right">{addCommas(item.amount)}</td>
                              </tr>
                            )
                          );
                        })}

                        <tr>
                          <th>Total</th>
                          <th>
                            <div className="pull-right">
                              {fixedLiabalityAmountData.length > 0
                                ? addCommas(fixedLiabalityAmountData[0].branch)
                                : '0.00'}
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td />
                        </tr>
                        <tr>
                          <th>Current Liabilities</th>
                          <th />
                        </tr>

                        {currentLabilityAmountData.map((item) => {
                          return (
                            item.amount != 0 && (
                              <tr key={item.id}>
                                <td align="left">
                                  <a style={{ color: 'black' }}>
                                    {item.ledger_name}
                                  </a>
                                </td>
                                <td align="right">{addCommas(item.amount)}</td>
                              </tr>
                            )
                          );
                        })}

                        <tr>
                          <th>Total</th>
                          <th>
                            <div className="pull-right">
                              {currentLabilityAmountData.length > 0
                                ? addCommas(currentLabilityAmountData[0].branch)
                                : '0.00'}
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td />
                        </tr>
                        <tr>
                          <th>Total</th>
                          <th>
                            <div className="pull-right">
                              {addCommas(
                                parseFloat(
                                  currentLabilityAmountData.length > 0
                                    ? currentLabilityAmountData[0].branch
                                    : '0.00'
                                ) +
                                  parseFloat(
                                    fixedLiabalityAmountData.length > 0
                                      ? fixedLiabalityAmountData[0].branch
                                      : '0.00'
                                  ) +
                                  parseFloat(
                                    capitalAomuntData.length > 0
                                      ? capitalAomuntData[0].branch
                                      : '0.00'
                                  ) +
                                  parseFloat(
                                    totalIncomeData > totalExpensesData
                                      ? totalIncomeData - totalExpensesData
                                      : totalIncomeData - totalExpensesData
                                  )
                              )}
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td />
                        </tr>
                      </tbody>
                    </table>
                    <table border="1px" style={{ display: 'inline' }}>
                      <tbody>
                        <tr>
                          <td align="center" colSpan={2}>
                            <h3>Assets </h3>
                          </td>
                        </tr>
                        <tr>
                          <th align="left" colSpan={2}>
                            Fixed Assets
                          </th>
                        </tr>
                        {fixedAssetAmountData.map((item) => {
                          return (
                            item.amount != 0 && (
                              <tr key={item.id}>
                                <td align="left">{item.ledger_name}</td>
                                <td align="right">{addCommas(item.amount)}</td>
                              </tr>
                            )
                          );
                        })}

                        <tr>
                          <th>Total</th>
                          <th>
                            <div className="pull-right">
                              {fixedAssetAmountData.length > 0
                                ? addCommas(fixedAssetAmountData[0].branch)
                                : '0.00'}
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td />
                        </tr>
                        <tr>
                          <th>Current Assets</th>
                          <th />
                        </tr>

                        {currentAssetAmountData.map((item) => {
                          return (
                            item.amount != 0 && (
                              <tr key={item.id}>
                                <td align="left">
                                  <a style={{ color: 'black' }}>
                                    {item.ledger_name}
                                  </a>
                                </td>
                                <td align="right">{addCommas(item.amount)}</td>
                              </tr>
                            )
                          );
                        })}

                        <tr>
                          <th>Total</th>
                          <th>
                            <div className="pull-right">
                              {currentAssetAmountData.length > 0
                                ? addCommas(currentAssetAmountData[0].branch)
                                : '0.00'}
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td />
                        </tr>
                        {totalIncomeData < totalExpensesData && (
                          <tr>
                            <th>Net Loss </th>
                            <th>
                              <div className="pull-right">
                                {addCommas(
                                  parseFloat(totalExpensesData) -
                                    parseFloat(totalIncomeData)
                                )}
                              </div>
                            </th>
                          </tr>
                        )}
                        <tr>
                          <td />
                        </tr>

                        <tr>
                          <th>
                            <h4>Total</h4>
                          </th>
                          <th>
                            <div className="pull-right">
                              {totalIncomeData < totalExpensesData
                                ? addCommas(
                                    parseFloat(
                                      fixedAssetAmountData.length > 0
                                        ? fixedAssetAmountData[0].branch
                                        : 0.0
                                    ) +
                                      parseFloat(
                                        currentAssetAmountData.length > 0
                                          ? currentAssetAmountData[0].branch
                                          : 0.0
                                      ) +
                                      parseFloat(
                                        totalExpensesData - totalIncomeData
                                      )
                                  )
                                : addCommas(
                                    parseFloat(
                                      fixedAssetAmountData.length > 0
                                        ? fixedAssetAmountData[0].branch
                                        : 0.0
                                    ) +
                                      parseFloat(
                                        currentAssetAmountData.length > 0
                                          ? currentAssetAmountData[0].branch
                                          : 0.0
                                      )
                                  )}
                            </div>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div> */}

                  <div align="center" style={{ marginTop: '10px' }}>
                    <ReactToExcel
                      table="id1"
                      filename="balanceSheet_excelFileIntuisyz"
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
      {/* ) : (
        <PageLoader />
      )} */}
    </div>
  );
};

export default Balance_sheet;
