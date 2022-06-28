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

const Journal = () => {
  const [endDate, setEndDate] = useState(new Date());
  const [tranDateValidation, setTranDateValidation] = useState(false);
  const [ledgerData, setLedgerData] = useState([]);
  const [refreshBtn, setRefreshBtn] = useState(false);
  const [refreshBtn1, setRefreshBtn1] = useState(false);
  const [downloadUri, setDownloadUri] = React.useState('Nil');
  const [fileUploadFlag, setFileUploadFlag] = useState(false);
  const [fileUploadData, setFileUploadData] = useState('');

  let url = baseUrl.url;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const submitFinal = handleSubmit((data) => {
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

    let journalCredit = data.credit;
    let journalDebit = data.debit;
    let journalAmount = data.amount;

    let finalObj1 = {};

    finalObj1.transactionID = uuid();
    finalObj1.dbt_ac = data.debit;
    // finalObj1.dbt_ac = arr[0].ac_type;
    finalObj1.crdt_ac = data.credit;
    finalObj1.mode = '';
    finalObj1.amount = data.amount;
    finalObj1.type = 'Contra'; //transactionType
    // finalObj1.tran_gen = data.state;             not used , but in table
    finalObj1.tran_Date = eDate; //datee
    finalObj1.description = data.narrative; //narrative
    finalObj1.ac_no = '';
    finalObj1.chq_no = '';
    finalObj1.chq_date = '';
    finalObj1.branch = '';
    finalObj1.user_bank = ''; //bankname
    finalObj1.bank = '';
    // finalObj1.status = '1';
    //////new code///////
    finalObj1.status = data.status;
    /////////////////////
    finalObj1.filename = 'Nil'; //image
    finalObj1.filepath = downloadUri; //im
    finalObj1.createdBy = ''; // userID
    finalObj1.createdDate = cDate;
    finalObj1.createdTime = cTime;

    finalObj1.company_name = sessionStorage.getItem('CompanyName');
    finalObj1.cust_id = sessionStorage.getItem('CustId');

    console.log('FinalObj1', finalObj1);

    axios
      .post(url + 'add_journalTransaction', finalObj1)
      .then(() => {
        successToast('Journal Created Successfully');
        reset();

        //// increase and decrease amount function call
        creditFun(journalCredit, journalAmount, cDate, cTime, '');
        debitFun(journalDebit, journalAmount, cDate, cTime, '');
      })
      .catch((err) => {
        console.log(err);
      });
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

  function ledgerLoading() {
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function ledgerLoadingOnClick() {
    document.getElementById('debit').selectedIndex = '';
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
        setRefreshBtn(true);
        setTimeout(function () {
          setRefreshBtn(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function ledgerLoadingOnClick1() {
    document.getElementById('credit').selectedIndex = '';
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
        setRefreshBtn1(true);
        setTimeout(function () {
          setRefreshBtn1(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  let history = useHistory();
  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      ledgerLoading();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  return (
    <div className="container-fluid" id="content">
      <Headers />
      <div id="main">
        <div className="container-fluid">
          <div className="page-header flexHeader">
            <h1>Journal</h1>

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
              <Link className="LinkBtn" align="right" to="/transactionHistory">
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
                  method="post"
                  name="journals"
                  onsubmit="return journalVal()"
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
                            {errors.ledger && <p>Please select debit name</p>}
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
                            {errors.ledger && <p>Please select credit name</p>}
                          </div>
                          <button
                            id="refresh_ledgers2"
                            style={{
                              backgroundColor: 'Transparent',
                              border: 'none',
                              paddingTop: '3px',
                            }}
                            type="button"
                            onClick={ledgerLoadingOnClick1}
                            className={refreshBtn1 ? 'fa-spin' : null}
                          >
                            <i
                              id="refreshbtn2"
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
                            defaultValue={''}
                            {...register('narrative', {
                              required: true,
                            })}
                            rows="5"
                          />
                          <div style={{ color: 'red' }}>
                            {errors.narrative && <p>Please enter Narrative</p>}
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
                          id="stat"
                          align="left"
                        >
                          Status
                        </label>
                        <div className="col-sm-9">
                          {/* <label
                            htmlFor="textfield"
                            className="control-label col-sm-3"
                            id="paid"
                          >
                            Paid
                          </label> */}

                          <select
                            name="status"
                            id="status"
                            className="form-control"
                            {...register('status')}
                          >
                            <option value="1">---Select---</option>
                            <option value="paid">Paid</option>
                            <option value="not paid">Not Paid</option>
                          </select>

                          {/* <label
                            htmlFor="textfield"
                            className="control-label col-sm-3"
                            id="not_paid"
                          > */}
                          {/* Not Paid */}
                          {/* </label> */}
                        </div>
                      </div>
                    </div>

                    {/* <div class="col-sm-6">
                                    <div class="form-group" id="due_date">	
										<label for="textfield" class="control-label col-sm-3">Due Date</label>
										<div class="col-sm-9">
											<input name="due_date" id="textfield" class="form-control" type="date">											
										</div>
                                    </div>
                            </div> */}

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
                                  {downloadUri}
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
                            if (fileUploadFlag) {
                              uploadImage(fileUploadData);
                            }
                            submitFinal();
                          }}
                        >
                          Save
                        </button>
                        &nbsp;
                        <button type="reset" className="btn btn-primary">
                          Cancel
                        </button>
                      </div>
                    </div>
                    <ToastContainer />
                  </div>
                  <br />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
