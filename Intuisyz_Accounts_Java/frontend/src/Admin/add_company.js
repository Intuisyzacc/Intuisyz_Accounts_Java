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

const Add_company = () => {
  let url = baseUrl.url;

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
    let company_name = data.CompanyName;

    let finalObj1 = {};
    finalObj1.company_name = company_name;

    axios
      .post(url + 'addCompany', finalObj1)
      .then((data) => {
        console.log('company added successfully');
        successToast('company added Successfully');

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
                <input
                  class="form-control"
                  type="text"
                  // placeholder="Default input"
                  name="CompanyName"
                  id="CompanyName"
                  {...register('CompanyName', {
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
                {errors.CompanyName && <p>Please enter Company Name</p>}
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

export default Add_company;
