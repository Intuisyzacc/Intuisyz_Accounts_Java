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
import { ToastContainer, toast } from 'react-toastify';
import Headers from '../Header/Headers';

const Reciept_list = () => {
  let history = useHistory();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [transactionData, setTransactionData] = useState([]);
  const [dateSortFlag, setDateSortFlag] = useState(1);
  const [ledgerSortFlag, setLedgerSortFlag] = useState(0);
  const [modeSortFlag, setModeSortFlag] = useState(0);
  const [amountSortFlag, setAmountSortFlag] = useState(0);
  const [narrationSortFlag, setNarrationSortFlag] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadedError, setDataLoadedError] = useState(false);
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false);
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);
  const [invoiceTransactionIdData, setInvoiceTransactionIdData] = useState();

  let url = baseUrl.url;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(transactionData.length / usersPerPage);

  console.log(
    'pagesVisited',
    pagesVisited,
    '',
    'pageCount',
    pageCount,
    'pageNumber',
    pageNumber
  );

  const displayUsers = transactionData
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (val.crdt_ac.toLowerCase().includes(searchTerm.toLowerCase())) {
        //    let k = val.ledger_name;
        //    let i  = val.ac_group;
        // if(k==searchTerm)
        // {
        //   return val;
        // }

        // else if(i==searchTerm)
        // {
        //
        // }
        return val;
      }
    })
    .map((item) => {
      return (
        <tr role="row" className="odd" key={item.tranID}>
          <td className="sorting_1"> {item.tran_Date}</td>
          <td>{item.crdt_ac}</td>
          <td>{item.mode}</td>
          <td align="right">{item.amount}</td>
          <td>{item.description}</td>
          <td>
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/simple_reciept',
                  post: item,
                });
                localStorage.setItem(
                  'RecieptTransactionId',
                  item.transactionID
                );
                localStorage.setItem('RecieptLedger_id', item.createdBy);
              }}
            >
              <button className="btn">View </button>
            </a>
            &nbsp;
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/edit_receipt',
                  post: item,
                });
              }}
            >
              <button className="btn">Edit </button>
            </a>
            &nbsp;
            {item.filepath !== 'Nil' && item.filepath !== '' && (
              <a
                onClick={(e) => {
                  const response1 = axios.get(
                    url + `fileDownload?fileName=${item.filepath}`
                  );

                  console.log('response1', response1);

                  window.location.href =
                    url + `fileDownload?fileName=${item.filepath}`;

                  // window.open(
                  //   `http://intz.live:8080/fileDownload?fileName=${item.filepath}`,
                  //   '_blank'
                  // );
                }}
              >
                <button className="btn">Download</button>
              </a>
            )}
            &nbsp;
            {/* <a href="downloadfile.php?id=<?php echo $row['transactionID']; ?>">
                <button className="btn">Download</button>
              </a> */}
            <a
              onClick={(e) => {
                setInvoiceTransactionIdData(item.tran_gen);
                confirmAlert({
                  title: 'Confirm to Delete',
                  message: 'Are you sure to do this.',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: () => deleting(item.tranID, item.tran_gen),
                    },
                    {
                      label: 'No',
                      // onClick: () => alert('Click No')
                    },
                  ],
                });
              }}
            >
              <button className="btn">Delete</button>
            </a>
          </td>
        </tr>
      );
    });

  console.log('displayUsers', displayUsers);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    // console.log('selected', selected);
  };

  function deleting(tranID, InvoiceTransactionId) {
    var currentdate = new Date();

    let Amount;

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

        Amount = data[0].amount;

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
              successToast('Deleted Succesfully');
              invoiceFun(Amount, InvoiceTransactionId);

              // setTimeout(function () {
              //   dataLoading();
              // }, 3000);
              dataLoading();
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
              successToast('Deleted Succesfully');
              // setTimeout(function () {
              //   dataLoading();
              // }, 3000);
              dataLoading();
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

  function invoiceFun(journalAmount, InvoiceTransactionId) {
    let invId;
    let finalObj1 = {};
    let totalTax;

    axios
      .get(
        url + `invoiceDataByTransactionId?transactionId=${InvoiceTransactionId}`
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
        finalObj1.tds_rate = data[0].tds_rate;

        finalObj1.created_date = data[0].created_date;
        finalObj1.created_time = data[0].created_time;

        // finalObj1.status = data[0].status;

        let newAmnt =
          parseFloat(data[0].amount_received) - parseFloat(journalAmount);

        if (
          parseFloat(data[0].total_amount) +
            parseFloat(data[0].total_tax) -
            (data[0].tds_rate === '' ? parseFloat(0) : data[0].tds_rate) -
            parseFloat(newAmnt) ===
          0
        ) {
          finalObj1.status = 'paid';
        } else {
          finalObj1.status = 'pending';
        }

        finalObj1.payment_mode = data[0].payment_mode;
        finalObj1.bank_name = data[0].bank_name;
        finalObj1.payment_date = data[0].payment_date;
        finalObj1.amount_received =
          parseFloat(data[0].amount_received) - parseFloat(journalAmount);
        finalObj1.invoice_tran_id = data[0].invoice_tran_id;
        finalObj1.total_amount = data[0].total_amount;
        finalObj1.total_tax = data[0].total_tax;

        finalObj1.company_name = sessionStorage.getItem('CompanyName');
        finalObj1.cust_id = sessionStorage.getItem('CustId');

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
  }

  const submitFinal = handleSubmit((data) => {
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
      axios
        .get(
          url +
            `receipt_bn_date?start=${sDate}&end=${eDate}&CompanyName=${sessionStorage.getItem(
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

          console.log(data);
          setTransactionData(data);

          if (data.length < 1) {
            setDataLoaded(false);
          } else {
            setDataLoaded(true);
          }
          setDataLoadedError(false);
          setDataLoadedFlag(true);
        })
        .catch((err) => {
          console.log(err);
          setDataLoadedError(true);
          setDataLoadedFlag(true);
        });
    }
  });

  function sorting(field, type) {
    console.log(field, type);
    axios
      .get(
        url +
          `receipt_sorting?field=${field}&type=${type}&CompanyName=${sessionStorage.getItem(
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

        console.log(data);
        setTransactionData(data);

        if (data.length < 1) {
          setDataLoaded(false);
        } else {
          setDataLoaded(true);
        }
        setDataLoadedError(false);
        setDataLoadedFlag(true);
      })
      .catch((err) => {
        console.log(err);
        setDataLoadedError(true);
        setDataLoadedFlag(true);
      });
  }

  function dataLoading() {
    axios
      .get(url + 'transactionDate')
      .then(({ data }) => {
        console.log(data[0].tran_Date);
        // setStartDate(data[0].tran_Date);

        let k = data[0].tran_Date;
        console.log(k.split('-'));
        let i = new Date(k.split('-')[0], k.split('-')[1] - 1, k.split('-')[2]);
        console.log(i);
        setStartDate(i);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(
        url +
          `list_receipt?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        console.log(data);
        setTransactionData(data);

        if (data.length < 1) {
          setDataLoaded(false);
        } else {
          setDataLoaded(true);
        }
        setDataLoadedError(false);
        setDataLoadedFlag(true);
      })
      .catch((err) => {
        console.log(err);
        setDataLoadedError(true);
        setDataLoadedFlag(true);
      });
  }

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      dataLoading();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  return (
    <div>
      <Headers />
      {dataLoadedFlag && (
        <div className="container-fluid" id="content">
          <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
            <div className="container-fluid">
              <div className="page-header">
                <div className="pull-left">
                  <h1>View Receipt</h1>
                </div>
                <div className="pull-right"></div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="box-content">
                    <form className="form-horizontal" method="post">
                      <div className="row">
                        <div className="col-sm-5">
                          <div className="form-group" align="left">
                            <label
                              htmlFor="textfield"
                              className="control-label"
                            >
                              Start Date
                            </label>
                            <div className="col-sm-5">
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
                        </div>
                        <div className="col-sm-5">
                          <div className="form-group" align="left">
                            <label
                              htmlFor="textfield"
                              className="control-label"
                            >
                              End Date
                            </label>
                            <div className="col-sm-5">
                              <DatePicker
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
                        </div>
                        <div className="col-sm-2">
                          <input
                            type="submit"
                            name="submit"
                            className="btn btn-primary btn-lg"
                            defaultValue="Search"
                            onClick={(e) => {
                              e.preventDefault();
                              submitFinal();
                            }}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <br />
                {/*form ends here*/}
                <div className="row" style={{ paddingLeft: '22px' }}>
                  <div className="col-sm-12">
                    <div className="box box-color box-bordered">
                      <div className="box-title">
                        <h3>Receipt List</h3>
                      </div>
                      <div className="box-content nopadding" id="search_result">
                        <div
                          id="DataTables_Table_0_wrapper"
                          className="dataTables_wrapper no-footer"
                        >
                          <div
                            className="dataTables_length"
                            id="DataTables_Table_0_length"
                          >
                            <label>
                              Show{' '}
                              <select
                                name="DataTables_Table_0_length"
                                aria-controls="DataTables_Table_0"
                                className
                                onChange={(e) => {
                                  setCountPerPage(e.target.value);
                                  setPageNumber(0);
                                  //  changePage({selected:'0'})
                                }}
                              >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                              </select>{' '}
                              entries
                            </label>
                          </div>
                          <div
                            id="DataTables_Table_0_filter"
                            className="dataTables_filter"
                          >
                            <label>
                              Search:
                              <input
                                type="search"
                                className
                                placeholder
                                aria-controls="DataTables_Table_0"
                                onChange={(e) => {
                                  setSearchTerm(e.target.value);
                                }}
                              />
                            </label>
                          </div>
                          <table
                            className="table table-hover table-nomargin table-bordered dataTable no-footer"
                            id="DataTables_Table_0"
                            role="grid"
                            aria-describedby="DataTables_Table_0_info"
                            // style={{ width: '1068px' }}
                          >
                            <thead>
                              <tr role="row">
                                <th
                                  className={
                                    (dateSortFlag == 0 && 'sorting') ||
                                    (dateSortFlag == 1 && 'sorting_asc') ||
                                    (dateSortFlag == 2 && 'sorting_desc')
                                  }
                                  tabIndex={0}
                                  aria-controls="DataTables_Table_0"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Date: activate to sort column descending"
                                  style={{ width: '90px' }}
                                  aria-sort={
                                    (dateSortFlag == 0 && '') ||
                                    (dateSortFlag == 1 && ' ascending') ||
                                    (dateSortFlag == 2 && 'descending')
                                  }
                                  onClick={(e) => {
                                    if (dateSortFlag == 0) {
                                      setDateSortFlag(1);
                                      setLedgerSortFlag(0);
                                      setModeSortFlag(0);
                                      setNarrationSortFlag(0);
                                      setAmountSortFlag(0);

                                      sorting('tran_Date', 'ASC');
                                    }
                                    if (dateSortFlag == 1) {
                                      setDateSortFlag(2);
                                      sorting('tran_Date', 'DESC');
                                    }
                                    if (dateSortFlag == 2) {
                                      setDateSortFlag(1);
                                      sorting('tran_Date', 'ASC');
                                    }
                                  }}
                                >
                                  Date
                                </th>
                                <th
                                  className={
                                    (ledgerSortFlag == 0 && 'sorting') ||
                                    (ledgerSortFlag == 1 && 'sorting_asc') ||
                                    (ledgerSortFlag == 2 && 'sorting_desc')
                                  }
                                  tabIndex={0}
                                  aria-controls="DataTables_Table_0"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Ledger: activate to sort column ascending"
                                  style={{ width: '114px' }}
                                  aria-sort={
                                    (ledgerSortFlag == 0 && '') ||
                                    (ledgerSortFlag == 1 && ' ascending') ||
                                    (ledgerSortFlag == 2 && 'descending')
                                  }
                                  onClick={(e) => {
                                    if (ledgerSortFlag == 0) {
                                      setDateSortFlag(0);
                                      setLedgerSortFlag(1);
                                      setModeSortFlag(0);
                                      setNarrationSortFlag(0);
                                      setAmountSortFlag(0);

                                      sorting('dbt_ac', 'ASC');
                                    }
                                    if (ledgerSortFlag == 1) {
                                      setLedgerSortFlag(2);
                                      sorting('dbt_ac', 'DESC');
                                    }
                                    if (ledgerSortFlag == 2) {
                                      setLedgerSortFlag(1);
                                      sorting('dbt_ac', 'ASC');
                                    }
                                  }}
                                >
                                  Ledger
                                </th>
                                <th
                                  className={
                                    (modeSortFlag == 0 && 'sorting') ||
                                    (modeSortFlag == 1 && 'sorting_asc') ||
                                    (modeSortFlag == 2 && 'sorting_desc')
                                  }
                                  tabIndex={0}
                                  aria-controls="DataTables_Table_0"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Mode: activate to sort column ascending"
                                  style={{ width: '101px' }}
                                  aria-sort={
                                    (modeSortFlag == 0 && '') ||
                                    (modeSortFlag == 1 && ' ascending') ||
                                    (modeSortFlag == 2 && 'descending')
                                  }
                                  onClick={(e) => {
                                    if (modeSortFlag == 0) {
                                      setDateSortFlag(0);
                                      setLedgerSortFlag(0);
                                      setModeSortFlag(1);
                                      setNarrationSortFlag(0);
                                      setAmountSortFlag(0);

                                      sorting('mode', 'ASC');
                                    }
                                    if (modeSortFlag == 1) {
                                      setModeSortFlag(2);
                                      sorting('mode', 'DESC');
                                    }
                                    if (modeSortFlag == 2) {
                                      setModeSortFlag(1);
                                      sorting('mode', 'ASC');
                                    }
                                  }}
                                >
                                  Mode
                                </th>
                                <th
                                  className={
                                    (amountSortFlag == 0 && 'sorting') ||
                                    (amountSortFlag == 1 && 'sorting_asc') ||
                                    (amountSortFlag == 2 && 'sorting_desc')
                                  }
                                  tabIndex={0}
                                  aria-controls="DataTables_Table_0"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Amount: activate to sort column ascending"
                                  style={{ width: '127px' }}
                                  aria-sort={
                                    (amountSortFlag == 0 && '') ||
                                    (amountSortFlag == 1 && ' ascending') ||
                                    (amountSortFlag == 2 && 'descending')
                                  }
                                  onClick={(e) => {
                                    if (amountSortFlag == 0) {
                                      setDateSortFlag(0);
                                      setLedgerSortFlag(0);
                                      setModeSortFlag(0);
                                      setNarrationSortFlag(0);
                                      setAmountSortFlag(1);

                                      sorting('amount', 'ASC');
                                    }
                                    if (amountSortFlag == 1) {
                                      setAmountSortFlag(2);
                                      sorting('amount', 'DESC');
                                    }
                                    if (amountSortFlag == 2) {
                                      setAmountSortFlag(1);
                                      sorting('amount', 'ASC');
                                    }
                                  }}
                                >
                                  Amount
                                </th>
                                <th
                                  className={
                                    (narrationSortFlag == 0 && 'sorting') ||
                                    (narrationSortFlag == 1 && 'sorting_asc') ||
                                    (narrationSortFlag == 2 && 'sorting_desc')
                                  }
                                  tabIndex={0}
                                  aria-controls="DataTables_Table_0"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Narration: activate to sort column ascending"
                                  style={{ width: '145px' }}
                                  aria-sort={
                                    (narrationSortFlag == 0 && '') ||
                                    (narrationSortFlag == 1 && ' ascending') ||
                                    (narrationSortFlag == 2 && 'descending')
                                  }
                                  onClick={(e) => {
                                    if (narrationSortFlag == 0) {
                                      setDateSortFlag(0);
                                      setLedgerSortFlag(0);
                                      setModeSortFlag(0);
                                      setNarrationSortFlag(1);
                                      setAmountSortFlag(0);

                                      sorting('description', 'ASC');
                                    }
                                    if (narrationSortFlag == 1) {
                                      setNarrationSortFlag(2);
                                      sorting('description', 'DESC');
                                    }
                                    if (narrationSortFlag == 2) {
                                      setNarrationSortFlag(1);
                                      sorting('description', 'ASC');
                                    }
                                  }}
                                >
                                  Narration
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="DataTables_Table_0"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Action: activate to sort column ascending"
                                  style={{ width: '107px' }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayUsers}

                              {/* <tr className="odd">
                              <td
                                valign="top"
                                colSpan={6}
                                className="dataTables_empty"
                              >
                                No data available in table
                              </td>
                            </tr> */}
                            </tbody>
                          </table>
                          <div
                            className="dataTables_info"
                            id="DataTables_Table_0_info"
                            role="status"
                            aria-live="polite"
                          >
                            {!dataLoadedError ? (
                              !dataLoaded ? (
                                <h1>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No
                                  data fetch&nbsp;&nbsp;&nbsp;&nbsp;
                                </h1>
                              ) : (
                                <>
                                  Showing {pagesVisited * 1 + 1} to{' '}
                                  {transactionData.length - pagesVisited <
                                  parseInt(usersPerPage)
                                    ? pagesVisited +
                                      (transactionData.length - pagesVisited)
                                    : pagesVisited * 1 +
                                      parseInt(usersPerPage)}{' '}
                                  of {transactionData.length} entries
                                </>
                              )
                            ) : (
                              <h1>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error
                                on data fetch&nbsp;&nbsp;&nbsp;&nbsp;
                              </h1>
                            )}
                          </div>
                          {dataLoaded && (
                            <div
                              className="dataTables_paginate paging_simple_numbers"
                              id="DataTables_Table_0_paginate"
                            >
                              <ReactPaginate
                                previousLabel={' Previous'}
                                nextLabel={'Next'}
                                pageCount={pageCount}
                                onPageChange={changePage}
                                containerClassName={'paginationBttns'}
                                previousLinkClassName={
                                  'paginate_button previous disabled'
                                }
                                nextLinkClassName={
                                  'paginate_button next disabled'
                                }
                                activeClassName={'paginationActive'}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reciept_list;
