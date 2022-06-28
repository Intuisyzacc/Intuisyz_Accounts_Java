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
import invoiceHeaderImg from '../Image/invoice_header.jpg';
import invoiceFooterImg from '../Image/invoice_footer.jpg';
import Headers from '../Header/Headers';

const Preview_invoice = () => {
  let location = useLocation();
  let history = useHistory();
  let url = baseUrl.url;

  const [endDate, setEndDate] = useState(new Date());
  // const [uuidValue, setUuidValue] = useState();
  const [templateData, setTemplateData] = useState();
  const [templateDataLoaded, setTemplateDataLoaded] = useState(false);
  const [image, setImage] = useState();
  const [logo, setLogo] = useState();

  const [logoImageLoaded, setLogoImageLoaded] = useState(false);
  const [signImageLoaded, setSignImageLoaded] = useState(false);

  const [printClicked, setPrintClicked] = useState(false);

  const [profileData, setProfileData] = useState();
  const [profileDataLoaded, setProfileDataLoaded] = useState(false);
  const [profileDataEmpty, setProfileDataEmpty] = useState(false);

  let uuidValue;

  let Obj1 = localStorage.getItem('finalObj1');
  let Obj2 = localStorage.getItem('finalObj2');

  const finalObj1 = JSON.parse(Obj1);
  const finalObj2 = JSON.parse(Obj2);
  const inputList = JSON.parse(Obj2);

  localStorage.setItem('invoicePageStatus', location.pathname);

  console.log('preview page finalObj1', finalObj1);

  // setUuidValue(finalObj1.invoice_tran_id);
  uuidValue = finalObj1.invoice_tran_id;

  console.log('preview page finalObj2', finalObj2);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });
  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      axios
        .get(
          url +
            `templateData?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
        .then(({ data }) => {
          console.log('template data', data);
          setTemplateData(data);

          setImage(data[0].template_sig);
          setLogo(data[0].template_logo);
          setTemplateDataLoaded(true);

          let logoName = data[0].template_logo;
          let signName = data[0].template_sig;

          axios
            .get(url + `invoiceImgFetch?fileName=${data[0].template_logo}`)
            .then(({ data }) => {
              console.log('img fetch data', data);
              setLogoImageLoaded(true);
              // import('../Image/' + data[0].template_sig).then(setImage);

              // var reader = new FileReader();
              // // it's onload event and you forgot (parameters)
              // reader.onload = function (e) {
              //   var image = document.getElementById('testImg');
              //   // the result image data
              //   image.src = e.target.result;
              //   // document.body.appendChild(image);
              // };
              // // you have to declare the file loading
              // reader.readAsDataURL(data);

              // window.location.href = url + `invoiceImgFetch?fileName=${l}`;

              var image = document.getElementById('logoImg');
              // the result image data
              image.src = url + `invoiceImgFetch?fileName=${logoName}`;

              var image2 = document.getElementById('logoImg2');
              // the result image data
              image2.src = url + `invoiceImgFetch?fileName=${logoName}`;
            })
            .catch((err) => {
              console.log(err);
            });

          axios
            .get(url + `invoiceImgFetch?fileName=${data[0].template_sig}`)
            .then(({ data }) => {
              console.log('img fetch data', data);
              setSignImageLoaded(true);

              // window.location.href = url + `invoiceImgFetch?fileName=${l}`;

              var image = document.getElementById('signImg');
              // the result image data
              image.src = url + `invoiceImgFetch?fileName=${signName}`;

              var image2 = document.getElementById('signImg2');
              // the result image data
              image2.src = url + `invoiceImgFetch?fileName=${signName}`;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(
          url +
            `profileData?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
        .then(({ data }) => {
          console.log('profile data', data);
          setProfileData(data);

          if (data.length > 0) {
            setProfileDataEmpty(false);
            setProfileDataLoaded(true);
          } else {
            setProfileDataEmpty(true);
            setProfileDataLoaded(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  const submitFinal = handleSubmit((data) => {
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

    setEndDate(finalObj1.created_date);

    finalObj1.company_name = sessionStorage.getItem('CompanyName');
    finalObj1.cust_id = sessionStorage.getItem('CustId');

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

            for (let i = 0; i < inputList.length; i++) {
              let finalObj = {};

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
                finalObj.amount = inputList[i].amount;
                finalObj.created_date = cDate;
                finalObj.created_time = cTime;
                finalObj.description = inputList[i].description;
                finalObj.hsn = inputList[i].hsn;
                finalObj.inv_id = newInvId;
                finalObj.qty = inputList[i].qty;
                finalObj.remarks = inputList[i].remarks;
                finalObj.tax = inputList[i].tax;

                axios
                  .post(url + 'add_invoice_sub', finalObj)
                  .then(() => {
                    console.log(i, ' th row ', finalObj);

                    finalObj1.to = '';
                    finalObj1.from = 'intuisyz2021acc@gmail.com';
                    // finalObj1.from = 'invoice@intreact.tk';
                    finalObj1.subject = '';
                    finalObj1.name = '';

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
                      finalObj1.totalTaxAmnt = parseFloat(finalObj1.total_tax);
                    }

                    if (finalObj1.place_of_supply === 'IntraState') {
                      finalObj1.totalTaxAmnt =
                        parseFloat(finalObj1.total_tax) / 2;
                    }

                    finalObj1.totalAmnt =
                      parseFloat(finalObj1.total_amount) +
                      parseFloat(finalObj1.total_tax);

                    let filename = 'invoice.pdf';

                    setTimeout(function () {
                      axios
                        .get(
                          url +
                            `invoicePdfDownloadDashboard?inv_id=${newInvId}&invDate=${
                              finalObj1.inv_date
                            }&invNo=${finalObj1.inv_no}&gstNo=${
                              finalObj1.gst_no
                            }&billAddress=${
                              finalObj1.bill_address
                            }&place_of_supply=${
                              finalObj1.place_of_supply
                            }&igstAmnt=${finalObj1.igstAmnt}&cgstAmnt=${
                              finalObj1.cgstAmnt
                            }&sgstAmnt=${finalObj1.sgstAmnt}&totalTaxAmnt=${
                              finalObj1.totalTaxAmnt
                            }&totalAmnt=${finalObj1.totalAmnt}&hsn=${
                              finalObj.hsn
                            }&CompanyName=${sessionStorage.getItem(
                              'CompanyName'
                            )}&CustId=${sessionStorage.getItem(
                              'CustId'
                            )}&ifsc=${finalObj1.ifsc}&swift_code=${
                              finalObj1.swift_code
                            }&gstId=${profileData[0].gst_id}`
                        )
                        .then((data) => {
                          console.log(`Invoice download data`, data);

                          // window.location.href = data;
                          window.location.href =
                            url +
                            `invoicePdfDownloadDashboard?inv_id=${newInvId}&invDate=${
                              finalObj1.inv_date
                            }&invNo=${finalObj1.inv_no}&gstNo=${
                              finalObj1.gst_no
                            }&billAddress=${
                              finalObj1.bill_address
                            }&place_of_supply=${
                              finalObj1.place_of_supply
                            }&igstAmnt=${finalObj1.igstAmnt}&cgstAmnt=${
                              finalObj1.cgstAmnt
                            }&sgstAmnt=${finalObj1.sgstAmnt}&totalTaxAmnt=${
                              finalObj1.totalTaxAmnt
                            }&totalAmnt=${finalObj1.totalAmnt}&hsn=${
                              finalObj.hsn
                            }&CompanyName=${sessionStorage.getItem(
                              'CompanyName'
                            )}&CustId=${sessionStorage.getItem(
                              'CustId'
                            )}&ifsc=${finalObj1.ifsc}&swift_code=${
                              finalObj1.swift_code
                            }&gstId=${profileData[0].gst_id}`;
                          history.push({
                            pathname: '/dashboard_invoice',
                          });
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

            console.log('preview page after saving finalObj2', finalObj2);

            // prints('printrec');

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
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    //   { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
  });

  const submitFinalPrint = handleSubmit((data) => {
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

    setEndDate(finalObj1.created_date);

    finalObj1.company_name = sessionStorage.getItem('CompanyName');
    finalObj1.cust_id = sessionStorage.getItem('CustId');

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

            for (let i = 0; i < inputList.length; i++) {
              let finalObj = {};

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
                finalObj.amount = inputList[i].amount;
                finalObj.created_date = cDate;
                finalObj.created_time = cTime;
                finalObj.description = inputList[i].description;
                finalObj.hsn = inputList[i].hsn;
                finalObj.inv_id = newInvId;
                finalObj.qty = inputList[i].qty;
                finalObj.remarks = inputList[i].remarks;
                finalObj.tax = inputList[i].tax;

                axios
                  .post(url + 'add_invoice_sub', finalObj)
                  .then(() => {
                    console.log(i, ' th row ', finalObj);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }

            console.log('preview page after saving finalObj2', finalObj2);

            prints('printrec');

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
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    //   { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
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

  function prints(el) {
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById('id2').innerHTML;
    document.body.innerHTML = printcontent;
    window.print();

    document.body.innerHTML = restorepage;
    history.push({
      pathname: '/dashboard_invoice',
    });
    window.location.reload();
  }

  return (
    <div>
      <Headers />
      {templateDataLoaded && profileDataLoaded && (
        <div>
          <div>
            {logoImageLoaded === false ? (
              <div className="LogoSpacing"></div>
            ) : (
              <div className="imgStyle pad2050">
                <div className="LogoLeft">
                  <img
                    //src={'/assets/images/' + logo}
                    alt="Loading..."
                    id="logoImg"
                  />
                </div>
                <div className="InvoiceTitle">
                  <h2>INVOICE</h2>
                </div>
              </div>
            )}

            <div className="wrapperDiv pad050">
              <div className="invoiceHeadOne">
                <div className="InvoiceHeadOneLeft">
                  <div className="TopAddress">
                    <p>
                      {templateData[0].template_companyAddress.split('\n')[0]}
                    </p>
                    <p>
                      {templateData[0].template_companyAddress.split('\n')[1]}
                    </p>
                    <p>
                      {templateData[0].template_companyAddress.split('\n')[2]}

                      {templateData[0].template_companyContact.split('|')[0] !==
                        '' &&
                        templateData[0].template_companyContact.split('|')[0]}

                      {templateData[0].template_companyContact.split('|')[0] !==
                        '' &&
                        templateData[0].template_companyContact.split(
                          '+91'
                        )[1] !== '' &&
                        '|'}

                      {templateData[0].template_companyContact.split(
                        '+91'
                      )[1] !== '' &&
                        'India-+91' +
                          templateData[0].template_companyContact.split(
                            '+91'
                          )[1]}
                    </p>
                  </div>
                </div>
                <div className="InvoiceHeadOneRight">
                  <p>
                    <label>Date : {finalObj1.inv_date}</label>
                  </p>
                  <p>
                    <label>Invoice No: {finalObj1.inv_no}</label>
                  </p>
                  <p>
                    <label>GSTIN: {profileData[0].gst_id}</label>
                  </p>
                  <p>
                    <label>SAC Code: {finalObj2[0].hsn}</label>
                  </p>
                </div>
              </div>

              <div className="AddressSection">
                <div className="BillToSection">
                  <h3>Bill To</h3>
                  <p>
                    {finalObj1.bill_address}
                    {finalObj1.gst_no !== '' && finalObj1.gst_no !== null && (
                      <br />
                    )}
                    {finalObj1.gst_no !== '' &&
                      finalObj1.gst_no !== null &&
                      'GSTIN :' + finalObj1.gst_no}
                  </p>
                </div>

                <div className="PayToSection">
                  <h3>Pay To</h3>
                  <p>
                    {templateData[0].template_payTo != '' &&
                      templateData[0].template_payTo != null && (
                        <>
                          {templateData[0].template_payTo
                            .split('\n')[0]
                            .split(':')[1] !== '' &&
                            templateData[0].template_payTo.split('\n')[0]}
                          {templateData[0].template_payTo
                            .split('\n')[0]
                            .split(':')[1] !== '' && <br />}
                          {templateData[0].template_payTo
                            .split('\n')[1]
                            .split(':')[1] !== '' &&
                            templateData[0].template_payTo.split('\n')[1]}
                          {templateData[0].template_payTo
                            .split('\n')[1]
                            .split(':')[1] !== '' && <br />}

                          {templateData[0].template_payTo
                            .split('\n')[2]
                            .split(',')[0] !== '' &&
                            templateData[0].template_payTo
                              .split('\n')[2]
                              .split(',')[0]}
                          {templateData[0].template_payTo
                            .split('\n')[2]
                            .split(',')[0] !== '' &&
                            templateData[0].template_payTo
                              .split('\n')[2]
                              .split(',')[1] !== '' &&
                            ','}

                          {templateData[0].template_payTo
                            .split('\n')[2]
                            .split(',')[1] !== '' &&
                            templateData[0].template_payTo
                              .split('\n')[2]
                              .split(',')[1]}
                          {templateData[0].template_payTo
                            .split('\n')[2]
                            .split(':')[1] !== '' && <br />}

                          {templateData[0].template_payTo
                            .split('\n')[3]
                            .split(':')[1] !== '' &&
                            templateData[0].template_payTo.split('\n')[3]}
                          {templateData[0].template_payTo
                            .split('\n')[3]
                            .split(':')[1] !== '' && <br />}
                          {templateData[0].template_payTo
                            .split('\n')[4]
                            .split(':')[1] !== '' &&
                            templateData[0].template_payTo.split('\n')[4]}
                          {templateData[0].template_payTo
                            .split('\n')[4]
                            .split(':')[1] !== '' && <br />}
                          {templateData[0].template_payTo
                            .split('\n')[5]
                            .split(':')[1] !== '' &&
                            templateData[0].template_payTo.split('\n')[5]}
                          {finalObj1.swift_code !== '' &&
                            finalObj1.swift_code !== null && <br />}
                          {finalObj1.swift_code !== '' &&
                            finalObj1.swift_code !== null &&
                            'Swift Code :' + finalObj1.swift_code}
                          {finalObj1.ifsc !== '' && finalObj1.ifsc !== null && (
                            <br />
                          )}
                          {finalObj1.ifsc !== '' &&
                            finalObj1.ifsc !== null &&
                            'IFSC :' + finalObj1.ifsc}
                        </>
                      )}
                    {/* INTUISYZ TECHNOLOGIES
                  <br />
                  PRIVATE LIMITED <br />
                  A/c No: 074205500060 <br />
                  ICICI BANK, ANGAMALY, <br />
                  IFSC: ICIC0000742 <br />
                  Swift Code: ICICINBBNRI <br />
                  PANNO: AADCI6383A <br /> */}
                  </p>
                </div>
              </div>

              {/* Bejoys */}

              <div>
                <table className="preview-table">
                  <tr className="brownbg">
                    <th className="preview-th-td"></th>
                    <th className="preview-th-td">Sl No</th>
                    <th className="preview-th-td">Description</th>
                    <th className="preview-th-td">Qty</th>
                    <th className="preview-th-td"> Amount</th>
                    {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
                  </tr>

                  {finalObj2.map((item, index) => {
                    return (
                      <tr className="preview-tr" key={index + 1}>
                        <td className="preview-th-td brownbg"></td>
                        <td className="preview-th-td">{index + 1}</td>
                        <td className="preview-th-td">{item.description}</td>
                        <td className="preview-th-td">{item.qty}</td>
                        <td className="preview-th-td">{item.amount}</td>
                        {/* <td className="preview-th-td">{'        '}</td> */}
                      </tr>
                    );
                  })}

                  <tr className="preview-tr">
                    <td className="preview-th-td brownbg"></td>
                    <td className="preview-th-td"></td>
                    <td className="preview-th-td">
                      {' '}
                      <b>GST</b>
                      <br />
                      {finalObj1.place_of_supply === 'InterState' && (
                        <b>
                          IGST ({' '}
                          {parseInt(
                            (parseFloat(finalObj1.total_tax) /
                              parseFloat(finalObj1.total_amount)) *
                              100
                          )}
                          %){' '}
                        </b>
                      )}
                      {finalObj1.place_of_supply === 'IntraState' && (
                        <>
                          <b>
                            CGST ({' '}
                            {parseInt(
                              ((parseFloat(finalObj1.total_tax) /
                                parseFloat(finalObj1.total_amount)) *
                                100) /
                                2
                            )}{' '}
                            %){' '}
                          </b>
                          <br />
                          <b>
                            SGST ({' '}
                            {parseInt(
                              ((parseFloat(finalObj1.total_tax) /
                                parseFloat(finalObj1.total_amount)) *
                                100) /
                                2
                            )}{' '}
                            %)
                          </b>
                        </>
                      )}
                    </td>
                    <td className="preview-th-td "></td>
                    <td className="preview-th-td">
                      {' '}
                      {finalObj1.place_of_supply === 'InterState' && (
                        <>
                          <br />
                          <b>{parseFloat(finalObj1.total_tax)}</b>
                        </>
                      )}
                      {finalObj1.place_of_supply === 'IntraState' && (
                        <>
                          <br />
                          <b>{parseFloat(finalObj1.total_tax) / 2}</b>
                          <br />
                          <b>{parseFloat(finalObj1.total_tax) / 2}</b>
                        </>
                      )}
                    </td>
                    {/* <td className="preview-th-td">{'        '}</td> */}
                  </tr>

                  <tr className="preview-tr">
                    <td className="preview-th-td brownbg"></td>
                    <td className="preview-th-td"></td>
                    <td className="preview-th-td">
                      <h4>
                        <b>Total</b>
                      </h4>
                    </td>
                    <td className="preview-th-td"></td>
                    <td className="preview-th-td">
                      <h4>
                        <b>{localStorage.getItem('TotalAmountData')}</b>
                      </h4>
                    </td>
                    {/* <td className="preview-th-td">{'        '}</td> */}
                  </tr>
                </table>

                <div className="footerTable">
                  <table className="preview-footer-table">
                    <tr className="preview-footer-tr">
                      <th className="preview-footer-th-td posRel">
                        <span>Name</span>
                        <div className="designationTxt">
                          {templateData[0].template_Name.split('\n')[0]}
                          <br />
                          {templateData[0].template_Name.split('\n')[1]}
                          <br />
                          {templateData[0].template_Name.split('\n')[2]}
                        </div>
                      </th>
                      <th className="preview-footer-th-td posRel">
                        <span>Signature</span>
                        <div className="SignatureImage">
                          <img
                            //src={'/assets/images/' + image}
                            //  src="C://Users/SHERIN/git/JavaAccounts/Intuisyz_Accounts_Java/src/main/resources/image/Screenshot%20(395)%20(1).png"
                            alt="Loading..."
                            id="signImg"
                          />
                        </div>
                      </th>
                    </tr>
                  </table>
                </div>
              </div>

              <footer className="invoice-footer">
                <div className="RightButtonsSec">
                  <button
                    className="primary btn"
                    type="submit"
                    name="submit"
                    onClick={(e) => {
                      history.push({
                        pathname: '/create_invoice',
                      });
                    }}
                  >
                    Back to Edit
                  </button>
                  <button
                    className="primary btn"
                    type="submit"
                    name="submit"
                    onClick={(e) => {
                      submitFinal();
                    }}
                  >
                    Save & PDF
                  </button>
                  <button
                    className="primary btn"
                    type="submit"
                    name="submit"
                    onClick={(e) => {
                      submitFinalPrint();
                    }}
                  >
                    Save & Print
                  </button>
                </div>
              </footer>
            </div>

            {/* PRINT SECTION  */}
            <div id="id2" hidden>
              <div className="PdfPreviewWrapper">
                {logoImageLoaded === false ? (
                  <div className="LogoSpacings"></div>
                ) : (
                  <div className="imgStyle pad2000">
                    <div className="LogoLeft">
                      <img
                        //src={'/assets/images/' + logo}
                        alt="Loading..."
                        id="logoImg2"
                      />
                    </div>
                    <div className="InvoiceTitle">
                      <h2>INVOICE</h2>
                    </div>
                  </div>
                )}

                <div className="wrapperDiv">
                  <div className="invoiceHeadOne">
                    <div className="InvoiceHeadOneLeft">
                      <div className="TopAddress">
                        <p>
                          {
                            templateData[0].template_companyAddress.split(
                              '\n'
                            )[0]
                          }
                        </p>
                        <p>
                          {
                            templateData[0].template_companyAddress.split(
                              '\n'
                            )[1]
                          }
                        </p>
                        <p>
                          {
                            templateData[0].template_companyAddress.split(
                              '\n'
                            )[2]
                          }

                          {templateData[0].template_companyContact.split(
                            '|'
                          )[0] !== '' &&
                            templateData[0].template_companyContact.split(
                              '|'
                            )[0]}

                          {templateData[0].template_companyContact.split(
                            '|'
                          )[0] !== '' &&
                            templateData[0].template_companyContact.split(
                              '+91'
                            )[1] !== '' &&
                            '|'}

                          {templateData[0].template_companyContact.split(
                            '+91'
                          )[1] !== '' &&
                            'India-+91' +
                              templateData[0].template_companyContact.split(
                                '+91'
                              )[1]}
                        </p>
                      </div>
                    </div>
                    <div className="InvoiceHeadOneRight">
                      <p>
                        <label>Date : {finalObj1.inv_date}</label>
                      </p>
                      <p>
                        <label>Invoice No: {finalObj1.inv_no}</label>
                      </p>
                      <p>
                        <label>GSTIN: {profileData[0].gst_id}</label>
                      </p>
                      <p>
                        <label>SAC Code: {finalObj2[0].hsn}</label>
                      </p>
                    </div>
                  </div>

                  <div className="AddressSection">
                    <div className="BillToSection">
                      <label>Bill To</label>
                      <p>
                        {finalObj1.bill_address}
                        {finalObj1.gst_no !== '' &&
                          finalObj1.gst_no !== null && <br />}
                        {finalObj1.gst_no !== '' &&
                          finalObj1.gst_no !== null &&
                          'GSTIN :' + finalObj1.gst_no}
                      </p>
                    </div>

                    <div className="PayToSection">
                      <label>Pay To</label>
                      <p>
                        {templateData[0].template_payTo != '' &&
                          templateData[0].template_payTo != null && (
                            <>
                              {templateData[0].template_payTo
                                .split('\n')[0]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[0]}
                              {templateData[0].template_payTo
                                .split('\n')[0]
                                .split(':')[1] !== '' && <br />}
                              {templateData[0].template_payTo
                                .split('\n')[1]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[1]}
                              {templateData[0].template_payTo
                                .split('\n')[1]
                                .split(':')[1] !== '' && <br />}

                              {templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[0] !== '' &&
                                templateData[0].template_payTo
                                  .split('\n')[2]
                                  .split(',')[0]}
                              {templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[0] !== '' &&
                                templateData[0].template_payTo
                                  .split('\n')[2]
                                  .split(',')[1] !== '' &&
                                ','}

                              {templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[1] !== '' &&
                                templateData[0].template_payTo
                                  .split('\n')[2]
                                  .split(',')[1]}
                              {templateData[0].template_payTo
                                .split('\n')[2]
                                .split(':')[1] !== '' && <br />}

                              {templateData[0].template_payTo
                                .split('\n')[3]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[3]}
                              {templateData[0].template_payTo
                                .split('\n')[3]
                                .split(':')[1] !== '' && <br />}
                              {templateData[0].template_payTo
                                .split('\n')[4]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[4]}
                              {templateData[0].template_payTo
                                .split('\n')[4]
                                .split(':')[1] !== '' && <br />}
                              {templateData[0].template_payTo
                                .split('\n')[5]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[5]}
                              {finalObj1.swift_code !== '' &&
                                finalObj1.swift_code !== null && <br />}
                              {finalObj1.swift_code !== '' &&
                                finalObj1.swift_code !== null &&
                                'Swift Code :' + finalObj1.swift_code}
                              {finalObj1.ifsc !== '' &&
                                finalObj1.ifsc !== null && <br />}
                              {finalObj1.ifsc !== '' &&
                                finalObj1.ifsc !== null &&
                                'IFSC :' + finalObj1.ifsc}
                            </>
                          )}
                        {/* INTUISYZ TECHNOLOGIES
                  <br />
                  PRIVATE LIMITED <br />
                  A/c No: 074205500060 <br />
                  ICICI BANK, ANGAMALY, <br />
                  IFSC: ICIC0000742 <br />
                  Swift Code: ICICINBBNRI <br />
                  PANNO: AADCI6383A <br /> */}
                      </p>
                    </div>
                  </div>

                  {/* Bejoys */}

                  <div>
                    <table className="preview-table">
                      <tr>
                        <th className="preview-th-td">Sl No</th>
                        <th className="preview-th-td alignLeft">Description</th>
                        <th className="preview-th-td">Qty</th>
                        <th className="preview-th-td alignRight"> Amount</th>
                        {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
                      </tr>

                      {finalObj2.map((item, index) => {
                        return (
                          <tr className="preview-tr" key={index + 1}>
                            <td className="preview-th-td brownbg"></td>
                            <td className="preview-th-td">{index + 1}</td>
                            <td className="preview-th-td alignLeft">
                              {item.description}
                            </td>
                            <td className="preview-th-td">{item.qty}</td>
                            <td className="preview-th-td alignRight">
                              {item.amount}
                            </td>
                            {/* <td className="preview-th-td">{'        '}</td> */}
                          </tr>
                        );
                      })}

                      <tr className="preview-tr">
                        <td className="preview-th-td brownbg"></td>
                        <td className="preview-th-td"></td>
                        <td className="preview-th-td alignRight">
                          <ul className="gstUlLi">
                            <li>
                              <b>GST</b>
                            </li>
                            {finalObj1.place_of_supply === 'InterState' && (
                              <li>
                                IGST (
                                {parseInt(
                                  (parseFloat(finalObj1.total_tax) /
                                    parseFloat(finalObj1.total_amount)) *
                                    100
                                )}
                                %)
                              </li>
                            )}
                            {finalObj1.place_of_supply === 'IntraState' && (
                              <>
                                <li>
                                  CGST ({' '}
                                  {parseInt(
                                    ((parseFloat(finalObj1.total_tax) /
                                      parseFloat(finalObj1.total_amount)) *
                                      100) /
                                      2
                                  )}{' '}
                                  %){' '}
                                </li>
                                <li>
                                  SGST ({' '}
                                  {parseInt(
                                    ((parseFloat(finalObj1.total_tax) /
                                      parseFloat(finalObj1.total_amount)) *
                                      100) /
                                      2
                                  )}{' '}
                                  %)
                                </li>
                              </>
                            )}
                          </ul>
                        </td>
                        <td className="preview-th-td "></td>
                        <td className="preview-th-td alignRight">
                          <ul className="gstUlLi">
                            <li>&nbsp;</li>
                            {finalObj1.place_of_supply === 'InterState' && (
                              <>
                                <li>{parseFloat(finalObj1.total_tax)} </li>
                              </>
                            )}
                            {finalObj1.place_of_supply === 'IntraState' && (
                              <>
                                <li>{parseFloat(finalObj1.total_tax) / 2} </li>
                                <li>{parseFloat(finalObj1.total_tax) / 2}</li>
                              </>
                            )}
                          </ul>
                        </td>
                        {/* <td className="preview-th-td">{'        '}</td> */}
                      </tr>

                      <tr className="preview-tr">
                        <td className="preview-th-td brownbg"></td>
                        <td className="preview-th-td"></td>
                        <td className="preview-th-td alignRight amountTd">
                          <h4>
                            <b>Total</b>
                          </h4>
                        </td>
                        <td className="preview-th-td"></td>
                        <td className="preview-th-td alignRight amountTd">
                          <h4>
                            <b>{localStorage.getItem('TotalAmountData')}</b>
                          </h4>
                        </td>
                        {/* <td className="preview-th-td">{'        '}</td> */}
                      </tr>
                    </table>

                    <div className="DesiGnationandSign">
                      <table className="table">
                        <tr>
                          <td>
                            <div className="designationCopy">
                              <span>Name</span>
                              <div className="desigTxt">
                                <p>
                                  <b>
                                    {
                                      templateData[0].template_Name.split(
                                        '\n'
                                      )[0]
                                    }
                                  </b>
                                </p>
                                <p>
                                  {templateData[0].template_Name.split('\n')[1]}{' '}
                                </p>
                                <p>
                                  {templateData[0].template_Name.split('\n')[2]}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td style={{ width: '50%' }}>
                            <div className="SignatureCopy">
                              <span>Signature</span>
                              <div>
                                <img
                                  alt="Loading..."
                                  className="signImgTwo"
                                  id="signImg2"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* bejoys  */}
        </div>
      )}
    </div>
  );
};

export default Preview_invoice;

/////////OLD Code/////////

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import {
//   useHistory,
//   useLocation,
//   Redirect,
//   Link,
//   BrowserRouter as Router,
// } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import ReactPaginate from 'react-paginate';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import { successToast, errorToast } from '../common/global';
// import uuid from 'react-uuid';
// import { ToastContainer, toast } from 'react-toastify';
// import baseUrl from '../Base Url/baseUrl';
// import '../Invoice/style_invoice.css';
// import invoiceHeaderImg from '../Image/invoice_header.jpg';
// import invoiceFooterImg from '../Image/invoice_footer.jpg';

// const Preview_invoice = () => {
//   let location = useLocation();
//   let history = useHistory();
//   let url = baseUrl.url;

//   const [endDate, setEndDate] = useState(new Date());
//   // const [uuidValue, setUuidValue] = useState();

//   let uuidValue;

//   let Obj1 = localStorage.getItem('finalObj1');
//   let Obj2 = localStorage.getItem('finalObj2');

//   const finalObj1 = JSON.parse(Obj1);
//   const finalObj2 = JSON.parse(Obj2);
//   const inputList = JSON.parse(Obj2);

//   localStorage.setItem('invoicePageStatus', location.pathname);

//   console.log('preview page finalObj1', finalObj1);

//   // setUuidValue(finalObj1.invoice_tran_id);
//   uuidValue = finalObj1.invoice_tran_id;

//   console.log('preview page finalObj2', finalObj2);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     mode: 'onSubmit',
//   });

//   const submitFinal = handleSubmit((data) => {
//     var currentdate = new Date();

//     if (currentdate.getDate() < 10) {
//       var currentDay = '0' + currentdate.getDate();
//     } else {
//       var currentDay = currentdate.getDate();
//     }

//     if (currentdate.getMonth() + 1 < 10) {
//       var currentMonth = '0' + (currentdate.getMonth() + 1);
//     } else {
//       var currentMonth = currentdate.getMonth() + 1;
//     }

//     var cDate =
//       currentdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

//     if (currentdate.getHours() < 10) {
//       var currentHour = '0' + currentdate.getHours();
//     } else {
//       var currentHour = currentdate.getHours();
//     }

//     if (currentdate.getMinutes() < 10) {
//       var currentMinutes = '0' + currentdate.getMinutes();
//     } else {
//       var currentMinutes = currentdate.getMinutes();
//     }

//     if (currentdate.getSeconds() < 10) {
//       var currentSeconds = '0' + currentdate.getSeconds();
//     } else {
//       var currentSeconds = currentdate.getSeconds();
//     }

//     var cTime = currentHour + ':' + currentMinutes + ':' + currentSeconds;

//     console.log('date', cTime, cDate);

//     setEndDate(finalObj1.created_date);

//     axios
//       .post(url + 'add_invoice', finalObj1)
//       .then(() => {
//         successToast('Invoice Created Successfully');
//         reset();

//         axios
//           .get(url + 'invoiceData')
//           .then(({ data }) => {
//             console.log('invoice data', data);

//             ////////////////Journal section calling////////////
//             addJournal(
//               finalObj1.cust_name,
//               finalObj1.service,
//               finalObj1.total_amount,
//               'Invoice'
//             );

//             if (
//               finalObj1.place_of_supply === 'InterState' ||
//               finalObj1.place_of_supply === 'IntraState'
//             ) {
//               console.log('GST inserted');
//               // setTimeout(function () {
//               //   console.log('GST inserted');

//               addJournal1(
//                 finalObj1.cust_name,
//                 '32',
//                 finalObj1.total_tax,
//                 'GST charges'
//               );
//               // }, 2000);
//             }

//             if (finalObj1.tds_rate !== '') {
//               console.log('TDS inserted');
//               // setTimeout(function () {
//               //   console.log('TDS inserted');
//               addJournal2(
//                 '33',
//                 finalObj1.cust_name,
//                 finalObj1.tds_rate,
//                 'TDS Deducted'
//               );
//               // }, 3000);
//             }

//             console.log('invoice last data id', data[data.length - 1].inv_id);

//             let newInvId = data[data.length - 1].inv_id;

//             for (let i = 0; i < inputList.length; i++) {
//               let finalObj = {};

//               if (
//                 inputList[i].amount === '' &&
//                 inputList[i].description === '' &&
//                 inputList[i].hsn === '' &&
//                 inputList[i].qty === '' &&
//                 inputList[i].remarks === '' &&
//                 inputList[i].tax === ''
//               ) {
//                 continue;
//               } else {
//                 finalObj.amount = inputList[i].amount;
//                 finalObj.created_date = cDate;
//                 finalObj.created_time = cTime;
//                 finalObj.description = inputList[i].description;
//                 finalObj.hsn = inputList[i].hsn;
//                 finalObj.inv_id = newInvId;
//                 finalObj.qty = inputList[i].qty;
//                 finalObj.remarks = inputList[i].remarks;
//                 finalObj.tax = inputList[i].tax;

//                 axios
//                   .post(url + 'add_invoice_sub', finalObj)
//                   .then(() => {
//                     console.log(i, ' th row ', finalObj);
//                   })
//                   .catch((err) => {
//                     console.log(err);
//                   });
//               }
//             }

//             console.log('preview page after saving finalObj2', finalObj2);

//             prints('printrec');

//             localStorage.setItem('finalObj1', JSON.stringify('{}'));

//             localStorage.setItem(
//               'finalObj2',
//               JSON.stringify([
//                 {
//                   description: '',
//                   hsn: '',
//                   qty: '',
//                   amount: '',
//                   tax: '',
//                   remarks: '',
//                 },
//               ])
//             );
//             localStorage.setItem('TotalAmountData', '');
//             localStorage.setItem('invoicePageStatus', '');
//             localStorage.setItem('SubTotalAmountData', '');
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     //   { description: '', hsn: '', qty: '', amount: '', tax: '', remarks: '' },
//   });

//   function addJournal(Debit, Credit, Amount, narration) {
//     // current date
//     var currentdate = new Date();
//     // console.log('upload data', data.upload);
//     if (currentdate.getDate() < 10) {
//       var currentDay = '0' + currentdate.getDate();
//     } else {
//       var currentDay = currentdate.getDate();
//     }

//     if (currentdate.getMonth() + 1 < 10) {
//       var currentMonth = '0' + (currentdate.getMonth() + 1);
//     } else {
//       var currentMonth = currentdate.getMonth() + 1;
//     }

//     var cDate =
//       currentdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

//     if (currentdate.getHours() < 10) {
//       var currentHour = '0' + currentdate.getHours();
//     } else {
//       var currentHour = currentdate.getHours();
//     }

//     if (currentdate.getMinutes() < 10) {
//       var currentMinutes = '0' + currentdate.getMinutes();
//     } else {
//       var currentMinutes = currentdate.getMinutes();
//     }

//     if (currentdate.getSeconds() < 10) {
//       var currentSeconds = '0' + currentdate.getSeconds();
//     } else {
//       var currentSeconds = currentdate.getSeconds();
//     }

//     var cTime = currentHour + ':' + currentMinutes + ':' + currentSeconds;

//     console.log('date', cTime, cDate);

//     // journal date

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

//     let journalCredit = Credit;
//     let journalDebit = Debit;
//     let journalAmount = Amount;

//     let finalObj1 = {};

//     finalObj1.transactionID = uuid();
//     finalObj1.dbt_ac = Debit;
//     // finalObj1.dbt_ac = arr[0].ac_type;
//     finalObj1.crdt_ac = Credit;
//     finalObj1.mode = '';
//     finalObj1.amount = Amount;
//     finalObj1.type = 'Contra'; //transactionType
//     finalObj1.tran_gen = uuidValue;
//     finalObj1.tran_Date = eDate; //datee
//     finalObj1.description = narration; //narrative
//     finalObj1.ac_no = '';
//     finalObj1.chq_no = '';
//     finalObj1.chq_date = '';
//     finalObj1.branch = '';
//     finalObj1.user_bank = ''; //bankname
//     finalObj1.bank = '';
//     finalObj1.status = '1';
//     finalObj1.filename = 'Nil'; //image
//     finalObj1.filepath = ''; //im
//     finalObj1.createdBy = ''; // userID
//     finalObj1.createdDate = cDate;
//     finalObj1.createdTime = cTime;

//     console.log('FinalObj1', finalObj1);

//     axios
//       .post(url + 'add_journalTransaction', finalObj1)
//       .then(() => {
//         // successToast('Journal Created Successfully');
//         // reset();

//         //// increase and decrease amount function call
//         creditFun(journalCredit, journalAmount, cDate, cTime, '');
//         debitFun(journalDebit, journalAmount, cDate, cTime, '');
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function addJournal1(Debit, Credit, Amount, narration) {
//     // current date
//     var currentdate = new Date();
//     // console.log('upload data', data.upload);
//     if (currentdate.getDate() < 10) {
//       var currentDay = '0' + currentdate.getDate();
//     } else {
//       var currentDay = currentdate.getDate();
//     }

//     if (currentdate.getMonth() + 1 < 10) {
//       var currentMonth = '0' + (currentdate.getMonth() + 1);
//     } else {
//       var currentMonth = currentdate.getMonth() + 1;
//     }

//     var cDate =
//       currentdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

//     if (currentdate.getHours() < 10) {
//       var currentHour = '0' + currentdate.getHours();
//     } else {
//       var currentHour = currentdate.getHours();
//     }

//     if (currentdate.getMinutes() < 10) {
//       var currentMinutes = '0' + currentdate.getMinutes();
//     } else {
//       var currentMinutes = currentdate.getMinutes();
//     }

//     if (currentdate.getSeconds() < 10) {
//       var currentSeconds = '0' + currentdate.getSeconds();
//     } else {
//       var currentSeconds = currentdate.getSeconds();
//     }

//     var cTime = currentHour + ':' + currentMinutes + ':' + currentSeconds;

//     console.log('date', cTime, cDate);

//     // journal date

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

//     let journalCredit = Credit;
//     let journalDebit = Debit;
//     let journalAmount = Amount;

//     let finalObj1 = {};

//     finalObj1.transactionID = uuid();
//     finalObj1.dbt_ac = Debit;
//     // finalObj1.dbt_ac = arr[0].ac_type;
//     finalObj1.crdt_ac = Credit;
//     finalObj1.mode = '';
//     finalObj1.amount = Amount;
//     finalObj1.type = 'Contra'; //transactionType
//     finalObj1.tran_gen = uuidValue;
//     finalObj1.tran_Date = eDate; //datee
//     finalObj1.description = narration; //narrative
//     finalObj1.ac_no = '';
//     finalObj1.chq_no = '';
//     finalObj1.chq_date = '';
//     finalObj1.branch = '';
//     finalObj1.user_bank = ''; //bankname
//     finalObj1.bank = '';
//     finalObj1.status = '1';
//     finalObj1.filename = 'Nil'; //image
//     finalObj1.filepath = ''; //im
//     finalObj1.createdBy = ''; // userID
//     finalObj1.createdDate = cDate;
//     finalObj1.createdTime = cTime;

//     console.log('FinalObj1', finalObj1);

//     axios
//       .post(url + 'add_journalTransaction', finalObj1)
//       .then(() => {
//         // successToast('Journal Created Successfully');
//         // reset();

//         //// increase and decrease amount function call
//         creditFun(journalCredit, journalAmount, cDate, cTime, '');
//         debitFun(journalDebit, journalAmount, cDate, cTime, '');
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function addJournal2(Debit, Credit, Amount, narration) {
//     // current date
//     var currentdate = new Date();
//     // console.log('upload data', data.upload);
//     if (currentdate.getDate() < 10) {
//       var currentDay = '0' + currentdate.getDate();
//     } else {
//       var currentDay = currentdate.getDate();
//     }

//     if (currentdate.getMonth() + 1 < 10) {
//       var currentMonth = '0' + (currentdate.getMonth() + 1);
//     } else {
//       var currentMonth = currentdate.getMonth() + 1;
//     }

//     var cDate =
//       currentdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

//     if (currentdate.getHours() < 10) {
//       var currentHour = '0' + currentdate.getHours();
//     } else {
//       var currentHour = currentdate.getHours();
//     }

//     if (currentdate.getMinutes() < 10) {
//       var currentMinutes = '0' + currentdate.getMinutes();
//     } else {
//       var currentMinutes = currentdate.getMinutes();
//     }

//     if (currentdate.getSeconds() < 10) {
//       var currentSeconds = '0' + currentdate.getSeconds();
//     } else {
//       var currentSeconds = currentdate.getSeconds();
//     }

//     var cTime = currentHour + ':' + currentMinutes + ':' + currentSeconds;

//     console.log('date', cTime, cDate);

//     // journal date

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

//     let journalCredit = Credit;
//     let journalDebit = Debit;
//     let journalAmount = Amount;

//     let finalObj1 = {};

//     finalObj1.transactionID = uuid();
//     finalObj1.dbt_ac = Debit;
//     // finalObj1.dbt_ac = arr[0].ac_type;
//     finalObj1.crdt_ac = Credit;
//     finalObj1.mode = '';
//     finalObj1.amount = Amount;
//     finalObj1.type = 'Contra'; //transactionType
//     finalObj1.tran_gen = uuidValue;
//     finalObj1.tran_Date = eDate; //datee
//     finalObj1.description = narration; //narrative
//     finalObj1.ac_no = '';
//     finalObj1.chq_no = '';
//     finalObj1.chq_date = '';
//     finalObj1.branch = '';
//     finalObj1.user_bank = ''; //bankname
//     finalObj1.bank = '';
//     finalObj1.status = '1';
//     finalObj1.filename = 'Nil'; //image
//     finalObj1.filepath = ''; //im
//     finalObj1.createdBy = ''; // userID
//     finalObj1.createdDate = cDate;
//     finalObj1.createdTime = cTime;

//     console.log('FinalObj1', finalObj1);

//     axios
//       .post(url + 'add_journalTransaction', finalObj1)
//       .then(() => {
//         // successToast('Journal Created Successfully');
//         // reset();

//         //// increase and decrease amount function call
//         creditFun(journalCredit, journalAmount, cDate, cTime, '');
//         debitFun(journalDebit, journalAmount, cDate, cTime, '');
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function creditFun(ledgerID, journalAmount, cDate, cTime) {
//     let type;
//     axios
//       .get(url + `ledger_search?ledgerId=${ledgerID}`)
//       .then(({ data }) => {
//         console.log(data);

//         type = data[0].ac_type;
//         console.log('credit ledger ac_type', type);

//         if (type === '2' || type === '3') {
//           increaseAmount(ledgerID, journalAmount, cDate, cTime, '');
//         } else {
//           decreaseAmount(ledgerID, journalAmount, cDate, cTime, '');
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function debitFun(ledgerID, journalAmount, cDate, cTime) {
//     let type1;
//     axios
//       .get(url + `ledger_search?ledgerId=${ledgerID}`)
//       .then(({ data }) => {
//         console.log(data);

//         type1 = data[0].ac_type;
//         console.log('debit ledger ac_type', type1);

//         if (type1 === '2' || type1 === '3') {
//           decreaseAmount(ledgerID, journalAmount, cDate, cTime, '');
//         } else {
//           increaseAmount(ledgerID, journalAmount, cDate, cTime, '');
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function increaseAmount(ledgerID, ledgeramount, created_date, time, userID) {
//     let currentAmount, updatedAmount;
//     axios
//       .get(url + `ledger_search?ledgerId=${ledgerID}`)
//       .then(({ data }) => {
//         console.log(data);
//         currentAmount = data[0].amount;
//         if (currentAmount === '') {
//           currentAmount = 0;
//         }
//         updatedAmount = parseFloat(currentAmount) + parseFloat(ledgeramount);
//         console.log('increase function updatedAmount', updatedAmount);

//         let finalObj3 = {};

//         // data for account_ledger_v3 table
//         finalObj3.id = ledgerID;
//         finalObj3.ledger_name = data[0].ledger_name;

//         finalObj3.ac_group = data[0].ac_group;
//         finalObj3.name = data[0].name;
//         finalObj3.address = data[0].address;
//         finalObj3.state = data[0].state;
//         finalObj3.pin = data[0].pin;
//         finalObj3.contact = data[0].contact;
//         finalObj3.mobile = data[0].mobile;
//         finalObj3.fax = data[0].fax;
//         finalObj3.email = data[0].email;
//         finalObj3.acc_number = data[0].acc_number;
//         finalObj3.bank = data[0].bank;
//         finalObj3.branch = data[0].branch;
//         finalObj3.ifsc_code = data[0].ifsc_code;
//         finalObj3.open_balance = data[0].open_balance;
//         finalObj3.amount = updatedAmount;
//         //account id
//         finalObj3.created_date = created_date;
//         finalObj3.time = time;
//         //userId
//         finalObj3.balance_type = data[0].balance_type;
//         finalObj3.ledger_date = data[0].ledger_date;

//         axios
//           .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
//           .then(({ data }) => {
//             console.log('grpId', data);

//             // setFlag(data);
//             finalObj3.ac_type = data[0].ac_type;
//             finalObj3.ac_title = data[0].ac_title;

//             axios
//               .put(url + `ledger_update/${finalObj3.id}`, finalObj3)
//               .then(() => {
//                 console.log('increaseAmount Updated Successfully');
//                 // reset();
//                 // setTimeout(function () {
//                 //   history.push({
//                 //     pathname: '/view_journal',
//                 //   });
//                 // }, 1000);
//               })
//               .catch((err) => {
//                 console.log(err);
//               });

//             console.log('increaseAmount finalObj3', finalObj3);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function decreaseAmount(ledgerID, ledgeramount, created_date, time, userID) {
//     let currentAmount, updatedAmount;
//     axios
//       .get(url + `ledger_search?ledgerId=${ledgerID}`)
//       .then(({ data }) => {
//         console.log(data);
//         currentAmount = data[0].amount;
//         if (currentAmount === '') {
//           currentAmount = 0;
//         }
//         updatedAmount = parseFloat(currentAmount) - parseFloat(ledgeramount);
//         console.log('decrease function updatedAmount', updatedAmount);

//         let finalObj4 = {};

//         // data for account_ledger_v3 table
//         finalObj4.id = ledgerID;
//         finalObj4.ledger_name = data[0].ledger_name;

//         finalObj4.ac_group = data[0].ac_group;
//         finalObj4.name = data[0].name;
//         finalObj4.address = data[0].address;
//         finalObj4.state = data[0].state;
//         finalObj4.pin = data[0].pin;
//         finalObj4.contact = data[0].contact;
//         finalObj4.mobile = data[0].mobile;
//         finalObj4.fax = data[0].fax;
//         finalObj4.email = data[0].email;
//         finalObj4.acc_number = data[0].acc_number;
//         finalObj4.bank = data[0].bank;
//         finalObj4.branch = data[0].branch;
//         finalObj4.ifsc_code = data[0].ifsc_code;
//         finalObj4.open_balance = data[0].open_balance;
//         finalObj4.amount = updatedAmount;
//         //account id
//         finalObj4.created_date = created_date;
//         finalObj4.time = time;
//         //userId
//         finalObj4.balance_type = data[0].balance_type;
//         finalObj4.ledger_date = data[0].ledger_date;

//         axios
//           .get(url + `grp_by_id?grpId=${data[0].ac_group}`)
//           .then(({ data }) => {
//             console.log('grpId', data);

//             // setFlag(data);
//             finalObj4.ac_type = data[0].ac_type;
//             finalObj4.ac_title = data[0].ac_title;

//             axios
//               .put(url + `ledger_update/${finalObj4.id}`, finalObj4)
//               .then(() => {
//                 console.log('decreaseAmount Updated Successfully');
//                 // reset();
//                 // setTimeout(function () {
//                 //   history.push({
//                 //     pathname: '/view_journal',
//                 //   });
//                 // }, 1000);
//               })
//               .catch((err) => {
//                 console.log(err);
//               });

//             console.log('decreaseAmount finalObj4', finalObj4);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function prints(el) {
//     var restorepage = document.body.innerHTML;
//     var printcontent = document.getElementById('id2').innerHTML;
//     document.body.innerHTML = printcontent;
//     window.print();

//     document.body.innerHTML = restorepage;
//     history.push({
//       pathname: '/dashboard_invoice',
//     });
//     window.location.reload();
//   }

//   return (
//     <div>
//       <br />
//       <div>
//         <div>
//           <img src={invoiceHeaderImg} alt="Loading..." />
//         </div>
//         <br />
//         <br />
//         <div>
//           <label style={{ fontSize: 18, fontWeight: 'bold' }}>
//             <b>INVOICE</b>
//           </label>
//         </div>

//         <div style={{ textAlign: 'left' }}>
//           <br />
//           <label
//             style={{
//               paddingLeft: 200,
//               fontWeight: 'bold',
//               fontSize: 15,
//             }}
//           >
//             Date : {finalObj1.inv_date}
//           </label>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <label
//             style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
//           >
//             Invoice No: {finalObj1.inv_no}
//           </label>
//           <br />
//           <label
//             style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
//           >
//             GSTIN: {finalObj1.gst_no}
//           </label>
//           <br />
//           <label
//             style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
//           >
//             SAC Code: {finalObj2[0].hsn}
//           </label>
//         </div>

//         <div style={{ textAlign: 'left' }}>
//           <br />
//           <label
//             style={{
//               paddingLeft: 200,
//               fontWeight: 'bold',
//               fontSize: 15,
//             }}
//           >
//             Bill To
//           </label>
//           <br />

//           <p
//             style={{
//               paddingLeft: 200,
//               fontSize: 15,
//             }}
//           >
//             {finalObj1.bill_address}
//           </p>
//         </div>
//         <div style={{ textAlign: 'left' }}>
//           <br />
//           <label
//             style={{
//               paddingLeft: 200,
//               fontWeight: 'bold',
//               fontSize: 15,
//             }}
//           >
//             Pay To
//           </label>
//           <br />

//           <p
//             style={{
//               paddingLeft: 200,
//               fontSize: 15,
//             }}
//           >
//             INTUISYZ TECHNOLOGIES
//             <br />
//             PRIVATE LIMITED <br />
//             A/c No: 074205500060 <br />
//             ICICI BANK, ANGAMALY, <br />
//             IFSC: ICIC0000742 <br />
//             Swift Code: ICICINBBNRI <br />
//             PANNO: AADCI6383A <br />
//           </p>
//         </div>
//         <br />
//         <div style={{ paddingLeft: 200, paddingRight: 200 }}>
//           <table className="preview-table">
//             <tr className="preview-tr">
//               <th className="preview-th-td">Sl No</th>
//               <th className="preview-th-td">Description</th>
//               <th className="preview-th-td">Qty</th>
//               <th className="preview-th-td"> Amount</th>
//               {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
//             </tr>

//             {finalObj2.map((item, index) => {
//               return (
//                 <tr className="preview-tr" key={index + 1}>
//                   <td className="preview-th-td">{index + 1}</td>
//                   <td className="preview-th-td">{item.description}</td>
//                   <td className="preview-th-td">{item.qty}</td>
//                   <td className="preview-th-td">{item.amount}</td>
//                   {/* <td className="preview-th-td">{'        '}</td> */}
//                 </tr>
//               );
//             })}

//             <tr className="preview-tr">
//               <td className="preview-th-td"></td>
//               <td className="preview-th-td">
//                 {' '}
//                 <b>GST</b>
//                 <br />
//                 {finalObj1.place_of_supply === 'InterState' && (
//                   <b>
//                     IGST ({' '}
//                     {parseInt(
//                       (parseFloat(finalObj1.total_tax) /
//                         parseFloat(finalObj1.total_amount)) *
//                         100
//                     )}
//                     %){' '}
//                   </b>
//                 )}
//                 {finalObj1.place_of_supply === 'IntraState' && (
//                   <>
//                     <b>
//                       CGST ({' '}
//                       {parseInt(
//                         ((parseFloat(finalObj1.total_tax) /
//                           parseFloat(finalObj1.total_amount)) *
//                           100) /
//                           2
//                       )}{' '}
//                       %){' '}
//                     </b>
//                     <br />
//                     <b>
//                       SGST ({' '}
//                       {parseInt(
//                         ((parseFloat(finalObj1.total_tax) /
//                           parseFloat(finalObj1.total_amount)) *
//                           100) /
//                           2
//                       )}{' '}
//                       %)
//                     </b>
//                   </>
//                 )}
//               </td>
//               <td className="preview-th-td"></td>
//               <td className="preview-th-td">
//                 {' '}
//                 {finalObj1.place_of_supply === 'InterState' && (
//                   <>
//                     <br />
//                     <b>{parseFloat(finalObj1.total_tax)}</b>
//                   </>
//                 )}
//                 {finalObj1.place_of_supply === 'IntraState' && (
//                   <>
//                     <br />
//                     <b>{parseFloat(finalObj1.total_tax) / 2}</b>
//                     <br />
//                     <b>{parseFloat(finalObj1.total_tax) / 2}</b>
//                   </>
//                 )}
//               </td>
//               {/* <td className="preview-th-td">{'        '}</td> */}
//             </tr>

//             <tr className="preview-tr">
//               <td className="preview-th-td"></td>
//               <td className="preview-th-td">
//                 <h4>
//                   {' '}
//                   <b>Total</b>
//                 </h4>{' '}
//               </td>
//               <td className="preview-th-td"></td>
//               <td className="preview-th-td">
//                 <h4>
//                   {' '}
//                   <b>{localStorage.getItem('TotalAmountData')}</b>
//                 </h4>{' '}
//               </td>
//               {/* <td className="preview-th-td">{'        '}</td> */}
//             </tr>
//           </table>
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />

//           <div style={{ paddingRight: 150 }}>
//             <table className="preview-footer-table">
//               <tr className="preview-footer-tr">
//                 <th className="preview-footer-th-td">
//                   Name <br />
//                   <br />
//                   Sijin Stephen <br />
//                   Managing <br />
//                   Director
//                 </th>
//                 <th className="preview-footer-th-td">
//                   Signature <br />
//                   <br />
//                   <br />
//                   <br />
//                   <br />
//                 </th>
//                 <th className="preview-footer-th-td">
//                   Date
//                   <br />
//                   <br />
//                   <br />
//                   {finalObj1.inv_date}
//                   <br />
//                   <br />
//                 </th>
//               </tr>
//             </table>
//           </div>
//           <br></br>
//           <br></br>
//           <br></br>
//         </div>
//         <div>
//           <img src={invoiceFooterImg} width="85%" alt="Loading..." />
//         </div>
//       </div>
//       <br></br>
//       <br></br>
//       <br></br>

//       <div id="id2" hidden>
//         <div>
//           <img src={invoiceHeaderImg} alt="Loading..." />
//         </div>
//         <br />
//         <br />
//         <div style={{ textAlign: 'center' }}>
//           <label style={{ fontSize: 18, fontWeight: 'bold' }}>
//             <b>INVOICE</b>
//           </label>
//         </div>

//         <div style={{ textAlign: 'left' }}>
//           <br />
//           <label
//             style={{
//               paddingLeft: 60,
//               fontWeight: 'bold',
//               fontSize: 15,
//             }}
//           >
//             Date : {finalObj1.inv_date}
//           </label>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <label style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}>
//             Invoice No: {finalObj1.inv_no}
//           </label>
//           <br />
//           <label style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}>
//             GSTIN: {finalObj1.gst_no}
//           </label>
//           <br />
//           <label style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}>
//             SAC Code:{finalObj2[0].hsn}
//           </label>
//         </div>

//         <div style={{ textAlign: 'left' }}>
//           <br />
//           <label
//             style={{
//               paddingLeft: 60,
//               fontWeight: 'bold',
//               fontSize: 15,
//             }}
//           >
//             Bill To
//           </label>
//           <br />

//           <p
//             style={{
//               paddingLeft: 60,
//               fontSize: 15,
//             }}
//           >
//             {finalObj1.bill_address}
//           </p>
//         </div>
//         <div style={{ textAlign: 'left' }}>
//           <br />
//           <label
//             style={{
//               paddingLeft: 60,
//               fontWeight: 'bold',
//               fontSize: 15,
//             }}
//           >
//             Pay To
//           </label>
//           <br />

//           <p
//             style={{
//               paddingLeft: 60,
//               fontSize: 15,
//             }}
//           >
//             INTUISYZ TECHNOLOGIES
//             <br />
//             PRIVATE LIMITED <br />
//             A/c No: 074205500060 <br />
//             ICICI BANK, ANGAMALY, <br />
//             IFSC: ICIC0000742 <br />
//             Swift Code: ICICINBBNRI <br />
//             PANNO: AADCI6383A <br />
//           </p>
//         </div>
//         <br />
//         <div style={{ paddingLeft: 60, paddingRight: 60 }}>
//           <table className="preview-table">
//             <tr className="preview-tr">
//               <th className="preview-th-td">Sl No</th>
//               <th className="preview-th-td">Description</th>
//               <th className="preview-th-td">Qty</th>
//               <th className="preview-th-td"> Amount</th>
//               {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
//             </tr>

//             {finalObj2.map((item, index) => {
//               return (
//                 <tr className="preview-tr" key={index + 1}>
//                   <td className="preview-th-td">{index + 1}</td>
//                   <td className="preview-th-td">{item.description}</td>
//                   <td className="preview-th-td">{item.qty}</td>
//                   <td className="preview-th-td">{item.amount}</td>
//                   {/* <td className="preview-th-td">{'        '}</td> */}
//                 </tr>
//               );
//             })}

//             <tr className="preview-tr">
//               <td className="preview-th-td"></td>
//               <td className="preview-th-td">
//                 {' '}
//                 <b>GST</b>
//                 <br />
//                 {finalObj1.place_of_supply === 'InterState' && (
//                   <b>
//                     IGST ({' '}
//                     {parseInt(
//                       (parseInt(finalObj1.total_tax) /
//                         parseInt(finalObj1.total_amount)) *
//                         100
//                     )}
//                     %){' '}
//                   </b>
//                 )}
//                 {finalObj1.place_of_supply === 'IntraState' && (
//                   <>
//                     <b>
//                       CGST ({' '}
//                       {parseInt(
//                         ((parseFloat(finalObj1.total_tax) /
//                           parseFloat(finalObj1.total_amount)) *
//                           100) /
//                           2
//                       )}{' '}
//                       %){' '}
//                     </b>
//                     <br />
//                     <b>
//                       SGST ({' '}
//                       {parseInt(
//                         ((parseFloat(finalObj1.total_tax) /
//                           parseFloat(finalObj1.total_amount)) *
//                           100) /
//                           2
//                       )}{' '}
//                       %)
//                     </b>
//                   </>
//                 )}
//               </td>
//               <td className="preview-th-td"></td>
//               <td className="preview-th-td">
//                 {' '}
//                 {finalObj1.place_of_supply === 'InterState' && (
//                   <>
//                     <br />
//                     <b>{parseFloat(finalObj1.total_tax)}</b>
//                   </>
//                 )}
//                 {finalObj1.place_of_supply === 'IntraState' && (
//                   <>
//                     <br />
//                     <b>{parseFloat(finalObj1.total_tax) / 2}</b>
//                     <br />
//                     <b>{parseFloat(finalObj1.total_tax) / 2}</b>
//                   </>
//                 )}
//               </td>
//               {/* <td className="preview-th-td">{'        '}</td> */}
//             </tr>

//             <tr className="preview-tr">
//               <td className="preview-th-td"></td>
//               <td className="preview-th-td">
//                 <h4>
//                   {' '}
//                   <b>Total</b>
//                 </h4>{' '}
//               </td>
//               <td className="preview-th-td"></td>
//               <td className="preview-th-td">
//                 <h4>
//                   {' '}
//                   <b>{localStorage.getItem('TotalAmountData')}</b>
//                 </h4>{' '}
//               </td>
//               {/* <td className="preview-th-td">{'        '}</td> */}
//             </tr>
//           </table>
//           <br />
//           <br />

//           <div style={{ paddingRight: 110 }}>
//             <table className="preview-footer-table">
//               <tr className="preview-footer-tr">
//                 <th className="preview-footer-th-td">
//                   Name <br />
//                   <br />
//                   Sijin Stephen <br />
//                   Managing <br />
//                   Director
//                 </th>
//                 <th className="preview-footer-th-td">
//                   Signature <br />
//                   <br />
//                   <br />
//                   <br />
//                   <br />
//                 </th>
//                 <th className="preview-footer-th-td">
//                   Date
//                   <br />
//                   <br />
//                   <br />
//                   {finalObj1.inv_date}
//                   <br />
//                   <br />
//                 </th>
//               </tr>
//             </table>
//           </div>
//           <br></br>
//         </div>
//         <div>
//           <img src={invoiceFooterImg} width="100%" alt="Loading..." />
//         </div>
//       </div>

//       <footer className="invoice-footer">
//         <p>
//           <div style={{ alignItems: 'center', padding: 10 }} align="center">
//             <button
//               type="submit"
//               name="submit"
//               onClick={(e) => {
//                 history.push({
//                   pathname: '/create_invoice',
//                 });
//               }}
//               style={{
//                 backgroundColor: 'green',
//                 width: 100,
//               }}
//             >
//               Back to Edit{' '}
//             </button>
//             &nbsp;
//             <button
//               type="submit"
//               name="submit"
//               style={{ backgroundColor: 'green', width: 100 }}
//               onClick={(e) => {
//                 submitFinal();
//               }}
//             >
//               Save & Print
//             </button>
//           </div>
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default Preview_invoice;
