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
import { successToast } from '../common/global';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../Base Url/baseUrl';
import uuid from 'react-uuid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Ledger/style_ledger.css';
import Headers from '../Header/Headers';

const Edit_ledger = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  let url = baseUrl.url;

  const [validationMsg, setValidationMsg] = useState();
  const [grpName, setGrpName] = useState([]);
  const [radioBtn, setRadioBtn] = useState(false);
  const [flag, setFlag] = useState([]);
  let arr = [];
  let location = useLocation();
  let history = useHistory();

  const [ledgerData, setLedgerData] = useState([]);
  const [ledgerLoaded, setLedgerLoaded] = useState(false);
  const [grpNameLoaded, setGrpNameLoaded] = useState(false);
  const [ledgerIdData, setledgerIdData] = useState();
  const [ledgerNameData, setledgerNameData] = useState();
  const [endDate, setEndDate] = useState(new Date());

  let ledgerId, ledgerName;
  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        history.push({
          pathname: '/ledger_list',
        });
      } else {
        console.log('location.post.ledger_id', location.post.id);
        let ledgerId1 = location.post.id;
        let ledgerName1 = location.post.ledger_name;
        ledgerId = ledgerId1;
        ledgerName = ledgerName1;
        grpLoading();
        dataLoading();
        setledgerIdData(ledgerId1);
        setledgerNameData(ledgerName1);
      }
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  const submitFinal = handleSubmit((data) => {
    ledgerId = ledgerIdData;
    ledgerName = ledgerNameData;
    console.log('ledgerID', ledgerId, 'ledgerName', ledgerName);
    ////////////////////////Date and Time /////////////////////////////////
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

    ////////////////////////////////////////////////////////////////////////

    // if (endDate.getDate() < 10) {
    //   var currentDay = '0' + endDate.getDate();
    // } else {
    //   var currentDay = endDate.getDate();
    // }

    // if (endDate.getMonth() + 1 < 10) {
    //   var currentMonth = '0' + (endDate.getMonth() + 1);
    // } else {
    //   var currentMonth = endDate.getMonth() + 1;
    // }

    // var eDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

    // console.log(eDate);

    ////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////
    // let acc_number = 'Nil';
    // let bank = 'Nil';
    // let branch = 'Nil';
    // let ifsc_code = 'Nil';

    // if (radioBtn === true) {
    let acc_number = data.acc_number;
    let bank = data.bank;
    let branch = data.branch;
    let ifsc_code = data.ifsc_code;
    // }

    /////////////////////////////////////////////////////////////////

    let finalObj = {};

    // data for account_ledger_v3 table

    ////////new code///////
    if (
      data.open_balance === '' ||
      data.open_balance === undefined ||
      data.open_balance === null
    ) {
      data.open_balance = '0';
    }
    /////////////////////////

    finalObj.id = ledgerId;
    finalObj.ledger_name = data.ledger_name;

    finalObj.ac_group = data.group_name;
    finalObj.name = data.mail_name;
    finalObj.address = data.address;
    finalObj.state = data.state;
    finalObj.pin = data.pin;
    finalObj.contact = data.contact;
    finalObj.mobile = data.mobile;
    finalObj.fax = data.fax;
    finalObj.email = data.email;
    finalObj.acc_number = acc_number;
    finalObj.bank = bank;
    finalObj.branch = branch;
    finalObj.ifsc_code = ifsc_code;
    finalObj.open_balance = data.open_balance;
    // finalObj.amount = location.post.amount;
    //account id
    finalObj.created_date = cDate;
    finalObj.time = cTime;
    //userId
    finalObj.balance_type = data.balancetype;
    finalObj.ledger_date = endDate;

    finalObj.company_name = sessionStorage.getItem('CompanyName');
    finalObj.cust_id = sessionStorage.getItem('CustId');

    let GroupName = data.group_name;

    axios
      //.get(`http://localhost:8080/grp_by_id?grpId=${data.group_name}`)
      .get(url + `grp_by_id?grpId=${data.group_name}`)
      .then(({ data }) => {
        console.log('grpId', data);

        // setFlag(data);
        finalObj.ac_type = data[0].ac_type;
        let ac_title1 = data[0].ac_title;

        if (ac_title1 === '') {
          finalObj.ac_title = data.group_name;
        }

        if (ac_title1 !== '') {
          finalObj.ac_title = ac_title1;
        }

        let amnt, old_open_balance, diff;
        axios
          .get(url + `ledger_search?ledgerId=${ledgerId}`)
          .then(({ data }) => {
            console.log(data);

            finalObj.amount = data[0].amount;

            amnt = data[0].amount;
            old_open_balance = data[0].open_balance;
            diff = finalObj.open_balance - old_open_balance;

            console.log('diff ', diff);

            let debit = 'Nil',
              credit = 'Nil';
            if (finalObj.balance_type == 'debit') {
              debit = ledgerId;
              credit = '31';
            } else if (finalObj.balance_type == 'credit') {
              debit = '31';
              credit = ledgerId;
            }

            console.log('debit', debit, 'credit', credit, 'diff', diff);

            console.log('finalObj', finalObj);

            axios
              // .get(
              //   `http://localhost:8080/ledger_name_search?ledgerName=${finalObj.ledger_name}`
              // )
              .get(
                url +
                  `ledger_name_search?ledgerName=${
                    finalObj.ledger_name
                  }&CompanyName=${sessionStorage.getItem(
                    'CompanyName'
                  )}&CustId=${sessionStorage.getItem('CustId')}`
              )
              .then(({ data }) => {
                console.log('ledger name', data);
                if (data.length >= 1) {
                  if (finalObj.ledger_name === ledgerName) {
                    setValidationMsg(false);

                    axios
                      .put(url + `ledger_update/${ledgerId}`, finalObj)
                      .then(() => {
                        successToast('Ledger Updated Successfully');
                        ///transaction function calling
                        transactionFun(
                          cDate,
                          cTime,
                          debit,
                          credit,
                          finalObj.open_balance,
                          old_open_balance,
                          finalObj.open_balance,
                          GroupName
                        );
                        reset();
                        setTimeout(function () {
                          history.push({
                            pathname: '/ledger_list',
                          });
                        }, 1000);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    setValidationMsg(true);
                  }
                } else {
                  setValidationMsg(false);

                  axios
                    // .put(
                    //   `http://localhost:8080/ledger_update/${ledgerId}`,
                    //   finalObj
                    // )
                    .put(url + `ledger_update/${ledgerId}`, finalObj)
                    .then(() => {
                      setTimeout(function () {
                        // f();
                      }, 500);
                      ///transaction function calling
                      transactionFun(
                        cDate,
                        cTime,
                        debit,
                        credit,
                        finalObj.open_balance,
                        old_open_balance,
                        finalObj.open_balance,
                        GroupName
                      );
                      successToast('Ledger Updated Successfully');
                      reset();
                      setTimeout(function () {
                        history.push({
                          pathname: '/ledger_list',
                        });
                      }, 1000);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  function transactionFun(
    cDate,
    cTime,
    debit,
    credit,
    open_balance,
    old_open_balance,
    Amounts,
    GroupName
  ) {
    let open_trans_id, finalAmount, type;
    axios
      .get(url + `ledger_transaction_search?dbt_ac=${debit}&&crdt_ac=${credit}`)
      .then(({ data }) => {
        console.log('ledger_transaction_search data', data);
        console.log('ledger_transaction_search data length', data.length);

        if (data.length != 0 && old_open_balance != open_balance) {
          console.log('old_open_balance data', old_open_balance);
          console.log('open_balance data', open_balance);
          console.log('open_balance data', open_balance);

          open_trans_id = data[0].tranID;

          console.log('open_trans_id ', open_trans_id);

          axios
            .get(url + `journal_search?tranId=${open_trans_id}`)
            .then(({ data }) => {
              console.log('open_trans_id data', data);
              let ledgerAmount = data[0].amount;
              let ledgerID11 = data[0].dbt_ac;
              let crdtAmountac = data[0].crdt_ac;
              let a1 = data[0].amount;

              console.log('ledgerID11 ', ledgerID11);
              console.log('crdtAmountac ', crdtAmountac);

              ///////////////updatesLedger1 calculation //////////////
              axios
                .get(url + `ledger_search?ledgerId=${ledgerID11}`)
                .then(({ data }) => {
                  console.log('ledgerID11 data', data);

                  let previousAmount = data[0].amount;
                  finalAmount =
                    parseFloat(previousAmount) - parseFloat(ledgerAmount);

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

                  finalObj1.company_name =
                    sessionStorage.getItem('CompanyName');
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
                  type = data[0].ac_type;

                  console.log('updatesAmount type ', type);

                  if (type === '2' || type === '3') {
                    let previousAmount1 = data[0].amount;
                    finalAmount1 =
                      parseFloat(previousAmount1) -
                      parseFloat(a1) +
                      parseFloat(Amounts);
                  } else {
                    let previousAmount1 = data[0].amount;
                    finalAmount1 =
                      parseFloat(previousAmount1) + parseFloat(ledgerAmount);
                  }

                  console.log('finalAmount1 ', finalAmount1);

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

              setTimeout(function () {
                let finalObj5 = {};

                finalObj5.tranID = open_trans_id;
                finalObj5.transactionID = data[0].transactionID;
                finalObj5.dbt_ac = debit;
                // finalObj1.dbt_ac = arr[0].ac_type;
                finalObj5.crdt_ac = credit;
                finalObj5.mode = data[0].mode;
                finalObj5.amount = Amounts;
                finalObj5.type = 'Nil'; //transactionType
                // finalObj1.tran_gen = data.state;             not used , but in table
                finalObj5.tran_Date = data[0].tran_Date; //datee
                finalObj5.description = 'ledger creation'; //narrative
                finalObj5.ac_no = data[0].ac_no;
                finalObj5.chq_no = data[0].chq_no;
                finalObj5.chq_date = data[0].chq_date;
                finalObj5.branch = data[0].branch;
                finalObj5.user_bank = data[0].user_bank; //bankname
                finalObj5.bank = data[0].bank;
                finalObj5.status = data[0].status;
                finalObj5.filename = data[0].filename; //image
                finalObj5.filepath = data[0].filepath; //im
                finalObj5.createdBy = data[0].createdBy; // userID
                finalObj5.createdDate = cDate;
                finalObj5.createdTime = cTime;

                finalObj5.company_name = sessionStorage.getItem('CompanyName');
                finalObj5.cust_id = sessionStorage.getItem('CustId');

                console.log('updateJournal data FinalObj5', finalObj5);
                update(
                  finalObj5,
                  open_trans_id,
                  debit,
                  credit,
                  type,
                  Amounts,
                  cDate,
                  cTime
                );
              }, 3000);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (data.length === 0 && old_open_balance !== open_balance) {
          let debitor = debit,
            creditor = credit,
            lastid = ledgerId;

          if (creditor === 'Nil') {
            creditor = '31';
          }

          console.log('Amounts ', Amounts);

          console.log('creditor ', creditor);
          console.log('debitor ', debitor);
          console.log('GroupName ', GroupName);

          if ((Amounts != 0 && Amounts != '') || GroupName === '3') {
            let finalObj6 = {};

            finalObj6.transactionID = uuid();
            finalObj6.dbt_ac = debitor;
            finalObj6.crdt_ac = creditor;
            finalObj6.mode = 'Nil';
            finalObj6.amount = Amounts;
            finalObj6.type = 'Nil'; //transactionType
            // finalObj1.tran_gen = data.state;             not used , but in table
            finalObj6.tran_Date = cDate; //datee
            finalObj6.description = 'ledger creation'; //narrative
            finalObj6.ac_no = 'Nil';
            finalObj6.chq_no = 'Nil';
            finalObj6.chq_date = 'Nil';
            finalObj6.branch = 'Nil';
            finalObj6.user_bank = 'Nil'; //bankname
            finalObj6.bank = 'Nil';
            finalObj6.status = 'Pay_Now';
            finalObj6.filename = 'Nil'; //image
            finalObj6.filepath = 'Nil'; //im
            finalObj6.createdBy = ''; // userID
            finalObj6.createdDate = cDate;
            finalObj6.createdTime = cTime;
            // finalObj1.credit_blnc_bfore_txn = acc_number;       not used , but in table
            // finalObj1.debit_blnc_bfore_txn = acc_number;        not used , but in table

            finalObj6.company_name = sessionStorage.getItem('CompanyName');
            finalObj6.cust_id = sessionStorage.getItem('CustId');

            console.log('finalObj6', finalObj6);

            axios
              .post(url + 'add_transaction', finalObj6)
              .then(() => {
                console.log('Transaction Created Successfully');
                creditFun(
                  finalObj6.crdt_ac,
                  finalObj6.amount,
                  cDate,
                  cTime,
                  ''
                );
                debitFun(finalObj6.dbt_ac, finalObj6.amount, cDate, cTime, '');
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

  function update(
    finalObj5,
    open_trans_id,
    debit,
    credit,
    type,
    Amounts,
    cDate,
    cTime
  ) {
    axios
      .put(url + `journal_update/${open_trans_id}`, finalObj5)
      .then(() => {
        console.log('updateJournal update successfully');
        setTimeout(function () {
          increaseAmount(debit, Amounts, cDate, cTime, '');
          if (type === '2' || type === '3') {
            increaseAmount(credit, Amounts, cDate, cTime, '');
          } else {
            decreaseAmount(credit, Amounts, cDate, cTime, '');
          }
        }, 4000);
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
          increaseAmount(ledgerID, journalAmount, cDate, cTime, '');
        } else {
          decreaseAmount(ledgerID, journalAmount, cDate, cTime, '');
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

  function grpLoading() {
    axios
      //.get('http://localhost:8080/view_group')
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
        setGrpNameLoaded(true);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function dataLoading() {
    axios
      //.get(`http://localhost:8080/ledger_search?ledgerId=${ledgerId}`)
      .get(url + `ledger_search?ledgerId=${ledgerId}`)
      .then(({ data }) => {
        console.log(data);

        setEndDate(data[0].ledger_date);
        // console.log(k.split('-'));
        // let i = new Date(k.split('-')[0], k.split('-')[1] - 1, k.split('-')[2]);
        // setEndDate(i);
        // console.log(i);

        setLedgerData(data);
        setLedgerLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <Headers />
      {ledgerLoaded && grpNameLoaded && (
        <div className="container-fluid" id="content">
          <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
            <form>
              <div className="container-fluid">
                <div className="page-header">
                  <div className="pull-left">
                    <h1>Edit Ledger</h1>
                  </div>
                  <div className="pull-right"></div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="box">
                      <div className="box-title">
                        <h3></h3>
                      </div>
                    </div>
                    <div className="box-content">
                      <div className="col-sm-8">
                        <font color="#FF0000">
                          <p id="wrn" />
                        </font>
                        <font color="#FF0000"></font>
                        <div className="box">
                          <div className="box-title">
                            <h3>
                              <i className="fa fa-bars" />
                              Edit Ledger
                            </h3>
                          </div>
                          <div className="box-content nopadding">
                            <form
                              method="post"
                              name="add_head"
                              onsubmit="return add_head_valdation()"
                            >
                              <table className="table table-hover table-nomargin">
                                <tbody>
                                  <tr>
                                    <th>Ledger Name</th>
                                    <td>
                                      <input
                                        type="text"
                                        defaultValue={ledgerData[0].ledger_name}
                                        name="ledger_name"
                                        id="ledger_name_chk"
                                        className="form-control"
                                        // onfocusout="chk_ldgr_name(this.id);"
                                        {...register('ledger_name', {
                                          required: true,
                                        })}
                                      />
                                      <div style={{ color: 'red' }}>
                                        {errors.ledger_name && (
                                          <p>Ledger Name is required.</p>
                                        )}
                                        {validationMsg && (
                                          <p>Ledger Name is repeated.</p>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>Under Group</th>
                                    <td>
                                      <select
                                        defaultValue={ledgerData[0].ac_group}
                                        name="group_name"
                                        id="select"
                                        className="form-control"
                                        // onchange="showHint(this.value)"
                                        {...register('group_name', {
                                          required: true,
                                        })}
                                      >
                                        {grpName
                                          ? grpName.map((item) => {
                                              return (
                                                <option
                                                  key={item.group_id}
                                                  value={item.group_id}
                                                >
                                                  {item.group_name}
                                                </option>
                                              );
                                            })
                                          : null}
                                      </select>
                                      <div style={{ color: 'red' }}>
                                        {errors.group_name && (
                                          <p>Group Name is required.</p>
                                        )}
                                      </div>
                                      {/* <button
                                        id="refresh_ledgers"
                                        style={{
                                          backgroundColor: 'Transparent',
                                          border: 'none',
                                          paddingTop: '3px',
                                        }}
                                        type="button"
                                        // onclick="refresh_ledger()"
                                        onClick={grpLoading}
                                      >
                                        <i
                                          id="refreshbtn"
                                          className="fa fa-refresh"
                                          aria-hidden="true"
                                        />
                                      </button> */}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>Balance Type</th>
                                    <td>
                                      <select
                                        defaultValue={
                                          ledgerData[0].balance_type
                                        }
                                        name="balancetype"
                                        className="form-control"
                                        {...register('balancetype')}
                                      >
                                        <option value="">
                                          Select Account Type
                                        </option>
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="box-content">
                        <div className="col-sm-8">
                          <font color="#FF0000">
                            <p id="wrn" />
                          </font>
                          <font color="#FF0000"></font>
                          <div className="box">
                            <div className="box-title">
                              <h3>
                                <i className="fa fa-bars" />
                                Mailing Details
                              </h3>
                            </div>
                            <div className="box-content nopadding">
                              <p></p>
                              <p />
                              <table className="table table-hover table-nomargin">
                                <tbody>
                                  <tr>
                                    <th> Name </th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].name}
                                        type="text"
                                        name="mail_name"
                                        className="form-control"
                                        {...register('mail_name')}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> Address </th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].address}
                                        type="text"
                                        name="address"
                                        id="textarea"
                                        className="form-control"
                                        {...register('address')}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> State </th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].state}
                                        type="text"
                                        name="state"
                                        className="form-control"
                                        {...register('state')}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> Pin </th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].pin}
                                        type="text"
                                        name="pin"
                                        className="form-control"
                                        {...register('pin')}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> Contact Number </th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].contact}
                                        type="text"
                                        name="contact"
                                        className="form-control"
                                        {...register('contact')}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> Mobile </th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].mobile}
                                        type="text"
                                        name="mobile"
                                        className="form-control"
                                        {...register('mobile')}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> Fax No </th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].fax}
                                        type="text"
                                        name="fax"
                                        className="form-control"
                                        {...register('fax')}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> E-mail </th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].email}
                                        type="text"
                                        name="email"
                                        className="form-control"
                                        {...register('email')}
                                      />
                                    </td>
                                  </tr>
                                  {/* <tr>
                                    <th> Date </th>
                                    <td>
                                      <div className="datepickerStyle2">
                                        <DatePicker
                                          name="end"
                                          className="form-control datepicker"
                                          dateFormat="dd/MM/yyyy"
                                          selected={endDate}
                                          onChange={(date) => setEndDate(date)}
                                          // defaultValue=""
                                        />
                                      </div>
                                    </td>
                                  </tr> */}

                                  <tr align="center">
                                    <td colSpan={2}>
                                      <b>Bank details</b>
                                    </td>
                                  </tr>
                                  <tr id={1}>
                                    <th> A/C No:</th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].acc_number}
                                        type="text"
                                        name="acc_number"
                                        className="form-control"
                                        {...register('acc_number')}
                                      />
                                    </td>
                                  </tr>
                                  <tr id={2}>
                                    <th> Bank Name</th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].bank}
                                        type="text"
                                        name="bank"
                                        className="form-control"
                                        {...register('bank')}
                                      />
                                    </td>
                                  </tr>
                                  <tr id={3}>
                                    <th> Bank Branch</th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].branch}
                                        type="text"
                                        name="branch"
                                        className="form-control"
                                        {...register('branch')}
                                      />
                                    </td>
                                  </tr>
                                  <tr id={4}>
                                    <th> IFSC Code</th>
                                    <td>
                                      <input
                                        defaultValue={ledgerData[0].ifsc_code}
                                        type="text"
                                        name="ifsc_code"
                                        className="form-control"
                                        {...register('ifsc_code')}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> Opening Balance </th>
                                    <td>
                                      <input
                                        defaultValue={
                                          ledgerData[0].open_balance
                                        }
                                        type="text"
                                        name="open_balance"
                                        className="form-control"
                                        {...register('open_balance', {
                                          pattern: {
                                            value: /^\d{1,8}(?:\.\d{0,2})?$/,
                                            message:
                                              'enter amount in correct format (Eg: 1234.25)',
                                          },
                                        })}
                                      />
                                      <div style={{ color: 'red' }}>
                                        <p>
                                          {errors.open_balance &&
                                            'enter amount in correct format (Eg: 1234.25)'}
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      <button
                                        type="submit"
                                        name="submit"
                                        className="btn btn-primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          submitFinal();
                                        }}
                                      >
                                        Update
                                      </button>
                                      &nbsp;
                                      <button
                                        type="button"
                                        className="btn"
                                        onClick={(e) => {
                                          history.push({
                                            pathname: '/ledger_list',
                                          });
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <ToastContainer />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit_ledger;
