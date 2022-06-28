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
import DatePicker from 'react-datepicker';
import uuid from 'react-uuid';
import baseUrl from '../Base Url/baseUrl';
import Headers from '../Header/Headers';

const Edit_voucher = () => {
  const [endDate, setEndDate] = useState(new Date());
  const [ledgerData, setLedgerData] = useState([]);
  const [cashState, setCashState] = useState();
  const [chequeState, setChequeState] = useState();
  const [neftState, setNeftState] = useState();
  const [chequeDate, setChequeDate] = useState();
  const [tranDateValidation, setTranDateValidation] = useState(false);
  const [chequeDateValidation, setChequeDateValidation] = useState(false);
  const [chequeNoValidation, setChequeNoValidation] = useState(false);
  const [bankName, setBankName] = useState([]);
  const [bankValidation, setBankValidation] = useState(false);

  const [paymentData, setPaymentData] = useState([]);
  const [paymentLoaded, setPaymentLoaded] = useState(false);
  const [ledgerLoaded, setLedgerLoaded] = useState(false);
  const [bankNameLoaded, setBankNameLoaded] = useState(false);
  const [flag, setFlag] = useState(0);
  const [tranIDData, setTranIDData] = useState();
  const [transactionIdData, setTransactionIdData] = useState();
  const [downloadUri, setDownloadUri] = React.useState('Nil');
  const [fileUploadFlag, setFileUploadFlag] = useState(false);
  const [fileUploadData, setFileUploadData] = useState('');

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

  const submitFinal = handleSubmit((data) => {
    tranID = tranIDData;
    transactionId = transactionIdData;

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

    // axios
    //   .get(`http://localhost:8080/ledger_search?ledgerId=${data.ledger}`)
    //   //.get(`http://intz.live:8080/ledger_search?ledgerId=${ledgerId}`)
    //   .then(({ data }) => {
    //     console.log(data);
    //     setLedgerDataById(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    console.log('endDate', endDate);
    console.log('chequeDate', chequeDate);

    ////////mode checking////////

    if (data.mode === 'cheque') {
      if (
        endDate === null ||
        chequeDate === null ||
        chequeDate === undefined ||
        endDate === undefined ||
        data.cheque_no === '' ||
        data.bank === undefined ||
        data.bank === ''
      ) {
        if (endDate === null || endDate === undefined) {
          setTranDateValidation(true);
          if (chequeDate != null || chequeDate != undefined) {
            setChequeDateValidation(false);
          }
          if (data.cheque_no != '') {
            setChequeNoValidation(false);
          }
          if (data.bank != undefined || data.bank != '') {
            setBankValidation(false);
          }
        }

        if (chequeDate === null || chequeDate === undefined) {
          setChequeDateValidation(true);

          if (endDate != null || endDate != undefined) {
            setTranDateValidation(false);
          }
          if (data.cheque_no != '') {
            setChequeNoValidation(false);
          }
          if (data.bank != undefined || data.bank != '') {
            setBankValidation(false);
          }
        }

        if (data.cheque_no === '') {
          setChequeNoValidation(true);
          if (endDate != null || endDate != undefined) {
            setTranDateValidation(false);
          }
          if (chequeDate != null || chequeDate != undefined) {
            setChequeDateValidation(false);
          }
          if (data.bank != undefined || data.bank != '') {
            setBankValidation(false);
          }
        }

        if (data.bank === undefined || data.bank === '') {
          setBankValidation(true);
          if (endDate != null || endDate != undefined) {
            setTranDateValidation(false);
          }
          if (chequeDate != null || chequeDate != undefined) {
            setChequeDateValidation(false);
          }
          if (data.cheque_no != '') {
            setChequeNoValidation(false);
          }
        }
      } else {
        setTranDateValidation(false);
        setChequeDateValidation(false);
        setChequeNoValidation(false);
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
        if (chequeDate.getDate() < 10) {
          var currentDay = '0' + chequeDate.getDate();
        } else {
          var currentDay = chequeDate.getDate();
        }

        if (chequeDate.getMonth() + 1 < 10) {
          var currentMonth = '0' + (chequeDate.getMonth() + 1);
        } else {
          var currentMonth = chequeDate.getMonth() + 1;
        }

        var cheque__Date =
          chequeDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

        let finalObj1 = {};
        console.log('mode', data.mode);
        finalObj1.transactionID = uuid();
        finalObj1.dbt_ac = data.ledger;
        // finalObj1.dbt_ac = arr[0].ac_type;
        // finalObj1.crdt_ac = arr[0].ac_title;
        finalObj1.mode = data.mode;
        finalObj1.amount = data.amount;
        finalObj1.type = 'Voucher'; //transactionType
        // finalObj1.tran_gen = data.state;             not used , but in table
        finalObj1.tran_Date = eDate; //datee
        finalObj1.description = data.narrative; //narrative
        finalObj1.ac_no = 'Nil';
        finalObj1.chq_no = data.cheque_no;
        finalObj1.chq_date = cheque__Date;
        finalObj1.branch = 'Nil';
        finalObj1.user_bank = 'Nil'; //bankname
        finalObj1.bank = data.bank;
        finalObj1.status = 'Pay_Now';
        finalObj1.filename = 'Nil'; //image
        finalObj1.filepath = downloadUri; //im
        finalObj1.createdBy = ''; // userID
        finalObj1.createdDate = cDate;
        finalObj1.createdTime = cTime;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

        let ac_type, ac_title, ac_group, amount1, Mode;

        axios
          .get(url + `journal_search?tranId=${tranID}`)
          .then(({ data }) => {
            console.log('transaction data', data);
            amount1 = data[0].amount;
            Mode = data[0].mode;
            let crdtAmountac = data[0].dbt_ac;
            let bankledger = data[0].bank;

            // axios
            //   .get(url + `ledger_search?ledgerId=${finalObj1.crdt_ac}`)
            //   .then(({ data }) => {
            //     console.log('ledger data', data);
            //     ac_type = data[0].ac_type;
            //     ac_title = data[0].ac_title;
            //     let amnt = data[0].amount;
            //     ac_group = data[0].ac_group;

            if (Mode === 'cash') {
              // let ledgerID11 = '30';
              let ledgerID11 = sessionStorage.getItem('cashIdVal');

              let previousAmount, finalAmount;

              //////////////////////////updatesLedger1 calculation/////////////
              axios
                .get(url + `ledger_search?ledgerId=${ledgerID11}`)
                .then(({ data }) => {
                  previousAmount = data[0].amount;
                  finalAmount =
                    parseFloat(previousAmount) + parseFloat(amount1);

                  let finalObj6 = {};

                  // data for account_ledger_v3 table
                  finalObj6.id = ledgerID11;
                  finalObj6.ledger_name = data[0].ledger_name;

                  finalObj6.ac_group = data[0].ac_group;
                  finalObj6.name = data[0].name;
                  finalObj6.address = data[0].address;
                  finalObj6.state = data[0].state;
                  finalObj6.pin = data[0].pin;
                  finalObj6.contact = data[0].contact;
                  finalObj6.mobile = data[0].mobile;
                  finalObj6.fax = data[0].fax;
                  finalObj6.email = data[0].email;
                  finalObj6.acc_number = data[0].acc_number;
                  finalObj6.bank = data[0].bank;
                  finalObj6.branch = data[0].branch;
                  finalObj6.ifsc_code = data[0].ifsc_code;
                  finalObj6.open_balance = data[0].open_balance;
                  finalObj6.amount = finalAmount;
                  //account id
                  finalObj6.created_date = cDate;
                  finalObj6.time = cTime;
                  //userId
                  finalObj6.balance_type = data[0].balance_type;
                  finalObj6.ledger_date = data[0].ledger_date;

                  finalObj6.company_name =
                    sessionStorage.getItem('CompanyName');
                  finalObj6.cust_id = sessionStorage.getItem('CustId');

                  axios
                    .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
                    .then(({ data }) => {
                      console.log('grpId', data);

                      // setFlag(data);
                      finalObj6.ac_type = data[0].ac_type;
                      finalObj6.ac_title = data[0].ac_title;

                      axios
                        .put(url + `ledger_update/${finalObj6.id}`, finalObj6)
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

                      console.log('updatesLedger1 finalObj6', finalObj6);
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
            } else {
              //////////////////////////updatesLedger1 calculation/////////////
              axios
                .get(url + `ledger_search?ledgerId=${bankledger}`)
                .then(({ data }) => {
                  let previousAmount = data[0].amount;
                  let finalAmount =
                    parseFloat(previousAmount) + parseFloat(amount1);

                  let finalObj6 = {};

                  // data for account_ledger_v3 table
                  finalObj6.id = bankledger;
                  finalObj6.ledger_name = data[0].ledger_name;

                  finalObj6.ac_group = data[0].ac_group;
                  finalObj6.name = data[0].name;
                  finalObj6.address = data[0].address;
                  finalObj6.state = data[0].state;
                  finalObj6.pin = data[0].pin;
                  finalObj6.contact = data[0].contact;
                  finalObj6.mobile = data[0].mobile;
                  finalObj6.fax = data[0].fax;
                  finalObj6.email = data[0].email;
                  finalObj6.acc_number = data[0].acc_number;
                  finalObj6.bank = data[0].bank;
                  finalObj6.branch = data[0].branch;
                  finalObj6.ifsc_code = data[0].ifsc_code;
                  finalObj6.open_balance = data[0].open_balance;
                  finalObj6.amount = finalAmount;
                  //account id
                  finalObj6.created_date = cDate;
                  finalObj6.time = cTime;
                  //userId
                  finalObj6.balance_type = data[0].balance_type;
                  finalObj6.ledger_date = data[0].ledger_date;

                  finalObj6.company_name =
                    sessionStorage.getItem('CompanyName');
                  finalObj6.cust_id = sessionStorage.getItem('CustId');

                  axios
                    .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
                    .then(({ data }) => {
                      console.log('grpId', data);

                      // setFlag(data);
                      finalObj6.ac_type = data[0].ac_type;
                      finalObj6.ac_title = data[0].ac_title;

                      axios
                        .put(url + `ledger_update/${finalObj6.id}`, finalObj6)
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

                      console.log('updatesLedger1 finalObj6', finalObj6);
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
            }

            /////////////transaction delete//////////
            axios
              .delete(url + `payment_delete/${tranID}`)
              .then(({ data }) => {
                console.log('deleted data', data);
                console.log('Deleted Succesfully');

                let creditor = '';
                if (finalObj1.mode === 'NEFT/RTGS') {
                  creditor = finalObj1.bank;
                  finalObj1.crdt_ac = creditor;

                  axios
                    .post(url + 'add_payment', finalObj1)
                    .then(() => {
                      // setFlag(1);
                      console.log('new transaction added ', data);
                      // successToast('Payment Updated Successfully');
                      increaseAmount(
                        finalObj1.dbt_ac,
                        finalObj1.amount,
                        cDate,
                        cTime,
                        ''
                      );

                      setTimeout(function () {
                        decreaseAmount(
                          finalObj1.bank, //ledger value
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );
                      }, 2000);

                      history.push({
                        pathname: '/payment_list',
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  if (
                    finalObj1.status === 'Pay_Now' ||
                    finalObj1.status === '1'
                  ) {
                    if (finalObj1.mode === 'cash') {
                      // creditor = '30';
                      creditor = sessionStorage.getItem('cashIdVal');
                    }
                    if (finalObj1.mode === 'cheque') {
                      creditor = finalObj1.bank;
                    }
                    finalObj1.crdt_ac = creditor;

                    axios
                      .post(url + 'add_payment', finalObj1)
                      .then(() => {
                        // setFlag(1);
                        console.log('new transaction added ', data);
                        // successToast('Payment Updated Successfully');
                        increaseAmount(
                          finalObj1.dbt_ac,
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );

                        setTimeout(function () {
                          decreaseAmount(
                            finalObj1.crdt_ac, //ledger value
                            finalObj1.amount,
                            cDate,
                            cTime,
                            ''
                          );
                        }, 2000);

                        history.push({
                          pathname: '/payment_list',
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    // I think this else part not used now...so not setted correctly
                    if (finalObj1.mode === 'cash') {
                      // creditor = '30';
                      creditor = sessionStorage.getItem('cashIdVal');
                    }
                    if (finalObj1.mode === 'cheque') {
                      creditor = finalObj1.bank;
                    }
                    finalObj1.crdt_ac = creditor;

                    axios
                      .post(url + 'add_payment', finalObj1)
                      .then(() => {
                        // setFlag(1);
                        console.log('new transaction added ', data);
                        // successToast('Payment Updated Successfully');
                        increaseAmount(
                          finalObj1.dbt_ac,
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );

                        setTimeout(function () {
                          increaseAmount(
                            finalObj1.crdt_ac, //ledger value
                            finalObj1.amount,
                            cDate,
                            cTime,
                            ''
                          );
                        }, 2000);

                        history.push({
                          pathname: '/payment_list',
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
          })
          .catch((err) => {
            console.log(err);
          });
        // })
        // .catch((err) => {
        //   console.log(err);
        // });

        console.log('FinalObj1', finalObj1);
        console.log('tran date', finalObj1.tran_Date);
        console.log('cheque__Date', finalObj1.chq_date);
        // localStorage.setItem('transactionID', finalObj1.transactionID);
      }
    } else if (data.mode === 'NEFT/RTGS') {
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
        // setChequeDateValidation(true);
      } else {
        setTranDateValidation(false);
        setBankValidation(false);
        // setChequeDateValidation(false);
        setChequeDateValidation(false);
        setChequeNoValidation(false);
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
        console.log('mode', data.mode);
        finalObj1.transactionID = uuid();
        finalObj1.dbt_ac = data.ledger;
        // finalObj1.dbt_ac = arr[0].ac_type;
        // finalObj1.crdt_ac = arr[0].ac_title;
        finalObj1.mode = data.mode;
        finalObj1.amount = data.amount;
        finalObj1.type = 'Voucher'; //transactionType
        // finalObj1.tran_gen = data.state;             not used , but in table
        finalObj1.tran_Date = eDate; //datee
        finalObj1.description = data.narrative; //narrative
        finalObj1.ac_no = data.ac_no;
        finalObj1.chq_no = '';
        finalObj1.chq_date = '';
        finalObj1.branch = data.branch;
        finalObj1.user_bank = data.bankname; //bankname
        if (data.mode === 'NEFT/RTGS') {
          finalObj1.bank = data.bank;
        } else {
          finalObj1.bank = '';
        }
        finalObj1.status = 'Pay_Now';
        finalObj1.filename = 'Nil'; //image
        finalObj1.filepath = downloadUri; //im
        finalObj1.createdBy = ''; // userID
        finalObj1.createdDate = cDate;
        finalObj1.createdTime = cTime;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

        let ac_type, ac_title, ac_group, amount1, Mode;

        axios
          .get(url + `journal_search?tranId=${tranID}`)
          .then(({ data }) => {
            console.log('transaction data', data);
            amount1 = data[0].amount;
            Mode = data[0].mode;
            let crdtAmountac = data[0].dbt_ac;
            let bankledger = data[0].bank;

            // axios
            //   .get(url + `ledger_search?ledgerId=${finalObj1.crdt_ac}`)
            //   .then(({ data }) => {
            //     console.log('ledger data', data);
            //     ac_type = data[0].ac_type;
            //     ac_title = data[0].ac_title;
            //     let amnt = data[0].amount;
            //     ac_group = data[0].ac_group;

            if (Mode === 'cash') {
              // let ledgerID11 = '30';
              let ledgerID11 = sessionStorage.getItem('cashIdVal');

              let previousAmount, finalAmount;

              //////////////////////////updatesLedger1 calculation/////////////
              axios
                .get(url + `ledger_search?ledgerId=${ledgerID11}`)
                .then(({ data }) => {
                  previousAmount = data[0].amount;
                  finalAmount =
                    parseFloat(previousAmount) + parseFloat(amount1);

                  let finalObj6 = {};

                  // data for account_ledger_v3 table
                  finalObj6.id = ledgerID11;
                  finalObj6.ledger_name = data[0].ledger_name;

                  finalObj6.ac_group = data[0].ac_group;
                  finalObj6.name = data[0].name;
                  finalObj6.address = data[0].address;
                  finalObj6.state = data[0].state;
                  finalObj6.pin = data[0].pin;
                  finalObj6.contact = data[0].contact;
                  finalObj6.mobile = data[0].mobile;
                  finalObj6.fax = data[0].fax;
                  finalObj6.email = data[0].email;
                  finalObj6.acc_number = data[0].acc_number;
                  finalObj6.bank = data[0].bank;
                  finalObj6.branch = data[0].branch;
                  finalObj6.ifsc_code = data[0].ifsc_code;
                  finalObj6.open_balance = data[0].open_balance;
                  finalObj6.amount = finalAmount;
                  //account id
                  finalObj6.created_date = cDate;
                  finalObj6.time = cTime;
                  //userId
                  finalObj6.balance_type = data[0].balance_type;
                  finalObj6.ledger_date = data[0].ledger_date;

                  finalObj6.company_name =
                    sessionStorage.getItem('CompanyName');
                  finalObj6.cust_id = sessionStorage.getItem('CustId');

                  axios
                    .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
                    .then(({ data }) => {
                      console.log('grpId', data);

                      // setFlag(data);
                      finalObj6.ac_type = data[0].ac_type;
                      finalObj6.ac_title = data[0].ac_title;

                      axios
                        .put(url + `ledger_update/${finalObj6.id}`, finalObj6)
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

                      console.log('updatesLedger1 finalObj6', finalObj6);
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
            } else {
              //////////////////////////updatesLedger1 calculation/////////////
              axios
                .get(url + `ledger_search?ledgerId=${bankledger}`)
                .then(({ data }) => {
                  let previousAmount = data[0].amount;
                  let finalAmount =
                    parseFloat(previousAmount) + parseFloat(amount1);

                  let finalObj6 = {};

                  // data for account_ledger_v3 table
                  finalObj6.id = bankledger;
                  finalObj6.ledger_name = data[0].ledger_name;

                  finalObj6.ac_group = data[0].ac_group;
                  finalObj6.name = data[0].name;
                  finalObj6.address = data[0].address;
                  finalObj6.state = data[0].state;
                  finalObj6.pin = data[0].pin;
                  finalObj6.contact = data[0].contact;
                  finalObj6.mobile = data[0].mobile;
                  finalObj6.fax = data[0].fax;
                  finalObj6.email = data[0].email;
                  finalObj6.acc_number = data[0].acc_number;
                  finalObj6.bank = data[0].bank;
                  finalObj6.branch = data[0].branch;
                  finalObj6.ifsc_code = data[0].ifsc_code;
                  finalObj6.open_balance = data[0].open_balance;
                  finalObj6.amount = finalAmount;
                  //account id
                  finalObj6.created_date = cDate;
                  finalObj6.time = cTime;
                  //userId
                  finalObj6.balance_type = data[0].balance_type;
                  finalObj6.ledger_date = data[0].ledger_date;

                  finalObj6.company_name =
                    sessionStorage.getItem('CompanyName');
                  finalObj6.cust_id = sessionStorage.getItem('CustId');

                  axios
                    .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
                    .then(({ data }) => {
                      console.log('grpId', data);

                      // setFlag(data);
                      finalObj6.ac_type = data[0].ac_type;
                      finalObj6.ac_title = data[0].ac_title;

                      axios
                        .put(url + `ledger_update/${finalObj6.id}`, finalObj6)
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

                      console.log('updatesLedger1 finalObj6', finalObj6);
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
            }

            /////////////transaction delete//////////
            axios
              .delete(url + `payment_delete/${tranID}`)
              .then(({ data }) => {
                console.log('deleted data', data);
                console.log('Deleted Succesfully');

                let creditor = '';
                if (finalObj1.mode === 'NEFT/RTGS') {
                  creditor = finalObj1.bank;
                  finalObj1.crdt_ac = creditor;

                  axios
                    .post(url + 'add_payment', finalObj1)
                    .then(() => {
                      // setFlag(1);
                      console.log('new transaction added ', data);
                      // successToast('Payment Updated Successfully');
                      increaseAmount(
                        finalObj1.dbt_ac,
                        finalObj1.amount,
                        cDate,
                        cTime,
                        ''
                      );

                      setTimeout(function () {
                        decreaseAmount(
                          finalObj1.bank, //ledger value
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );
                      }, 2000);

                      history.push({
                        pathname: '/payment_list',
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  if (
                    finalObj1.status === 'Pay_Now' ||
                    finalObj1.status === '1'
                  ) {
                    if (finalObj1.mode === 'cash') {
                      // creditor = '30';
                      creditor = sessionStorage.getItem('cashIdVal');
                    }
                    if (finalObj1.mode === 'cheque') {
                      creditor = finalObj1.bank;
                    }
                    finalObj1.crdt_ac = creditor;

                    axios
                      .post(url + 'add_payment', finalObj1)
                      .then(() => {
                        // setFlag(1);
                        console.log('new transaction added ', data);
                        // successToast('Payment Updated Successfully');
                        increaseAmount(
                          finalObj1.dbt_ac,
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );

                        setTimeout(function () {
                          decreaseAmount(
                            finalObj1.crdt_ac, //ledger value
                            finalObj1.amount,
                            cDate,
                            cTime,
                            ''
                          );
                        }, 2000);

                        history.push({
                          pathname: '/payment_list',
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    // I think this else part not used now...so not setted correctly
                    if (finalObj1.mode === 'cash') {
                      // creditor = '30';
                      creditor = sessionStorage.getItem('cashIdVal');
                    }
                    if (finalObj1.mode === 'cheque') {
                      creditor = finalObj1.bank;
                    }
                    finalObj1.crdt_ac = creditor;

                    axios
                      .post(url + 'add_payment', finalObj1)
                      .then(() => {
                        // setFlag(1);
                        console.log('new transaction added ', data);
                        // successToast('Payment Updated Successfully');
                        increaseAmount(
                          finalObj1.dbt_ac,
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );

                        setTimeout(function () {
                          increaseAmount(
                            finalObj1.crdt_ac, //ledger value
                            finalObj1.amount,
                            cDate,
                            cTime,
                            ''
                          );
                        }, 2000);

                        history.push({
                          pathname: '/payment_list',
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
          })
          .catch((err) => {
            console.log(err);
          });
        // })
        // .catch((err) => {
        //   console.log(err);
        // });

        console.log('FinalObj1', finalObj1);
        console.log('tran date', finalObj1.tran_Date);
        console.log('cheque__Date', finalObj1.chq_date);
      }
    } else if (data.mode === 'cash') {
      if (endDate === null || endDate === undefined) {
        setTranDateValidation(true);

        // setChequeDateValidation(true);
      } else {
        setTranDateValidation(false);
        setBankValidation(false);
        // setChequeDateValidation(false);
        setChequeDateValidation(false);
        setChequeNoValidation(false);
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
        finalObj1.dbt_ac = data.ledger;
        // finalObj1.dbt_ac = arr[0].ac_type;
        // finalObj1.crdt_ac = arr[0].ac_title;
        finalObj1.mode = data.mode;
        finalObj1.amount = data.amount;
        finalObj1.type = 'Voucher'; //transactionType
        // finalObj1.tran_gen = data.state;             not used , but in table
        finalObj1.tran_Date = eDate; //datee
        finalObj1.description = data.narrative; //narrative
        finalObj1.ac_no = 'Nil';
        finalObj1.chq_no = '';
        finalObj1.chq_date = '';
        finalObj1.branch = 'Nil';
        finalObj1.user_bank = 'Nil'; //bankname
        if (data.mode === 'NEFT/RTGS') {
          finalObj1.bank = data.bank;
        } else {
          finalObj1.bank = '';
        }
        finalObj1.status = 'Pay_Now';
        finalObj1.filename = 'Nil'; //image
        finalObj1.filepath = downloadUri; //im
        finalObj1.createdBy = ''; // userID
        finalObj1.createdDate = cDate;
        finalObj1.createdTime = cTime;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

        let ac_type, ac_title, ac_group, amount1, Mode;

        axios
          .get(url + `journal_search?tranId=${tranID}`)
          .then(({ data }) => {
            console.log('transaction data', data);
            amount1 = data[0].amount;
            Mode = data[0].mode;
            let crdtAmountac = data[0].dbt_ac;
            let bankledger = data[0].bank;

            // axios
            //   .get(url + `ledger_search?ledgerId=${finalObj1.crdt_ac}`)
            //   .then(({ data }) => {
            //     console.log('ledger data', data);
            //     ac_type = data[0].ac_type;
            //     ac_title = data[0].ac_title;
            //     let amnt = data[0].amount;
            //     ac_group = data[0].ac_group;

            if (Mode === 'cash') {
              // let ledgerID11 = '30';
              let ledgerID11 = sessionStorage.getItem('cashIdVal');

              let previousAmount, finalAmount;

              //////////////////////////updatesLedger1 calculation/////////////
              axios
                .get(url + `ledger_search?ledgerId=${ledgerID11}`)
                .then(({ data }) => {
                  previousAmount = data[0].amount;
                  finalAmount =
                    parseFloat(previousAmount) + parseFloat(amount1);

                  let finalObj6 = {};

                  // data for account_ledger_v3 table
                  finalObj6.id = ledgerID11;
                  finalObj6.ledger_name = data[0].ledger_name;

                  finalObj6.ac_group = data[0].ac_group;
                  finalObj6.name = data[0].name;
                  finalObj6.address = data[0].address;
                  finalObj6.state = data[0].state;
                  finalObj6.pin = data[0].pin;
                  finalObj6.contact = data[0].contact;
                  finalObj6.mobile = data[0].mobile;
                  finalObj6.fax = data[0].fax;
                  finalObj6.email = data[0].email;
                  finalObj6.acc_number = data[0].acc_number;
                  finalObj6.bank = data[0].bank;
                  finalObj6.branch = data[0].branch;
                  finalObj6.ifsc_code = data[0].ifsc_code;
                  finalObj6.open_balance = data[0].open_balance;
                  finalObj6.amount = finalAmount;
                  //account id
                  finalObj6.created_date = cDate;
                  finalObj6.time = cTime;
                  //userId
                  finalObj6.balance_type = data[0].balance_type;
                  finalObj6.ledger_date = data[0].ledger_date;

                  finalObj6.company_name =
                    sessionStorage.getItem('CompanyName');
                  finalObj6.cust_id = sessionStorage.getItem('CustId');

                  axios
                    .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
                    .then(({ data }) => {
                      console.log('grpId', data);

                      // setFlag(data);
                      finalObj6.ac_type = data[0].ac_type;
                      finalObj6.ac_title = data[0].ac_title;

                      axios
                        .put(url + `ledger_update/${finalObj6.id}`, finalObj6)
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

                      console.log('updatesLedger1 finalObj6', finalObj6);
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
            } else {
              //////////////////////////updatesLedger1 calculation/////////////
              axios
                .get(url + `ledger_search?ledgerId=${bankledger}`)
                .then(({ data }) => {
                  let previousAmount = data[0].amount;
                  let finalAmount =
                    parseFloat(previousAmount) + parseFloat(amount1);

                  let finalObj6 = {};

                  // data for account_ledger_v3 table
                  finalObj6.id = bankledger;
                  finalObj6.ledger_name = data[0].ledger_name;

                  finalObj6.ac_group = data[0].ac_group;
                  finalObj6.name = data[0].name;
                  finalObj6.address = data[0].address;
                  finalObj6.state = data[0].state;
                  finalObj6.pin = data[0].pin;
                  finalObj6.contact = data[0].contact;
                  finalObj6.mobile = data[0].mobile;
                  finalObj6.fax = data[0].fax;
                  finalObj6.email = data[0].email;
                  finalObj6.acc_number = data[0].acc_number;
                  finalObj6.bank = data[0].bank;
                  finalObj6.branch = data[0].branch;
                  finalObj6.ifsc_code = data[0].ifsc_code;
                  finalObj6.open_balance = data[0].open_balance;
                  finalObj6.amount = finalAmount;
                  //account id
                  finalObj6.created_date = cDate;
                  finalObj6.time = cTime;
                  //userId
                  finalObj6.balance_type = data[0].balance_type;
                  finalObj6.ledger_date = data[0].ledger_date;

                  finalObj6.company_name =
                    sessionStorage.getItem('CompanyName');
                  finalObj6.cust_id = sessionStorage.getItem('CustId');

                  axios
                    .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
                    .then(({ data }) => {
                      console.log('grpId', data);

                      // setFlag(data);
                      finalObj6.ac_type = data[0].ac_type;
                      finalObj6.ac_title = data[0].ac_title;

                      axios
                        .put(url + `ledger_update/${finalObj6.id}`, finalObj6)
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

                      console.log('updatesLedger1 finalObj6', finalObj6);
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
            }

            /////////////transaction delete//////////
            axios
              .delete(url + `payment_delete/${tranID}`)
              .then(({ data }) => {
                console.log('deleted data', data);
                console.log('Deleted Succesfully');

                let creditor = '';
                if (finalObj1.mode === 'NEFT/RTGS') {
                  creditor = finalObj1.bank;
                  finalObj1.crdt_ac = creditor;

                  axios
                    .post(url + 'add_payment', finalObj1)
                    .then(() => {
                      // setFlag(1);
                      console.log('new transaction added ', data);
                      // successToast('Payment Updated Successfully');
                      increaseAmount(
                        finalObj1.dbt_ac,
                        finalObj1.amount,
                        cDate,
                        cTime,
                        ''
                      );

                      setTimeout(function () {
                        decreaseAmount(
                          finalObj1.bank, //ledger value
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );
                      }, 2000);

                      history.push({
                        pathname: '/payment_list',
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  if (
                    finalObj1.status === 'Pay_Now' ||
                    finalObj1.status === '1'
                  ) {
                    if (finalObj1.mode === 'cash') {
                      // creditor = '30';
                      creditor = sessionStorage.getItem('cashIdVal');
                    }
                    if (finalObj1.mode === 'cheque') {
                      creditor = finalObj1.bank;
                    }
                    finalObj1.crdt_ac = creditor;

                    axios
                      .post(url + 'add_payment', finalObj1)
                      .then(() => {
                        // setFlag(1);
                        console.log('new transaction added ', data);
                        // successToast('Payment Updated Successfully');
                        increaseAmount(
                          finalObj1.dbt_ac,
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );

                        setTimeout(function () {
                          decreaseAmount(
                            finalObj1.crdt_ac, //ledger value
                            finalObj1.amount,
                            cDate,
                            cTime,
                            ''
                          );
                        }, 2000);

                        history.push({
                          pathname: '/payment_list',
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    // I think this else part not used now...so not setted correctly
                    if (finalObj1.mode === 'cash') {
                      // creditor = '30';
                      creditor = sessionStorage.getItem('cashIdVal');
                    }
                    if (finalObj1.mode === 'cheque') {
                      creditor = finalObj1.bank;
                    }
                    finalObj1.crdt_ac = creditor;

                    axios
                      .post(url + 'add_payment', finalObj1)
                      .then(() => {
                        // setFlag(1);
                        console.log('new transaction added ', data);
                        // successToast('Payment Updated Successfully');
                        increaseAmount(
                          finalObj1.dbt_ac,
                          finalObj1.amount,
                          cDate,
                          cTime,
                          ''
                        );

                        setTimeout(function () {
                          increaseAmount(
                            finalObj1.crdt_ac, //ledger value
                            finalObj1.amount,
                            cDate,
                            cTime,
                            ''
                          );
                        }, 2000);

                        history.push({
                          pathname: '/payment_list',
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
          })
          .catch((err) => {
            console.log(err);
          });
        // })
        // .catch((err) => {
        //   console.log(err);
        // });

        console.log('FinalObj1', finalObj1);
        console.log('tran date', finalObj1.tran_Date);
        console.log('cheque__Date', finalObj1.chq_date);
      }
    }
  });

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

  const ledgerLoading = () => {
    axios
      // .get('http://localhost:8080/list_ledger')
      .get(
        url +
          `list_ledger?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);
        setLedgerData(data);
        setLedgerLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const bankNameLoading = () => {
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
        setBankNameLoaded(true);
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

  function dataLoading() {
    axios
      // .get(
      //   `http://localhost:8080/transaction_search?transactionId=${transactionId}`
      // )
      .get(url + `transaction_search?transactionId=${transactionId}`)
      .then(({ data }) => {
        console.log('sdd', data);

        setPaymentData(data);
        setPaymentLoaded(true);

        let k = data[0].tran_Date;
        console.log(k.split('-'));
        let i = new Date(k.split('-')[0], k.split('-')[1] - 1, k.split('-')[2]);
        setEndDate(i);
        console.log(i);

        if (data[0].chq_date === '') {
          setChequeDate(new Date());
        } else {
          let j = data[0].chq_date;
          console.log(j.split('-'));
          let p = new Date(
            j.split('-')[0],
            j.split('-')[1] - 1,
            j.split('-')[2]
          );
          console.log(p);
          setChequeDate(p);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let transactionId, tranID;
  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        history.push({
          pathname: '/payment_list',
        });
      } else {
        console.log('location.post.transactionID', location.post.transactionID);
        transactionId = location.post.transactionID;
        let ledgerName = location.post.createdTime;
        //  let bankName = location.post.dbt_ac;
        tranID = location.post.tranID;

        setTranIDData(tranID);
        setTransactionIdData(transactionId);

        if (location.post.mode === 'cash') {
          setCashState(1);
        } else if (location.post.mode === 'cheque') {
          setChequeState(1);
        } else if (location.post.mode === 'NEFT/RTGS') {
          setNeftState(1);
        } else {
          setCashState(1);
        }
        ledgerLoading();
        bankNameLoading();
        // if (flag === 0) {
        //   dataLoading(transactionId);
        // } else {
        //   dataLoading(localStorage.getItem('transactionID'));
        // }
        dataLoading();
        console.log('flag', flag);
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
      {ledgerLoaded && paymentLoaded && bankNameLoaded && (
        <div className="container-fluid" id="content">
          <div id="main">
            <div className="container-fluid">
              <div className="page-header flexHeader">
                <h1>Edit Payment</h1>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <font color="#FF0000">
                    {/*?php echo $msg;?*/}
                    <p id="wrn" />
                  </font>
                  <div className="box-content">
                    <form
                      className="form-horizontal"
                      method="post"
                      encType="multipart/form-data"
                    >
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="col-sm-6" id="datee">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Date
                              </label>
                              <div className="col-sm-9">
                                <DatePicker
                                  // defaultValue={paymentData[0].tran_Date}
                                  name="end"
                                  className="form-control datepicker"
                                  dateFormat="dd/MM/yyyy"
                                  selected={endDate}
                                  onChange={(date) => setEndDate(date)}
                                />
                                <div style={{ color: 'red' }}>
                                  {tranDateValidation && (
                                    <p>Please enter transaction date</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6" id="ledgers">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Ledger
                              </label>
                              <div className="col-sm-9">
                                <select
                                  name="ledger"
                                  id="ledger"
                                  className="form-control"
                                  {...register('ledger', {
                                    required: true,
                                  })}
                                  defaultValue={
                                    paymentData[0].debit_blnc_bfore_txn
                                  }
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
                                    <p>Please select ledger name</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {neftState === 1 && (
                            <div className="col-sm-6" id="ac_no">
                              <div className="form-group">
                                <label
                                  htmlFor="textfield"
                                  className="control-label col-sm-3"
                                >
                                  Account Number
                                </label>
                                <div className="col-sm-9">
                                  <input
                                    type="text"
                                    name="ac_no"
                                    defaultValue={paymentData[0].ac_no}
                                    className="form-control"
                                    {...register('ac_no', {
                                      // required: true,
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="col-sm-6" id="paymode">
                            <div className="form-group">
                              <label
                                htmlFor="textfield"
                                className="control-label col-sm-3"
                              >
                                Mode
                              </label>
                              <div className="col-sm-9">
                                <select
                                  defaultValue={paymentData[0].mode}
                                  name="mode"
                                  className="form-control"
                                  id="mode"
                                  {...register('mode', {
                                    required: true,
                                  })}
                                  onChange={(e) => {
                                    if (e.target.value === 'cash') {
                                      setCashState(1);
                                      setChequeState(0);
                                      setNeftState(0);
                                    } else if (e.target.value === 'cheque') {
                                      setCashState(0);
                                      setChequeState(1);
                                      setNeftState(0);
                                    } else if (e.target.value === 'NEFT/RTGS') {
                                      setCashState(0);
                                      setChequeState(0);
                                      setNeftState(1);
                                    }
                                    // setCountPerPage(e.target.value);
                                    // setPageNumber(0);
                                    //  changePage({selected:'0'})
                                  }}
                                >
                                  <option value="">---Select---</option>
                                  <option value="cash">Cash</option>
                                  <option value="cheque">Cheque</option>
                                  <option value="NEFT/RTGS">NEFT/RTGS</option>
                                </select>
                                <div style={{ color: 'red' }}>
                                  {errors.mode && (
                                    <p>Please select payment mode</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {neftState === 1 && (
                            <div className="col-sm-6" id="bankname">
                              <div className="form-group">
                                <label
                                  htmlFor="textfield"
                                  className="control-label col-sm-3"
                                >
                                  User Bank Name
                                </label>
                                <div className="col-sm-9">
                                  <input
                                    type="text"
                                    name="bankname"
                                    defaultValue={paymentData[0].user_bank}
                                    className="form-control"
                                    {...register('bankname', {
                                      // required: true,
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {chequeState === 1 && (
                            <div className="col-sm-6" id="chq_date">
                              <div className="form-group">
                                <label
                                  htmlFor="textfield"
                                  className="control-label col-sm-3"
                                >
                                  Cheque Date
                                </label>
                                <div className="col-sm-9">
                                  <DatePicker
                                    name="cheque_date"
                                    className="form-control datepicker"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => setChequeDate(date)}
                                    selected={chequeDate}
                                  />

                                  <div style={{ color: 'red' }}>
                                    {chequeDateValidation && (
                                      <p>Please enter cheque date</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {chequeState === 1 && (
                            <div className="col-sm-6" id="chq_no">
                              <div className="form-group">
                                <label
                                  htmlFor="textfield"
                                  className="control-label col-sm-3"
                                >
                                  Cheque No
                                </label>
                                <div className="col-sm-9">
                                  <input
                                    type="text"
                                    name="cheque_no"
                                    id="cheque_no"
                                    className="form-control"
                                    {...register('cheque_no', {
                                      // required: true,
                                    })}
                                    defaultValue={paymentData[0].chq_no}
                                  />
                                  <div style={{ color: 'red' }}>
                                    {chequeNoValidation && (
                                      <p>Please enter cheque number</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {neftState === 1 && (
                            <div className="col-sm-6" id="branch">
                              <div className="form-group">
                                <label
                                  htmlFor="textfield"
                                  className="control-label col-sm-3"
                                >
                                  Branch
                                </label>
                                <div className="col-sm-9">
                                  <input
                                    type="text"
                                    name="branch"
                                    defaultValue={paymentData[0].branch}
                                    className="form-control"
                                    {...register('branch', {
                                      // required: true,
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {(chequeState === 1 || neftState === 1) && (
                            <div className="col-sm-6" id="bank_name">
                              <div className="form-group">
                                <label
                                  htmlFor="textfield"
                                  className="control-label col-sm-3"
                                >
                                  Bank Name
                                </label>
                                <div className="col-sm-9">
                                  <select
                                    name="bank"
                                    id="bank"
                                    className="form-control"
                                    {...register('bank', {
                                      // required: true,
                                    })}
                                    defaultValue={paymentData[0].bank}
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
                                    {bankValidation && (
                                      <p>Please Select bank</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {(cashState === 1 ||
                            chequeState === 1 ||
                            neftState === 1) && (
                            <div className="col-sm-6" id="amnt">
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
                                    defaultValue={paymentData[0].amount}
                                  />
                                  <div style={{ color: 'red' }}>
                                    {errors.amount && (
                                      <p>
                                        enter amount in correct format (Eg:
                                        1234.25)
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {(cashState === 1 ||
                            chequeState === 1 ||
                            neftState === 1) && (
                            <div className="col-sm-6" id="narrat">
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
                                    {...register('narrative', {
                                      required: true,
                                    })}
                                    defaultValue={paymentData[0].description}
                                  />
                                  <div style={{ color: 'red' }}>
                                    {errors.narrative && (
                                      <p>Please enter Narrative</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* <div className="col-sm-6 pull-left" id="due_date">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Due Date
                            </label>
                            <div className="col-sm-9">
                              <input
                                name="due_date"
                                id
                                className="form-control datepicker"
                                type="text"
                              />
                            </div>
                          </div>
                        </div> */}
                          {/* <div className="col-sm-6 pull-left" id="sundry">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Sundry Creditors
                            </label>
                            <div className="col-sm-9">
                              <select className="form-control" name="creditor">
                                <option value={0}>---select---</option>
                              
                                <option value="<?php echo $arry['id']; ?>">
                                  
                                </option>
                                
                              </select>
                            </div>
                          </div>
                        </div> */}
                          {(cashState === 1 ||
                            chequeState === 1 ||
                            neftState === 1) && (
                            <div className="col-sm-6 pull-left">
                              <div className="form-group">
                                <label
                                  htmlFor="textfield"
                                  className="control-label col-sm-3"
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
                                            ? paymentData[0].status
                                            : downloadUri}
                                        </span>
                                      </div>
                                      <span className="input-group-addon btn-default btn-file">
                                        {fileUploadFlag ? (
                                          <>
                                            <span
                                              id="1"
                                              className="fileinput-new"
                                            >
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
                                            setFileUploadData(
                                              e.target.files[0]
                                            );
                                            uploadDataFun();
                                            // uploadImage(e.target.files[0]);
                                          }}
                                        />
                                      </span>
                                      &nbsp;
                                      {fileUploadFlag ? (
                                        <span className="input-group-addon btn-default btn-file">
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
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-3" />
                        <div className="col-sm-6">
                          <div className="form-actions" align="left">
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
                              Save{' '}
                            </button>
                            &nbsp;
                            <a>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={(e) => {
                                  history.push({
                                    pathname: '/payment_list',
                                  });
                                }}
                              >
                                Cancel
                              </button>
                            </a>
                          </div>
                        </div>
                        <ToastContainer />
                      </div>
                    </form>
                    {/*-form ends here*/}
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

export default Edit_voucher;
