import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Headers from '../Header/Headers';
import Journals from '../Journal/Journal';
import Add_ledger from '../Ledger/add_ledger';
import Add_group from '../Group/Add_group';
import TransactionHistory from '../Transaction/transactionHistory';
import Payment from '../Payment/payment';
import Payment_list from '../Payment/payment_list';
import View_group from '../Group/view_group';
import Ledger_list from '../Ledger/ledger_list';
import View_journal from '../Journal/view_journal';
import Receipt from '../Receipt/receipt';
import Reciept_list from '../Receipt/reciept_list';
import Account_statement from '../Account Statement/account_statement';
import View_statement from '../Account Statement/view_statement';
import Profit_loss from '../Profit & Loss/profit_loss';
import Balance_sheet from '../Balance Sheet/balance_sheet';
import Trial_balance from '../Trial Balance/trial_balance';
import Cashbook from '../Reports/cashbook';
import Bankbook from '../Reports/bankbook';
import Daybook from '../Reports/daybook';
import Payable from '../Reports/payable';
import Recievable from '../Reports/recievable';
import Ac_dashboard from '../Dashboard/ac_dashboard';
import Index from '../Dashboard/index';
import Chart from '../Chart/chart';
import Edit_group from '../Group/edit_group';
import View_ledger from '../Ledger/view_ledger';
import Edit_ledger from '../Ledger/edit_ledger';
import Simple_voucher from '../Payment/simple_voucher';
import Edit_voucher from '../Payment/edit_voucher';
import Edit_journal from '../Journal/edit_journal';
import Simple_reciept from '../Receipt/simple_reciept';
import Edit_receipt from '../Receipt/edit_receipt';
import Ac_view_ledger from '../Account Statement/ac_view_ledger';

const Routes = () => {
  return (
    <div>
      <Router>
        <Headers />

        <Route exact path="/">
          <Index />
        </Route>

        <Route exact path="/journals">
          <Journals />
        </Route>

        <Route exact path="/add_ledger">
          <Add_ledger />
        </Route>

        <Route exact path="/add_group">
          <Add_group />
        </Route>

        <Route exact path="/transactionHistory">
          <TransactionHistory />
        </Route>

        <Route exact path="/payment">
          <Payment />
        </Route>

        <Route exact path="/payment_list">
          <Payment_list />
        </Route>

        <Route exact path="/view_group">
          <View_group />
        </Route>

        <Route exact path="/ledger_list">
          <Ledger_list />
        </Route>

        <Route exact path="/view_journal">
          <View_journal />
        </Route>

        <Route exact path="/receipt">
          <Receipt />
        </Route>

        <Route exact path="/reciept_list">
          <Reciept_list />
        </Route>

        <Route exact path="/account_statement">
          <Account_statement />
        </Route>

        <Route exact path="/view_statement">
          <View_statement />
        </Route>

        <Route exact path="/profit_loss">
          <Profit_loss />
        </Route>

        <Route exact path="/balance_sheet">
          <Balance_sheet />
        </Route>

        <Route exact path="/trial_balance">
          <Trial_balance />
        </Route>

        <Route exact path="/cashbook">
          <Cashbook />
        </Route>

        <Route exact path="/bankbook">
          <Bankbook />
        </Route>

        <Route exact path="/daybook">
          <Daybook />
        </Route>

        <Route exact path="/payable">
          <Payable />
        </Route>

        <Route exact path="/recievable">
          <Recievable />
        </Route>

        <Route exact path="/ac_dashboard">
          <Ac_dashboard />
        </Route>

        <Route exact path="/chart">
          <Chart />
        </Route>

        <Route exact path="/edit_group">
          <Edit_group />
        </Route>

        <Route exact path="/view_ledger">
          <View_ledger />
        </Route>

        <Route exact path="/edit_ledger">
          <Edit_ledger />
        </Route>

        <Route exact path="/simple_voucher">
          <Simple_voucher />
        </Route>

        <Route exact path="/edit_voucher">
          <Edit_voucher />
        </Route>

        <Route exact path="/edit_journal">
          <Edit_journal />
        </Route>

        <Route exact path="/simple_reciept">
          <Simple_reciept />
        </Route>

        <Route exact path="/edit_receipt">
          <Edit_receipt />
        </Route>

        <Route exact path="/ac_view_ledger">
          <Ac_view_ledger />
        </Route>
      </Router>
    </div>
  );
};

export default Routes;
