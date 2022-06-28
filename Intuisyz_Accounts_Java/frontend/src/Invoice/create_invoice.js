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
import { Container, Row, Col } from 'react-bootstrap';
import Button from '@restart/ui/esm/Button';
import '../Invoice/main.css';
import Modal from 'react-modal';
import Headers from '../Header/Headers';

// import { AiFillDelete } from 'react-icons/AiFillDelete';
// import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

const Create_invoice = () => {
  const [endDate, setEndDate] = useState(new Date());
  const [ledgerData, setLedgerData] = useState([]);
  const [cashState, setCashState] = useState(1);
  const [chequeState, setChequeState] = useState(0);
  const [neftState, setNeftState] = useState(0);
  const [chequeDate, setChequeDate] = useState();
  const [invoiceDateValidation, setInvoiceDateValidation] = useState(false);
  const [chequeDateValidation, setChequeDateValidation] = useState(false);
  const [chequeNoValidation, setChequeNoValidation] = useState(false);
  const [bankName, setBankName] = useState([]);
  const [bankValidation, setBankValidation] = useState(false);
  const [refreshBtn1, setRefreshBtn1] = useState(false);
  const [refreshBtn2, setRefreshBtn2] = useState(false);
  const [downloadUri, setDownloadUri] = React.useState('Nil');
  const [fileUploadFlag, setFileUploadFlag] = useState(false);
  const [fileUploadData, setFileUploadData] = useState('');
  const [modeValidation, setModeValidation] = useState(false);
  const [flagData, setFlagData] = useState('');
  const [placeOfSupplySelected, setPlaceOfSupplySelected] = useState('');
  const [taxSelected, setTaxSelected] = useState('');
  const [totalAmountCalculated, setTotalAmountCalculated] = useState(0);
  const [taxAmountCalculated, setTaxAmountCalculated] = useState(0);
  const [previewInvoiceValue1, setPreviewInvoiceValue1] = useState('');
  const [customerName, setCustomerName] = useState();
  const [serviceName, setServiceName] = useState();
  const [serviceNameLoaded, setServiceNameLoaded] = useState(false);
  const [customerNameLoaded, setCustomerNameLoaded] = useState(false);
  const [uuidValue, setUuidValue] = useState(uuid());

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [mailToData, setMailToData] = useState();
  const [mailSubData, setMailSubData] = useState();
  const [mailBodyData, setMailBodyData] = useState();

  let url = baseUrl.url;
  let userID = '';
  let location = useLocation();
  let history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const submitFinal = handleSubmit((data) => {
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
    console.log('chequeDate', chequeDate);

    ////////mode checking////////

    if (endDate === null || endDate === undefined) {
      setInvoiceDateValidation(true);
    } else {
      setInvoiceDateValidation(false);

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

      var eDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

      let finalObj1 = {};

      finalObj1.inv_date = eDate;
      finalObj1.inv_no = data.invoiceNo;
      finalObj1.cust_name = data.customer;
      finalObj1.service = data.service;
      finalObj1.place_of_supply = data.placeOfSupply;
      finalObj1.bill_address = data.address;
      finalObj1.gst_no = data.gstNo;
      finalObj1.tds_rate = data.tdsRate;
      finalObj1.created_date = cDate;
      finalObj1.created_time = cTime;
      finalObj1.status = 'pending';
      finalObj1.payment_mode = 'null';
      finalObj1.bank_name = 'null';
      finalObj1.payment_date = 'null';
      finalObj1.amount_received = 0;
      finalObj1.invoice_tran_id = uuidValue;
      finalObj1.swift_code = data.SwiftCode;
      finalObj1.ifsc = data.IFSC;

      finalObj1.company_name = sessionStorage.getItem('CompanyName');
      finalObj1.cust_id = sessionStorage.getItem('CustId');

      if (localStorage.getItem('invoicePageStatus') === '') {
        finalObj1.total_amount = totalAmountCalculated;
      } else {
        finalObj1.total_amount = localStorage.getItem('SubTotalAmountData');
      }

      if (localStorage.getItem('invoicePageStatus') === '') {
        finalObj1.total_tax = (totalAmountCalculated * taxSelected) / 100;
      } else {
        finalObj1.total_tax =
          (localStorage.getItem('SubTotalAmountData') * taxSelected) / 100;
      }

      console.log('FinalObj1', finalObj1);

      axios
        .post(url + 'add_invoice', finalObj1)
        .then(() => {
          successToast('Invoice Created Successfully');
          reset();

          axios
            .get(
              url +
                `invoiceData?CompanyName=${sessionStorage.getItem(
                  'CompanyName'
                )}&CustId=${sessionStorage.getItem('CustId')}`
            )
            .then(({ data }) => {
              console.log('invoice data', data);

              ////////////////Journal section calling////////////
              addJournal(
                finalObj1.cust_name,
                finalObj1.service,
                finalObj1.total_amount,
                'Invoice'
              );

              if (
                finalObj1.place_of_supply === 'InterState' ||
                finalObj1.place_of_supply === 'IntraState'
              ) {
                console.log('GST inserted');
                // setTimeout(function () {
                //   console.log('GST inserted');

                addJournal1(
                  finalObj1.cust_name,
                  sessionStorage.getItem('gstIdVal'),
                  finalObj1.total_tax,
                  'GST charges'
                );
                // }, 2000);
              }

              if (finalObj1.tds_rate !== '') {
                console.log('TDS inserted');
                // setTimeout(function () {
                //   console.log('TDS inserted');
                addJournal2(
                  sessionStorage.getItem('tdsIdVal'),
                  finalObj1.cust_name,
                  finalObj1.tds_rate,
                  'TDS Deducted'
                );
                // }, 3000);
              }

              console.log('invoice last data id', data[data.length - 1].inv_id);

              let newInvId = data[data.length - 1].inv_id;

              console.log('inputList data', inputList);

              for (let i = 0; i < inputList.length; i++) {
                let finalObj2 = {};

                if (
                  inputList[i].amount === '' &&
                  inputList[i].description === '' &&
                  inputList[i].hsn === '' &&
                  inputList[i].qty === '' &&
                  inputList[i].remarks === '' &&
                  inputList[i].tax === ''
                ) {
                  continue;
                } else {
                  finalObj2.amount = inputList[i].amount;
                  finalObj2.created_date = cDate;
                  finalObj2.created_time = cTime;
                  finalObj2.description = inputList[i].description;
                  finalObj2.hsn = inputList[i].hsn;
                  finalObj2.inv_id = newInvId;
                  finalObj2.qty = inputList[i].qty;
                  finalObj2.remarks = inputList[i].remarks;
                  finalObj2.tax = inputList[i].tax;

                  axios
                    .post(url + 'add_invoice_sub', finalObj2)
                    .then(() => {
                      console.log(i, ' th row ', finalObj2);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
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

              setTimeout(function () {
                history.push({
                  pathname: '/dashboard_invoice',
                });
              }, 3000);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      //   { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
    }
  });

  function addJournal(Debit, Credit, Amount, narration) {
    // current date
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

    // journal date

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

    let journalCredit = Credit;
    let journalDebit = Debit;
    let journalAmount = Amount;

    let finalObj1 = {};

    finalObj1.transactionID = uuid();
    finalObj1.dbt_ac = Debit;
    // finalObj1.dbt_ac = arr[0].ac_type;
    finalObj1.crdt_ac = Credit;
    finalObj1.mode = '';
    finalObj1.amount = Amount;
    finalObj1.type = 'Contra'; //transactionType
    finalObj1.tran_gen = uuidValue;
    finalObj1.tran_Date = eDate; //datee
    finalObj1.description = narration; //narrative
    finalObj1.ac_no = '';
    finalObj1.chq_no = '';
    finalObj1.chq_date = '';
    finalObj1.branch = '';
    finalObj1.user_bank = ''; //bankname
    finalObj1.bank = '';
    finalObj1.status = '1';
    finalObj1.filename = 'Nil'; //image
    finalObj1.filepath = ''; //im
    finalObj1.createdBy = ''; // userID
    finalObj1.createdDate = cDate;
    finalObj1.createdTime = cTime;

    finalObj1.company_name = sessionStorage.getItem('CompanyName');
    finalObj1.cust_id = sessionStorage.getItem('CustId');

    console.log('FinalObj1', finalObj1);

    axios
      .post(url + 'add_journalTransaction', finalObj1)
      .then(() => {
        // successToast('Journal Created Successfully');
        // reset();

        //// increase and decrease amount function call
        creditFun(journalCredit, journalAmount, cDate, cTime, '');
        debitFun(journalDebit, journalAmount, cDate, cTime, '');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function addJournal1(Debit, Credit, Amount, narration) {
    // current date
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

    // journal date

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

    let journalCredit = Credit;
    let journalDebit = Debit;
    let journalAmount = Amount;

    let finalObj1 = {};

    finalObj1.transactionID = uuid();
    finalObj1.dbt_ac = Debit;
    // finalObj1.dbt_ac = arr[0].ac_type;
    finalObj1.crdt_ac = Credit;
    finalObj1.mode = '';
    finalObj1.amount = Amount;
    finalObj1.type = 'Contra'; //transactionType
    finalObj1.tran_gen = uuidValue;
    finalObj1.tran_Date = eDate; //datee
    finalObj1.description = narration; //narrative
    finalObj1.ac_no = '';
    finalObj1.chq_no = '';
    finalObj1.chq_date = '';
    finalObj1.branch = '';
    finalObj1.user_bank = ''; //bankname
    finalObj1.bank = '';
    finalObj1.status = '1';
    finalObj1.filename = 'Nil'; //image
    finalObj1.filepath = ''; //im
    finalObj1.createdBy = ''; // userID
    finalObj1.createdDate = cDate;
    finalObj1.createdTime = cTime;

    finalObj1.company_name = sessionStorage.getItem('CompanyName');
    finalObj1.cust_id = sessionStorage.getItem('CustId');

    console.log('FinalObj1', finalObj1);

    axios
      .post(url + 'add_journalTransaction', finalObj1)
      .then(() => {
        // successToast('Journal Created Successfully');
        // reset();

        //// increase and decrease amount function call
        creditFun(journalCredit, journalAmount, cDate, cTime, '');
        debitFun(journalDebit, journalAmount, cDate, cTime, '');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function addJournal2(Debit, Credit, Amount, narration) {
    // current date
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

    // journal date

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

    let journalCredit = Credit;
    let journalDebit = Debit;
    let journalAmount = Amount;

    let finalObj1 = {};

    finalObj1.transactionID = uuid();
    finalObj1.dbt_ac = Debit;
    // finalObj1.dbt_ac = arr[0].ac_type;
    finalObj1.crdt_ac = Credit;
    finalObj1.mode = '';
    finalObj1.amount = Amount;
    finalObj1.type = 'Contra'; //transactionType
    finalObj1.tran_gen = uuidValue;
    finalObj1.tran_Date = eDate; //datee
    finalObj1.description = narration; //narrative
    finalObj1.ac_no = '';
    finalObj1.chq_no = '';
    finalObj1.chq_date = '';
    finalObj1.branch = '';
    finalObj1.user_bank = ''; //bankname
    finalObj1.bank = '';
    finalObj1.status = '1';
    finalObj1.filename = 'Nil'; //image
    finalObj1.filepath = ''; //im
    finalObj1.createdBy = ''; // userID
    finalObj1.createdDate = cDate;
    finalObj1.createdTime = cTime;

    finalObj1.company_name = sessionStorage.getItem('CompanyName');
    finalObj1.cust_id = sessionStorage.getItem('CustId');

    console.log('FinalObj1', finalObj1);

    axios
      .post(url + 'add_journalTransaction', finalObj1)
      .then(() => {
        // successToast('Journal Created Successfully');
        // reset();

        //// increase and decrease amount function call
        creditFun(journalCredit, journalAmount, cDate, cTime, '');
        debitFun(journalDebit, journalAmount, cDate, cTime, '');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function creditFun(ledgerID, journalAmount, cDate, cTime) {
    let type;
    axios
      .get(url + `ledger_search?ledgerId=${ledgerID}`)
      .then(({ data }) => {
        console.log(data);

        type = data[0].ac_type;
        console.log('credit ledger ac_type', type);

        if (type === '2' || type === '3') {
          increaseAmount(ledgerID, journalAmount, cDate, cTime, '');
        } else {
          decreaseAmount(ledgerID, journalAmount, cDate, cTime, '');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function debitFun(ledgerID, journalAmount, cDate, cTime) {
    let type1;
    axios
      .get(url + `ledger_search?ledgerId=${ledgerID}`)
      .then(({ data }) => {
        console.log(data);

        type1 = data[0].ac_type;
        console.log('debit ledger ac_type', type1);

        if (type1 === '2' || type1 === '3') {
          decreaseAmount(ledgerID, journalAmount, cDate, cTime, '');
        } else {
          increaseAmount(ledgerID, journalAmount, cDate, cTime, '');
        }
      })
      .catch((err) => {
        console.log(err);
      });
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

  const previewFinal = handleSubmit((data) => {
    console.log('functiom call');
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
    console.log('chequeDate', chequeDate);

    ////////mode checking////////

    if (endDate === null || endDate === undefined) {
      setInvoiceDateValidation(true);
    } else {
      setInvoiceDateValidation(false);

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

      var eDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

      let finalObj1 = {};

      finalObj1.inv_date = eDate;
      finalObj1.inv_no = data.invoiceNo;
      finalObj1.cust_name = data.customer;
      finalObj1.service = data.service;
      finalObj1.place_of_supply = data.placeOfSupply;
      finalObj1.bill_address = data.address;
      finalObj1.gst_no = data.gstNo;
      finalObj1.tds_rate = data.tdsRate;
      finalObj1.created_date = cDate;
      finalObj1.created_time = cTime;
      finalObj1.status = 'pending';
      finalObj1.payment_mode = 'null';
      finalObj1.bank_name = 'null';
      finalObj1.payment_date = 'null';
      finalObj1.amount_received = 0;
      finalObj1.invoice_tran_id = uuidValue;
      finalObj1.swift_code = data.SwiftCode;
      finalObj1.ifsc = data.IFSC;

      if (localStorage.getItem('invoicePageStatus') === '') {
        finalObj1.total_amount = totalAmountCalculated;
      } else {
        finalObj1.total_amount = localStorage.getItem('SubTotalAmountData');
      }

      if (localStorage.getItem('invoicePageStatus') === '') {
        finalObj1.total_tax = (totalAmountCalculated * taxSelected) / 100;
      } else {
        finalObj1.total_tax =
          (localStorage.getItem('SubTotalAmountData') * taxSelected) / 100;
      }

      console.log('FinalObj1', finalObj1);

      localStorage.setItem('finalObj1', JSON.stringify(finalObj1));

      console.log('inputList data', inputList);

      let finalObj2 = {};
      for (let i = 0; i < inputList.length; i++) {
        if (
          inputList[i].amount === '' &&
          inputList[i].description === '' &&
          inputList[i].hsn === '' &&
          inputList[i].qty === '' &&
          inputList[i].remarks === '' &&
          inputList[i].tax === ''
        ) {
          continue;
        } else {
          finalObj2.amount = inputList[i].amount;
          finalObj2.created_date = cDate;
          finalObj2.created_time = cTime;
          finalObj2.description = inputList[i].description;
          finalObj2.hsn = inputList[i].hsn;

          finalObj2.qty = inputList[i].qty;
          finalObj2.remarks = inputList[i].remarks;
          finalObj2.tax = inputList[i].tax;
        }
      }

      localStorage.setItem('finalObj2', JSON.stringify(inputList));

      let t = 0;
      for (let i = 0; i < inputList.length; i++) {
        if (inputList[i].amount !== '') {
          t = t + parseFloat(inputList[i].amount);
        }
      }

      localStorage.setItem('TotalAmountData', t + (t * taxSelected) / 100);
      localStorage.setItem('SubTotalAmountData', t);

      history.push({
        pathname: '/preview_invoice',
      });

      //   { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
    }
  });

  const sendMail = handleSubmit((data) => {
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
    console.log('chequeDate', chequeDate);

    ////////mode checking////////

    if (endDate === null || endDate === undefined) {
      setInvoiceDateValidation(true);
    } else {
      setInvoiceDateValidation(false);

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

      var eDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

      let finalObj1 = {};

      let mailTo = mailToData;
      let mailSub = mailSubData;
      let mailBody = mailBodyData;

      finalObj1.inv_date = eDate;
      finalObj1.inv_no = data.invoiceNo;
      finalObj1.cust_name = data.customer;
      finalObj1.service = data.service;
      finalObj1.place_of_supply = data.placeOfSupply;
      finalObj1.bill_address = data.address;
      finalObj1.gst_no = data.gstNo;
      finalObj1.tds_rate = data.tdsRate;
      finalObj1.created_date = cDate;
      finalObj1.created_time = cTime;
      finalObj1.status = 'pending';
      finalObj1.payment_mode = 'null';
      finalObj1.bank_name = 'null';
      finalObj1.payment_date = 'null';
      finalObj1.amount_received = 0;
      finalObj1.invoice_tran_id = uuidValue;
      finalObj1.swift_code = data.SwiftCode;
      finalObj1.ifsc = data.IFSC;

      finalObj1.company_name = sessionStorage.getItem('CompanyName');
      finalObj1.cust_id = sessionStorage.getItem('CustId');

      if (localStorage.getItem('invoicePageStatus') === '') {
        finalObj1.total_amount = totalAmountCalculated;
      } else {
        finalObj1.total_amount = localStorage.getItem('SubTotalAmountData');
      }

      if (localStorage.getItem('invoicePageStatus') === '') {
        finalObj1.total_tax = (totalAmountCalculated * taxSelected) / 100;
      } else {
        finalObj1.total_tax =
          (localStorage.getItem('SubTotalAmountData') * taxSelected) / 100;
      }

      console.log('FinalObj1', finalObj1);

      axios
        .post(url + 'add_invoice', finalObj1)
        .then(() => {
          successToast('Invoice Created Successfully');
          reset();

          axios
            .get(
              url +
                `invoiceData?CompanyName=${sessionStorage.getItem(
                  'CompanyName'
                )}&CustId=${sessionStorage.getItem('CustId')}`
            )
            .then(({ data }) => {
              console.log('invoice data', data);

              ////////////////Journal section calling////////////
              addJournal(
                finalObj1.cust_name,
                finalObj1.service,
                finalObj1.total_amount,
                'Invoice'
              );

              if (
                finalObj1.place_of_supply === 'InterState' ||
                finalObj1.place_of_supply === 'IntraState'
              ) {
                console.log('GST inserted');
                // setTimeout(function () {
                //   console.log('GST inserted');

                addJournal1(
                  finalObj1.cust_name,
                  sessionStorage.getItem('gstIdVal'),
                  finalObj1.total_tax,
                  'GST charges'
                );
                // }, 2000);
              }

              if (finalObj1.tds_rate !== '') {
                console.log('TDS inserted');
                // setTimeout(function () {
                //   console.log('TDS inserted');
                addJournal2(
                  sessionStorage.getItem('tdsIdVal'),
                  finalObj1.cust_name,
                  finalObj1.tds_rate,
                  'TDS Deducted'
                );
                // }, 3000);
              }

              console.log('invoice last data id', data[data.length - 1].inv_id);

              let newInvId = data[data.length - 1].inv_id;

              console.log('inputList data', inputList);

              for (let i = 0; i < inputList.length; i++) {
                let finalObj2 = {};

                if (
                  inputList[i].amount === '' &&
                  inputList[i].description === '' &&
                  inputList[i].hsn === '' &&
                  inputList[i].qty === '' &&
                  inputList[i].remarks === '' &&
                  inputList[i].tax === ''
                ) {
                  continue;
                } else {
                  finalObj2.amount = inputList[i].amount;
                  finalObj2.created_date = cDate;
                  finalObj2.created_time = cTime;
                  finalObj2.description = inputList[i].description;
                  finalObj2.hsn = inputList[i].hsn;
                  finalObj2.inv_id = newInvId;
                  finalObj2.qty = inputList[i].qty;
                  finalObj2.remarks = inputList[i].remarks;
                  finalObj2.tax = inputList[i].tax;

                  axios
                    .post(url + 'add_invoice_sub', finalObj2)
                    .then(() => {
                      console.log(i, ' th row ', finalObj2);

                      console.log(`mailTo Val`, mailTo);

                      finalObj1.to = mailTo;
                      finalObj1.from = 'intuisyz2021acc@gmail.com';
                      // finalObj1.from = 'invoice@intreact.tk';
                      finalObj1.subject = mailSub;
                      finalObj1.name = mailBody;

                      finalObj1.igstAmnt = parseInt(
                        (parseFloat(finalObj1.total_tax) /
                          parseFloat(finalObj1.total_amount)) *
                          100
                      );

                      finalObj1.cgstAmnt = parseInt(
                        ((parseFloat(finalObj1.total_tax) /
                          parseFloat(finalObj1.total_amount)) *
                          100) /
                          2
                      );

                      finalObj1.sgstAmnt = parseInt(
                        ((parseFloat(finalObj1.total_tax) /
                          parseFloat(finalObj1.total_amount)) *
                          100) /
                          2
                      );

                      if (finalObj1.place_of_supply === 'InterState') {
                        finalObj1.totalTaxAmnt = parseFloat(
                          finalObj1.total_tax
                        );
                      }

                      if (finalObj1.place_of_supply === 'IntraState') {
                        finalObj1.totalTaxAmnt =
                          parseFloat(finalObj1.total_tax) / 2;
                      }

                      finalObj1.totalAmnt =
                        parseFloat(finalObj1.total_amount) +
                        parseFloat(finalObj1.total_tax);

                      setTimeout(function () {
                        axios
                          .post(url + 'sendingEmail', finalObj1)
                          .then((data) => {
                            console.log(`Email data`, data);
                            console.log(`mailInfo`, finalObj1);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }, 2000);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
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

              setTimeout(function () {
                history.push({
                  pathname: '/dashboard_invoice',
                });
                window.location.reload();
              }, 2500);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      //   { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
    }
  });

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

  const ledgerLoading = () => {
    axios
      // .get('http://localhost:8080/list_ledger')
      .get(url + 'list_ledger')
      .then(({ data }) => {
        console.log(data);
        setLedgerData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const customerLoadingOnClick = () => {
    // document.getElementById('ledger1').selectedIndex = '';

    axios
      .get(
        url +
          `customer_name?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log('customer name data on refresh btn ', data);
        setCustomerName(data);
        setCustomerNameLoaded(true);
        setRefreshBtn1(true);
        setTimeout(function () {
          setRefreshBtn1(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const serviceLoadingOnClick = () => {
    // document.getElementById('ledger1').selectedIndex = '';

    axios
      .get(
        url +
          `service_name?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log('service name data', data);
        setServiceName(data);
        setServiceNameLoaded(true);
        setRefreshBtn2(true);
        setTimeout(function () {
          setRefreshBtn2(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const bankNameLoading = () => {
    axios
      // .get('http://localhost:8080/bank_name')
      .get(url + 'bank_name')
      .then(({ data }) => {
        console.log(data);
        setBankName(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function uploadDataFun() {
    var fullPath = document.getElementById('upload123').value;
    if (fullPath) {
      var startIndex =
        fullPath.indexOf('\\') >= 0
          ? fullPath.lastIndexOf('\\')
          : fullPath.lastIndexOf('/');
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }

      setDownloadUri(filename);
      setFileUploadFlag(true);
    }
  }

  const uploadImage = async (file) => {
    try {
      // setImageUploaded(false);
      console.log('uploadedimg', file);
      let formdata = new FormData();
      formdata.append('file', file);
      console.log(formdata);
      const response = await axios.put(url + 'files', formdata);
      // .post('http://intz.live:8080/upload_image', formdata)

      // successToast('file uploaded Successfully');

      // showConsole('uploaded img url', data);
      // setImageMethod('select');
      // refreshUploadedImageArray();

      console.log(
        'response.data.fileDownloadUri',
        response.data.fileDownloadUri
      );

      let newUrl = response.data.fileDownloadUri.split('image');

      console.log('newUrl', newUrl[1]);

      // setTimeout(function () {
      //   const response1 = axios.get(url + `fileDownload?fileName=${newUrl}`);
      //   console.log('response1', response1);
      //   // setDownloadUri(
      //   //   'http://localhost:8080/fileDownload?fileName=KTU-EX-V-3-Registration.pdf'
      //   // );

      //   // window.location.href =
      //   //   'http://localhost:8080/fileDownload?fileName=KTU-EX-V-3-Registration.pdf';

      //   // history.push({
      //   //   pathname:
      //   //     'http://localhost:8080/fileDownload?fileName=KTU-EX-V-3-Registration.pdf',
      //   // });
      // }, 3000);

      // .post('http://intz.live:8080/upload_image', formdata)

      ///////////////
    } catch (err) {
      errorToast('Something went wrong , Try a file with maximum size 200MB');
    }
  };

  useEffect(() => {
    // ledgerLoading();
    // bankNameLoading();
    if (sessionStorage.getItem('logDetails') === 'true') {
      let Obj1 = localStorage.getItem('finalObj1');

      setPreviewInvoiceValue1(JSON.parse(Obj1));

      if (localStorage.getItem('invoicePageStatus') !== '') {
        setTaxSelected(JSON.parse(localStorage.getItem('finalObj2'))[0].tax);

        setInputList(JSON.parse(localStorage.getItem('finalObj2')));

        setPlaceOfSupplySelected(
          JSON.parse(localStorage.getItem('finalObj1')).place_of_supply
        );
      }

      axios
        .get(
          url +
            `customer_name?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
        .then(({ data }) => {
          console.log('customer name data', data);
          setCustomerName(data);
          setCustomerNameLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(
          url +
            `service_name?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
        .then(({ data }) => {
          console.log('service name data', data);
          setServiceName(data);
          setServiceNameLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });

      // localStorage.setItem('finalObj1', JSON.stringify('{}'));

      // localStorage.setItem(
      //   'finalObj2',
      //   JSON.stringify([
      //     { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
      //   ])
      // );

      // alert(previewInvoiceValue1);

      // if (Session['CurrentPageURL'] != null) {
      //   Session['PreviousPageURL'] = Session['CurrentPageURL'];
      // }
      // Session['CurrentPageURL'] = Request.Url;

      // alert(Request.Url);
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  const [inputList, setInputList] = useState([
    { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
  ]);

  const total = () => {
    let t = 0;
    for (let i = 0; i < inputList.length; i++) {
      if (inputList[i].amount !== '') {
        t = t + parseFloat(inputList[i].amount);
      }
    }

    setTotalAmountCalculated(t);
  };

  // handle input change
  const handleInputChange = (e, index) => {
    localStorage.setItem('invoicePageStatus', '');
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);

    let t = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].amount !== '') {
        t = t + parseFloat(list[i].amount);
      }
    }

    setTotalAmountCalculated(t);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    localStorage.setItem('invoicePageStatus', '');
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);

    let t = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].amount !== '') {
        t = t + parseFloat(list[i].amount);
      }
    }

    setTotalAmountCalculated(t);

    // setTimeout(function () {
    //   total();
    // }, 1000);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([
      ...inputList,
      { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
    ]);
  };

  // const clearData = () => {
  //   const list = [...inputList];
  //   console.log('list', list);
  //   console.log('length', list.length);

  //   for (var i = 1; i < list.length; i++) {
  //     list[i].description = '';

  //     list[i].hsn = '';
  //     list[i].qty = '';
  //     list[i].amount = '';
  //     list[i].tax = '';
  //     list[i].remarks = '';
  //     setInputList(list[i]);

  //     console.log('inputList', inputList);
  //   }
  // };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  function previewFinalnew() {
    console.log('control came here');
    previewFinal();
  }

  return (
    <div>
      <Headers />
      <div className="container-fluid" id="content">
        <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
          <form>
            <div className="container-fluid">
              <div className="page-header">
                <div style={{ display: 'inline' }} className="pull-left">
                  <h1>Create Invoice</h1>
                </div>
                {/* <div style={{ display: 'inline' }} className="pull-right">
                  <Link align="right" to="/add_ledger" target="_blank">
                    <i className="fa fa-plus" aria-hidden="true" />
                    Create Ledger
                  </Link>

                  <br />

                  <Link align="right" to="/transactionHistory">
                    <i className="fa fa-exchange" aria-hidden="true" />
                    Transaction History
                  </Link>
                </div> */}
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <font color="#FF0000">
                    <p id="wrn" />
                  </font>
                  <div className="box-content">
                    <form className="form-horizontal">
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Invoice Date
                              </label>
                              <div className="col-sm-5">
                                <div className="datepickerStyle1">
                                  <DatePicker
                                    //   className="form-control"
                                    name="end"
                                    className="form-control datepicker"
                                    dateFormat="dd/MM/yyyy"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    defaultValue=""
                                  />
                                </div>
                                <div style={{ color: 'red' }}>
                                  {invoiceDateValidation && (
                                    <p>Please enter invoice date</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Place of supply
                              </label>
                              <div className="col-sm-5" id="ledger_list">
                                <select
                                  defaultValue={
                                    JSON.parse(
                                      localStorage.getItem('finalObj1')
                                    ).place_of_supply
                                  }
                                  name="placeOfSupply"
                                  id="placeOfSupply"
                                  className="form-control"
                                  {...register('placeOfSupply')}
                                  onChange={(e) => {
                                    if (e.target.value === 'InterState') {
                                      setPlaceOfSupplySelected(e.target.value);
                                    } else if (
                                      e.target.value === 'IntraState'
                                    ) {
                                      setPlaceOfSupplySelected(e.target.value);
                                    } else if (e.target.value === 'Export') {
                                      setPlaceOfSupplySelected(e.target.value);
                                      setTaxSelected('');
                                    }
                                  }}
                                >
                                  <option value="">---Select---</option>
                                  <option value="InterState">
                                    Inter State
                                  </option>
                                  <option value="IntraState">
                                    Intra State
                                  </option>
                                  <option value="Export">Export</option>
                                </select>

                                {/* <div style={{ color: 'red' }}>
                                  {errors.ledger && (
                                    <p>Please select ledger name</p>
                                  )}
                                </div> */}
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Customer
                              </label>
                              <div id="ledger_list" className="col-sm-5 ">
                                {customerNameLoaded && (
                                  <select
                                    defaultValue={parseInt(
                                      JSON.parse(
                                        localStorage.getItem('finalObj1')
                                      ).cust_name
                                    )}
                                    name="customer"
                                    id="customer"
                                    {...register('customer', {
                                      required: true,
                                    })}
                                    className="cl"
                                  >
                                    <option value="">---Select---</option>
                                    {customerName.map((item) => {
                                      return (
                                        <option key={item.id} value={item.id}>
                                          {item.ledger_name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                )}

                                {/* <a className="cl1">Add</a> */}
                                <Link
                                  onClick={() => {
                                    history.push({
                                      comingfrom: 'createInvoiceCustomer',
                                    });
                                  }}
                                  to={`add_ledger?CompanyName=${sessionStorage.getItem(
                                    'CompanyName'
                                  )}&logDetails=${sessionStorage.getItem(
                                    'logDetails'
                                  )}&tdsIdVal=${sessionStorage.getItem(
                                    'tdsIdVal'
                                  )}&gstIdVal=${sessionStorage.getItem(
                                    'gstIdVal'
                                  )}&cashIdVal=${sessionStorage.getItem(
                                    'cashIdVal'
                                  )}&CustId=${sessionStorage.getItem(
                                    'CustId'
                                  )}`}
                                  className="cl1"
                                  target="_blank"
                                >
                                  Add
                                </Link>
                                <button
                                  id="refresh_ledgers"
                                  style={{
                                    backgroundColor: 'Transparent',
                                    border: 'none',
                                    paddingTop: '3px',
                                  }}
                                  type="button"
                                  // onclick="refresh_ledger()"
                                  onClick={customerLoadingOnClick}
                                  className={refreshBtn1 ? 'fa-spin' : null}
                                >
                                  <i
                                    id="refreshbtn"
                                    className="fa fa-refresh "
                                    aria-hidden="true"
                                  ></i>
                                </button>

                                <div
                                  style={{
                                    color: 'red',
                                    textAlign: 'left',
                                    paddingTop: 5,
                                  }}
                                >
                                  {errors.customer && (
                                    <p>Please select customer name</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Service
                              </label>
                              <div className="col-sm-5 ">
                                {serviceNameLoaded && (
                                  <select
                                    defaultValue={
                                      JSON.parse(
                                        localStorage.getItem('finalObj1')
                                      ).service
                                    }
                                    name="service"
                                    className="cl"
                                    id="service"
                                    {...register('service', {
                                      required: true,
                                    })}
                                    // onChange={(e) => {}}
                                  >
                                    <option value="">---Choose one---</option>
                                    {serviceName.map((item) => {
                                      return (
                                        <option key={item.id} value={item.id}>
                                          {item.ledger_name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                )}
                                <Link
                                  onClick={() => {
                                    history.push({
                                      comingfrom: 'createInvoiceService',
                                    });
                                  }}
                                  to={`add_ledger?CompanyName=${sessionStorage.getItem(
                                    'CompanyName'
                                  )}&logDetails=${sessionStorage.getItem(
                                    'logDetails'
                                  )}&tdsIdVal=${sessionStorage.getItem(
                                    'tdsIdVal'
                                  )}&gstIdVal=${sessionStorage.getItem(
                                    'gstIdVal'
                                  )}&cashIdVal=${sessionStorage.getItem(
                                    'cashIdVal'
                                  )}&CustId=${sessionStorage.getItem(
                                    'CustId'
                                  )}`}
                                  className="cl1"
                                  target="_blank"
                                >
                                  Add
                                </Link>

                                <button
                                  id="refresh_ledgers"
                                  style={{
                                    backgroundColor: 'Transparent',
                                    border: 'none',
                                    paddingTop: '3px',
                                  }}
                                  type="button"
                                  // onclick="refresh_ledger()"
                                  onClick={serviceLoadingOnClick}
                                  className={refreshBtn2 ? 'fa-spin' : null}
                                >
                                  <i
                                    id="refreshbtn"
                                    className="fa fa-refresh "
                                    aria-hidden="true"
                                  ></i>
                                </button>

                                {/* <Link
                                  className="cl1"
                                  to="/add_ledger"
                                  // target="_blank"
                                >
                                  Add
                                </Link> */}

                                <div
                                  style={{
                                    color: 'red',
                                    textAlign: 'left',
                                    paddingTop: 5,
                                  }}
                                >
                                  {errors.service && (
                                    <p>Please select service </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Invoice No
                              </label>
                              <div className="col-sm-5">
                                <input
                                  // defaultValue={
                                  //   location.pathname === '/create_invoice' &&
                                  //   previewInvoiceValue1.invoiceNo
                                  // }

                                  defaultValue={
                                    JSON.parse(
                                      localStorage.getItem('finalObj1')
                                    ).inv_no
                                  }
                                  type="text"
                                  name="invoiceNo"
                                  id="invoiceNo"
                                  className="form-control"
                                  {...register('invoiceNo', {
                                    required: true,
                                  })}
                                />
                                <div
                                  style={{
                                    color: 'red',
                                    paddingTop: 5,
                                    textAlign: 'left',
                                  }}
                                >
                                  {errors.invoiceNo && (
                                    <p>Please enter Invoice Number</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Billing address
                              </label>
                              <div className="col-sm-5">
                                <textarea
                                  defaultValue={
                                    JSON.parse(
                                      localStorage.getItem('finalObj1')
                                    ).bill_address
                                  }
                                  className="control-label col-sm-12"
                                  name="address"
                                  id="address"
                                  {...register('address', {
                                    required: true,
                                  })}
                                />
                                <div
                                  style={{
                                    color: 'red',
                                    paddingTop: 5,
                                    textAlign: 'left',
                                  }}
                                >
                                  {errors.address && (
                                    <p>Please enter address</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                GST No
                              </label>
                              <div className="col-sm-5">
                                <input
                                  defaultValue={
                                    JSON.parse(
                                      localStorage.getItem('finalObj1')
                                    ).gst_no
                                  }
                                  type="text"
                                  name="gstNo"
                                  id="gstNo"
                                  className="form-control"
                                  {...register('gstNo')}
                                />
                                <div></div>
                                {/* <div style={{ color: 'red' }}>
                                  {errors.amount && (
                                    <p>
                                      enter amount in correct format (Eg:
                                      1234.25)
                                    </p>
                                  )}
                                </div> */}
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                TDS
                              </label>
                              <div className="col-sm-5" id="ledger_list">
                                <input
                                  // defaultValue={
                                  //   location.pathname === '/create_invoice' &&
                                  //   previewInvoiceValue1.invoiceNo
                                  // }

                                  defaultValue={
                                    JSON.parse(
                                      localStorage.getItem('finalObj1')
                                    ).tds_rate
                                  }
                                  type="text"
                                  name="tdsRate"
                                  id="tdsRate"
                                  className="form-control"
                                  {...register('tdsRate')}
                                />

                                {/* <div style={{ color: 'red' }}>
                                  {errors.ledger && (
                                    <p>Please select ledger name</p>
                                  )}
                                </div> */}
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Swift Code
                              </label>
                              <div className="col-sm-5" id="ledger_list">
                                <input
                                  // defaultValue={
                                  //   location.pathname === '/create_invoice' &&
                                  //   previewInvoiceValue1.invoiceNo
                                  // }

                                  defaultValue={
                                    JSON.parse(
                                      localStorage.getItem('finalObj1')
                                    ).swift_code
                                  }
                                  type="text"
                                  name="SwiftCode"
                                  id="SwiftCode"
                                  className="form-control"
                                  {...register('SwiftCode')}
                                />

                                {/* <div style={{ color: 'red' }}>
                                  {errors.ledger && (
                                    <p>Please select ledger name</p>
                                  )}
                                </div> */}
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 pull-left">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                IFSC Code
                              </label>
                              <div className="col-sm-5" id="ledger_list">
                                <input
                                  // defaultValue={
                                  //   location.pathname === '/create_invoice' &&
                                  //   previewInvoiceValue1.invoiceNo
                                  // }

                                  defaultValue={
                                    JSON.parse(
                                      localStorage.getItem('finalObj1')
                                    ).ifsc
                                  }
                                  type="text"
                                  name="IFSC"
                                  id="IFSC"
                                  className="form-control"
                                  {...register('IFSC')}
                                />

                                {/* <div style={{ color: 'red' }}>
                                  {errors.ledger && (
                                    <p>Please select ledger name</p>
                                  )}
                                </div> */}
                              </div>
                            </div>
                          </div>

                          {/* <div className="col-sm-6 pull-left" id="due_date">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Due Date
                            </label>
                            <div className="col-sm-5">
                              <input
                                name="due_date"
                                id="due_dates"
                                className="form-control datepicker"
                                type="text"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 pull-left" id="sundry">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Sundry Creditors
                            </label>
                            <div className="col-sm-5">
                              <select className="form-control" name="creditor">
                                <option value={0}>---select---</option>

                                <option value="<?php echo $arry['id']; ?>"></option>
                              </select>
                            </div>
                          </div>
                        </div> */}
                        </div>
                      </div>

                      <div
                        style={{ paddingTop: 60 }}
                        className="table-responsive"
                      >
                        <table className="invoice-table table">
                          <tr className="invoice-tr">
                            <th className="invoice-th-td">Sl No.</th>
                            <th className="invoice-th-td">Description</th>
                            <th className="invoice-th-td">Hsn/SAC Code</th>
                            <th className="invoice-th-td">Qty</th>
                            <th className="invoice-th-td">Amount</th>

                            {(placeOfSupplySelected === 'InterState' ||
                              placeOfSupplySelected === 'IntraState') && (
                              <th className="invoice-th-td">Tax</th>
                            )}

                            <th className="invoice-th-td">Remarks</th>
                            <th className="invoice-th-td">Action</th>
                          </tr>

                          {inputList.map((x, i) => {
                            return (
                              <tr className="invoice-tr">
                                <td className="invoice-th-td">{i + 1}</td>
                                <td className="invoice-th-td">
                                  <input
                                    type="text"
                                    name="description"
                                    style={{
                                      borderColor: 'grey',
                                      borderWidth: 1,
                                    }}
                                    value={x.description}
                                    onChange={(e) => handleInputChange(e, i)}
                                  ></input>
                                </td>
                                <td className="invoice-th-td">
                                  <input
                                    type="text"
                                    name="hsn"
                                    style={{
                                      borderColor: 'grey',
                                      borderWidth: 1,
                                    }}
                                    value={x.hsn}
                                    onChange={(e) => handleInputChange(e, i)}
                                  ></input>
                                </td>
                                <td className="invoice-th-td">
                                  {' '}
                                  <input
                                    type="text"
                                    name="qty"
                                    style={{
                                      borderColor: 'grey',
                                      borderWidth: 1,
                                    }}
                                    value={x.qty}
                                    onChange={(e) => handleInputChange(e, i)}
                                  ></input>
                                </td>
                                <td className="invoice-th-td">
                                  {' '}
                                  <input
                                    type="text"
                                    name="amount"
                                    style={{
                                      borderColor: 'grey',
                                      borderWidth: 1,
                                    }}
                                    value={x.amount}
                                    onChange={(e) => {
                                      handleInputChange(e, i);

                                      total();
                                    }}
                                  ></input>
                                </td>

                                {(placeOfSupplySelected === 'InterState' ||
                                  placeOfSupplySelected === 'IntraState') && (
                                  <td className="invoice-th-td">
                                    {' '}
                                    <select
                                      name="tax"
                                      style={{ width: 120 }}
                                      value={taxSelected}
                                      onChange={(e) => {
                                        handleInputChange(e, i);

                                        setTaxSelected(e.target.value);
                                      }}
                                      defaultValue={taxSelected}
                                    >
                                      <option value="">---Select---</option>
                                      <option value="5">5%</option>
                                      <option value="12">12%</option>
                                      <option value="18">18%</option>
                                      <option value="28">28%</option>
                                    </select>
                                  </td>
                                )}
                                <td className="invoice-th-td">
                                  {' '}
                                  <input
                                    type="text"
                                    name="remarks"
                                    style={{
                                      borderColor: 'grey',
                                      borderWidth: 1,
                                    }}
                                    value={x.remarks}
                                    onChange={(e) => handleInputChange(e, i)}
                                  ></input>
                                </td>

                                <td className="invoice-th-td">
                                  <button
                                    onClick={() => {
                                      handleRemoveClick(i);
                                      // total();
                                    }}
                                    disabled={
                                      inputList.length - i !== 1 ? true : false
                                    }
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </table>
                      </div>

                      <div
                        style={{
                          paddingTop: 10,
                          textAlign: 'left',
                        }}
                      >
                        <Button
                          value="Add Row"
                          onClick={handleAddClick}
                          className="button-style"
                        >
                          Add Row
                        </Button>
                      </div>

                      <div
                        style={{
                          paddingTop: 30,
                          textAlign: 'right',
                          paddingRight: 25,
                        }}
                      >
                        <label style={{ fontSize: 16 }}>Sub Total</label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label style={{ fontSize: 16 }}>
                          {localStorage.getItem('invoicePageStatus') === ''
                            ? totalAmountCalculated
                            : localStorage.getItem('SubTotalAmountData')}
                        </label>
                      </div>
                      <br></br>

                      {(placeOfSupplySelected === 'InterState' ||
                        placeOfSupplySelected === 'IntraState') && (
                        <div
                          style={{
                            textAlign: 'right',
                            paddingRight: 25,
                          }}
                        >
                          <label style={{ fontSize: 16 }}>
                            GST@ {taxSelected === '' ? '0' : taxSelected}%
                          </label>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <br></br>
                          {placeOfSupplySelected === 'IntraState' && (
                            <>
                              <label style={{ fontSize: 16 }}>
                                {' '}
                                CGST {taxSelected / 2}%
                              </label>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <label style={{ fontSize: 16 }}>
                                {' '}
                                {localStorage.getItem('invoicePageStatus') ===
                                ''
                                  ? ((totalAmountCalculated / 2) *
                                      taxSelected) /
                                    100
                                  : ((localStorage.getItem(
                                      'SubTotalAmountData'
                                    ) /
                                      2) *
                                      taxSelected) /
                                    100}
                              </label>
                              <br></br>
                              <label style={{ fontSize: 16 }}>
                                {' '}
                                SGST {taxSelected / 2}%
                              </label>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <label style={{ fontSize: 16 }}>
                                {' '}
                                {localStorage.getItem('invoicePageStatus') ===
                                ''
                                  ? ((totalAmountCalculated / 2) *
                                      taxSelected) /
                                    100
                                  : ((localStorage.getItem(
                                      'SubTotalAmountData'
                                    ) /
                                      2) *
                                      taxSelected) /
                                    100}
                              </label>
                            </>
                          )}
                          {placeOfSupplySelected === 'InterState' && (
                            <>
                              <label style={{ fontSize: 16 }}>
                                {' '}
                                IGST {taxSelected === '' ? '0' : taxSelected}%
                              </label>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <label style={{ fontSize: 16 }}>
                                {localStorage.getItem('invoicePageStatus') ===
                                ''
                                  ? (totalAmountCalculated * taxSelected) / 100
                                  : (localStorage.getItem(
                                      'SubTotalAmountData'
                                    ) *
                                      taxSelected) /
                                    100}
                              </label>
                              <br></br>
                            </>
                          )}
                        </div>
                      )}

                      <div
                        style={{
                          textAlign: 'right',
                          paddingRight: 25,
                        }}
                      >
                        <label>____________________________________</label>
                        <br></br>
                        <label style={{ fontSize: 20 }}>Total</label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label style={{ fontSize: 20 }}>
                          {localStorage.getItem('invoicePageStatus') === ''
                            ? totalAmountCalculated +
                              (totalAmountCalculated * taxSelected) / 100
                            : localStorage.getItem('TotalAmountData')}
                        </label>
                      </div>

                      {/* display row values */}

                      {/* <div style={{ marginTop: 20 }}>
                        {JSON.stringify(inputList)}
                      </div> */}

                      <br />
                      <br />
                      <br />
                      <footer className="invoice-footer">
                        <div className="leftCol">
                          {' '}
                          <button
                            style={{
                              backgroundColor: 'green',
                              width: 100,
                            }}
                            onClick={(e) => {
                              localStorage.setItem(
                                'finalObj1',
                                JSON.stringify('{}')
                              );

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

                              history.push({
                                pathname: '/dashboard_invoice',
                              });
                            }}
                          >
                            Cancel{' '}
                          </button>
                        </div>
                        <div className="rightCol">
                          {' '}
                          <button
                            type="submit"
                            name="submit1"
                            onClick={(e) => {
                              // setModalIsOpen(false);
                              e.preventDefault();

                              submitFinal();
                            }}
                            style={{
                              backgroundColor: 'green',
                              width: 100,
                            }}
                          >
                            Save{' '}
                          </button>
                          &nbsp;
                          <button
                            type="submit"
                            name="submit2"
                            style={{
                              backgroundColor: 'green',
                              width: 100,
                            }}
                            onClick={(e) => {
                              // setModalIsOpen(false);
                              e.preventDefault();

                              previewFinalnew();
                              // history.push({
                              //   pathname: '/preview_invoice',
                              // });
                            }}
                          >
                            Preview
                          </button>
                          &nbsp;
                          {/* <button
                            type="submit"
                            style={{
                              backgroundColor: 'green',
                              width: 150,
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              sendMail();
                              // history.push({
                              //   pathname: '/preview_invoice',
                              // });
                            }}
                          >
                            Save & Send Mail
                          </button> */}
                          <button
                            style={{
                              backgroundColor: 'green',
                              width: 150,
                              height: 25,
                            }}
                            onClick={(event) => {
                              event.preventDefault();
                              setModalIsOpen(true);
                            }}
                          >
                            Save & Send Mail
                          </button>
                          {/* <a
                            href
                            className="btn btn-default btn-rounded mb-4"
                            data-toggle="modal"
                            data-target="#modalContactForm"
                            style={{
                              backgroundColor: 'green',
                              height: 25,
                              color: 'white',
                              marginBottom: 5,
                            }}
                          >
                            Save & Send Mail
                          </a> */}
                        </div>
                      </footer>

                      <Modal isOpen={modalIsOpen} style={customStyles}>
                        <div className="modal-dialog" role="document">
                          <div className="modal-header text-center">
                            <h4 className="modal-title w-100 font-weight-bold">
                              Invoice Mail
                            </h4>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                              onClick={(event) => {
                                event.preventDefault();
                                setModalIsOpen(false);
                              }}
                            >
                              <span aria-hidden="true">x</span>
                            </button>
                          </div>
                          <div className="modal-body mx-3">
                            <div className="md-form mb-5">
                              <div className="wrap-input100 ">
                                <input
                                  className="input100"
                                  type="text"
                                  name="mailTo"
                                  placeholder="To"
                                  // {...register('mailTo', {
                                  //   required: true,
                                  // })}

                                  onChange={(e) => {
                                    setMailToData(e.target.value);
                                  }}
                                />
                                <span className="focus-input100" />
                              </div>
                            </div>
                            <div className="md-form mb-5">
                              <div className="wrap-input100 ">
                                <input
                                  className="input100"
                                  type="text"
                                  name="mailSub"
                                  placeholder="Subject"
                                  // {...register('mailSub', {
                                  //   required: true,
                                  // })}

                                  onChange={(e) => {
                                    setMailSubData(e.target.value);
                                  }}
                                />
                                <span className="focus-input100" />
                              </div>
                            </div>
                            <div className="md-form mb-5">
                              <div className="wrap-input100 ">
                                <textarea
                                  className="input100"
                                  name="mailBody"
                                  placeholder="Your Message"
                                  defaultValue={''}
                                  // {...register('mailBody', {
                                  //   required: true,
                                  // })}
                                  onChange={(e) => {
                                    setMailBodyData(e.target.value);
                                  }}
                                />
                                <span className="focus-input100" />
                              </div>
                            </div>
                          </div>
                          <div className="container-contact100-form-btn">
                            <button
                              className="contact100-form-btn sendBtn"
                              type="submit"
                              style={{
                                backgroundColor: 'green',
                                width: 150,
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                sendMail();
                                // history.push({
                                //   pathname: '/preview_invoice',
                                // });
                              }}
                            >
                              <span>
                                <i
                                  className="fa fa-paper-plane-o m-r-6"
                                  aria-hidden="true"
                                />
                                Send
                              </span>
                            </button>
                          </div>
                        </div>
                      </Modal>
                    </form>
                    <br />
                  </div>
                </div>
              </div>
              <ToastContainer />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create_invoice;
