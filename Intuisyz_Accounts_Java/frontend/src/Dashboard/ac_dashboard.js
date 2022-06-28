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

const Ac_dashboard = () => {
  let url = baseUrl.url;

  let location = useLocation();
  let history = useHistory();

  const [cashData, setCashData] = useState();
  const [bankData, setBankData] = useState();
  const [cashDataLoaded, setCashDataLoaded] = useState(false);
  const [bankDataLoaded, setBankDataLoaded] = useState(false);

  let amnt = 0;

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      axios
        .get(url + 'ac_dashboardCashData')
        .then(({ data }) => {
          setCashData(data);
          console.log('cash data', data);
          setCashDataLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(url + 'ac_dashboardBankData')
        .then(({ data }) => {
          console.log('bank data', data);

          for (let i = 0; i < data.length; i++) {
            amnt = amnt + parseFloat(data[i].amount);
          }
          console.log('bank amount', amnt);
          setBankData(amnt);
          setBankDataLoaded(true);
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

  function addCommas(nStr) {
    return format(parseFloat(nStr));
  }

  const format = (num, decimals) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div>
      <Headers />
      {cashDataLoaded && bankDataLoaded && (
        <div className="container-fluid" id="content">
          {/* header include*/}
          {/*?php include("../include_files/sidemenu.php") ?*/}
          {/* header include*/}
          <div id="main">
            <div className="container-fluid">
              <div className="page-header">
                <div className="pull-left">
                  <h1>Dashboard</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="box box-color box-bordered">
                    <div className="box-title">
                      <h3></h3>
                    </div>
                    <div className="box-content nopadding">
                      <ul className="tabs tabs-inline tabs-top">
                        <li className="active">
                          <a href="#profile" data-toggle="tab">
                            Cash Position
                          </a>
                        </li>
                        <li>
                          <a href="#notifications" data-toggle="tab">
                            Top Payables
                          </a>
                        </li>
                        <li>
                          <a href="#security" data-toggle="tab">
                            Top Recievables
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content padding tab-content-inline tab-content-bottom">
                        <div className="tab-pane active" id="profile">
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="box-content nopadding box-bordered">
                                <table className="table table-hover table-nomargin table-colored-header table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Account</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Cash in hand</td>
                                      <td align="right">
                                        {addCommas(cashData[0].amount)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Bank Account</td>
                                      <td align="right">
                                        {addCommas(bankData)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane" id="notifications">
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="box-content nopadding box-bordered">
                                <table className="table table-hover table-nomargin table-colored-header table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Date</th>
                                      <th>Party</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td colSpan={3}>
                                        <p
                                          align="center"
                                          style={{ color: '#F00' }}
                                        >
                                          <a href="payable.php">
                                            &gt;&gt;More..
                                          </a>
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane" id="security">
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="box-content nopadding box-bordered">
                                <table className="table table-hover table-nomargin table-colored-header table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Date</th>
                                      <th>Customer</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td colSpan={3}>
                                        <p
                                          align="center"
                                          style={{ color: '#F00' }}
                                        >
                                          <a href="recievable.php">
                                            &gt;&gt;More..
                                          </a>
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ac_dashboard;
