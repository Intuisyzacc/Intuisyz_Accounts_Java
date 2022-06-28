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

const Ac_view_ledger = () => {
  let location = useLocation();
  let history = useHistory();

  const [ledgerData, setLedgerData] = useState([]);
  const [ledgerLoaded, setLedgerLoaded] = useState(false);

  const [ac_groupData, setAc_groupData] = useState();

  let url = baseUrl.url;

  let custId, companyName;

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        history.push({
          pathname: '/account_statement',
        });
      } else {
        companyName = sessionStorage.getItem('CompanyName');
        custId = sessionStorage.getItem('CustId');

        console.log('location.post.ledger_id', location.post.id);
        let ledgerId1 = location.post.id;
        let Ac_group1 = location.post.group_name;

        setAc_groupData(Ac_group1);
        axios
          //.get(`http://localhost:8080/ledger_search?ledgerId=${ledgerId}`)
          .get(url + `ledger_search?ledgerId=${ledgerId1}`)
          .then(({ data }) => {
            console.log(data);

            if (data.length > 0) {
              setLedgerData(data);
            }
            setLedgerLoaded(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  return (
    <div>
      <Headers />
      {ledgerLoaded &&
        (ledgerData.length > 0 ? (
          <div className="container-fluid" id="content">
            <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
              <div className="container-fluid">
                <div className="page-header">
                  <div className="pull-left">
                    <h1>View Ledger</h1>
                  </div>
                  <div className="pull-right"></div>
                </div>
                <br />
                {/*-form ends here-*/}
                <div className="row" style={{ paddingLeft: '22px' }}>
                  <div className="col-sm-10">
                    <div className="box box-color box-bordered">
                      <div className="box-title"></div>
                      <div className="box-content nopadding">
                        <table className="table table-hover table-nomargin table-bordered">
                          <tbody>
                            <tr>
                              <th>Date</th>
                              <td>{ledgerData[0].created_date} </td>
                            </tr>
                            <tr>
                              <th>Ledger Name</th>
                              <td>{ledgerData[0].ledger_name} </td>
                            </tr>
                            <tr>
                              <th>Under Group</th>
                              <td>{ac_groupData}</td>
                            </tr>
                            <tr>
                              <th>Name</th>
                              <td>{ledgerData[0].name}</td>
                            </tr>
                            <tr>
                              <th>Address</th>
                              <td>{ledgerData[0].address}</td>
                            </tr>
                            <tr>
                              <th>State</th>
                              <td>{ledgerData[0].state}</td>
                            </tr>
                            <tr>
                              <th>Pin</th>
                              <td>{ledgerData[0].pin}</td>
                            </tr>
                            <tr>
                              <th>Mobile </th>
                              <td>{ledgerData[0].mobile}</td>
                            </tr>
                            <tr>
                              <th>Bank Name</th>
                              <td>{ledgerData[0].bank}</td>
                            </tr>
                            <tr>
                              <th>A/c no</th>
                              <td>{ledgerData[0].acc_number}</td>
                            </tr>
                            <tr>
                              <th>Bank Branch</th>
                              <td>{ledgerData[0].branch}</td>
                            </tr>
                            <tr>
                              <th>IFSC Code</th>
                              <td>{ledgerData[0].ifsc_code}</td>
                            </tr>
                            <tr>
                              <th>Amount</th>
                              <td>{ledgerData[0].open_balance}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <div className="row" style={{ textAlign: 'center' }}>
                  <a
                    onClick={(e) =>
                      history.push({
                        pathname: '/account_statement',
                      })
                    }
                  >
                    {' '}
                    <button className="btn btn-danger">Back</button>
                  </a>
                </div>
                <br />
                <div></div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="container-fluid" id="content">
              <div
                id="main"
                style={{ marginLeft: '50px', marginRight: '50px' }}
              >
                <div className="container-fluid">
                  <div className="page-header">
                    <div className="pull-left">
                      <h1>No data available</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Ac_view_ledger;
