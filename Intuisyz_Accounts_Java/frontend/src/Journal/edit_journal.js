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
import { successToast, errorToast } from '../common/global';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../Base Url/baseUrl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import uuid from 'react-uuid';
import Headers from '../Header/Headers';

const Edit_journal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  let url = baseUrl.url;

  let location = useLocation();
  let history = useHistory();

  // let ledgerName = location.post.ledger_name;

  const [ledgerData, setLedgerData] = useState([]);
  const [ledgerLoaded, setLedgerLoaded] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [tranDateValidation, setTranDateValidation] = useState(false);
  const [journalData, setJournalData] = useState([]);
  const [journalLoaded, setJournalLoaded] = useState(false);
  const [tranIdData, setTranIdData] = useState();
  const [downloadUri, setDownloadUri] = React.useState('Nil');
  const [fileUploadFlag, setFileUploadFlag] = useState(false);
  const [fileUploadData, setFileUploadData] = useState('');

  const [transactionIdData, setTransactionIdData] = useState();
  const [descriptionData, setDescriptionData] = useState();

  const submitFinal = handleSubmit((data) => {
    tranId = tranIdData;
    // current date
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

    let journalAmount = data.amount;
    let journalCredit = data.credit;
    let journalDebit = data.debit;
    let journalDescription = data.narrative;
    let journalStatus = data.status;
    // calculations begins

    let finalAmount;
    axios
      .get(url + `journal_search?tranId=${tranId}`)
      .then(({ data }) => {
        console.log(data);

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
                parseFloat(previousAmount1) -
                parseFloat(a1) +
                parseFloat(journalAmount);
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
                    setTimeout(function () {
                      increaseAmount(
                        journalDebit,
                        journalAmount,
                        cDate,
                        cTime,
                        ''
                      );
                      if (type === '2' || type === '3') {
                        increaseAmount(
                          journalCredit,
                          journalAmount,
                          cDate,
                          cTime,
                          ''
                        );
                      } else {
                        decreaseAmount(
                          journalCredit,
                          journalAmount,
                          cDate,
                          cTime,
                          ''
                        );
                      }
                    }, 4000);

                    if (transactionIdData !== '') {
                      invoiceFun(journalAmount);
                    }
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

    //////////Update Journal////////////
    let finalObj1 = {};
    axios
      .get(url + `journal_search?tranId=${tranId}`)
      .then(({ data }) => {
        finalObj1.tranID = data[0].tranID;
        finalObj1.transactionID = data[0].transactionID;
        finalObj1.dbt_ac = journalDebit;
        // finalObj1.dbt_ac = arr[0].ac_type;
        finalObj1.crdt_ac = journalCredit;
        finalObj1.mode = data[0].mode;
        finalObj1.amount = journalAmount;
        finalObj1.type = 'Contra'; //transactionType
        finalObj1.tran_gen = data[0].tran_gen;
        finalObj1.tran_Date = eDate; //datee
        finalObj1.description = journalDescription; //narrative
        finalObj1.ac_no = data[0].ac_no;
        finalObj1.chq_no = data[0].chq_no;
        finalObj1.chq_date = data[0].chq_date;
        finalObj1.branch = data[0].branch;
        finalObj1.user_bank = data[0].user_bank; //bankname
        finalObj1.bank = data[0].bank;
        // finalObj1.status = data[0].status;

        //////new code///////
        finalObj1.status = journalStatus;
        /////////////////////

        finalObj1.filename = data[0].filename; //image
        finalObj1.filepath = downloadUri; //im
        finalObj1.createdBy = data[0].createdBy; // userID
        finalObj1.createdDate = cDate;
        finalObj1.createdTime = cTime;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

        console.log('FinalObj1', finalObj1);
        update(finalObj1);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  function update(finalObj1) {
    axios
      .put(url + `journal_update/${tranId}`, finalObj1)
      .then(() => {
        successToast('Journal Updated Successfully');
        reset();
        setTimeout(function () {
          history.push({
            pathname: '/view_journal',
          });
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function invoiceFun(journalAmount) {
    let invId;
    let finalObj1 = {};
    let totalTax;

    axios
      .get(
        url + `invoiceDataByTransactionId?transactionId=${transactionIdData}`
      )
      .then(({ data }) => {
        console.log('invoice function data', data);

        console.log('data[0].inv_id ', data[0].inv_id);
        invId = data[0].inv_id;
        totalTax = data[0].total_tax;

        finalObj1.inv_id = data[0].inv_id;
        finalObj1.inv_date = data[0].inv_date;
        finalObj1.inv_no = data[0].inv_no;
        finalObj1.cust_name = data[0].cust_name;
        finalObj1.service = data[0].service;
        finalObj1.place_of_supply = data[0].place_of_supply;
        finalObj1.bill_address = data[0].bill_address;
        finalObj1.gst_no = data[0].gst_no;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

        if (descriptionData === 'TDS Deducted') {
          finalObj1.tds_rate = journalAmount;
        } else {
          finalObj1.tds_rate = data[0].tds_rate;
        }

        finalObj1.created_date = data[0].created_date;
        finalObj1.created_time = data[0].created_time;

        // finalObj1.status = data[0].status;

        if (
          parseFloat(data[0].total_amount) +
            parseFloat(data[0].total_tax) -
            (data[0].tds_rate === '' ? parseFloat(0) : data[0].tds_rate) -
            parseFloat(data[0].amount_received) ===
          0
        ) {
          finalObj1.status = 'paid';
        } else {
          finalObj1.status = 'pending';
        }

        finalObj1.payment_mode = data[0].payment_mode;
        finalObj1.bank_name = data[0].bank_name;
        finalObj1.payment_date = data[0].payment_date;
        finalObj1.amount_received = data[0].amount_received;
        finalObj1.invoice_tran_id = data[0].invoice_tran_id;

        if (descriptionData === 'Invoice') {
          finalObj1.total_amount = journalAmount;
        } else {
          finalObj1.total_amount = data[0].total_amount;
        }

        axios
          .get(url + `invoiceSubDataById?invoiceId=${invId}`)
          .then(({ data }) => {
            console.log('invoice sub data', data);

            if (descriptionData === 'Invoice') {
              finalObj1.total_tax = (journalAmount * data[0].tax) / 100;

              editJournal1(
                finalObj1.invoice_tran_id,
                sessionStorage.getItem('gstIdVal'),
                finalObj1.cust_name,
                finalObj1.total_tax
              );
            } else {
              finalObj1.total_tax = totalTax;
            }

            axios
              .put(url + `invoice_update/${invId}`, finalObj1)
              .then(() => {
                console.log('invoice Updated Successfully');
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

  function editJournal1(invoiceTranId, creditAc, debitAc, Amount) {
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

    let journalAmount = Amount;
    let journalCredit = creditAc;
    let journalDebit = debitAc;
    //let journalDescription = data.narrative;
    // calculations begins

    let finalAmount;
    axios
      .get(
        url +
          `journal_searchInvoice?tranId=${invoiceTranId}&&creditAc=${creditAc}&&debitAc=${debitAc}`
      )
      .then(({ data }) => {
        console.log(data);

        tranId = data[0].tranID;

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
            finalAmount = parseInt(previousAmount) - parseInt(ledgerAmount);

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
                parseInt(previousAmount1) -
                parseInt(a1) +
                parseInt(journalAmount);
            } else {
              let previousAmount1 = data[0].amount;
              finalAmount1 = parseInt(previousAmount1) + parseInt(ledgerAmount);
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
                    setTimeout(function () {
                      increaseAmount(
                        journalDebit,
                        journalAmount,
                        cDate,
                        cTime,
                        ''
                      );
                      if (type === '2' || type === '3') {
                        increaseAmount(
                          journalCredit,
                          journalAmount,
                          cDate,
                          cTime,
                          ''
                        );
                      } else {
                        decreaseAmount(
                          journalCredit,
                          journalAmount,
                          cDate,
                          cTime,
                          ''
                        );
                      }
                    }, 4000);
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

    //////////Update Journal////////////
    let finalObj1 = {};
    axios
      .get(
        url +
          `journal_searchInvoice?tranId=${invoiceTranId}&&creditAc=${creditAc}&&debitAc=${debitAc}`
      )
      .then(({ data }) => {
        console.log('sss data', data);
        finalObj1.tranID = data[0].tranID;
        finalObj1.transactionID = data[0].transactionID;
        finalObj1.dbt_ac = journalDebit;
        // finalObj1.dbt_ac = arr[0].ac_type;
        finalObj1.crdt_ac = journalCredit;
        finalObj1.mode = data[0].mode;
        finalObj1.amount = journalAmount;
        finalObj1.type = 'Contra'; //transactionType
        finalObj1.tran_gen = data[0].tran_gen;
        finalObj1.tran_Date = eDate; //datee
        finalObj1.description = data[0].description; //narrative
        finalObj1.ac_no = data[0].ac_no;
        finalObj1.chq_no = data[0].chq_no;
        finalObj1.chq_date = data[0].chq_date;
        finalObj1.branch = data[0].branch;
        finalObj1.user_bank = data[0].user_bank; //bankname
        finalObj1.bank = data[0].bank;
        finalObj1.status = data[0].status;
        finalObj1.filename = data[0].filename; //image
        finalObj1.filepath = downloadUri; //im
        finalObj1.createdBy = data[0].createdBy; // userID
        finalObj1.createdDate = cDate;
        finalObj1.createdTime = cTime;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

        console.log('FinalObj1', finalObj1);
        update(finalObj1);
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

  let tranId;
  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        history.push({
          pathname: '/view_journal',
        });
      } else {
        console.log('location.post.tranID', location.post.tranID);
        tranId = location.post.tranID;
        setTranIdData(tranId);
        setTransactionIdData(location.post.tran_gen);
        setDescriptionData(location.post.description);

        axios
          .get(url + `journal_search?tranId=${tranId}`)
          .then(({ data }) => {
            console.log(data);

            let k = data[0].tran_Date;
            console.log(k.split('-'));
            let i = new Date(
              k.split('-')[0],
              k.split('-')[1] - 1,
              k.split('-')[2]
            );

            setEndDate(i);
            console.log(i);

            setJournalData(data);
            setJournalLoaded(true);
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(
            url +
              `ledger_sorting?field=ledger_name&type=ASC&CompanyName=${sessionStorage.getItem(
                'CompanyName'
              )}&CustId=${sessionStorage.getItem('CustId')}`
          )
          .then(({ data }) => {
            setLedgerData(data);
            console.log(data);
            setLedgerLoaded(true);
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
      {ledgerLoaded && journalLoaded && (
        <div className="container-fluid" id="content">
          <div id="main">
            <div className="container-fluid">
              <div className="page-header flexHeader">
                <h1>Journal</h1>
              </div>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <font color="#FF0000">
                    {/*?php echo @$msg;?*/}
                    <p id="wrn" />
                  </font>
                  <div className="box-content">
                    <form
                      className="form-horizontal"
                      method="post"
                      name="ledger"
                      encType="multipart/form-data"
                    >
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Date
                            </label>
                            <div className="col-sm-9">
                              <DatePicker
                                name="end"
                                className="form-control datepicker"
                                dateFormat="dd/MM/yyyy"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                defaultValue=""
                              />
                              <div style={{ color: 'red' }}>
                                {tranDateValidation && (
                                  <p>Please enter transaction date</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Debit Account
                            </label>
                            <div className="col-sm-9">
                              <select
                                name="debit"
                                id="debit"
                                className="form-control"
                                {...register('debit', {
                                  required: true,
                                })}
                                defaultValue={journalData[0].dbt_ac}
                              >
                                <option value="">---Select---</option>

                                {ledgerData.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.ledger_name}
                                    </option>
                                  );
                                })}
                              </select>
                              <div style={{ color: 'red' }}>
                                {errors.ledger && (
                                  <p>Please select debit name</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Credit Account
                            </label>
                            <div className="col-sm-9">
                              <select
                                name="credit"
                                id="credit"
                                className="form-control"
                                {...register('credit', {
                                  required: true,
                                })}
                                defaultValue={journalData[0].crdt_ac}
                              >
                                <option value="">---Select---</option>

                                {ledgerData.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.ledger_name}
                                    </option>
                                  );
                                })}
                              </select>
                              <div style={{ color: 'red' }}>
                                {errors.ledger && (
                                  <p>Please select credit name</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Amount
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                name="amount"
                                id="amount"
                                className="form-control"
                                {...register('amount', {
                                  required: true,
                                  pattern: {
                                    value: /^\d{1,8}(?:\.\d{0,2})?$/,
                                    message:
                                      'enter amount in correct format (Eg: 1234.25)',
                                  },
                                })}
                                defaultValue={journalData[0].amount}
                              />
                              <div style={{ color: 'red' }}>
                                {errors.amount && (
                                  <p>
                                    enter amount in correct format (Eg: 1234.25)
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Narrative
                            </label>
                            <div className="col-sm-9">
                              <textarea
                                className="control-label col-sm-12"
                                name="narrative"
                                id="narrative"
                                defaultValue={journalData[0].description}
                                {...register('narrative', {
                                  required: true,
                                })}
                                rows="5"
                              />
                              <div style={{ color: 'red' }}>
                                {errors.narrative && (
                                  <p>Please enter Narrative</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label
                        htmlFor="textfield"
                        className="control-label col-sm-3"
                        id="stat"
                        align="right"
                      >
                        Status
                      </label>
                      <div className="col-sm-9">
                        <select
                          name="status"
                          id="status"
                          className="form-control"
                          {...register('status')}
                          defaultValue={journalData[0].status}
                        >
                          <option value="1">---Select---</option>
                          <option value="paid">Paid</option>
                          <option value="not paid">Not Paid</option>
                        </select>

                        {/* <label
                          htmlFor="textfield"
                          className="control-label col-sm-3"
                          id="paid"
                        >
                          Paid
                        </label>
                        <label
                          htmlFor="textfield"
                          className="control-label col-sm-3"
                          id="not_paid"
                        > */}
                        {/* Not Paid */}
                        {/* </label> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 ">
                    <div className="form-group">
                      <label
                        htmlFor="textfield"
                        className="control-label col-sm-3"
                        align="right"
                      >
                        Upload
                      </label>
                      <div className="col-sm-9">
                        <div
                          className="fileinput fileinput-new"
                          data-provides="fileinput"
                        >
                          <div className="input-group">
                            <div
                              className="form-control"
                              data-trigger="fileinput"
                            >
                              <i className="glyphicon glyphicon-file fileinput-exists" />
                              <span className="fileinput-filename">
                                {downloadUri === 'Nil'
                                  ? journalData[0].filepath
                                  : downloadUri}
                              </span>
                            </div>
                            <span className="input-group-addon btn-default btn-file">
                              {fileUploadFlag ? (
                                <>
                                  <span id="1" className="fileinput-new">
                                    Change
                                  </span>
                                </>
                              ) : (
                                <span className="fileinput-new">
                                  Select file
                                </span>
                              )}
                              <input
                                id="upload123"
                                name="upload"
                                type="file"
                                {...register('upload', {
                                  // required: true,
                                })}
                                onChange={(e) => {
                                  setFileUploadData(e.target.files[0]);
                                  uploadDataFun();
                                  // uploadImage(e.target.files[0]);
                                }}
                              />
                            </span>
                            &nbsp;
                            {fileUploadFlag ? (
                              <span className="input-group-addon btn btn-default btn-file">
                                <span
                                  className="fileinput-new"
                                  id="2"
                                  onClick={(e) => {
                                    setDownloadUri('Nil');
                                    setFileUploadFlag(false);
                                  }}
                                >
                                  Remove
                                </span>
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3" />
                  <div className="col-sm-6">
                    <div className="form-actions">
                      <button
                        type="submit"
                        name="submit"
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.preventDefault();

                          if (fileUploadFlag) {
                            uploadImage(fileUploadData);
                          }

                          submitFinal();
                        }}
                      >
                        Save
                      </button>
                      &nbsp;
                      <button
                        type="reset"
                        className="btn btn-primary"
                        onClick={(e) => {
                          history.push({
                            pathname: '/view_journal',
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <ToastContainer />
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit_journal;
