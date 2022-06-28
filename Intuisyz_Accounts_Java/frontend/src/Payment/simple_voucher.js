import React, { useState, useEffect, useRef } from 'react';
import {
  useHistory,
  useLocation,
  Redirect,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../Base Url/baseUrl';
import Headers from '../Header/Headers';

const Simple_voucher = () => {
  let location = useLocation();
  let history = useHistory();

  // let Ac_group = location.post.ac_group;

  let url = baseUrl.url;

  const [transactionData, setTransactionData] = useState([]);
  const [transactionLoaded, setTransactionLoaded] = useState(false);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        let transactionId = localStorage.getItem('PaymentTransactionId');

        if (transactionId === null || transactionId === undefined) {
          history.push({
            pathname: '/payment_list',
          });
        } else {
          axios
            .get(url + `transaction_search?transactionId=${transactionId}`)
            .then(({ data }) => {
              console.log(data);
              setTransactionData(data);
              setTransactionLoaded(true);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        console.log('location.post.transactionID', location.post.transactionID);
        let transactionId = location.post.transactionID;

        axios
          .get(url + `transaction_search?transactionId=${transactionId}`)
          .then(({ data }) => {
            console.log(data);
            setTransactionData(data);
            setTransactionLoaded(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }

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
      setEndDate(eDate);
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  function prints(el) {
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById('printrec').innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage;
    window.location.reload();
  }

  return (
    <div>
      <Headers />

      {transactionLoaded && (
        <div className="container-fluid" id="content">
          <div id="main">
            <div className="container-fluid">
              <div className="page-header">
                <div className="pull-left">
                  <h1>View Payment</h1>
                </div>
              </div>
              <br />
              {/*-form ends here-*/}
              <div className="row" style={{ paddingLeft: '22px' }}>
                <div className="col-sm-10">
                  <div className="box box-color box-bordered" id="printrec">
                    <div className="box-title"></div>
                    <div className="box-content nopadding">
                      <h3 style={{ textAlign: 'center' }}>VOUCHER</h3>
                      <br />
                      <div className="invoice-info">
                        <div
                          className="invoice-from"
                          style={{ paddingLeft: '25px' }}
                        >
                          <strong>{transactionData[0].dbt_ac}</strong>
                          <address>
                            {transactionData[0].filepath}
                            <br />
                            {transactionData[0].filename}, ZIP code:
                            {transactionData[0].tran_gen}
                            <br />
                            <abbr title="Phone">Phone:</abbr>
                            {transactionData[0].createdDate}
                            <br />
                            <abbr title="Fax">Fax:</abbr>
                            {transactionData[0].createdTime}
                          </address>
                        </div>
                        <div className="invoice-infos">
                          <table>
                            <tbody>
                              <tr>
                                <th>Reciept No:</th>
                                <td>
                                  VCHR
                                  {transactionData[0].tranID}
                                </td>
                              </tr>
                              <tr>
                                <th>Date:</th>
                                <td>{endDate}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Party:</th>
                            <td> {transactionData[0].dbt_ac}</td>
                          </tr>
                          <tr>
                            <th>Amount:</th>
                            <td> {transactionData[0].amount}</td>
                          </tr>
                          <tr>
                            <th>Payment Mode:</th>
                            <td> {transactionData[0].mode}</td>
                          </tr>
                          <tr>
                            <th>Narration:</th>
                            <td>{transactionData[0].description}</td>
                          </tr>
                        </tbody>
                      </table>
                      <br />
                      <br />
                      <br />
                      <br />
                      <div className="invoice-info">
                        <div className="invoice-infos">
                          Authorised Signatory.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <br />
              <div className="row" style={{ textAlign: 'center' }}>
                <button
                  onClick={(e) => {
                    prints('printrec');
                  }}
                  className="btn btn-danger"
                >
                  Print
                </button>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simple_voucher;
