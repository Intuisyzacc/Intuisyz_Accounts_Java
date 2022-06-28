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

const Forgot_password = () => {
  let url = baseUrl.url;
  let history = useHistory();
  let location = useLocation();

  const [cpasswordFlag, setCpasswordFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const submitFinal = handleSubmit((data) => {
    let userName = data.username;
    let newPassword = data.password;
    let cpassword = data.cpassword;

    if (newPassword !== cpassword) {
      setCpasswordFlag(true);
    } else {
      setCpasswordFlag(false);
      console.log(
        'userName',
        userName,
        '  ',
        'password',
        newPassword,
        ' ',
        'cpassword',
        cpassword
      );

      axios
        .get(url + `userSearch?userName=${userName}`)
        .then(({ data }) => {
          console.log('user data ', data);

          let finalObj = {};

          if (data.length === 1) {
            console.log('data.length', data.length);
            finalObj.id = data[0].id;
            finalObj.password = newPassword;
            finalObj.user_id = data[0].user_id;
            finalObj.user_name = data[0].user_name;

            axios
              .put(url + `forgot_password/${finalObj.id}`, finalObj)
              .then(({ data }) => {
                console.log('password updated');
                successToast('password updated');

                setTimeout(function () {
                  history.push({
                    pathname: '/login',
                  });
                }, 1500);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setUserFlag(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // axios
    //   .get(url + `login?userName=${userName}&password=${password}`)
    //   .then(({ data }) => {
    //     console.log('login details', data);

    //     if (data === 'success') {
    //       sessionStorage.setItem('logDetails', true);
    //       history.push({
    //         pathname: '/',
    //       });
    //     } else {
    //       sessionStorage.setItem('logDetails', false);
    //       history.push({
    //         pathname: '/login',
    //       });

    //       history.pushState(null, null, location.href);
    //       window.onpopstate = function (event) {
    //         history.go(1);
    //       };
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  });

  return (
    <div className="loginBody">
      <div style={{ display: 'flex' }}>
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
      <br></br>
      <div
        style={{
          fontSize: 45,
          color: 'white',
          fontWeight: 100,
        }}
      >
        Accounts
      </div>
      <div id="login-form-wrap">
        <h2
          style={{
            position: 'relative',
            textAlign: 'center',
          }}
        >
          {' '}
          Forgot Password
        </h2>
        <form id="login-form">
          <p style={{ margin: '25px 0 0 0' }}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User Name"
              required
              {...register('username', { required: true })}
            />
            <div style={{ color: 'red' }}>
              {errors.username && <p>Please enter email </p>}
              {userFlag && <p>Enter a registered Email Id</p>}
            </div>
          </p>
          <p style={{ margin: '20px 0 0 0' }}>
            <input
              type="Password"
              id="password"
              name="password"
              placeholder="Password"
              {...register('password', { required: true })}
            />
            <div style={{ color: 'red' }}>
              {errors.password && <p>Please enter password </p>}
              {/* {validationMsg && (
                                        <p>Ledger Name is repeated.</p>
                                      )} */}
            </div>
          </p>
          <p style={{ margin: '20px 0 0 0' }}>
            <input
              type="Password"
              id="cpassword"
              name="cpassword"
              placeholder="Confirm Password"
              {...register('cpassword', { required: true })}
            />
            <div style={{ color: 'red' }}>
              {errors.cpassword && <p>Please enter password again</p>}
              {cpasswordFlag && <p>Password mismatch</p>}
            </div>
          </p>
          <p style={{ margin: '20px 0 50px 0 ' }}>
            <input
              type="submit"
              id="login"
              value="Submit"
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
            <Link to="/login" style={{ color: '#555' }}>
              Sign In ?
            </Link>
          </p>
          <p></p>
        </div>
        {/*create-account-wrap*/}
      </div>
      <div width="100%" height="100%">
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Forgot_password;
