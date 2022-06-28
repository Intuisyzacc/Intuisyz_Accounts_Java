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
import Create_user from '../Admin/create_user';
import Edit_user from '../Admin/edit_user';
import Add_company from '../Admin/add_company';

const User_view = () => {
  let url = baseUrl.url;

  let location = useLocation();
  let history = useHistory();

  const [userList, setUserList] = useState();
  const [userListLoaded, setUserListLoaded] = useState();
  const [editVal, setEditVal] = useState('dffgdfgfg');
  const [userTypeVal, setUserTypeVal] = useState();

  function deleting(userId) {
    axios
      .delete(url + `userDelete/${userId}`)
      .then(({ data }) => {
        console.log(data);

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
  }

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      axios
        .get(url + 'userList')
        .then(({ data }) => {
          setUserList(data);
          console.log('user data', data);
          setUserListLoaded(true);
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
      {userListLoaded && (
        <>
          <Container>
            <div>
              <h1>Users</h1>
            </div>

            <div className="InvoiceDashBoardRightBtns">
              <input
                type="button"
                value="Add User"
                data-toggle="modal"
                data-target="#modalContactForm"
                className="button-style"
              />
              <input
                type="button"
                value="Add Company"
                data-toggle="modal"
                data-target="#modalCompanyForm"
                className="button-style"
              />

              <input
                type="button"
                value="Logout"
                onClick={() => {
                  sessionStorage.setItem('logDetails', false);
                  history.push({
                    pathname: '/login',
                  });
                }}
                className="button-style"
              />
            </div>
            <br />
            <div>
              <div className="table-responsive">
                <table className="invoice-table table">
                  <tr className="invoice-tr">
                    <th className="invoice-th-td">User Name</th>
                    <th className="invoice-th-td">Company</th>
                    <th className="invoice-th-td">Type</th>
                    <th className="invoice-th-td ">Action</th>
                  </tr>

                  {userList.map((x, i) => {
                    return (
                      <tr className="invoice-tr" key={x.inv_id}>
                        <td className="invoice-th-td">{x.user_name}</td>
                        <td className="invoice-th-td">{x.company_name}</td>
                        <td className="invoice-th-td">{x.user_type}</td>

                        <td className="invoice-th-td">
                          <div className="actionButton">
                            <button
                              outlined
                              className="primary"
                              onClick={() => {
                                // history.push({
                                //   pathname: '/editUser',
                                //   post: x,
                                // });
                                sessionStorage.setItem('editUserId', x.id);
                                setEditVal(x);
                                setUserTypeVal(x.user_type);
                              }}
                              data-toggle="modal"
                              data-target="#modalEditForm"
                              //disabled={inputList.length - i !== 1 ? true : false}
                            >
                              Edit
                            </button>

                            <button
                              className="deletebtn"
                              onClick={(e) => {
                                confirmAlert({
                                  title: 'Confirm to Delete',
                                  message: 'Are you sure to do this.',
                                  buttons: [
                                    {
                                      label: 'Yes',
                                      onClick: () => deleting(x.id),
                                    },
                                    {
                                      label: 'No',
                                    },
                                  ],
                                });
                              }}
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </table>

                {/* ///////////create modal///////// */}
                <div
                  className="modal fade"
                  id="modalEditForm"
                  tabIndex={-1}
                  role="dialog"
                  aria-labelledby="myModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header text-center">
                        <h4 className="modal-title w-100 font-weight-bold">
                          Edit User
                        </h4>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span
                            aria-hidden="true"
                            onClick={(e) => {
                              window.location.reload();
                            }}
                          >
                            x
                          </span>
                        </button>
                      </div>
                      <Edit_user EditVal={editVal} UserTypes={userTypeVal} />
                    </div>
                  </div>
                </div>

                <div
                  className="modal fade"
                  id="modalCompanyForm"
                  tabIndex={-1}
                  role="dialog"
                  aria-labelledby="myModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header text-center">
                        <h4 className="modal-title w-100 font-weight-bold">
                          Add Company
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
                      <Add_company />
                    </div>
                  </div>
                </div>

                {/* //////////edit user////////// */}

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
                          Add User
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
                      <Create_user />
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer />
            </div>
          </Container>
        </>
      )}
    </div>
  );
};

export default User_view;
