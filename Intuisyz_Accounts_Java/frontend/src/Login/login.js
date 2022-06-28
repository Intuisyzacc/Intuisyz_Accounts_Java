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
import { useCookies } from 'react-cookie';
import bcrypt from 'bcryptjs';

const Login = () => {
  let url = baseUrl.url;
  let history = useHistory();
  let location = useLocation();
  console.log('history.go back', window.location.pathname);

  const [cookies, setCookie] = useCookies(['user']);
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');

  var CryptoJS = require('crypto-js');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const submitFinal = handleSubmit((data) => {
    getData();
    let userName = data.username;
    let passWord = data.password;

    // const hashedPassword = bcrypt.hashSync(
    //   passWord,
    //   '$2a$10$CwTycUXWue0Thq9StjUM0u'
    // ); // hash created previously created upon sign up

    // var ciphertext = CryptoJS.AES.encrypt(
    //   passWord,
    //   'my-secret-key@123'
    // ).toString();

    console.log('userName', userName, '  ', 'password', passWord, ' ');

    axios
      .get(url + `login?userName=${userName}&password=${passWord}`)
      .then(({ data }) => {
        console.log('login credential', data);

        let code = data;

        var bytes = CryptoJS.AES.decrypt(data, 'my-secret-key@123');
        var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        console.log('decryptedData', decryptedData);

        if (decryptedData === passWord) {
          axios
            .get(url + `loginDetails?userName=${userName}&password=${passWord}`)
            .then(({ data }) => {
              console.log('login details', data);

              if (data[0].user_type === 'Admin') {
                sessionStorage.setItem('logDetails', true);
                history.push({
                  pathname: '/userView',
                });
              } else {
                setName(data);

                sessionStorage.setItem('logDetails', true);
                sessionStorage.setItem('CompanyName', data[0].company_name);
                sessionStorage.setItem('CustId', data[0].cust_id);

                sessionStorage.setItem('cashIdVal', data[0].cashId);
                sessionStorage.setItem('gstIdVal', data[0].gstId);
                sessionStorage.setItem('tdsIdVal', data[0].tdsId);

                history.push({
                  pathname: '/',
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          sessionStorage.setItem('logDetails', false);
          history.push({
            pathname: '/login',
          });

          history.pushState(null, null, location.href);
          window.onpopstate = function (event) {
            history.go(1);
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const getData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/');
    console.log(res.data);
    //setIP(res.data.IPv4);
  };

  return (
    <div className="loginBody">
      <div className="wrapper-container">
        <a href="index-2.html">
          <img
            src="img/logo-big.png"
            alt=""
            className="retina-ready"
            width={59}
            height={49}
          />
        </a>
      </div>
      <div>Accounts</div>
      <div id="login-form-wrap">
        <h2>SIGN IN</h2>
        <form id="login-form">
          <p>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User Name"
              required
              {...register('username')}
            />
          </p>
          <p>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              {...register('password')}
            />
          </p>
          <p className="textAlignRight">
            <input
              type="submit"
              id="login"
              value="Sign me in"
              style={{
                width: '30%',
              }}
              onClick={(e) => {
                e.preventDefault();
                submitFinal();
              }}
            />
          </p>
        </form>
        <div id="create-account-wrap">
          <p>
            <Link to="/forgotPassword">Forgot Password?</Link>
          </p>
        </div>
        {/*create-account-wrap*/}
      </div>
    </div>
  );
};
export default Login;
