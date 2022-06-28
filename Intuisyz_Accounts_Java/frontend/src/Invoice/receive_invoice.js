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
import Headers from '../Header/Headers';

const Receive_invoice = () => {
  let url = baseUrl.url;

  let location = useLocation();
  let history = useHistory();

  const [endDate, setEndDate] = useState(new Date());
  const [bankFlag, setBankFlag] = useState(false);
  const [bankName, setBankName] = useState([]);
  const [amountReceivedData, setAmountReceivedData] = useState();
  const [customerName, setCustomerName] = useState();
  const [invIdData, setInvIdData] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [tranDateValidation, setTranDateValidation] = useState(false);
  const [bankValidation, setBankValidation] = useState(false);

  const [customerNameLoaded, setCustomerNameLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  let userID = '';

  const submitFinal = handleSubmit((data) => {
    if (data.paymentMethod === 'NEFT/RTGS') {
      if (
        endDate === null ||
        endDate === undefined ||
        data.bank === undefined ||
        data.bank === ''
      ) {
        if (endDate === null || endDate === undefined) {
          setTranDateValidation(true);
          if (data.bank != undefined || data.bank != '') {
            setBankValidation(false);
          }
        }
        if (data.bank === undefined || data.bank === '') {
          setBankValidation(true);
          if (endDate != null || endDate != undefined) {
            setTranDateValidation(false);
          }
        }
      } else {
        setTranDateValidation(false);
        setBankValidation(false);

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

        console.log('endDate', endDate);

        /////////invoice date calculation////////////

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

        var eDate =
          endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

        let finalObj1 = {};

        finalObj1.cust_name = invoiceData[0].cust_name;
        finalObj1.payment_mode = data.paymentMethod;
        if (bankFlag === true) {
          finalObj1.bank_name = data.bank;
        } else {
          finalObj1.bank_name = '';
        }

        finalObj1.payment_date = eDate;
        finalObj1.amount_received =
          parseFloat(data.amountReceived) +
          parseFloat(location.post.amount_received);

        addReceipt(
          finalObj1.bank_name,
          finalObj1.payment_mode,
          data.amountReceived
        );

        axios
          .get(url + `invoiceDataById?invoiceId=${location.post.inv_id}`)
          .then(({ data }) => {
            console.log('invoice data', data);

            finalObj1.inv_id = data[0].inv_id;
            finalObj1.inv_date = data[0].inv_date;
            finalObj1.inv_no = data[0].inv_no;

            finalObj1.swift_code = data[0].swift_code;
            finalObj1.ifsc = data[0].ifsc;

            finalObj1.service = data[0].service;
            finalObj1.place_of_supply = data[0].place_of_supply;
            finalObj1.bill_address = data[0].bill_address;
            finalObj1.gst_no = data[0].gst_no;
            finalObj1.tds_rate = data[0].tds_rate;
            finalObj1.created_date = cDate;
            finalObj1.created_time = cTime;
            if (
              parseFloat(data[0].total_amount) +
                parseFloat(data[0].total_tax) -
                (data[0].tds_rate === '' ? parseFloat(0) : data[0].tds_rate) -
                parseFloat(finalObj1.amount_received) ===
              0
            ) {
              finalObj1.status = 'paid';
            } else {
              finalObj1.status = 'pending';
            }
            finalObj1.total_amount = data[0].total_amount;
            finalObj1.total_tax = data[0].total_tax;
            finalObj1.invoice_tran_id = data[0].invoice_tran_id;

            finalObj1.company_name = sessionStorage.getItem('CompanyName');
            finalObj1.cust_id = sessionStorage.getItem('CustId');

            console.log(
              'finalObj1.amount_received',
              parseFloat(data[0].total_amount) +
                parseFloat(data[0].total_tax) -
                parseFloat(finalObj1.amount_received)
            );

            axios
              .put(url + `invoice_update/${location.post.inv_id}`, finalObj1)
              .then(() => {
                successToast('Invoice updated  Succesfully');

                setTimeout(function () {
                  history.push({
                    pathname: '/dashboard_invoice',
                  });
                }, 3000);

                reset();
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });

        console.log('FinalObj1', finalObj1);
      }
    }

    if (data.paymentMethod === 'cash') {
      if (endDate === null || endDate === undefined) {
        setTranDateValidation(true);
      } else {
        setTranDateValidation(false);
        setBankValidation(false);

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

        console.log('endDate', endDate);

        /////////invoice date calculation////////////

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

        var eDate =
          endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

        let finalObj1 = {};

        finalObj1.cust_name = invoiceData[0].cust_name;
        finalObj1.payment_mode = data.paymentMethod;
        if (bankFlag === true) {
          finalObj1.bank_name = data.bank;
        } else {
          finalObj1.bank_name = '';
        }

        finalObj1.payment_date = eDate;
        finalObj1.amount_received =
          parseFloat(data.amountReceived) +
          parseFloat(location.post.amount_received);

        addReceipt(
          finalObj1.bank_name,
          finalObj1.payment_mode,
          data.amountReceived
        );

        axios
          .get(url + `invoiceDataById?invoiceId=${location.post.inv_id}`)
          .then(({ data }) => {
            console.log('invoice data', data);

            finalObj1.inv_id = data[0].inv_id;
            finalObj1.inv_date = data[0].inv_date;
            finalObj1.inv_no = data[0].inv_no;
            finalObj1.inv_no = data[0].inv_no;

            finalObj1.swift_code = data[0].swift_code;
            finalObj1.ifsc = data[0].ifsc;

            finalObj1.service = data[0].service;
            finalObj1.place_of_supply = data[0].place_of_supply;
            finalObj1.bill_address = data[0].bill_address;
            finalObj1.gst_no = data[0].gst_no;
            finalObj1.tds_rate = data[0].tds_rate;
            finalObj1.created_date = cDate;
            finalObj1.created_time = cTime;
            if (
              parseFloat(data[0].total_amount) +
                parseFloat(data[0].total_tax) -
                (data[0].tds_rate === '' ? parseFloat(0) : data[0].tds_rate) -
                parseFloat(finalObj1.amount_received) ===
              0
            ) {
              finalObj1.status = 'paid';
            } else {
              finalObj1.status = 'pending';
            }
            finalObj1.total_amount = data[0].total_amount;
            finalObj1.total_tax = data[0].total_tax;
            finalObj1.invoice_tran_id = data[0].invoice_tran_id;

            finalObj1.company_name = sessionStorage.getItem('CompanyName');
            finalObj1.cust_id = sessionStorage.getItem('CustId');

            console.log(
              'finalObj1.amount_received',
              parseFloat(data[0].total_amount) +
                parseFloat(data[0].total_tax) -
                parseFloat(finalObj1.amount_received)
            );

            axios
              .put(url + `invoice_update/${location.post.inv_id}`, finalObj1)
              .then(() => {
                successToast('Invoice updated  Succesfully');

                setTimeout(function () {
                  history.push({
                    pathname: '/dashboard_invoice',
                  });
                }, 3000);

                reset();
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });

        console.log('FinalObj1', finalObj1);
      }
    }
  });

  function addReceipt(bankNameVal, paymentMethodVal, Amount) {
    var currentdate = new Date();
    // console.log('upload data', data.upload);
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
    ////////mode checking////////

    if (paymentMethodVal === 'NEFT/RTGS') {
      if (
        endDate === null ||
        endDate === undefined ||
        bankNameVal === undefined ||
        bankNameVal === ''
      ) {
        if (endDate === null || endDate === undefined) {
          setTranDateValidation(true);
          if (bankNameVal != undefined || bankNameVal != '') {
            setBankValidation(false);
          }
        }
        if (bankNameVal === undefined || bankNameVal === '') {
          setBankValidation(true);
          if (endDate != null || endDate != undefined) {
            setTranDateValidation(false);
          }
        }
        // setChequeDateValidation(true);
      } else {
        setTranDateValidation(false);
        setBankValidation(false);

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

        var eDate =
          endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

        /////////////cheque date/////////////////
        // if (chequeDate === null || chequeDate === undefined) {
        //   var cheque__Date = '';
        // } else {
        //   if (chequeDate.getDate() < 10) {
        //     var currentDay = '0' + chequeDate.getDate();
        //   } else {
        //     var currentDay = chequeDate.getDate();
        //   }

        //   if (chequeDate.getMonth() + 1 < 10) {
        //     var currentMonth = '0' + (chequeDate.getMonth() + 1);
        //   } else {
        //     var currentMonth = chequeDate.getMonth() + 1;
        //   }

        //   var cheque__Date =
        //     chequeDate.getFullYear() + '-' + currentMonth + '-' + currentDay;
        // }

        let finalObj1 = {};

        finalObj1.transactionID = uuid();
        finalObj1.crdt_ac = invoiceData[0].cust_name;
        // finalObj1.dbt_ac = arr[0].ac_type;
        // finalObj1.crdt_ac = arr[0].ac_title;
        finalObj1.mode = paymentMethodVal;
        finalObj1.amount = Amount;
        finalObj1.type = 'Receipt'; //transactionType
        finalObj1.tran_gen = invoiceData[0].invoice_tran_id; //  not used , but in table
        finalObj1.tran_Date = eDate; //datee
        finalObj1.description = 'Received'; //narrative
        finalObj1.ac_no = 'Nil';
        finalObj1.chq_no = '';
        finalObj1.chq_date = '';
        finalObj1.branch = 'Nil';
        finalObj1.user_bank = 'Nil'; //bankname
        if (paymentMethodVal === 'NEFT/RTGS') {
          finalObj1.bank = bankNameVal;
        } else {
          finalObj1.bank = '';
        }
        finalObj1.status = 'Recieve';
        finalObj1.filename = 'Nil'; //image
        finalObj1.filepath = ''; //im
        finalObj1.createdBy = ''; // userID
        finalObj1.createdDate = cDate;
        finalObj1.createdTime = cTime;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

        console.log('FinalObj1', finalObj1);
        console.log('tran date', finalObj1.tran_Date);
        console.log('cheque__Date', finalObj1.chq_date);

        let dbtAc = '';
        if (finalObj1.mode === 'NEFT/RTGS') {
          dbtAc = finalObj1.bank;
          finalObj1.dbt_ac = dbtAc;
          axios
            .post(url + 'add_payment', finalObj1)
            .then(() => {
              // successToast('Receipt Created Successfully');
              // reset();
              console.log('finalObj1.bank', finalObj1.bank);
              increaseAmount(
                finalObj1.bank,
                finalObj1.amount,
                cDate,
                cTime,
                userID
              );
              decreaseAmount(
                finalObj1.crdt_ac,
                finalObj1.amount,
                cDate,
                cTime,
                userID
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          if (finalObj1.status === 'Recieve') {
            if (finalObj1.mode === 'cash') {
              // dbtAc = '30';
              dbtAc = sessionStorage.getItem('cashIdVal');
            }
            if (finalObj1.mode === 'cheque') {
              dbtAc = finalObj1.bank;
            }
            finalObj1.dbt_ac = dbtAc;
            axios
              .post(url + 'add_payment', finalObj1)
              .then(() => {
                // successToast('Receipt Created Successfully');
                // reset();
                console.log('dbtAc', dbtAc);
                increaseAmount(dbtAc, finalObj1.amount, cDate, cTime, userID);
                decreaseAmount(
                  finalObj1.crdt_ac,
                  finalObj1.amount,
                  cDate,
                  cTime,
                  userID
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // I think this else part not used now...so not coded correctly
            if (finalObj1.mode === 'cash') {
              // dbtAc = '30';
              dbtAc = sessionStorage.getItem('cashIdVal');
            }
            if (finalObj1.mode === 'cheque') {
              dbtAc = finalObj1.bank;
            }
            finalObj1.dbt_ac = dbtAc;
            axios
              .post(url + 'add_payment', finalObj1)
              .then(() => {
                // successToast('Receipt Created Successfully');
                // reset();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      }
    } else if (paymentMethodVal === 'cash') {
      if (endDate === null || endDate === undefined) {
        setTranDateValidation(true);

        // setChequeDateValidation(true);
      } else {
        setTranDateValidation(false);
        setBankValidation(false);
        // setChequeDateValidation(false);

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

        var eDate =
          endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

        /////////////cheque date/////////////////
        // if (chequeDate === null || chequeDate === undefined) {
        //   var cheque__Date = '';
        // } else {
        //   if (chequeDate.getDate() < 10) {
        //     var currentDay = '0' + chequeDate.getDate();
        //   } else {
        //     var currentDay = chequeDate.getDate();
        //   }

        //   if (chequeDate.getMonth() + 1 < 10) {
        //     var currentMonth = '0' + (chequeDate.getMonth() + 1);
        //   } else {
        //     var currentMonth = chequeDate.getMonth() + 1;
        //   }

        //   var cheque__Date =
        //     chequeDate.getFullYear() + '-' + currentMonth + '-' + currentDay;
        // }

        let finalObj1 = {};

        finalObj1.transactionID = uuid();
        finalObj1.crdt_ac = invoiceData[0].cust_name;
        // finalObj1.dbt_ac = arr[0].ac_type;
        // finalObj1.crdt_ac = arr[0].ac_title;
        finalObj1.mode = paymentMethodVal;
        finalObj1.amount = Amount;
        finalObj1.type = 'Receipt'; //transactionType
        finalObj1.tran_gen = invoiceData[0].invoice_tran_id; //   not used , but in table
        finalObj1.tran_Date = eDate; //datee
        finalObj1.description = 'Received'; //narrative
        finalObj1.ac_no = 'Nil';
        finalObj1.chq_no = '';
        finalObj1.chq_date = '';
        finalObj1.branch = 'Nil';
        finalObj1.user_bank = 'Nil'; //bankname
        if (paymentMethodVal === 'NEFT/RTGS') {
          finalObj1.bank = bankNameVal;
        } else {
          finalObj1.bank = '';
        }
        finalObj1.status = 'Recieve';
        finalObj1.filename = 'Nil'; //image
        finalObj1.filepath = ''; //im
        finalObj1.createdBy = ''; // userID
        finalObj1.createdDate = cDate;
        finalObj1.createdTime = cTime;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

        console.log('FinalObj1', finalObj1);
        console.log('tran date', finalObj1.tran_Date);
        console.log('cheque__Date', finalObj1.chq_date);

        let dbtAc = '';
        if (finalObj1.mode === 'NEFT/RTGS') {
          dbtAc = finalObj1.bank;
          finalObj1.dbt_ac = dbtAc;
          axios
            .post(url + 'add_payment', finalObj1)
            .then(() => {
              // successToast('Receipt Created Successfully');
              // reset();
              console.log('finalObj1.bank', finalObj1.bank);
              increaseAmount(
                finalObj1.bank,
                finalObj1.amount,
                cDate,
                cTime,
                userID
              );
              decreaseAmount(
                finalObj1.crdt_ac,
                finalObj1.amount,
                cDate,
                cTime,
                userID
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          if (finalObj1.status === 'Recieve') {
            if (finalObj1.mode === 'cash') {
              // dbtAc = '30';
              dbtAc = sessionStorage.getItem('cashIdVal');
            }
            if (finalObj1.mode === 'cheque') {
              dbtAc = finalObj1.bank;
            }
            finalObj1.dbt_ac = dbtAc;
            axios
              .post(url + 'add_payment', finalObj1)
              .then(() => {
                // successToast('Receipt Created Successfully');
                // reset();
                console.log('dbtAc', dbtAc);
                increaseAmount(dbtAc, finalObj1.amount, cDate, cTime, userID);
                decreaseAmount(
                  finalObj1.crdt_ac,
                  finalObj1.amount,
                  cDate,
                  cTime,
                  userID
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // I think this else part not used now...so not coded correctly
            if (finalObj1.mode === 'cash') {
              // dbtAc = '30';
              dbtAc = sessionStorage.getItem('cashIdVal');
            }
            if (finalObj1.mode === 'cheque') {
              dbtAc = finalObj1.bank;
            }
            finalObj1.dbt_ac = dbtAc;
            axios
              .post(url + 'add_payment', finalObj1)
              .then(() => {
                // successToast('Receipt Created Successfully');
                // reset();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      }
    }
  }

  function increaseAmount(ledgerID, ledgeramount, created_date, time, userID) {
    let currentAmount, updatedAmount;
    axios
      .get(url + `ledger_search?ledgerId=${ledgerID}`)
      .then(({ data }) => {
        console.log(data);
        currentAmount = data[0].amount;
        if (currentAmount === '') {
          currentAmount = 0;
        }
        updatedAmount = parseFloat(currentAmount) + parseFloat(ledgeramount);
        console.log('increase function updatedAmount', updatedAmount);

        let finalObj3 = {};

        // data for account_ledger_v3 table
        finalObj3.id = ledgerID;
        finalObj3.ledger_name = data[0].ledger_name;

        finalObj3.ac_group = data[0].ac_group;
        finalObj3.name = data[0].name;
        finalObj3.address = data[0].address;
        finalObj3.state = data[0].state;
        finalObj3.pin = data[0].pin;
        finalObj3.contact = data[0].contact;
        finalObj3.mobile = data[0].mobile;
        finalObj3.fax = data[0].fax;
        finalObj3.email = data[0].email;
        finalObj3.acc_number = data[0].acc_number;
        finalObj3.bank = data[0].bank;
        finalObj3.branch = data[0].branch;
        finalObj3.ifsc_code = data[0].ifsc_code;
        finalObj3.open_balance = data[0].open_balance;
        finalObj3.amount = updatedAmount;
        //account id
        finalObj3.created_date = created_date;
        finalObj3.time = time;
        //userId
        finalObj3.balance_type = data[0].balance_type;
        finalObj3.ledger_date = data[0].ledger_date;

        finalObj3.company_name = sessionStorage.getItem('CompanyName');
        finalObj3.cust_id = sessionStorage.getItem('CustId');

        axios
          .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
          .then(({ data }) => {
            console.log('grpId', data);

            // setFlag(data);
            finalObj3.ac_type = data[0].ac_type;
            finalObj3.ac_title = data[0].ac_title;

            axios
              .put(url + `ledger_update/${finalObj3.id}`, finalObj3)
              .then(() => {
                console.log('increaseAmount Updated Successfully');
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

            console.log('increaseAmount finalObj3', finalObj3);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function decreaseAmount(ledgerID, ledgeramount, created_date, time, userID) {
    let currentAmount, updatedAmount;
    axios
      .get(url + `ledger_search?ledgerId=${ledgerID}`)
      .then(({ data }) => {
        console.log(data);
        currentAmount = data[0].amount;
        if (currentAmount === '') {
          currentAmount = 0;
        }
        updatedAmount = parseFloat(currentAmount) - parseFloat(ledgeramount);
        console.log('decrease function updatedAmount', updatedAmount);

        let finalObj4 = {};

        // data for account_ledger_v3 table
        finalObj4.id = ledgerID;
        finalObj4.ledger_name = data[0].ledger_name;

        finalObj4.ac_group = data[0].ac_group;
        finalObj4.name = data[0].name;
        finalObj4.address = data[0].address;
        finalObj4.state = data[0].state;
        finalObj4.pin = data[0].pin;
        finalObj4.contact = data[0].contact;
        finalObj4.mobile = data[0].mobile;
        finalObj4.fax = data[0].fax;
        finalObj4.email = data[0].email;
        finalObj4.acc_number = data[0].acc_number;
        finalObj4.bank = data[0].bank;
        finalObj4.branch = data[0].branch;
        finalObj4.ifsc_code = data[0].ifsc_code;
        finalObj4.open_balance = data[0].open_balance;
        finalObj4.amount = updatedAmount;
        //account id
        finalObj4.created_date = created_date;
        finalObj4.time = time;
        //userId
        finalObj4.balance_type = data[0].balance_type;
        finalObj4.ledger_date = data[0].ledger_date;

        finalObj4.company_name = sessionStorage.getItem('CompanyName');
        finalObj4.cust_id = sessionStorage.getItem('CustId');

        axios
          .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
          .then(({ data }) => {
            console.log('grpId', data);

            // setFlag(data);
            finalObj4.ac_type = data[0].ac_type;
            finalObj4.ac_title = data[0].ac_title;

            axios
              .put(url + `ledger_update/${finalObj4.id}`, finalObj4)
              .then(() => {
                console.log('decreaseAmount Updated Successfully');
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

            console.log('decreaseAmount finalObj4', finalObj4);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let customerNameVal;

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        history.push({
          pathname: '/dashboard_invoice',
        });
      } else {
        console.log('location.post.inv_id', location.post.inv_id);

        axios
          // .get('http://localhost:8080/bank_name')
          .get(
            url +
              `bank_name?CompanyName=${sessionStorage.getItem(
                'CompanyName'
              )}&CustId=${sessionStorage.getItem('CustId')}`
          )
          .then(({ data }) => {
            console.log(data);
            setBankName(data);
          })
          .catch((err) => {
            console.log(err);
          });

        let invId = location.post.inv_id;
        setInvIdData(invId);

        axios
          .get(url + `invoiceDataById?invoiceId=${invId}`)
          .then(({ data }) => {
            console.log('invoice data', data);
            setInvoiceData(data);

            axios
              .get(url + `ledger_search2?ledgerId=${data[0].cust_name}`)
              .then(({ data }) => {
                console.log('customer name data', data[0].ledger_name);
                customerNameVal = data[0].ledger_name;
                setCustomerName(data[0].ledger_name);
                setCustomerNameLoaded(true);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  return (
    <div>
      <Headers />

      {customerNameLoaded && (
        <>
          <div>
            <br />
            <div>
              <label style={{ fontSize: 24, fontWeight: 'bold' }}>
                <b>Receive Payment</b>
              </label>
            </div>
            <br />
            <br />
            <br />
            <tr style={{ textAlign: 'center' }}>
              <td>
                <label
                  style={{
                    paddingLeft: 200,
                    fontSize: 16,
                    fontWeight: 'normal',
                  }}
                >
                  Customer Name :
                </label>
                &nbsp;
                <input
                  type="text"
                  style={{ borderWidth: 1, height: 30, width: 180 }}
                  defaultValue={customerName}
                  name="customerName"
                  id="customerName"
                  {...register('customerName')}
                  disabled
                ></input>
              </td>
              <td>
                <label
                  style={{
                    paddingLeft: 200,
                    fontSize: 16,
                    fontWeight: 'normal',
                  }}
                >
                  Amount Received :
                </label>
                &nbsp;
                <input
                  type="text"
                  style={{ borderWidth: 1, height: 30, width: 180 }}
                  defaultValue={
                    parseFloat(location.post.total_amount) +
                    parseFloat(location.post.total_tax) -
                    (location.post.tds_rate === ''
                      ? parseFloat(0)
                      : parseFloat(location.post.tds_rate)) -
                    parseFloat(location.post.amount_received)
                  }
                  name="amountReceived"
                  id="amountReceived"
                  {...register('amountReceived')}
                ></input>
              </td>
            </tr>
            <br />
            <br />
            <br />
            <tr>
              <td>
                <label
                  style={{
                    paddingLeft: 200,
                    fontSize: 16,
                    fontWeight: 'normal',
                  }}
                >
                  Payment Date :
                </label>
                &nbsp; &nbsp; &nbsp;
                <DatePicker
                  name="end"
                  className="form-control datepicker"
                  dateFormat="dd/MM/yyyy"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  defaultValue=""
                />
                <div style={{ color: 'red' }}>
                  {tranDateValidation && <p>Please enter transaction date</p>}
                </div>
              </td>

              <td>
                <label
                  style={{
                    paddingLeft: 200,
                    fontSize: 16,
                    fontWeight: 'normal',
                  }}
                >
                  Payment Method :
                </label>
                &nbsp;
                <select
                  //   defaultValue={
                  //     JSON.parse(localStorage.getItem('finalObj1')).cust_name
                  //   }
                  name="paymentMethod"
                  id="paymentMethod"
                  {...register('paymentMethod')}
                  //   {...register('customer', {
                  //     required: true,
                  //   })}
                  //   className="cl"
                  style={{ borderWidth: 1, height: 30, width: 180 }}
                  onChange={(e) => {
                    if (e.target.value === 'NEFT/RTGS') {
                      setBankFlag(true);
                    } else {
                      setBankFlag(false);
                    }
                  }}
                >
                  {/* <option value="">---Select---</option> */}
                  <option value="cash">Cash</option>
                  <option value="NEFT/RTGS">Bank</option>
                </select>
              </td>
            </tr>
            <br />
            <br />
            <br />
            {bankFlag && (
              <tr>
                <td>
                  <label
                    style={{
                      paddingLeft: 200,
                      fontSize: 16,
                      fontWeight: 'normal',
                    }}
                  >
                    Bank :
                  </label>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp;
                  <select
                    //   defaultValue={
                    //     JSON.parse(localStorage.getItem('finalObj1')).cust_name
                    //   }
                    name="bank"
                    id="bank"
                    {...register('bank')}
                    style={{ borderWidth: 1, height: 30, width: 184 }}
                  >
                    <option value="">-----Select------</option>

                    {bankName.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.ledger_name}
                        </option>
                      );
                    })}
                  </select>
                  <div style={{ color: 'red' }}>
                    {bankValidation && <p>Please Select bank</p>}
                  </div>
                </td>
              </tr>
            )}
            <br />
            <br />
            <br />

            <tr>
              <td style={{ paddingLeft: 500 }}>
                <button
                  type="submit"
                  style={{ width: 100, background: 'green', color: 'white' }}
                  onClick={(e) => {
                    e.preventDefault();

                    submitFinal();
                  }}
                >
                  Save
                </button>
              </td>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <td>
                <button
                  type="submit"
                  style={{ width: 100, background: 'green', color: 'white' }}
                  onClick={() => {
                    history.push({ pathname: '/dashboard_invoice' });
                  }}
                >
                  Cancel
                </button>
              </td>
            </tr>

            <br />
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  );
};
export default Receive_invoice;
