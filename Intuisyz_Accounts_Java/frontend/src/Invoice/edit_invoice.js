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

// import { AiFillDelete } from 'react-icons/AiFillDelete';
// import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

const Edit_invoice = () => {
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
  const [refreshBtn, setRefreshBtn] = useState(false);
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
  const [invIdData, setInvIdData] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [invoiceLoaded, setInvoiceLoaded] = useState(false);
  const [customerName, setCustomerName] = useState();
  const [serviceName, setServiceName] = useState();
  const [serviceNameLoaded, setServiceNameLoaded] = useState(false);
  const [customerNameLoaded, setCustomerNameLoaded] = useState(false);

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

      finalObj1.inv_id = invIdData;
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
      finalObj1.swift_code = data.SwiftCode;
      finalObj1.ifsc = data.IFSC;

      if (localStorage.getItem('invoicePageStatus') === '') {
        if (invoiceData[0].total_amount === totalAmountCalculated) {
          if (
            parseFloat(invoiceData[0].total_amount) +
              parseFloat(invoiceData[0].total_tax) -
              (invoiceData[0].tds_rate === ''
                ? parseFloat(0)
                : invoiceData[0].tds_rate) -
              parseFloat(invoiceData[0].amount_received) ===
            0
          ) {
            finalObj1.status = 'paid';
          } else {
            finalObj1.status = 'pending';
          }
        } else {
          finalObj1.status = 'pending';
        }
      } else {
        if (
          invoiceData[0].total_amount ===
          localStorage.getItem('SubTotalAmountData')
        ) {
          if (
            parseFloat(invoiceData[0].total_amount) +
              parseFloat(invoiceData[0].total_tax) -
              (invoiceData[0].tds_rate === ''
                ? parseFloat(0)
                : invoiceData[0].tds_rate) -
              parseFloat(invoiceData[0].amount_received) ===
            0
          ) {
            finalObj1.status = 'paid';
          } else {
            finalObj1.status = 'pending';
          }
        } else {
          finalObj1.status = 'pending';
        }
      }

      finalObj1.payment_mode = invoiceData[0].payment_mode;
      finalObj1.bank_name = invoiceData[0].bank_name;
      finalObj1.payment_date = invoiceData[0].payment_date;
      finalObj1.amount_received = invoiceData[0].amount_received;
      finalObj1.invoice_tran_id = invoiceData[0].invoice_tran_id;

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
      console.log('invIdData', invIdData);

      console.log(
        'finalObj1.tds_rate ',
        finalObj1.tds_rate,
        '  ',
        invoiceData[0].tds_rate
      );

      ////////////////Journal section calling////////////
      editJournal(
        invoiceData[0].invoice_tran_id,
        invoiceData[0].service,
        invoiceData[0].cust_name,
        finalObj1.total_amount
      );

      if (
        (finalObj1.place_of_supply === 'InterState' ||
          finalObj1.place_of_supply === 'IntraState') &&
        finalObj1.total_tax !== invoiceData[0].total_tax
      ) {
        console.log('GST updated');
        // setTimeout(function () {
        //   console.log('GST inserted');

        editJournal1(
          invoiceData[0].invoice_tran_id,
          sessionStorage.getItem('gstIdVal'),
          invoiceData[0].cust_name,
          finalObj1.total_tax
        );
        // }, 2000);
      }

      if (
        finalObj1.tds_rate !== '' ||
        finalObj1.tds_rate !== invoiceData[0].tds_rate
      ) {
        console.log('TDS updated');
        // setTimeout(function () {
        //   console.log('TDS inserted');
        editJournal2(
          invoiceData[0].invoice_tran_id,
          invoiceData[0].cust_name,
          sessionStorage.getItem('tdsIdVal'),
          finalObj1.tds_rate
        );
        // }, 3000);
      }

      finalObj1.company_name = sessionStorage.getItem('CompanyName');
      finalObj1.cust_id = sessionStorage.getItem('CustId');

      axios
        .put(url + `invoice_update/${invIdData}`, finalObj1)
        .then(() => {
          reset();

          axios

            .get(url + `invoiceSubDelete/${invIdData}`)
            .then(({ data }) => {
              console.log(data);

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
                  finalObj2.inv_id = invIdData;
                  finalObj2.qty = inputList[i].qty;
                  finalObj2.remarks = inputList[i].remarks;
                  finalObj2.tax = taxSelected;

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

              successToast('Invoice updated  Succesfully');

              setTimeout(function () {
                history.push({
                  pathname: '/dashboard_invoice',
                });
              }, 3000);
            })
            .catch((err) => {
              console.log(err);
            });

          //   axios
          //     .get(url + 'invoiceData')
          //     .then(({ data }) => {
          //       console.log('invoice data', data);
          //       console.log('invoice last data id', data[data.length - 1].inv_id);

          //       let newInvId = data[data.length - 1].inv_id;

          //       console.log('inputList data', inputList);

          //       for (let i = 0; i < inputList.length; i++) {
          //         let finalObj2 = {};

          //         if (
          //           inputList[i].amount === '' &&
          //           inputList[i].description === '' &&
          //           inputList[i].hsn === '' &&
          //           inputList[i].qty === '' &&
          //           inputList[i].remarks === '' &&
          //           inputList[i].tax === ''
          //         ) {
          //           continue;
          //         } else {
          //           finalObj2.amount = inputList[i].amount;
          //           finalObj2.created_date = cDate;
          //           finalObj2.created_time = cTime;
          //           finalObj2.description = inputList[i].description;
          //           finalObj2.hsn = inputList[i].hsn;
          //           finalObj2.inv_id = newInvId;
          //           finalObj2.qty = inputList[i].qty;
          //           finalObj2.remarks = inputList[i].remarks;
          //           finalObj2.tax = inputList[i].tax;

          //           axios
          //             .post(url + 'add_invoice_sub', finalObj2)
          //             .then(() => {
          //               console.log(i, ' th row ', finalObj2);
          //             })
          //             .catch((err) => {
          //               console.log(err);
          //             });
          //         }
          //       }
          //       localStorage.setItem('finalObj1', JSON.stringify('{}'));

          //       localStorage.setItem(
          //         'finalObj2',
          //         JSON.stringify([
          //           {
          //             description: '',
          //             hsn: '',
          //             qty: '',
          //             amount: '',
          //             tax: '',
          //             remarks: '',
          //           },
          //         ])
          //       );
          //       localStorage.setItem('TotalAmountData', '');
          //       localStorage.setItem('invoicePageStatus', '');
          //       localStorage.setItem('SubTotalAmountData', '');

          //       setTimeout(function () {
          //         history.push({
          //           pathname: '/dashboard_invoice',
          //         });
          //       }, 3000);
          //     })
          //     .catch((err) => {
          //       console.log(err);
          //     });
        })
        .catch((err) => {
          console.log(err);
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

      finalObj1.inv_id = invIdData;
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
      finalObj1.swift_code = data.SwiftCode;
      finalObj1.ifsc = data.IFSC;

      if (localStorage.getItem('invoicePageStatus') === '') {
        if (invoiceData[0].total_amount === totalAmountCalculated) {
          if (
            parseFloat(invoiceData[0].total_amount) +
              parseFloat(invoiceData[0].total_tax) -
              (invoiceData[0].tds_rate === ''
                ? parseFloat(0)
                : invoiceData[0].tds_rate) -
              parseFloat(invoiceData[0].amount_received) ===
            0
          ) {
            finalObj1.status = 'paid';
          } else {
            finalObj1.status = 'pending';
          }
        } else {
          finalObj1.status = 'pending';
        }
      } else {
        if (
          invoiceData[0].total_amount ===
          localStorage.getItem('SubTotalAmountData')
        ) {
          if (
            parseFloat(invoiceData[0].total_amount) +
              parseFloat(invoiceData[0].total_tax) -
              (invoiceData[0].tds_rate === ''
                ? parseFloat(0)
                : invoiceData[0].tds_rate) -
              parseFloat(invoiceData[0].amount_received) ===
            0
          ) {
            finalObj1.status = 'paid';
          } else {
            finalObj1.status = 'pending';
          }
        } else {
          finalObj1.status = 'pending';
        }
      }

      finalObj1.payment_mode = invoiceData[0].payment_mode;
      finalObj1.bank_name = invoiceData[0].bank_name;
      finalObj1.payment_date = invoiceData[0].payment_date;
      finalObj1.amount_received = invoiceData[0].amount_received;
      finalObj1.invoice_tran_id = invoiceData[0].invoice_tran_id;

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
      console.log('invIdData', invIdData);

      console.log(
        'finalObj1.tds_rate ',
        finalObj1.tds_rate,
        '  ',
        invoiceData[0].tds_rate
      );

      ////////////////Journal section calling////////////
      editJournal(
        invoiceData[0].invoice_tran_id,
        invoiceData[0].service,
        invoiceData[0].cust_name,
        finalObj1.total_amount
      );

      if (
        (finalObj1.place_of_supply === 'InterState' ||
          finalObj1.place_of_supply === 'IntraState') &&
        finalObj1.total_tax !== invoiceData[0].total_tax
      ) {
        console.log('GST updated');
        // setTimeout(function () {
        //   console.log('GST inserted');

        editJournal1(
          invoiceData[0].invoice_tran_id,
          sessionStorage.getItem('gstIdVal'),
          invoiceData[0].cust_name,
          finalObj1.total_tax
        );
        // }, 2000);
      }

      if (
        finalObj1.tds_rate !== '' ||
        finalObj1.tds_rate !== invoiceData[0].tds_rate
      ) {
        console.log('TDS updated');
        // setTimeout(function () {
        //   console.log('TDS inserted');
        editJournal2(
          invoiceData[0].invoice_tran_id,
          invoiceData[0].cust_name,
          sessionStorage.getItem('tdsIdVal'),
          finalObj1.tds_rate
        );
        // }, 3000);
      }

      finalObj1.company_name = sessionStorage.getItem('CompanyName');
      finalObj1.cust_id = sessionStorage.getItem('CustId');

      axios
        .put(url + `invoice_update/${invIdData}`, finalObj1)
        .then(() => {
          reset();

          axios

            .get(url + `invoiceSubDelete/${invIdData}`)
            .then(({ data }) => {
              console.log(data);

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
                  finalObj2.inv_id = invIdData;
                  finalObj2.qty = inputList[i].qty;
                  finalObj2.remarks = inputList[i].remarks;
                  finalObj2.tax = taxSelected;

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
                          .post(url + 'sendingEmailUpdate', finalObj1)
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

              successToast('Invoice updated  Succesfully');

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

          //   axios
          //     .get(url + 'invoiceData')
          //     .then(({ data }) => {
          //       console.log('invoice data', data);
          //       console.log('invoice last data id', data[data.length - 1].inv_id);

          //       let newInvId = data[data.length - 1].inv_id;

          //       console.log('inputList data', inputList);

          //       for (let i = 0; i < inputList.length; i++) {
          //         let finalObj2 = {};

          //         if (
          //           inputList[i].amount === '' &&
          //           inputList[i].description === '' &&
          //           inputList[i].hsn === '' &&
          //           inputList[i].qty === '' &&
          //           inputList[i].remarks === '' &&
          //           inputList[i].tax === ''
          //         ) {
          //           continue;
          //         } else {
          //           finalObj2.amount = inputList[i].amount;
          //           finalObj2.created_date = cDate;
          //           finalObj2.created_time = cTime;
          //           finalObj2.description = inputList[i].description;
          //           finalObj2.hsn = inputList[i].hsn;
          //           finalObj2.inv_id = newInvId;
          //           finalObj2.qty = inputList[i].qty;
          //           finalObj2.remarks = inputList[i].remarks;
          //           finalObj2.tax = inputList[i].tax;

          //           axios
          //             .post(url + 'add_invoice_sub', finalObj2)
          //             .then(() => {
          //               console.log(i, ' th row ', finalObj2);
          //             })
          //             .catch((err) => {
          //               console.log(err);
          //             });
          //         }
          //       }
          //       localStorage.setItem('finalObj1', JSON.stringify('{}'));

          //       localStorage.setItem(
          //         'finalObj2',
          //         JSON.stringify([
          //           {
          //             description: '',
          //             hsn: '',
          //             qty: '',
          //             amount: '',
          //             tax: '',
          //             remarks: '',
          //           },
          //         ])
          //       );
          //       localStorage.setItem('TotalAmountData', '');
          //       localStorage.setItem('invoicePageStatus', '');
          //       localStorage.setItem('SubTotalAmountData', '');

          //       setTimeout(function () {
          //         history.push({
          //           pathname: '/dashboard_invoice',
          //         });
          //       }, 3000);
          //     })
          //     .catch((err) => {
          //       console.log(err);
          //     });
        })
        .catch((err) => {
          console.log(err);
        });

      //   { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
    }
  });

  let tranId;

  function editJournal(invoiceTranId, creditAc, debitAc, Amount) {
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

        console.log('FinalObj1', finalObj1);
        update(finalObj1);
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

        console.log('FinalObj1', finalObj1);
        update(finalObj1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function editJournal2(invoiceTranId, creditAc, debitAc, Amount) {
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

        console.log('FinalObj1', finalObj1);
        update(finalObj1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function update(finalObj1) {
    finalObj1.company_name = sessionStorage.getItem('CompanyName');
    finalObj1.cust_id = sessionStorage.getItem('CustId');

    axios
      .put(url + `journal_update/${tranId}`, finalObj1)
      .then(() => {
        // successToast('Journal Updated Successfully');
        // reset();
        // setTimeout(function () {
        //   history.push({
        //     pathname: '/view_journal',
        //   });
        // }, 2000);
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

  // const previewFinal = handleSubmit((data) => {
  //   var currentdate = new Date();
  //   console.log('upload data', data.upload);
  //   if (currentdate.getDate() < 10) {
  //     var currentDay = '0' + currentdate.getDate();
  //   } else {
  //     var currentDay = currentdate.getDate();
  //   }

  //   if (currentdate.getMonth() + 1 < 10) {
  //     var currentMonth = '0' + (currentdate.getMonth() + 1);
  //   } else {
  //     var currentMonth = currentdate.getMonth() + 1;
  //   }

  //   var cDate =
  //     currentdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

  //   if (currentdate.getHours() < 10) {
  //     var currentHour = '0' + currentdate.getHours();
  //   } else {
  //     var currentHour = currentdate.getHours();
  //   }

  //   if (currentdate.getMinutes() < 10) {
  //     var currentMinutes = '0' + currentdate.getMinutes();
  //   } else {
  //     var currentMinutes = currentdate.getMinutes();
  //   }

  //   if (currentdate.getSeconds() < 10) {
  //     var currentSeconds = '0' + currentdate.getSeconds();
  //   } else {
  //     var currentSeconds = currentdate.getSeconds();
  //   }

  //   var cTime = currentHour + ':' + currentMinutes + ':' + currentSeconds;

  //   console.log('date', cTime, cDate);

  //   console.log('endDate', endDate);
  //   console.log('chequeDate', chequeDate);

  //   ////////mode checking////////

  //   if (endDate === null || endDate === undefined) {
  //     setInvoiceDateValidation(true);
  //   } else {
  //     setInvoiceDateValidation(false);

  //     /////////invoice date calculation////////////

  //     if (endDate.getDate() < 10) {
  //       var currentDay = '0' + endDate.getDate();
  //     } else {
  //       var currentDay = endDate.getDate();
  //     }

  //     if (endDate.getMonth() + 1 < 10) {
  //       var currentMonth = '0' + (endDate.getMonth() + 1);
  //     } else {
  //       var currentMonth = endDate.getMonth() + 1;
  //     }

  //     var eDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

  //     let finalObj1 = {};

  //     finalObj1.inv_date = eDate;
  //     finalObj1.inv_no = data.invoiceNo;
  //     finalObj1.cust_name = data.customer;
  //     finalObj1.service = data.service;
  //     finalObj1.place_of_supply = data.placeOfSupply;
  //     finalObj1.bill_address = data.address;
  //     finalObj1.gst_no = data.gstNo;
  //     finalObj1.tds_rate = data.tdsRate;
  //     finalObj1.created_date = cDate;
  //     finalObj1.created_time = cTime;
  //     finalObj1.status = 'pending';

  //     if (localStorage.getItem('invoicePageStatus') === '') {
  //       finalObj1.total_amount = totalAmountCalculated;
  //     } else {
  //       finalObj1.total_amount = localStorage.getItem('SubTotalAmountData');
  //     }

  //     if (localStorage.getItem('invoicePageStatus') === '') {
  //       finalObj1.total_tax = (totalAmountCalculated * taxSelected) / 100;
  //     } else {
  //       finalObj1.total_tax =
  //         (localStorage.getItem('SubTotalAmountData') * taxSelected) / 100;
  //     }

  //     console.log('FinalObj1', finalObj1);

  //     localStorage.setItem('finalObj1', JSON.stringify(finalObj1));

  //     console.log('inputList data', inputList);

  //     let finalObj2 = {};
  //     for (let i = 0; i < inputList.length; i++) {
  //       if (
  //         inputList[i].amount === '' &&
  //         inputList[i].description === '' &&
  //         inputList[i].hsn === '' &&
  //         inputList[i].qty === '' &&
  //         inputList[i].remarks === '' &&
  //         inputList[i].tax === ''
  //       ) {
  //         continue;
  //       } else {
  //         finalObj2.amount = inputList[i].amount;
  //         finalObj2.created_date = cDate;
  //         finalObj2.created_time = cTime;
  //         finalObj2.description = inputList[i].description;
  //         finalObj2.hsn = inputList[i].hsn;

  //         finalObj2.qty = inputList[i].qty;
  //         finalObj2.remarks = inputList[i].remarks;
  //         finalObj2.tax = inputList[i].tax;
  //       }
  //     }

  //     localStorage.setItem('finalObj2', JSON.stringify(inputList));

  //     let t = 0;
  //     for (let i = 0; i < inputList.length; i++) {
  //       if (inputList[i].amount !== '') {
  //         t = t + parseFloat(inputList[i].amount);
  //       }
  //     }

  //     localStorage.setItem('TotalAmountData', t + (t * taxSelected) / 100);
  //     localStorage.setItem('SubTotalAmountData', t);

  //     history.push({
  //       pathname: '/preview_invoice',
  //     });

  //     //   { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
  //   }
  // });

  // function decreaseAmount(ledgerID, ledgeramount, created_date, time, userID) {
  //   let currentAmount, updatedAmount;
  //   axios
  //     .get(url + `ledger_search?ledgerId=${ledgerID}`)
  //     .then(({ data }) => {
  //       console.log(data);
  //       currentAmount = data[0].amount;
  //       if (currentAmount === '') {
  //         currentAmount = 0;
  //       }
  //       updatedAmount = parseFloat(currentAmount) - parseFloat(ledgeramount);
  //       console.log('decrease function updatedAmount', updatedAmount);

  //       let finalObj4 = {};

  //       // data for account_ledger_v3 table
  //       finalObj4.id = ledgerID;
  //       finalObj4.ledger_name = data[0].ledger_name;

  //       finalObj4.ac_group = data[0].ac_group;
  //       finalObj4.name = data[0].name;
  //       finalObj4.address = data[0].address;
  //       finalObj4.state = data[0].state;
  //       finalObj4.pin = data[0].pin;
  //       finalObj4.contact = data[0].contact;
  //       finalObj4.mobile = data[0].mobile;
  //       finalObj4.fax = data[0].fax;
  //       finalObj4.email = data[0].email;
  //       finalObj4.acc_number = data[0].acc_number;
  //       finalObj4.bank = data[0].bank;
  //       finalObj4.branch = data[0].branch;
  //       finalObj4.ifsc_code = data[0].ifsc_code;
  //       finalObj4.open_balance = data[0].open_balance;
  //       finalObj4.amount = updatedAmount;
  //       //account id
  //       finalObj4.created_date = created_date;
  //       finalObj4.time = time;
  //       //userId
  //       finalObj4.balance_type = data[0].balance_type;
  //       axios
  //         .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
  //         .then(({ data }) => {
  //           console.log('grpId', data);

  //           // setFlag(data);
  //           finalObj4.ac_type = data[0].ac_type;
  //           finalObj4.ac_title = data[0].ac_title;

  //           axios
  //             .put(url + `ledger_update/${finalObj4.id}`, finalObj4)
  //             .then(() => {
  //               console.log('decreaseAmount Updated Successfully');
  //               // reset();
  //               // setTimeout(function () {
  //               //   history.push({
  //               //     pathname: '/view_journal',
  //               //   });
  //               // }, 1000);
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });

  //           console.log('decreaseAmount finalObj4', finalObj4);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

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

  const ledgerLoadingOnClick = () => {
    document.getElementById('ledger1').selectedIndex = '';
    axios
      // .get('http://localhost:8080/list_ledger')
      .get(url + 'list_ledger')
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

  let invId;

  useEffect(() => {
    // ledgerLoading();
    // bankNameLoading();
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        history.push({
          pathname: '/dashboard_invoice',
        });
      } else {
        console.log('location.post.inv_id', location.post.inv_id);
        invId = location.post.inv_id;
        setInvIdData(invId);

        axios
          .get(url + `invoiceDataById?invoiceId=${invId}`)
          .then(({ data }) => {
            console.log('invoice data', data);
            setInvoiceData(data);

            let k = data[0].inv_date;
            console.log(k.split('-'));
            let i = new Date(
              k.split('-')[0],
              k.split('-')[1] - 1,
              k.split('-')[2]
            );

            setEndDate(i);
            setTotalAmountCalculated(data[0].total_amount);
            setPlaceOfSupplySelected(data[0].place_of_supply);

            setInvoiceLoaded(true);

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
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(url + `invoiceSubDataById?invoiceId=${invId}`)
          .then(({ data }) => {
            console.log('invoice sub data', data);

            setInputList(data);

            setTaxSelected(data[0].tax);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      // let Obj1 = localStorage.getItem('finalObj1');

      // setPreviewInvoiceValue1(JSON.parse(Obj1));

      // if (localStorage.getItem('invoicePageStatus') !== '') {
      //   setTaxSelected(JSON.parse(localStorage.getItem('finalObj2'))[0].tax);

      //   setInputList(JSON.parse(localStorage.getItem('finalObj2')));

      //   setPlaceOfSupplySelected(
      //     JSON.parse(localStorage.getItem('finalObj1')).place_of_supply
      //   );
      // }
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

  return (
    <div>
      <Headers />
      {invoiceLoaded && (
        <div className="container-fluid" id="content">
          <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
            <form>
              <div className="container-fluid">
                <div className="page-header">
                  <div style={{ display: 'inline' }} className="pull-left">
                    <h1>Edit Invoice</h1>
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
                      <form
                        className="form-horizontal"
                        name="payments"
                        method="post"
                        onsubmit="return paymentval()"
                        encType="multipart/form-data"
                      >
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
                                  <div>
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
                                      invoiceData[0].place_of_supply
                                    }
                                    name="placeOfSupply"
                                    id="placeOfSupply"
                                    className="form-control"
                                    {...register('placeOfSupply')}
                                    onChange={(e) => {
                                      if (e.target.value === 'InterState') {
                                        setPlaceOfSupplySelected(
                                          e.target.value
                                        );
                                      } else if (
                                        e.target.value === 'IntraState'
                                      ) {
                                        setPlaceOfSupplySelected(
                                          e.target.value
                                        );
                                      } else if (e.target.value === 'Export') {
                                        setPlaceOfSupplySelected(
                                          e.target.value
                                        );
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
                            {customerNameLoaded && (
                              <div className="col-sm-6 pull-left">
                                <div className="form-group">
                                  <label
                                    htmlFor="textfield"
                                    className="control-label col-sm-3"
                                  >
                                    Customer
                                  </label>
                                  <div
                                    style={{ paddingRight: 175 }}
                                    id="ledger_list"
                                  >
                                    <select
                                      defaultValue={invoiceData[0].cust_name}
                                      name="customer"
                                      id="customer"
                                      {...register('customer', {
                                        required: true,
                                      })}
                                      className="cl"
                                    >
                                      {customerName.map((item) => {
                                        return (
                                          <option key={item.id} value={item.id}>
                                            {item.ledger_name}
                                          </option>
                                        );
                                      })}
                                    </select>

                                    {/* <a className="cl1">Add</a> */}
                                    <Link
                                      className="cl1"
                                      to="/add_ledger"
                                      // target="_blank"
                                    >
                                      Add
                                    </Link>

                                    <div
                                      style={{ color: 'red', paddingLeft: 120 }}
                                    >
                                      {errors.customer && (
                                        <p>Please select customer name</p>
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
                                  onClick={ledgerLoadingOnClick}
                                  className={refreshBtn ? 'fa-spin' : null}
                                >
                                  <i
                                    id="refreshbtn"
                                    className="fa fa-refresh"
                                    aria-hidden="true"
                                  />
                                </button> */}
                                  </div>
                                </div>
                              </div>
                            )}

                            {serviceNameLoaded && (
                              <div className="col-sm-6 pull-left">
                                <div className="form-group">
                                  <label
                                    htmlFor="textfield"
                                    className="control-label col-sm-3"
                                  >
                                    Service
                                  </label>
                                  <div style={{ paddingRight: 175 }}>
                                    <select
                                      defaultValue={invoiceData[0].service}
                                      name="service"
                                      className="cl"
                                      id="service"
                                      {...register('service', {
                                        required: true,
                                      })}
                                      // onChange={(e) => {}}
                                    >
                                      {serviceName.map((item) => {
                                        return (
                                          <option key={item.id} value={item.id}>
                                            {item.ledger_name}
                                          </option>
                                        );
                                      })}
                                    </select>

                                    <Link
                                      className="cl1"
                                      to="/add_ledger"
                                      // target="_blank"
                                    >
                                      Add
                                    </Link>

                                    <div
                                      style={{ color: 'red', paddingLeft: 120 }}
                                    >
                                      {errors.service && (
                                        <p>Please select service </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

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

                                    defaultValue={invoiceData[0].inv_no}
                                    type="text"
                                    name="invoiceNo"
                                    id="invoiceNo"
                                    className="form-control"
                                    {...register('invoiceNo', {
                                      required: true,
                                    })}
                                  />
                                  <div style={{ color: 'red' }}>
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
                                    defaultValue={invoiceData[0].bill_address}
                                    className="control-label col-sm-12"
                                    name="address"
                                    id="address"
                                    {...register('address', {
                                      required: true,
                                    })}
                                  />
                                  <div style={{ color: 'red' }}>
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
                                    defaultValue={invoiceData[0].gst_no}
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

                                    defaultValue={invoiceData[0].tds_rate}
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
                                    defaultValue={invoiceData[0].swift_code}
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

                                    defaultValue={invoiceData[0].ifsc}
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

                        <div style={{ paddingTop: 60 }}>
                          <table className="invoice-table">
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
                                        inputList.length - i !== 1
                                          ? true
                                          : false
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
                            paddingTop: 30,
                            textAlign: 'left',
                          }}
                        >
                          <input
                            type="button"
                            value="Add Row"
                            onClick={handleAddClick}
                            className="button-style"
                          />
                          {/* &nbsp; &nbsp; &nbsp;
                        <input
                          type="button"
                          value="Clear Data"
                          onClick={clearData}
                          className="button-style"
                        /> */}
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
                            {totalAmountCalculated}
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
                                  {((totalAmountCalculated / 2) * taxSelected) /
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
                                  {((totalAmountCalculated / 2) * taxSelected) /
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
                                  {(totalAmountCalculated * taxSelected) / 100}
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
                            {parseFloat(totalAmountCalculated) +
                              parseFloat(
                                (totalAmountCalculated * taxSelected) / 100
                              )}
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
                          <p>
                            <div style={{ padding: 10 }}>
                              <tr>
                                <td>
                                  <button
                                    style={{
                                      backgroundColor: 'green',
                                      width: 100,
                                    }}
                                    onClick={(e) => {
                                      //   localStorage.setItem(
                                      //     'finalObj1',
                                      //     JSON.stringify('{}')
                                      //   );

                                      //   localStorage.setItem(
                                      //     'finalObj2',
                                      //     JSON.stringify([
                                      //       {
                                      //         description: '',
                                      //         hsn: '',
                                      //         qty: '',
                                      //         amount: '',
                                      //         tax: '',
                                      //         remarks: '',
                                      //       },
                                      //     ])
                                      //   );
                                      //   localStorage.setItem(
                                      //     'TotalAmountData',
                                      //     ''
                                      //   );
                                      //   localStorage.setItem(
                                      //     'invoicePageStatus',
                                      //     ''
                                      //   );
                                      //   localStorage.setItem(
                                      //     'SubTotalAmountData',
                                      //     ''
                                      //   );

                                      history.push({
                                        pathname: '/dashboard_invoice',
                                      });
                                    }}
                                  >
                                    Cancel{' '}
                                  </button>
                                </td>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                                &nbsp;&nbsp;
                                <td>
                                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                  &nbsp;
                                  <button
                                    type="submit"
                                    name="submit"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      submitFinal();
                                    }}
                                    style={{
                                      backgroundColor: 'green',
                                      width: 100,
                                    }}
                                  >
                                    Update{' '}
                                  </button>
                                  {/* <button
                                    type="submit"
                                    style={{
                                      backgroundColor: 'green',
                                      width: 100,
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      previewFinal();
                                      // history.push({
                                      //   pathname: '/preview_invoice',
                                      // });
                                    }}
                                  >
                                    Preview
                                  </button> */}
                                  &nbsp;
                                  <a
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
                                    Update & Send Mail
                                  </a>
                                </td>
                              </tr>
                            </div>
                          </p>
                        </footer>

                        <div>
                          <div
                            className="modal fade"
                            id="modalContactForm"
                            tabIndex={-1}
                            role="dialog"
                            aria-labelledby="myModalLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-header text-center">
                                  <h4 className="modal-title w-100 font-weight-bold">
                                    Invoice Mail
                                  </h4>
                                  <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
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
                            </div>
                          </div>
                          {/* <div className="text-center">
                          <a
                            href
                            className="btn btn-default btn-rounded mb-4"
                            data-toggle="modal"
                            data-target="#modalContactForm"
                          >
                            Launch Modal Contact Form
                          </a>
                        </div> */}
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
      )}
    </div>
  );
};

export default Edit_invoice;
