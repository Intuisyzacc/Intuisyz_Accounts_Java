import React from 'react';
import {
  useHistory,
  useLocation,
  Redirect,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';

function Headers() {
  let history = useHistory();

  return (
    <div>
      <div
        style={{
          background: 'url(../img/header-bg.jpg) repeat-x center center',
        }}
      >
        <div className="navbar-inner">
          <div className="container-fluid">
            {/* <a
              onClick={(e) => {
                history.push({
                  pathname: '/',
                });
              }}
              id="brand"
            >
              CRM Accounting
            </a> */}
            <Link id="brand" to="/">
              CRM Accounting
            </Link>
            <ul className="nav pull-right">
              <li className=" dropdown dropdownmargin">
                {/* <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/',
                    });
                  }}
                >
                  CRM Dashboard
                </a> */}
                <Link to="/">CRM Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="navigation">
        <div className="container-fluid">
          <a
            href="#"
            className="toggle-nav"
            rel="tooltip"
            data-placement="bottom"
            title="Toggle navigation"
          >
            <i className="fa fa-bars" />
          </a>
          <ul className="main-nav">
            <li>
              {/* <a
                onClick={(e) => {
                  history.push({
                    pathname: '/',
                  });
                }}
              >
                <span>Dashboard</span>
              </a> */}
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              {/* <a
                onClick={(e) => {
                  history.push({
                    pathname: '/ac_dashboard',
                  });
                }}
              >
                <span>Accounts Dashboard</span>
              </a> */}
              <Link to="/ac_dashboard">Accounts Dashboard</Link>
            </li>
            {/*====================Accounting==========================*/}
            <li>
              <a href="#" data-toggle="dropdown" className="dropdown-toggle">
                <span>Accounting</span>
                <span className="caret" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  {/* <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/chart',
                      });
                    }}
                  >
                    Chart of Accounts
                  </a> */}
                  <Link to="/chart">Chart of Accounts</Link>
                </li>
                <li className="dropdown-submenu">
                  <a href="#">Group</a>
                  <ul className="dropdown-menu">
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/add_group',
                          });
                        }}
                      > */}
                      <Link to="/add_group">Create Group</Link>
                      {/* </a> */}
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/view_group',
                          });
                        }}
                      >
                        View Group
                      </a> */}
                      <Link to="/view_group">View Group</Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown-submenu">
                  <a href="#"> Ledger/Account</a>
                  <ul className="dropdown-menu">
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/add_ledger',
                          });
                        }}
                      >
                        Create Ledger
                      </a> */}
                      <Link to="/add_ledger">Create Ledger</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/ledger_list',
                          });
                        }}
                      >
                        View Ledger
                      </a> */}
                      <Link to="/ledger_list">View Ledger</Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown-submenu">
                  <a href="#">Transactions</a>
                  <ul className="dropdown-menu">
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/receipt',
                          });
                        }}
                      >
                        Receipt
                      </a> */}
                      <Link to="/receipt">Receipt</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/reciept_list',
                          });
                        }}
                      >
                        View Receipts
                      </a> */}
                      <Link to="/reciept_list">View Receipts</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/payment',
                          });
                        }}
                      >
                        Payment
                      </a> */}
                      <Link to="/payment">Payment</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/payment_list',
                          });
                        }}
                      >
                        View Voucher
                      </a> */}
                      <Link to="/payment_list">View Voucher</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/journals',
                          });
                        }}
                      >
                        Journal
                      </a> */}
                      <Link to="/journals">Journal</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/view_journal',
                          });
                        }}
                      >
                        View Journal
                      </a> */}
                      <Link to="/view_journal">View Journal</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/transactionHistory',
                          });
                        }}
                      >
                        Transaction History
                      </a> */}
                      <Link to="/transactionHistory">Transaction History</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  {/* <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/account_statement',
                      });
                    }}
                  >
                    Account Statements
                  </a> */}
                  <Link to="/account_statement">Account Statements</Link>
                </li>
                <li>
                  {/* <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/profit_loss',
                      });
                    }}
                  >
                    Profit&amp;Loss{' '}
                  </a> */}
                  <Link to="/profit_loss">Profit&amp;Loss </Link>
                </li>
                <li>
                  {/* <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/balance_sheet',
                      });
                    }}
                  >
                    Balancesheet
                  </a> */}
                  <Link to="/balance_sheet">Balancesheet</Link>
                </li>
                <li>
                  {/* <a
                    onClick={(e) => {
                      history.push({
                        pathname: '/trial_balance',
                      });
                    }}
                  >
                    Trial balance
                  </a> */}
                  <Link to="/trial_balance">Trial balance</Link>
                </li>
                <li className="dropdown-submenu">
                  <a href="#">Reports</a>
                  <ul className="dropdown-menu">
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/cashbook',
                          });
                        }}
                      >
                        Cash Book
                      </a> */}
                      <Link to="/cashbook">Cash Book</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/bankbook',
                          });
                        }}
                      >
                        Bank Book
                      </a> */}
                      <Link to="/bankbook">Bank Book</Link>
                    </li>
                    <li>
                      {/* <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/daybook',
                          });
                        }}
                      >
                        Day Book
                      </a> */}
                      <Link to="/daybook">Day Book</Link>
                    </li>
                    <li className="dropdown-submenu">
                      <a href="#">Outstanding</a>
                      <ul className="dropdown-menu">
                        <li>
                          {/* <a
                            onClick={(e) => {
                              history.push({
                                pathname: '/payable',
                              });
                            }}
                          >
                            Payables
                          </a> */}
                          <Link to="/payable">Payables</Link>
                        </li>
                        <li>
                          {/* <a
                            onClick={(e) => {
                              history.push({
                                pathname: '/recievable',
                              });
                            }}
                          >
                            Receivables
                          </a> */}
                          <Link to="/recievable">Receivables</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>

                {/* <li className="dropdown-submenu">
                  <a href="#">Invoice</a>
                  <ul className="dropdown-menu">
                    <li>
                       <a
                        onClick={(e) => {
                          history.push({
                            pathname: '/cashbook',
                          });
                        }}
                      >
                        Cash Book
                      </a> 
                      <Link to="/dashboard_invoice">Invoice Dashboard</Link>
                    </li>
                  </ul>
                </li> */}
              </ul>
            </li>

            {/*====================Accounting==========================*/}

            <li>
              {/* <a
                onClick={(e) => {
                  history.push({
                    pathname: '/payment',
                  });
                }}
              >
                <span>Payment</span>
                <span className="caret" />
              </a> */}
              <Link to="/payment">
                <span>Payment</span>
                <span className="caret" />
              </Link>
            </li>
            <li>
              {/* <a
                onClick={(e) => {
                  history.push({
                    pathname: '/receipt',
                  });
                }}
              >
                <span>Receipt</span>
                <span className="caret" />
              </a> */}
              <Link to="/receipt">
                <span>Receipt</span>
                <span className="caret" />
              </Link>
            </li>
            <li>
              {/* <a
                onClick={(e) => {
                  history.push({
                    pathname: '/journals',
                  });
                }}
              >
                <span>Journal</span>
                <span className="caret" />
              </a> */}
              <Link to="/journals">
                <span>Journal</span>
                <span className="caret" />
              </Link>
            </li>

            <li>
              <Link to="/dashboard_invoice">
                <span>Invoice Dashboard</span>
                <span className="caret" />
              </Link>
            </li>
          </ul>
          <div className="user">
            <div className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                Settings
                <img src alt="" />
              </a>
              <ul className="dropdown-menu pull-right">
                {/*<li>
                            <a href="profile.php">Profile</a>
                        </li>
                        <li>
                            <a href="#">Account settings</a>
                        </li>*/}
                <li>
                  <Link to="migrationDate">Migration Date</Link>
                </li>
                <li>
                  <Link to="editTemplate">Configure Template</Link>
                </li>
                <li>
                  <Link to="createProfile">Create Profile</Link>
                </li>
                <li>
                  <Link
                    to="login"
                    onClick={(e) => {
                      sessionStorage.setItem('logDetails', false);
                    }}
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div style={{ clear: 'both' }} />
    </div>
  );
}

export default Headers;
