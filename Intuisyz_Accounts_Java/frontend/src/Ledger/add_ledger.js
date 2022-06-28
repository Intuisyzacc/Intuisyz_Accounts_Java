import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { successToast } from '../common/global';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {
  useHistory,
  useLocation,
  Redirect,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import uuid from 'react-uuid';
import baseUrl from '../Base Url/baseUrl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Ledger/style_ledger.css';

import Headers from '../Header/Headers';

const Add_ledger = (props) => {
  let history = useHistory();

  let location = useLocation();
  // const { comingfrom, grp } = route.params;
  console.log('coming from', location.comingfrom);

  // const params = new URLSearchParams(window.location.search);
  // const paramValue = params.get('post');

  let urlDetails = window.location.href;
  let myArray = urlDetails.split('?');

  if (myArray.length > 1) {
    let urlVal = myArray[1].split('&');

    if (urlVal[0].split('=')[0] == 'CompanyName') {
      sessionStorage.setItem('CompanyName', urlVal[0].split('=')[1]);
    }

    if (urlVal[1].split('=')[0] == 'logDetails') {
      sessionStorage.setItem('logDetails', urlVal[1].split('=')[1]);
    }

    if (urlVal[2].split('=')[0] == 'tdsIdVal') {
      sessionStorage.setItem('tdsIdVal', urlVal[2].split('=')[1]);
    }

    if (urlVal[3].split('=')[0] == 'gstIdVal') {
      sessionStorage.setItem('gstIdVal', urlVal[3].split('=')[1]);
    }

    if (urlVal[4].split('=')[0] == 'cashIdVal') {
      sessionStorage.setItem('cashIdVal', urlVal[4].split('=')[1]);
    }

    if (urlVal[5].split('=')[0] == 'CustId') {
      sessionStorage.setItem('CustId', urlVal[5].split('=')[1]);
    }
  }

  //alert(params);
  // sessionStorage.setItem('logDetails', paramValue);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  let url = baseUrl.url;

  const [refreshBtn, setRefreshBtn] = useState(false);
  const [validationMsg, setValidationMsg] = useState();
  const [grpName, setGrpName] = useState([]);
  const [radioBtn, setRadioBtn] = useState(false);
  const [grpNameLoad, setGrpNameLoad] = useState(false);
  const [endDate, setEndDate] = useState(new Date());

  const [flag, setFlag] = useState([]);
  let arr = [];

  var eDate = localStorage.getItem('migrationDate');

  const submitFinal = handleSubmit((data) => {
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

    console.log(eDate);

    ////////////////////////////////////////////////////////////////////
    let acc_number = 'Nil';
    let bank = 'Nil';
    let branch = 'Nil';
    let ifsc_code = 'Nil';

    if (radioBtn === true) {
      acc_number = data.acc_number;
      bank = data.bank;
      branch = data.branch;
      ifsc_code = data.ifsc_code;
    }

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
    finalObj.amount = '';
    //account id
    finalObj.created_date = cDate;
    finalObj.time = cTime;
    //userId
    finalObj.balance_type = data.balancetype;
    finalObj.ledger_date = eDate;

    finalObj.company_name = sessionStorage.getItem('CompanyName');
    finalObj.cust_id = sessionStorage.getItem('CustId');
    ///////////////////////////////////////////////////////////////////////

    //  grpName finding using javascript find function

    // grpName.find(l);

    // function l(item) {
    //   if (item.group_id === parseInt(data.group_name)) {
    //     console.log('grpd id', data.group_name, 'found');
    //     arr.push({
    //       ac_title: item.ac_title,
    //       ac_type: item.ac_type,
    //     });
    //     console.log('array', arr);
    //   } else {
    //     console.log('not found');
    //     arr.push({
    //       ac_title: '',
    //       ac_type: '',
    //     });
    //   }
    // }

    //  grpName finding using backend

    axios
      .get(url + `grp_by_id?grpId=${data.group_name}`)
      .then(({ data }) => {
        console.log('grpId', data);

        // setFlag(data);
        finalObj.ac_type = data[0].ac_type;
        finalObj.ac_title = data[0].ac_title;

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
              setValidationMsg(true);
            } else {
              setValidationMsg(false);

              axios
                // .post('http://localhost:8080/add_ledger', finalObj)
                .post(url + 'add_ledger', finalObj)
                .then(() => {
                  setTimeout(function () {
                    f();
                  }, 500);

                  successToast('Ledger Created Successfully');
                  reset();
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

    // data for account_transactions_v3

    function f() {
      let finalObj1 = {};

      finalObj1.transactionID = uuid();
      // finalObj1.dbt_ac = arr[0].ac_type;
      // finalObj1.crdt_ac = arr[0].ac_title;
      finalObj1.mode = 'Nil';
      finalObj1.amount = data.open_balance;
      finalObj1.type = 'Nil'; //transactionType
      // finalObj1.tran_gen = data.state;             not used , but in table
      finalObj1.tran_Date = cDate; //datee
      finalObj1.description = 'ledger creation'; //narrative
      finalObj1.ac_no = 'Nil';
      finalObj1.chq_no = 'Nil';
      finalObj1.chq_date = 'Nil';
      finalObj1.branch = 'Nil';
      finalObj1.user_bank = 'Nil'; //bankname
      finalObj1.bank = 'Nil';
      finalObj1.status = 'Pay_Now';
      finalObj1.filename = 'Nil'; //image
      finalObj1.filepath = 'Nil'; //im
      finalObj1.createdBy = ''; // userID
      finalObj1.createdDate = cDate;
      finalObj1.createdTime = cTime;

      finalObj1.company_name = sessionStorage.getItem('CompanyName');
      finalObj1.cust_id = sessionStorage.getItem('CustId');
      // finalObj1.credit_blnc_bfore_txn = acc_number;       not used , but in table
      // finalObj1.debit_blnc_bfore_txn = acc_number;        not used , but in table

      console.log('finalObj1', finalObj1);

      axios
        // .get('http://localhost:8080/last_id_search')
        .get(url + 'last_id_search')
        .then(({ data }) => {
          let lastId = data[data.length - 1].id;
          console.log('last Id', lastId);

          if (finalObj.balance_type === 'debit') {
            finalObj1.dbt_ac = lastId;
            finalObj1.crdt_ac = '31';
          } else if (finalObj.balance_type === 'credit') {
            finalObj1.dbt_ac = '31';
            finalObj1.crdt_ac = lastId;
          } else {
            finalObj1.dbt_ac = 'Nil';
            finalObj1.crdt_ac = 'Nil';
          }
          if (finalObj1.amount != 0 && finalObj1.amount != '') {
            axios
              // .post('http://localhost:8080/add_transaction', finalObj1)
              .post(url + 'add_transaction', finalObj1)
              .then(() => {
                console.log('Transaction Created Successfully');
                console.log('creditor', finalObj1.crdt_ac);
                console.log('debitor', finalObj1.dbt_ac);

                creditFun(
                  finalObj1.crdt_ac,
                  finalObj1.amount,
                  cDate,
                  cTime,
                  ''
                );
                debitFun(finalObj1.dbt_ac, finalObj1.amount, cDate, cTime, '');
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
    // console.log(finalObj);
    // console.log(JSON.stringify(finalObj));
    // console.log(finalObj1);
    // console.log(JSON.stringify(finalObj1));
  });

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

        console.log('increase function currentAmount', currentAmount);

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

        console.log('decrease function currentAmount', currentAmount);

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
      // .get('http://localhost:8080/view_group')
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
        setGrpNameLoad(true);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function grpLoadingOnClick() {
    document.getElementById('select1').selectedIndex = '';
    axios
      // .get('http://localhost:8080/view_group')
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
        setRefreshBtn(true);
        setTimeout(function () {
          setRefreshBtn(false);
        }, 2000);

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    // const { id } = props;

    // let params = queryString.parse(props.location.search);
    // console.log('passing val ', params);
    if (sessionStorage.getItem('logDetails') === 'true') {
      grpLoading();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  return (
    <div>
      <Headers />
      {grpNameLoad && (
        <div className="container-fluid" id="content">
          <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
            <form>
              <div className="container-fluid">
                <div className="page-header">
                  <div className="pull-left">
                    <h1>Create Ledger</h1>
                  </div>
                  <div className="pull-right">
                    {/* <a align="right" href="add_group.php" target="_blank"> */}
                    {/* <a
                    align="right"
                    onClick={(e) => {
                      history.push({
                        pathname: '/add_group',
                      });
                    }}
                    target="_blank"
                  > */}
                    <Link
                      align="right"
                      to={`add_group?CompanyName=${sessionStorage.getItem(
                        'CompanyName'
                      )}&logDetails=${sessionStorage.getItem(
                        'logDetails'
                      )}&tdsIdVal=${sessionStorage.getItem(
                        'tdsIdVal'
                      )}&gstIdVal=${sessionStorage.getItem(
                        'gstIdVal'
                      )}&cashIdVal=${sessionStorage.getItem(
                        'cashIdVal'
                      )}&CustId=${sessionStorage.getItem('CustId')}`}
                      target="_blank"
                    >
                      <i className="fa fa-plus" aria-hidden="true" />
                      Add Group
                    </Link>
                    {/* </a> */}
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
                              Create Ledger
                            </h3>
                          </div>
                          <div className="box-content nopadding">
                            {/* <form
                            method="post"
                            name="add_head"
                            onsubmit="return add_head_valdation()"
                          > */}
                            <table className="table table-hover table-nomargin">
                              <tbody>
                                <tr>
                                  <th>Ledger Name</th>
                                  <td>
                                    <input
                                      type="text"
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
                                      name="group_name"
                                      id="select1"
                                      className="form-control"
                                      // onchange="showHint(this.value)"
                                      {...register('group_name', {
                                        required: true,
                                      })}
                                      defaultValue={
                                        location.comingfrom ===
                                        'createInvoiceService'
                                          ? '5'
                                          : location.comingfrom ===
                                            'createInvoiceCustomer'
                                          ? '4'
                                          : ''
                                      }
                                    >
                                      <option value="">---Select---</option>

                                      {grpName.map((item) => {
                                        return (
                                          <option
                                            key={item.group_id}
                                            value={item.group_id}
                                          >
                                            {item.group_name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <div style={{ color: 'red' }}>
                                      {errors.group_name && (
                                        <p>Group Name is required.</p>
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
                                      // onclick="refresh_ledger()"
                                      onClick={grpLoadingOnClick}
                                      className={refreshBtn ? 'fa-spin' : null}
                                    >
                                      <i
                                        id="refreshbtn"
                                        className="fa fa-refresh "
                                        aria-hidden="true"
                                      ></i>
                                    </button>
                                  </td>
                                </tr>
                                <tr>
                                  <th> Opening Balance </th>
                                  <td>
                                    <input
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
                                  <th>Balance Type</th>
                                  <td>
                                    <select
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
                                    {/* <div style={{ color: 'red' }}>
                                      <p>
                                        {errors.balancetype &&
                                          'Select one type'}
                                      </p>
                                    </div> */}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
                                        type="text"
                                        name="mobile"
                                        className="form-control"
                                        {...register('mobile', {
                                          pattern: {
                                            value: /^\(?\d{3}\)?-?\s*-?\d{7}$/,
                                            message:
                                              'Enter 10 digit valid mobile',
                                          },
                                        })}
                                      />

                                      <div style={{ color: 'red' }}>
                                        <p>
                                          {errors.mobile &&
                                            'Enter 10 digit valid mobile'}
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th> Fax No </th>
                                    <td>
                                      <input
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
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        {...register('email', {
                                          pattern: {
                                            value:
                                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'invalid email address',
                                          },
                                        })}
                                      />

                                      <div style={{ color: 'red' }}>
                                        <p>
                                          {errors.email &&
                                            'invalid email address'}
                                        </p>
                                      </div>
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
                                          defaultValue=""
                                        />
                                      </div>
                                    </td>
                                  </tr> */}

                                  <tr>
                                    <th> Provide bank details</th>
                                    <td>
                                      <input
                                        type="radio"
                                        name="bank1"
                                        id="r1"
                                        onClick={(e) => {
                                          setRadioBtn(true);
                                        }}
                                      />{' '}
                                      Yes{' '}
                                      <input
                                        type="radio"
                                        name="bank1"
                                        id="r2"
                                        onClick={() => {
                                          setRadioBtn(false);
                                        }}
                                      />
                                      No
                                    </td>
                                  </tr>
                                  {radioBtn && (
                                    <>
                                      <tr id={1}>
                                        <th> A/C No:</th>
                                        <td>
                                          <input
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
                                            type="text"
                                            name="ifsc_code"
                                            className="form-control"
                                            {...register('ifsc_code')}
                                          />
                                        </td>
                                      </tr>
                                    </>
                                  )}
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
                                        Save
                                      </button>
                                      &nbsp;
                                      <button
                                        type="reset"
                                        // onclick="myFunction()"
                                        className="btn"
                                      >
                                        Cancel
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Add_ledger;
