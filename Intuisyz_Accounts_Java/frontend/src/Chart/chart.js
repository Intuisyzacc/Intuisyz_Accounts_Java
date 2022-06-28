import React from 'react';

const chart = () => {
  return (
    <div>
     
      <div className="container-fluid" id="content">
        
        <div id="main">
          <div className="container-fluid">
            <div className="page-header">
              <div className="pull-left">
                <h1>Chart of Account</h1>
              </div>
            </div>
          </div>
          <div className="row page-header ">
            <div className="col-sm-12">
              <div className="box-content">
                <div className="col-sm-4 its asset">
                  <ul id="LinkedList1" className="LinkedList ">
                    <li style={{ color: '#000' }}>
                      <i className="fa fa-bars" /> Asset
                      <ul style={{ color: '#000' }} className="tabs">
                        <li>
                          Fixed Asset
                          <ul>
                            {/*?php
                                          $ledger=mysqli_query($myconn,"SELECT * FROM `account_ledger_v3` WHERE `ac_title`='2'") or die(mysqli_error($myconn));
                                          while($ledgerRow=mysqli_fetch_array($ledger))
                                          {
                                          ?*/}
                            <li>
                              <a
                                href
                                onclick="cal('<?php echo $ledgerRow['id'];?>')"
                              >
                                {/*?php echo $ledgerRow['ledger_name'];?*/}
                              </a>
                            </li>
                            {/*?php
                                          }
                                          ?*/}
                          </ul>
                        </li>
                        <li>
                          Current Asset
                          <ul>
                            {/*?php
                                          $ledger=mysqli_query($myconn,"SELECT * FROM `account_ledger_v3` WHERE `ac_title`='1'") or die(mysqli_error($myconn));
                                          while($ledgerRow=mysqli_fetch_array($ledger))
                                          {
                                          ?*/}
                            <li>
                              <a
                                href
                                onclick="cal('<?php echo $ledgerRow['id'];?>')"
                              >
                                {/*?php echo $ledgerRow['ledger_name'];?*/}
                              </a>
                            </li>
                            {/*?php
                                          }
                                          ?*/}
                            {/*<li><a href='#tab3'>Bank A/C</a></li>
                                          <li><a href='#tab1' >Cash in hand</a></li>
                                          <li><a href='#tab4'>Sundary Debitors</a></li>*/}
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <br />
                    <li>
                      <i className="fa fa-bars" />
                      Liability
                      <ul className="tabs">
                        <li>
                          Fixed Liability
                          <ul>
                            {/*?php
                                          $ledger=mysqli_query($myconn,"SELECT * FROM `account_ledger_v3` WHERE `ac_title`='4'") or die(mysqli_error($myconn));
                                          while($ledgerRow=mysqli_fetch_array($ledger))
                                          {
                                          ?*/}
                            <li>
                              <a
                                href
                                onclick="cal('<?php echo $ledgerRow['id'];?>')"
                              >
                                {/*?php echo $ledgerRow['ledger_name'];?*/}
                              </a>
                            </li>
                            {/*?php
                                          }
                                          ?*/}
                          </ul>
                        </li>
                        <li>
                          Current Liability
                          <ul>
                            {/*?php
                                          $ledger=mysqli_query($myconn,"SELECT * FROM `account_ledger_v3` WHERE `ac_title`='3'") or die(mysqli_error($myconn));
                                          while($ledgerRow=mysqli_fetch_array($ledger))
                                          {
                                          ?*/}
                            <li>
                              <a
                                href
                                onclick="cal('<?php echo $ledgerRow['id'];?>')"
                              >
                                {/*?php echo $ledgerRow['ledger_name'];?*/}
                              </a>
                            </li>
                            {/*?php
                                          }
                                          ?*/}
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <br />
                    <li>
                      <i className="fa fa-bars" />
                      Income
                      <ul className="tabs">
                        <li>
                          Direct Income
                          <ul>
                            {/*?php
                                          $ledger=mysqli_query($myconn,"SELECT * FROM `account_ledger_v3` WHERE `ac_title`='6'") or die(mysqli_error($myconn));
                                          while($ledgerRow=mysqli_fetch_array($ledger))
                                          {
                                          ?*/}
                            <li>
                              <a
                                href
                                onclick="cal('<?php echo $ledgerRow['id'];?>')"
                              >
                                {/*?php echo $ledgerRow['ledger_name'];?*/}
                              </a>
                            </li>
                            {/*?php
                                          }
                                          ?*/}
                          </ul>
                        </li>
                        <li>
                          Indirect Income
                          <ul>
                            {/*?php
                                          $ledger=mysqli_query($myconn,"SELECT * FROM `account_ledger_v3` WHERE `ac_title`='8'") or die(mysqli_error($myconn));
                                          while($ledgerRow=mysqli_fetch_array($ledger))
                                          {
                                          ?*/}
                            <li>
                              <a
                                href
                                onclick="cal('<?php echo $ledgerRow['id'];?>')"
                              >
                                {/*?php echo $ledgerRow['ledger_name'];?*/}
                              </a>
                            </li>
                            {/*?php
                                          }
                                          ?*/}
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <br />
                    <li>
                      <i className="fa fa-bars" />
                      Expense
                      <ul className="tabs">
                        <li>
                          Direct Expense
                          <ul>
                            {/*?php
                                          $ledger=mysqli_query($myconn,"SELECT * FROM `account_ledger_v3` WHERE `ac_title`='7'") or die(mysqli_error($myconn));
                                          while($ledgerRow=mysqli_fetch_array($ledger))
                                          {
                                          ?*/}
                            <li>
                              <a
                                href
                                onclick="cal('<?php echo $ledgerRow['id'];?>')"
                              >
                                {/*?php echo $ledgerRow['ledger_name'];?*/}
                              </a>
                            </li>
                            {/*?php
                                          }
                                          ?*/}
                          </ul>
                        </li>
                        <li>
                          Indirect Expense
                          <ul>
                            {/*?php
                                          $ledger=mysqli_query($myconn,"SELECT * FROM `account_ledger_v3` WHERE `ac_title`='9'") or die(mysqli_error($myconn));
                                          while($ledgerRow=mysqli_fetch_array($ledger))
                                          {
                                          ?*/}
                            <li>
                              <a
                                href
                                onclick="cal('<?php echo $ledgerRow['id'];?>')"
                              >
                                {/*?php echo $ledgerRow['ledger_name'];?*/}
                              </a>
                            </li>
                            {/*?php
                                          }
                                          ?*/}
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <br />
                  </ul>
                </div>
                <div className="col-sm-7">
                  <div className="lnews">
                    <div className="hder">&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <div id="myModal" className="modal">
                      <div
                        className="modal-content"
                        id="show"
                        style={{ width: '50%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*?php include("../include_files/sidemenu.php") ?*/}
      </div>
    </div>
  );
};

export default chart;
