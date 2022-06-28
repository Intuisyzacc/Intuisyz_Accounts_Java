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

const Edit_user = (props) => {
  let url = baseUrl.url;

  var CryptoJS = require('crypto-js');

  let jj = props.EditVal.id;

  let location = useLocation();
  let history = useHistory();

  const [editVal, setEditVal] = useState();
  const [dataLoad, setDataLoad] = useState(false);
  //   console.log('user_type', props.EditVal.id);
  //   console.log('edit val', JSON.stringify(props.UserTypes));

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

  const submitFinal = handleSubmit((data) => {
    // const hashedPassword = bcrypt.hashSync(
    //   data.Password,
    //   '$2a$10$CwTycUXWue0Thq9StjUM0u'
    // ); // hash created previously created upon sign up

    var CryptoJS = require('crypto-js');

    var ciphertext = CryptoJS.AES.encrypt(
      data.Password,
      'my-secret-key@123'
    ).toString();

    let finalObj1 = {};
    finalObj1.id = props.EditVal.id;
    finalObj1.company_name = data.CompanyName;
    finalObj1.user_name = data.UserName;
    finalObj1.password = ciphertext;
    finalObj1.user_type = data.UserType;
    finalObj1.cust_id = props.EditVal.cust_id;

    finalObj1.cashId = props.EditVal.cashId;
    finalObj1.gstId = props.EditVal.gstId;
    finalObj1.tdsId = props.EditVal.tdsId;

    console.log('Add User Data', finalObj1);

    axios
      .put(url + `editUser/${finalObj1.id}`, finalObj1)
      .then(({ data }) => {
        console.log('user updated');
        successToast('user updated');

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
  });

  function dataloading(pp) {
    console.log('jj', jj);
    axios
      .get(url + `userSearchById?id=${pp}`)
      .then(({ data }) => {
        console.log('user data ', data);

        var bytes = CryptoJS.AES.decrypt(data[0].password, 'my-secret-key@123');
        var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        data[0].password = decryptedData;

        setEditVal(data);
        setDataLoad(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //   if (props.EditVal.id !== null) {
  //     dataloading();
  //   }

  useEffect(() => {
    //   if (props.EditVal.id !== null) {
    //     let ss = props.EditVal.user_type;
    //     setEditVal(props.EditVal);
    //     dataloading();
    //     // if (props.UserTypes == 'Admin') {
    //     //   setEditVal('Admin');
    //     //   setDataLoad(true);
    //     // }
    //     setDataLoad(true);
    //   }
    console.log('useEffect props id', props.EditVal.id);

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

    dataloading(props.EditVal.id);
  }, [props.EditVal]);

  return (
    <div>
      <div>
        {dataLoad && (
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
                    defaultValue={editVal[0].company_name}
                  >
                    <option value="">---Select--- </option>
                    {companyDataLoaded &&
                      companyData.map((item) => {
                        return (
                          <option
                            key={item.company_id}
                            value={item.company_name}
                          >
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
                    defaultValue={editVal[0].user_name}
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
                    defaultValue={editVal[0].password}
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
                    defaultValue={editVal[0].user_type}
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
                  Update{' '}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit_user;
