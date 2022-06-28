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
import { successToast, errorToast } from '../common/global';
import uuid from 'react-uuid';
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../Base Url/baseUrl';
import '../Invoice/style_invoice.css';
import { Container } from 'react-bootstrap';
import Headers from '../Header/Headers';

// import { AiFillDelete } from 'react-icons/AiFillDelete';
// import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

const Dashboard_invoice = () => {
  let url = baseUrl.url;

  let location = useLocation();
  let history = useHistory();

  const [invoiceData, setInvoiceData] = useState('');
  const [invoiceDataLoaded, setInvoiceDataLoaded] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);
  const [customFlag, setCustomFlag] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      localStorage.setItem('finalObj1', JSON.stringify('{}'));

      localStorage.setItem(
        'finalObj2',
        JSON.stringify([
          {
            description: '',
            hsn: '',
            qty: '',
            amount: '',
            tax: '',
            remarks: '',
          },
        ])
      );
      localStorage.setItem('TotalAmountData', '');
      localStorage.setItem('invoicePageStatus', '');
      localStorage.setItem('SubTotalAmountData', '');

      localStorage.setItem('statusFilter', '');
      localStorage.setItem('dateFilter', '');

      axios
        .get(
          url +
            `invoiceDataOnDashBoard?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
        .then(({ data }) => {
          setInvoiceData(data);
          console.log('invoice data', data);
          setInvoiceDataLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  function dataloading() {
    localStorage.setItem('finalObj1', JSON.stringify('{}'));

    localStorage.setItem(
      'finalObj2',
      JSON.stringify([
        {
          description: '',
          hsn: '',
          qty: '',
          amount: '',
          tax: '',
          remarks: '',
        },
      ])
    );
    localStorage.setItem('TotalAmountData', '');
    localStorage.setItem('invoicePageStatus', '');
    localStorage.setItem('SubTotalAmountData', '');

    localStorage.setItem('statusFilter', '');
    localStorage.setItem('dateFilter', '');

    axios
      .get(
        url +
          `invoiceDataOnDashBoard?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        setInvoiceData(data);
        console.log('invoice data', data);
        setInvoiceDataLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const filterFun = (demo) => {
    console.log(
      'statusFilter',
      localStorage.getItem('statusFilter'),
      '',
      'dateFilter',
      localStorage.getItem('dateFilter')
    );

    let statusVal = localStorage.getItem('statusFilter');
    let dateVal = localStorage.getItem('dateFilter');

    ////////////////////////////////////////////////

    var currentdate = new Date();

    var startdate = new Date();
    var enddate = new Date();

    if (dateVal === '0') {
      currentdate.setDate(1);
      console.log('ssss date', currentdate);
    } else if (dateVal === '12') {
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
    } else if (dateVal === '24') {
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
    } else {
      currentdate.setMonth(currentdate.getMonth() - dateVal);
    }

    if (dateVal === '12' || dateVal === '24') {
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

      var sDate =
        startdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

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
    } else if (dateVal === 'custom') {
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
    } else {
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

      var newMonth = cDate.split('-')[1];

      console.log('newMonth', newMonth);
    }

    //////////////////////////////////////////////

    axios
      .get(
        url +
          `invoiceDataOnDashBoard?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        setInvoiceData(data);

        if (statusVal === 'All') {
          let arr1 = [];

          console.log('invoice data', data);

          for (let i = 0; i < data.length; i++) {
            console.log('loop month', data[i].inv_date.split('-')[1]);

            console.log('cDate', cDate);
            console.log(' data[i].inv_date', data[i].inv_date);

            if (data[i].status === 'paid' || data[i].status === 'pending') {
              arr1.push(data[i]);
            }

            // console.log(arr1);
          }

          console.log('All');
          console.log('arr1', arr1);

          setInvoiceData(arr1);
        }

        if (statusVal === 'paid') {
          let arr1 = [];

          console.log('invoice data', data);

          for (let i = 0; i < data.length; i++) {
            console.log('loop month', data[i].inv_date.split('-')[1]);

            console.log('cDate', cDate);
            console.log(' data[i].inv_date', data[i].inv_date);

            if (data[i].status === 'paid') {
              arr1.push(data[i]);
            }

            // console.log(arr1);
          }

          console.log('paid');
          console.log('arr1', arr1);

          setInvoiceData(arr1);
        }

        if (statusVal === 'pending') {
          let arr1 = [];

          console.log('invoice data', data);

          for (let i = 0; i < data.length; i++) {
            console.log('loop month', data[i].inv_date.split('-')[1]);

            console.log('cDate', cDate);
            console.log(' data[i].inv_date', data[i].inv_date);

            if (data[i].status === 'pending') {
              arr1.push(data[i]);
            }

            // console.log(arr1);
          }

          console.log('pending');
          console.log('arr1', arr1);

          setInvoiceData(arr1);
        }

        if (statusVal === '' && dateVal !== '') {
          let arr1 = [];

          console.log('invoice data', data);

          if (dateVal === '12' || dateVal === '24' || dateVal === 'custom') {
            for (let i = 0; i < data.length; i++) {
              console.log('loop month', data[i].inv_date.split('-')[1]);

              console.log('cDate', cDate);
              console.log(' data[i].inv_date', data[i].inv_date);

              if (data[i].inv_date >= sDate && data[i].inv_date <= eDate) {
                arr1.push(data[i]);
              }

              // console.log(arr1);
            }
          } else {
            for (let i = 0; i < data.length; i++) {
              console.log('loop month', data[i].inv_date.split('-')[1]);

              console.log('cDate', cDate);
              console.log(' data[i].inv_date', data[i].inv_date);

              if (data[i].inv_date > cDate) {
                arr1.push(data[i]);
              }

              // console.log(arr1);
            }
          }

          console.log('Date filter only');
          console.log('arr1', arr1);

          setInvoiceData(arr1);
        }

        if (statusVal === 'All' && dateVal !== '') {
          let arr1 = [];

          console.log('invoice data', data);

          if (dateVal === '12' || dateVal === '24' || dateVal === 'custom') {
            for (let i = 0; i < data.length; i++) {
              console.log('loop month', data[i].inv_date.split('-')[1]);

              console.log('cDate', cDate);
              console.log(' data[i].inv_date', data[i].inv_date);

              if (
                (data[i].status === 'paid' || data[i].status === 'pending') &&
                data[i].inv_date >= sDate &&
                data[i].inv_date <= eDate
              ) {
                arr1.push(data[i]);
              }

              // console.log(arr1);
            }
          } else {
            for (let i = 0; i < data.length; i++) {
              console.log('loop month', data[i].inv_date.split('-')[1]);

              console.log('cDate', cDate);
              console.log(' data[i].inv_date', data[i].inv_date);

              if (
                (data[i].status === 'paid' || data[i].status === 'pending') &&
                data[i].inv_date > cDate
              ) {
                arr1.push(data[i]);
              }

              // console.log(arr1);
            }
          }

          console.log('All');
          console.log('arr1', arr1);

          setInvoiceData(arr1);
        }

        if (statusVal === 'paid' && dateVal !== '') {
          let arr1 = [];

          if (dateVal === '12' || dateVal === '24' || dateVal === 'custom') {
            for (let i = 0; i < data.length; i++) {
              if (
                data[i].status === 'paid' &&
                data[i].inv_date >= sDate &&
                data[i].inv_date <= eDate
              ) {
                arr1.push(data[i]);
              }
            }
          } else {
            for (let i = 0; i < data.length; i++) {
              if (data[i].status === 'paid' && data[i].inv_date > cDate) {
                arr1.push(data[i]);
              }
            }
          }
          console.log('paid');
          console.log('arr1', arr1);
          setInvoiceData(arr1);
        }

        if (statusVal === 'pending' && dateVal !== '') {
          let arr1 = [];

          if (dateVal === '12' || dateVal === '24' || dateVal === 'custom') {
            for (let i = 0; i < data.length; i++) {
              if (
                data[i].status === 'pending' &&
                data[i].inv_date >= sDate &&
                data[i].inv_date <= eDate
              ) {
                arr1.push(data[i]);
              }
            }
          } else {
            for (let i = 0; i < data.length; i++) {
              if (data[i].status === 'pending' && data[i].inv_date > cDate) {
                arr1.push(data[i]);
              }
            }
          }
          console.log('pending');
          console.log('arr1', arr1);
          setInvoiceData(arr1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        //successToast('Deleted Succesfully');
        // setTimeout(function () {
        //   history.push({
        //     pathname: '/view_group',
        //   });
        // }, 500);
        // dataLoading();
        // window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function receiptDeleting(tranID) {
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
      .get(url + `journal_search?tranId=${tranID}`)
      .then(({ data }) => {
        console.log('deleted transaction', data);
        let amount1 = data[0].amount;
        let status = data[0].status;
        if (status === 'Recieve' || status === '1') {
          let crdtAmountac = data[0].crdt_ac;
          let bankledger = data[0].bank;

          if (data[0].mode === 'cash') {
            // let ledgerID11 = '30';
            let ledgerID11 = sessionStorage.getItem('cashIdVal');
            //////////////////////////updatesLedger1 calculation/////////////
            axios
              .get(url + `ledger_search?ledgerId=${ledgerID11}`)
              .then(({ data }) => {
                console.log('ledgerID11 data', data);
                let previousAmount = data[0].amount;
                let finalAmount =
                  parseFloat(previousAmount) - parseFloat(amount1);

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

                finalObj1.company_name = sessionStorage.getItem('CompanyName');
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

                let previousAmount1 = data[0].amount;
                finalAmount1 =
                  parseFloat(previousAmount1) - parseFloat(amount1);

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

                    console.log('updatesLedger2 finalObj2', finalObj2);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            //////////////////////////else case  updatesLedger1 calculation/////////////
            axios
              .get(url + `ledger_search?ledgerId=${bankledger}`)
              .then(({ data }) => {
                console.log('bankledger data', data);
                let previousAmount = data[0].amount;
                let finalAmount =
                  parseFloat(previousAmount) - parseFloat(amount1);

                let finalObj1 = {};

                // data for account_ledger_v3 table
                finalObj1.id = bankledger;
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

                finalObj1.company_name = sessionStorage.getItem('CompanyName');
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

                let previousAmount1 = data[0].amount;
                finalAmount1 =
                  parseFloat(previousAmount1) - parseFloat(amount1);

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

                    console.log('updatesLedger2 finalObj2', finalObj2);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          }

          ////////transaction delete code//////
          axios
            .delete(url + `payment_delete/${tranID}`)
            .then(({ data }) => {
              console.log(data);
              //successToast('Deleted Succesfully');
              // setTimeout(function () {
              //   dataLoading();
              // }, 3000);
              // dataLoading();
              // window.location.reload(false);
            })

            .catch((err) => {
              console.log(err);
            });
        }

        if (status === 'Not_now' || status === '2') {
          ////////transaction delete code//////
          axios
            .delete(url + `payment_delete/${tranID}`)
            .then(({ data }) => {
              console.log(data);
              // successToast('Deleted Succesfully');
              // setTimeout(function () {
              //   dataLoading();
              // }, 3000);
              // dataLoading();
              // window.location.reload(false);
            })

            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function preDelete(invoice_tran_id) {
    console.log(`invoice tranId`, invoice_tran_id);

    axios
      .get(url + `tran_gen_Search?tran_gen_id=${invoice_tran_id}`)
      .then(({ data }) => {
        console.log(`transaction for delete`, data);

        for (let i = 0; i <= data.length; i++) {
          if (data[i].description === 'Received') {
            receiptDeleting(data[i].tranID);
          } else {
            deleting(data[i].tranID);
          }

          if (i === data.length - 1) {
            console.log(`equal`);
            let inv_id;
            axios
              .get(
                url +
                  `invoiceDataByTransactionId?transactionId=${invoice_tran_id}`
              )
              .then(({ data }) => {
                inv_id = data[0].inv_id;
                console.log(`invoice data for delete`, data);

                axios
                  .get(url + `invoiceSubDelete/${inv_id}`)
                  .then(({ data }) => {
                    console.log(`invoiceSub delete status`, data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });

                axios
                  .delete(url + `invoiceDelete/${inv_id}`)
                  .then(({ data }) => {
                    console.log(`invoice delete status`, data);
                    successToast('Deleted Succesfully');
                    dataloading();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <Headers />
      {invoiceDataLoaded && (
        <>
          <Container>
            <div>
              <h1>Invoice Dashboard</h1>
            </div>

            <div className="InvoiceDashBoardRightBtns">
              <input
                type="button"
                value="Create Invoice"
                onClick={() => {
                  history.push({
                    pathname: '/create_invoice',
                  });
                }}
                className="button-style"
              />
            </div>

            <div className="dashboardTableListFilter">
              <table>
                <tr>
                  <td>
                    <div className="selectWrapper">
                      <label>Date</label>
                      <select
                        name="date"
                        className="dashboard-textbox"
                        // value={taxSelected}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setCustomFlag(true);
                            localStorage.setItem('dateFilter', e.target.value);
                          } else {
                            setCustomFlag(false);

                            localStorage.setItem('dateFilter', e.target.value);

                            filterFun(e.target.value);
                          }
                        }}
                        // defaultValue={taxSelected}
                      >
                        <option value="">---Select---</option>
                        <option value="0">This month</option>
                        <option value="1">Last 1 month</option>
                        <option value="3">Last 3 month</option>
                        <option value="6">Last 6 month</option>
                        <option value="12">This Financial Year</option>
                        <option value="24">Last Financial Year</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </td>

                  <td>
                    <div className="selectWrapper">
                      <label>Status</label>
                      <select
                        name="status"
                        className="dashboard-textbox"
                        // value={taxSelected}
                        onChange={(e) => {
                          localStorage.setItem('statusFilter', e.target.value);

                          filterFun(e.target.value);
                        }}
                        defaultValue=""
                      >
                        <option value="">---Select---</option>
                        <option value="All">All</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <br></br>
                    {customFlag && (
                      <>
                        <div>
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
                                filterFun(e.target.value);
                              }}
                              defaultValue="Search"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              </table>
            </div>
            <div className="dashboardTableList">
              <div className="table-responsive">
                <table className="invoice-table table">
                  <tr className="invoice-tr">
                    <th className="invoice-th-td">Date</th>
                    <th className="invoice-th-td">Invoice number</th>
                    <th className="invoice-th-td">Customer</th>
                    <th className="invoice-th-td">Service</th>
                    <th className="invoice-th-td">Amount</th>
                    <th className="invoice-th-td">Tax</th>
                    <th className="invoice-th-td">Total</th>
                    <th className="invoice-th-td">TDS</th>
                    <th className="invoice-th-td">Balance</th>
                    <th className="invoice-th-td">Status</th>
                    <th className="invoice-th-td ">Action</th>
                  </tr>

                  {invoiceData.map((x, i) => {
                    return (
                      <tr className="invoice-tr" key={x.inv_id}>
                        <td className="invoice-th-td">{x.inv_date}</td>
                        <td className="invoice-th-td">{x.inv_no}</td>
                        <td className="invoice-th-td">{x.cust_name}</td>
                        <td className="invoice-th-td">{x.service}</td>
                        <td className="invoice-th-td"> {x.total_amount}</td>

                        <td className="invoice-th-td"> {x.total_tax}</td>

                        <td className="invoice-th-td">
                          {' '}
                          {parseFloat(x.total_amount) + parseFloat(x.total_tax)}
                        </td>
                        <td>{x.tds_rate === '' ? '0' : x.tds_rate}</td>

                        <td className="invoice-th-td">
                          {' '}
                          {parseFloat(x.total_amount) +
                            parseFloat(x.total_tax) -
                            (x.tds_rate === '' ? parseFloat(0) : x.tds_rate) -
                            parseFloat(x.amount_received)}{' '}
                        </td>
                        <td className="invoice-th-td">
                          {' '}
                          {x.status === 'pending' ? (
                            <a
                              className="LinkBtns"
                              onClick={() => {
                                history.push({
                                  pathname: '/receive_invoice',
                                  post: x,
                                });
                              }}
                            >
                              Receive Payment
                            </a>
                          ) : (
                            'paid'
                          )}
                        </td>

                        <td className="invoice-th-td">
                          <div className="actionButton">
                            <button
                              outlined
                              className="primary"
                              onClick={() => {
                                history.push({
                                  pathname: '/edit_invoice',
                                  post: x,
                                });
                              }}
                              //disabled={inputList.length - i !== 1 ? true : false}
                            >
                              Edit
                            </button>
                            <button
                              className="secondary"
                              onClick={() => {
                                history.push({
                                  pathname: '/dashboard_preview',
                                  post: x,
                                });
                              }}
                              //disabled={inputList.length - i !== 1 ? true : false}
                            >
                              View
                            </button>
                            <button
                              className="deletebtn"
                              onClick={(e) => {
                                confirmAlert({
                                  title: 'Confirm to Delete',
                                  message: 'Are you sure to do this.',
                                  buttons: [
                                    {
                                      label: 'Yes',
                                      onClick: () =>
                                        preDelete(x.invoice_tran_id),
                                    },
                                    {
                                      label: 'No',
                                      // onClick: () => alert('Click No')
                                    },
                                  ],
                                });
                              }}
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
              <ToastContainer />
            </div>
          </Container>
        </>
      )}
    </div>
  );
};

export default Dashboard_invoice;
