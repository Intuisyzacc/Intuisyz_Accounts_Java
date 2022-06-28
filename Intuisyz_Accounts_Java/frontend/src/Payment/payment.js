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
import Headers from '../Header/Headers';

const Payment = () => {
  const [endDate, setEndDate] = useState(new Date());
  const [ledgerData, setLedgerData] = useState([]);
  const [cashState, setCashState] = useState(1);
  const [chequeState, setChequeState] = useState(0);
  const [neftState, setNeftState] = useState(0);
  const [chequeDate, setChequeDate] = useState();
  const [tranDateValidation, setTranDateValidation] = useState(false);
  const [chequeDateValidation, setChequeDateValidation] = useState(false);
  const [chequeNoValidation, setChequeNoValidation] = useState(false);
  const [bankName, setBankName] = useState([]);
  const [bankValidation, setBankValidation] = useState(false);
  const [refreshBtn, setRefreshBtn] = useState(false);
  const [downloadUri, setDownloadUri] = React.useState('Nil');
  const [fileUploadFlag, setFileUploadFlag] = useState(false);
  const [fileUploadData, setFileUploadData] = useState('');
  const [modeValidation, setModeValidation] = useState(false);
  const [flagData, setFlagData] = useState('');

  let url = baseUrl.url;
  let userID = '';
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
    if (data.mode === '') {
      setModeValidation(true);
    } else {
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

          console.log('FinalObj1', finalObj1);
          console.log('tran date', finalObj1.tran_Date);
          console.log('cheque__Date', finalObj1.chq_date);

          let creditor = '';
          if (finalObj1.mode === 'NEFT/RTGS') {
            creditor = data.bank;
            finalObj1.crdt_ac = creditor;
            axios
              // .post('http://localhost:8080/add_payment', finalObj1)
              .post(url + 'add_payment', finalObj1)
              .then(() => {
                successToast('Payment Created Successfully');
                reset();
                decreaseAmount(
                  finalObj1.dbt_ac,
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
            if (finalObj1.status === 'Pay_Now') {
              if (finalObj1.mode === 'cash') {
                // creditor = '30';
                creditor = sessionStorage.getItem('cashIdVal');
              }
              if (finalObj1.mode === 'cheque') {
                creditor = finalObj1.bank;
              }
              finalObj1.crdt_ac = creditor;
              axios
                // .post('http://localhost:8080/add_payment', finalObj1)
                .post(url + 'add_payment', finalObj1)
                .then(() => {
                  successToast('Payment Created Successfully');
                  reset();
                  decreaseAmount(
                    finalObj1.dbt_ac,
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
                // .post('http://localhost:8080/add_payment', finalObj1)
                .post(url + 'add_payment', finalObj1)
                .then(() => {
                  successToast('Payment Created Successfully');
                  reset();
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        }
      } else if (data.mode === 'NEFT/RTGS') {
        if (
          endDate === null ||
          endDate === undefined
          //  ||
          // data.bank === undefined ||
          // data.bank === ''
        ) {
          if (endDate === null || endDate === undefined) {
            setTranDateValidation(true);
            if (data.bank != undefined || data.bank != '') {
              setBankValidation(false);
            }
          }
          // if (data.bank === undefined || data.bank === '') {
          //   setBankValidation(true);
          //   if (endDate != null || endDate != undefined) {
          //     setTranDateValidation(false);
          //   }
          // }
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

          console.log('FinalObj1', finalObj1);
          console.log('tran date', finalObj1.tran_Date);
          console.log('cheque__Date', finalObj1.chq_date);

          let creditor = '';
          if (finalObj1.mode === 'NEFT/RTGS') {
            creditor = data.bank;
            finalObj1.crdt_ac = creditor;
            axios
              // .post('http://localhost:8080/add_payment', finalObj1)
              .post(url + 'add_payment', finalObj1)
              .then(() => {
                successToast('Payment Created Successfully');
                reset();
                decreaseAmount(
                  finalObj1.dbt_ac,
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
            if (finalObj1.status === 'Pay_Now') {
              if (finalObj1.mode === 'cash') {
                // creditor = '30';
                creditor = sessionStorage.getItem('cashIdVal');
              }
              if (finalObj1.mode === 'cheque') {
                creditor = finalObj1.bank;
              }
              finalObj1.crdt_ac = creditor;
              axios
                // .post('http://localhost:8080/add_payment', finalObj1)
                .post(url + 'add_payment', finalObj1)
                .then(() => {
                  successToast('Payment Created Successfully');
                  reset();
                  decreaseAmount(
                    finalObj1.dbt_ac,
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
                // .post('http://localhost:8080/add_payment', finalObj1)
                .post(url + 'add_payment', finalObj1)
                .then(() => {
                  successToast('Payment Created Successfully');
                  reset();
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
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

          console.log('FinalObj1', finalObj1);
          console.log('tran date', finalObj1.tran_Date);
          console.log('cheque__Date', finalObj1.chq_date);

          let creditor = '';
          if (finalObj1.mode === 'NEFT/RTGS') {
            creditor = data.bank;
            finalObj1.crdt_ac = creditor;
            axios
              // .post('http://localhost:8080/add_payment', finalObj1)
              .post(url + 'add_payment', finalObj1)
              .then(() => {
                successToast('Payment Created Successfully');
                reset();
                decreaseAmount(
                  finalObj1.dbt_ac,
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
            if (finalObj1.status === 'Pay_Now') {
              if (finalObj1.mode === 'cash') {
                // creditor = '30';
                creditor = sessionStorage.getItem('cashIdVal');
              }
              if (finalObj1.mode === 'cheque') {
                creditor = finalObj1.bank;
              }
              finalObj1.crdt_ac = creditor;
              axios
                // .post('http://localhost:8080/add_payment', finalObj1)
                .post(url + 'add_payment', finalObj1)
                .then(() => {
                  successToast('Payment Created Successfully');
                  reset();
                  decreaseAmount(
                    finalObj1.dbt_ac,
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
                // .post('http://localhost:8080/add_payment', finalObj1)
                .post(url + 'add_payment', finalObj1)
                .then(() => {
                  successToast('Payment Created Successfully');
                  reset();
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        }
      }
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
      .get(
        url +
          `list_ledger?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);
        setLedgerData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ledgerLoadingOnClick = () => {
    document.getElementById('ledger1').selectedIndex = '';
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
        setRefreshBtn(true);
        setTimeout(function () {
          setRefreshBtn(false);
        }, 2000);
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
    if (sessionStorage.getItem('logDetails') === 'true') {
      ledgerLoading();
      bankNameLoading();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  return (
    <div>
      <Headers />

      <div className="container-fluid" id="content">
        <div id="main">
          <form>
            <div className="container-fluid">
              <div className="page-header flexHeader">
                <h1>Payment</h1>
                <div className="HeaderLinksNew">
                  {/* <a align="right" href="add_ledger.php" target="_blank"> */}
                  <Link
                    className="LinkBtn"
                    align="right"
                    to="/add_ledger"
                    target="_blank"
                  >
                    <i className="fa fa-plus" aria-hidden="true" />
                    Create Ledger
                  </Link>
                  {/* </a> */}
                  {/* <a align="right" href="transactionHistory.php" target="_blank"> */}
                  <Link
                    className="LinkBtn"
                    align="right"
                    to="/transactionHistory"
                  >
                    <i className="fa fa-exchange" aria-hidden="true" />
                    Transaction History
                  </Link>
                  {/* </a> */}
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <font color="#FF0000">
                    <p id="wrn" />
                  </font>
                  <div className="box-content">
                    <form
                      className="form-horizontal"
                      name="payments"
                      method="post"
                      onsubmit="return paymentval()"
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
                              Ledger
                            </label>
                            <div className="col-sm-9" id="ledger_list">
                              <select
                                name="ledger"
                                id="ledger1"
                                className="form-control"
                                {...register('ledger', {
                                  required: true,
                                })}
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
                              <button
                                id="refresh_ledgers"
                                style={{
                                  backgroundColor: 'Transparent',
                                  border: 'none',
                                  paddingTop: '3px',
                                }}
                                type="button"
                                onClick={ledgerLoadingOnClick}
                                className={refreshBtn ? 'fa-spin' : null}
                              >
                                <i
                                  id="refreshbtn"
                                  className="fa fa-refresh"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="form-group">
                            <label
                              htmlFor="textfield"
                              className="control-label col-sm-3"
                            >
                              Mode
                            </label>
                            <div className="col-sm-9">
                              <select
                                name="mode"
                                className="form-control"
                                id="mode"
                                {...register('mode')}
                                onChange={(e) => {
                                  if (e.target.value === 'cash') {
                                    setCashState(1);
                                    setChequeState(0);
                                    setNeftState(0);
                                    setModeValidation(false);
                                    setFlagData(e.target.value);
                                    console.log(errors.mode, 'mode');
                                  } else if (e.target.value === 'cheque') {
                                    setCashState(0);
                                    setChequeState(1);
                                    setNeftState(0);
                                    setModeValidation(false);
                                    setFlagData(e.target.value);
                                  } else if (e.target.value === 'NEFT/RTGS') {
                                    setCashState(0);
                                    setChequeState(0);
                                    setNeftState(1);
                                    setModeValidation(false);
                                    setFlagData(e.target.value);
                                  } else if (e.target.value === '') {
                                    setModeValidation(true);
                                    setFlagData(e.target.value);
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
                                {modeValidation && (
                                  <p>Please select payment mode</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

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
                                  defaultValue=""
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
                              </div>
                            </div>
                          </div>
                        )}
                        {(cashState === 1 ||
                          chequeState === 1 ||
                          neftState === 1) && (
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
                                  defaultValue={''}
                                  {...register('narrative', {
                                    required: true,
                                  })}
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
                        {(cashState === 1 ||
                          chequeState === 1 ||
                          neftState === 1) && (
                          <div className="col-sm-6">
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
                                        {downloadUri}
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
                        )}
                      </div>

                      <div className="row">
                        <div className="col-sm-3" />
                        <div className="col-sm-6">
                          <div
                            className="form-actions"
                            style={{ paddingLeft: '92px' }}
                            align="left"
                          >
                            <button
                              type="submit"
                              name="submit"
                              className="btn btn-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                if (flagData === '') {
                                  setModeValidation(true);
                                }

                                if (fileUploadFlag) {
                                  uploadImage(fileUploadData);
                                }
                                submitFinal();
                              }}
                            >
                              Save{' '}
                            </button>
                            &nbsp;
                            <button type="reset" className="btn btn-primary">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
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

export default Payment;
