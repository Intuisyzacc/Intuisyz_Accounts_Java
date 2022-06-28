import logo from './logo.svg';
import './App.css';
import Headers from './Header/Headers';
import Journals from './Journal/Journal';
import Add_ledger from './Ledger/add_ledger';
import Add_group from './Group/Add_group';
import TransactionHistory from './Transaction/transactionHistory';
import Payment from './Payment/payment';
import Payment_list from './Payment/payment_list';
import View_group from './Group/view_group';
import Ledger_list from './Ledger/ledger_list';
import View_journal from './Journal/view_journal';
import Receipt from './Receipt/receipt';
import Reciept_list from './Receipt/reciept_list';
import Account_statement from './Account Statement/account_statement';
import View_statement from './Account Statement/view_statement';
import Profit_loss from './Profit & Loss/profit_loss';
import Balance_sheet from './Balance Sheet/balance_sheet';
import Trial_balance from './Trial Balance/trial_balance';
import Cashbook from './Reports/cashbook';
import Bankbook from './Reports/bankbook';
import Daybook from './Reports/daybook';
import Payable from './Reports/payable';
import Recievable from './Reports/recievable';
import Ac_dashboard from './Dashboard/ac_dashboard';
import Index from './Dashboard/index';
import Routes from './Routers/Routes';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Chart from './Chart/chart';
import Edit_group from './Group/edit_group';
import View_ledger from './Ledger/view_ledger';
import Edit_ledger from './Ledger/edit_ledger';
import Simple_voucher from './Payment/simple_voucher';
import Edit_voucher from './Payment/edit_voucher';
import Edit_journal from './Journal/edit_journal';
import Simple_reciept from './Receipt/simple_reciept';
import Edit_receipt from './Receipt/edit_receipt';
import Ac_view_ledger from './Account Statement/ac_view_ledger';
import Create_invoice from './Invoice/create_invoice';
import Preview_invoice from './Invoice/preview_invoice';
import Dashboard_invoice from './Invoice/dashboard_invoice';
import Edit_invoice from './Invoice/edit_invoice';
import Dashboard_preview from './Invoice/dashboard_preview';
import Receive_invoice from './Invoice/receive_invoice';
import MigrationDate from './Settings/MigrationDate';
import Mail_preview from './Invoice/mail_preview';
import { useParams } from 'react-router-dom';
import EditTemplate from './Invoice/edit_template';
import Create_profile from './Profile/create_profile';
import Login from './Login/login';
import React, { useState, useEffect, useRef } from 'react';
import Forgot_password from './Login/forgot_password';
import User_view from './Admin/user_view';
import Create_user from './Admin/create_user';
import Edit_user from './Admin/create_user';

function App() {
  let history = useHistory();

  const [logValue, setLogValue] = useState(false);

  useEffect(() => {
    let logValues = sessionStorage.getItem('logDetails');
    // if (logValue) {
    //   history.push({
    //     pathname: '/',
    //   });
    // } else {
    //   history.push({
    //     pathname: '/login',
    //   });
    // }
    // window.addEventListener('beforeunload', function (e) {
    //   e.preventDefault();
    //   e.returnValue = '';

    //   localStorage.setItem('logDetails', false);
    // });
  }, []);

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      {/* <Journals /> */}

      {/* <Add_ledger /> */}

      {/* <Add_group /> */}

      {/* <TransactionHistory /> */}

      {/* <Payment/> */}

      {/* <Payment_list/> */}

      {/* <View_group/> */}

      {/*<Ledger_list/> */}

      {/* <View_journal /> */}

      {/* <Receipt /> */}

      {/* <Reciept_list /> */}

      {/* <Account_statement/> */}

      {/* <View_statement/> */}

      {/* <Profit_loss /> */}

      {/* <Balance_sheet/> */}

      {/* <Trial_balance/> */}

      {/* <Cashbook /> */}

      {/* <Bankbook /> */}

      {/* <Daybook/> */}

      {/* <Payable/> */}

      {/* <Recievable /> */}

      {/* <Ac_dashboard /> */}

      {/* <Index /> */}

      {/* {logValue && <Headers />} */}
      <Switch>
        <Route exact path="/">
          <Index />
        </Route>

        <Route path="/journals">
          <Journals />
        </Route>

        <Route path="/add_ledger">
          <Add_ledger />
        </Route>

        <Route path="/add_group">
          <Add_group />
        </Route>

        <Route path="/transactionHistory">
          <TransactionHistory />
        </Route>

        <Route path="/payment">
          <Payment />
        </Route>

        <Route path="/payment_list">
          <Payment_list />
        </Route>

        <Route path="/view_group">
          <View_group />
        </Route>

        <Route path="/ledger_list">
          <Ledger_list />
        </Route>

        <Route path="/view_journal">
          <View_journal />
        </Route>

        <Route path="/receipt">
          <Receipt />
        </Route>

        <Route path="/reciept_list">
          <Reciept_list />
        </Route>

        <Route path="/account_statement">
          <Account_statement />
        </Route>

        <Route path="/view_statement">
          <View_statement />
        </Route>

        <Route path="/profit_loss">
          <Profit_loss />
        </Route>

        <Route path="/balance_sheet">
          <Balance_sheet />
        </Route>

        <Route path="/trial_balance">
          <Trial_balance />
        </Route>

        <Route path="/cashbook">
          <Cashbook />
        </Route>

        <Route path="/bankbook">
          <Bankbook />
        </Route>

        <Route path="/daybook">
          <Daybook />
        </Route>

        <Route path="/payable">
          <Payable />
        </Route>

        <Route path="/recievable">
          <Recievable />
        </Route>

        <Route path="/ac_dashboard">
          <Ac_dashboard />
        </Route>

        <Route path="/chart">
          <Chart />
        </Route>

        <Route path="/edit_group">
          <Edit_group />
        </Route>

        <Route path="/view_ledger">
          <View_ledger />
        </Route>

        <Route path="/edit_ledger">
          <Edit_ledger />
        </Route>

        <Route path="/simple_voucher">
          <Simple_voucher />
        </Route>

        <Route path="/edit_voucher">
          <Edit_voucher />
        </Route>

        <Route path="/edit_journal">
          <Edit_journal />
        </Route>

        <Route path="/simple_reciept">
          <Simple_reciept />
        </Route>

        <Route path="/edit_receipt">
          <Edit_receipt />
        </Route>

        <Route path="/ac_view_ledger">
          <Ac_view_ledger />
        </Route>

        <Route path="/create_invoice">
          <Create_invoice />
        </Route>

        <Route path="/preview_invoice">
          <Preview_invoice />
        </Route>
        <Route path="/dashboard_invoice">
          <Dashboard_invoice />
        </Route>
        <Route path="/edit_invoice">
          <Edit_invoice />
        </Route>

        <Route path="/dashboard_preview">
          <Dashboard_preview />
        </Route>

        <Route path="/receive_invoice">
          <Receive_invoice />
        </Route>

        <Route path="/migrationDate">
          <MigrationDate />
        </Route>

        <Route
          exact
          path="/mail-preview-details/:id"
          component={Mail_preview}
        />

        <Route path="/editTemplate">
          <EditTemplate />
        </Route>

        <Route path="/createProfile">
          <Create_profile />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/forgotPassword">
          <Forgot_password />
        </Route>

        <Route path="/userView">
          <User_view />
        </Route>
        <Route path="/createUser">
          <Create_user />
        </Route>

        <Route path="/editUser">
          <Edit_user />
        </Route>
      </Switch>

      {/* <Routes /> */}
    </div>
  );
}

export default App;
