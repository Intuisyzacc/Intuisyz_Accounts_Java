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

const Simple_reciept = () => {
  let location = useLocation();
  let history = useHistory();

  // let Ac_group = location.post.ac_group;

  let url = baseUrl.url;

  const [transactionData, setTransactionData] = useState([]);
  const [transactionLoaded, setTransactionLoaded] = useState(false);
  const [ledgerData, setLedgerData] = useState([]);
  const [ledgerLoaded, setLedgerLoaded] = useState(false);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        let transactionId = localStorage.getItem('RecieptTransactionId');
        let ledger_id = localStorage.getItem('RecieptLedger_id');

        if (
          ledger_id === null ||
          ledger_id === undefined ||
          transactionId === null ||
          transactionId === undefined
        ) {
          history.push({
            pathname: '/reciept_list',
          });
        } else {
          axios
            .get(url + `transaction_search?transactionId=${transactionId}`)
            .then(({ data }) => {
              console.log('transaction data', data);
              setTransactionData(data);
              setTransactionLoaded(true);
            })
            .catch((err) => {
              console.log(err);
            });

          axios
            .get(url + `ledger_search?ledgerId=${ledger_id}`)
            .then(({ data }) => {
              console.log('ledger data', data);
              setLedgerData(data);
              setLedgerLoaded(true);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        console.log('location.post.transactionID', location.post.transactionID);
        let transactionId = location.post.transactionID;
        let ledger_id = location.post.createdBy;

        axios
          .get(url + `transaction_search?transactionId=${transactionId}`)
          .then(({ data }) => {
            console.log('transaction data', data);
            setTransactionData(data);
            setTransactionLoaded(true);
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(url + `ledger_search?ledgerId=${ledger_id}`)
          .then(({ data }) => {
            console.log('ledger data', data);
            setLedgerData(data);
            setLedgerLoaded(true);
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
    // window.open(printcontent, '_blank');
  }

  return (
    <div>
      <Headers />
      {transactionLoaded && ledgerLoaded && (
        <div className="container-fluid" id="content">
          <div id="main">
            <div className="container-fluid">
              <div className="page-header flexHeader">
                <h1>View Reciept</h1>
              </div>
            </div>
            <div className="container">
              {/*-form ends here-*/}
              <div className="row">
                <div className="col-sm-12">
                  <div className="box box-color box-bordered" id="printrec">
                    <div className="box-title"></div>
                    <div className="box-content">
                      <h3 style={{ textAlign: 'center' }}>RECIEPT</h3>
                      <br />
                      <div className="invoice-info">
                        <div className="invoice-from">
                          <strong>{ledgerData[0].ledger_name}</strong>
                          <address>
                            {ledgerData[0].address}
                            <br />
                            {ledgerData[0].state}, ZIP code:
                            {ledgerData[0].pin}
                            <br />
                            <abbr title="Phone">Phone:</abbr>
                            {ledgerData[0].contact}
                            <br />
                            <abbr title="Fax">Fax:</abbr>
                            {ledgerData[0].fax}
                          </address>
                        </div>
                        <div className="invoice-infos">
                          <table style={{ textAlign: 'right' }}>
                            <tbody>
                              <tr>
                                <th>Reciept No:</th>
                                <td>RCPT{transactionData[0].tranID}</td>
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
                            <td>{ledgerData[0].ledger_name}</td>
                          </tr>
                          <tr>
                            <th>Amount:</th>
                            <td>{transactionData[0].amount}</td>
                          </tr>
                          <tr>
                            <th>Payment Mode:</th>
                            <td>{transactionData[0].mode}</td>
                          </tr>
                          <tr>
                            <th>Narration:</th>
                            <td>{transactionData[0].description}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="invoice-info margi100">
                        <div className="invoice-infos">
                          Authorised Signatory.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="printBtn">
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

export default Simple_reciept;
