import React, { useState, useEffect, useRef } from 'react';
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
import { parse } from 'uuid';
import Modal from 'react-modal';
import '../Login/style.css';
import '../Invoice/style_invoice.css';
import { Container } from 'react-bootstrap';
import bcrypt from 'bcryptjs';

const Create_user = () => {
  let url = baseUrl.url;

  let location = useLocation();
  let history = useHistory();

  const [companyData, setCompanyData] = useState();
  const [companyDataLoaded, setCompanyDataLoaded] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  let CustId = uuid();

  const submitFinal = handleSubmit((data) => {
    let company_name = data.CompanyName;
    let user_name = data.UserName;
    let password = data.Password;
    let user_type = data.UserType;

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

    axios
      .get(url + `companySearch?companyName=${company_name}`)
      .then(({ data }) => {
        console.log('login details', data);

        if (data.length > 0) {
          ////////Add user Code////////////

          // const hashedPassword = bcrypt.hashSync(
          //   password,
          //   '$2a$10$CwTycUXWue0Thq9StjUM0u'
          // ); // hash created previously created upon sign up

          var CryptoJS = require('crypto-js');

          var ciphertext = CryptoJS.AES.encrypt(
            password,
            'my-secret-key@123'
          ).toString();

          let finalObj1 = {};
          finalObj1.company_name = company_name;
          finalObj1.user_name = user_name;
          finalObj1.password = ciphertext;
          finalObj1.user_type = user_type;
          finalObj1.cust_id = CustId;

          finalObj1.cashId = data[0].cashId;
          finalObj1.gstId = data[0].gstId;
          finalObj1.tdsId = data[0].tdsId;

          console.log('Add User Data', finalObj1);

          axios
            .post(url + 'addUser', finalObj1)
            .then((data) => {
              console.log('user added successfully');
              successToast('user added Successfully');

              setTimeout(function () {
                window.location.reload();
                history.push({
                  pathname: '/userView',
                });
              }, 1000);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          /////////Cash ledger///////////

          let finalObj = {};

          finalObj.ledger_name = 'Cash';

          finalObj.ac_group = '6';
          finalObj.name = '';
          finalObj.address = '';
          finalObj.state = '';
          finalObj.pin = '';
          finalObj.contact = '';
          finalObj.mobile = '';
          finalObj.fax = '';
          finalObj.email = '';
          finalObj.acc_number = '';
          finalObj.bank = 'Nil';
          finalObj.branch = 'Nil';
          finalObj.ifsc_code = '';
          finalObj.open_balance = 0;
          finalObj.amount = 0;
          //account id
          finalObj.created_date = cDate;
          finalObj.time = cTime;
          //userId
          finalObj.balance_type = 'debit';
          finalObj.ledger_date = cDate;

          finalObj.company_name = company_name;
          finalObj.cust_id = CustId;

          finalObj.ac_type = '1';
          finalObj.ac_title = '1';

          ///////////gst ledger///////////

          let finalObj2 = {};

          finalObj2.ledger_name = 'GST Payable';

          finalObj2.ac_group = '8';
          finalObj2.name = '';
          finalObj2.address = '';
          finalObj2.state = '';
          finalObj2.pin = '';
          finalObj2.contact = '';
          finalObj2.mobile = '';
          finalObj2.fax = '';
          finalObj2.email = '';
          finalObj2.acc_number = 'Nil';
          finalObj2.bank = 'Nil';
          finalObj2.branch = 'Nil';
          finalObj2.ifsc_code = 'Nil';
          finalObj2.open_balance = 0;
          finalObj2.amount = 0;
          //account id
          finalObj2.created_date = cDate;
          finalObj2.time = cTime;
          //userId
          finalObj2.balance_type = 'credit';
          finalObj2.ledger_date = cDate;

          finalObj2.company_name = company_name;
          finalObj2.cust_id = CustId;

          finalObj2.ac_type = '2';
          finalObj2.ac_title = '3';

          ////////////tds ledger/////////////

          let finalObj3 = {};

          finalObj3.ledger_name = 'TDS Receivable';

          finalObj3.ac_group = '7';
          finalObj3.name = '';
          finalObj3.address = '';
          finalObj3.state = '';
          finalObj3.pin = '';
          finalObj3.contact = '';
          finalObj3.mobile = '';
          finalObj3.fax = '';
          finalObj3.email = '';
          finalObj3.acc_number = 'Nil';
          finalObj3.bank = 'Nil';
          finalObj3.branch = 'Nil';
          finalObj3.ifsc_code = 'Nil';
          finalObj3.open_balance = 0;
          finalObj3.amount = 0;
          //account id
          finalObj3.created_date = cDate;
          finalObj3.time = cTime;
          //userId
          finalObj3.balance_type = 'debit';
          finalObj3.ledger_date = cDate;

          finalObj3.company_name = company_name;
          finalObj3.cust_id = CustId;

          finalObj3.ac_type = '1';
          finalObj3.ac_title = '1';

          axios
            .post(url + 'add_ledger', finalObj)
            .then(() => {
              console.log('cash ledger created');

              axios
                .post(url + 'add_ledger', finalObj2)
                .then(() => {
                  console.log('gst ledger created');

                  axios
                    .post(url + 'add_ledger', finalObj3)
                    .then(() => {
                      console.log('tds ledger created');

                      axios
                        // .get('http://localhost:8080/last_id_search')
                        .get(url + 'last_id_search')
                        .then(({ data }) => {
                          let lastId = data[data.length - 1].id;
                          console.log('last Id', lastId);

                          ////////Add user Code////////////

                          // const hashedPassword = bcrypt.hashSync(
                          //   password,
                          //   '$2a$10$CwTycUXWue0Thq9StjUM0u'
                          // ); // hash created previously created upon sign up

                          var CryptoJS = require('crypto-js');

                          var ciphertext = CryptoJS.AES.encrypt(
                            password,
                            'my-secret-key@123'
                          ).toString();

                          let finalObj1 = {};
                          finalObj1.company_name = company_name;
                          finalObj1.user_name = user_name;
                          finalObj1.password = ciphertext;
                          finalObj1.user_type = user_type;
                          finalObj1.cust_id = CustId;

                          finalObj1.cashId = lastId - 2;
                          finalObj1.gstId = lastId - 1;
                          finalObj1.tdsId = lastId;

                          console.log('Add User Data', finalObj1);

                          axios
                            .post(url + 'addUser', finalObj1)
                            .then((data) => {
                              console.log('user added successfully');
                              successToast('user added Successfully');

                              setTimeout(function () {
                                window.location.reload();
                                history.push({
                                  pathname: '/userView',
                                });
                              }, 1000);
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
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });

          ////////////profile data added/////////

          let finalObj5 = {};
          finalObj5.organization_name = company_name;
          finalObj5.industry = '';
          finalObj5.location = 'India';
          finalObj5.street1 = '';
          finalObj5.street2 = '';
          finalObj5.city = '';
          finalObj5.state = '';
          finalObj5.zip = '';
          finalObj5.phone = '';
          finalObj5.fax = '';
          finalObj5.website = '';
          finalObj5.ifsc = '';
          finalObj5.swift_code = '';
          finalObj5.pan_no = '';
          finalObj5.acc_no = '';
          finalObj5.bank = '';
          finalObj5.branch = '';
          finalObj5.fiscal_year = '';
          finalObj5.time_zone = '(GMT 5:30) India Standard Time';
          finalObj5.date_format = '';
          finalObj5.company_id = '';
          finalObj5.gst_id = '';
          finalObj5.signatory_name = '';
          finalObj5.signatory_designation = '';
          finalObj5.gmail = '';

          finalObj5.company_name = company_name;
          finalObj5.cust_id = '';

          axios
            .post(url + 'add_profile', finalObj5)
            .then((data) => {
              console.log('profile added successfully');
              successToast('profile added Successfully');
            })
            .catch((err) => {
              console.log(err);
            });

          ////////Template data added//////////

          let finalObj6 = {};

          finalObj6.template_payTo = '';
          finalObj6.template_Name = '';
          finalObj6.template_companyAddress = '';
          finalObj6.template_companyName = '';
          finalObj6.template_companyContact = '';

          finalObj6.template_logo = 'default_company_logo_here.png';
          finalObj6.template_sig = '';

          finalObj6.company_name = company_name;
          finalObj6.cust_id = '';

          axios
            .post(url + 'add_template', finalObj6)
            .then((data) => {
              console.log('template added successfully');
              successToast('template added Successfully');
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      axios
        .get(url + 'companyList')
        .then(({ data }) => {
          setCompanyData(data);
          console.log('company data', data);
          setCompanyDataLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push({
        pathname: '/login',
      });
    }
    return;
  }, []);

  return (
    <div>
      <div>
        <div class="container" style={{ marginLeft: '-90px' }}>
          <form>
            <br></br>
            <br></br>
            <div class="form-group row ">
              <label for="OrganizationName" class="col-sm-4 col-form-label">
                Company Name <span style={{ color: 'red' }}>*</span>
              </label>
              <div class="col-sm-2">
                <select
                  class="form-control"
                  name="CompanyName"
                  id="CompanyName"
                  {...register('CompanyName', {
                    required: true,
                  })}
                  style={{ fontSize: '12.5px' }}
                >
                  <option value="">---Select--- </option>
                  {companyDataLoaded &&
                    companyData.map((item) => {
                      return (
                        <option key={item.company_id} value={item.company_name}>
                          {item.company_name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div
                style={{
                  color: 'red',
                  paddingTop: 5,
                  textAlign: 'left',
                }}
              >
                {errors.CompanyName && <p>Please enter Company Name</p>}
              </div>
            </div>

            <div class="form-group row ">
              <label for="OrganizationName" class="col-sm-4 col-form-label">
                User Name <span style={{ color: 'red' }}>*</span>
              </label>
              <div class="col-sm-2">
                <input
                  class="form-control"
                  type="text"
                  // placeholder="Default input"
                  name="UserName"
                  id="UserName"
                  {...register('UserName', {
                    required: true,
                  })}
                  style={{ fontSize: '12.5px' }}
                />
              </div>
              <div
                style={{
                  color: 'red',
                  paddingTop: 5,
                  textAlign: 'left',
                }}
              >
                {errors.UserName && <p>Please enter User Name</p>}
              </div>
            </div>

            <div class="form-group row ">
              <label for="OrganizationName" class="col-sm-4 col-form-label">
                Password <span style={{ color: 'red' }}>*</span>
              </label>
              <div class="col-sm-2">
                <input
                  class="form-control"
                  type="text"
                  // placeholder="Default input"
                  name="Password"
                  id="Password"
                  {...register('Password', {
                    required: true,
                  })}
                  style={{ fontSize: '12.5px' }}
                />
              </div>
              <div
                style={{
                  color: 'red',
                  paddingTop: 5,
                  textAlign: 'left',
                }}
              >
                {errors.Password && <p>Please enter Password</p>}
              </div>
            </div>

            <div class="form-group row ">
              <label for="OrganizationName" class="col-sm-4 col-form-label">
                User Type <span style={{ color: 'red' }}>*</span>
              </label>
              <div class="col-sm-2">
                <select
                  class="form-control"
                  name="UserType"
                  id="UserType"
                  {...register('UserType', {
                    required: true,
                  })}
                  style={{ fontSize: '12.5px' }}
                >
                  <option value="">---Select--- </option>
                  <option value="Admin">Admin </option>
                  <option value="User">User</option>
                </select>
              </div>
              <div
                style={{
                  color: 'red',
                  paddingTop: 5,
                  textAlign: 'left',
                }}
              >
                {errors.UserType && <p>Please enter User Type</p>}
              </div>
            </div>
            <div>
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
                  color: 'white',
                  margin: 30,
                }}
              >
                Add{' '}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create_user;
