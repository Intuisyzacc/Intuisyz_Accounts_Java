import React from 'react';

const recievable = () => {
  return (
    <div>
      {/*?php include("../include_files/header1.php") ?*/}
      {/* header include*/}
      <div className="container-fluid" id="content">
        {/* header include*/}
        {/*?php include("../include_files/sidemenu.php") ?*/}
        {/* header include*/}
        <div id="main">
          <div className="container-fluid">
            <div className="page-header">
              <div className="pull-left">
                <h1>Recievables</h1>
              </div>
              <div className="pull-right"></div>
            </div>
            <div className="box">
              <div className="box-title">
                <div className="box-content">
                  <form className="form-horizontal" method="post">
                    <div className="row">
                      <div className="col-sm-5">
                        <div className="form-group">
                          <label htmlFor="textfield" className="control-label">
                            Start Date
                          </label>
                          <div className="col-sm-5">
                            <input
                              id="fromsearch"
                              name="start"
                              className="form-control"
                              type="date"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="form-group">
                          <label htmlFor="textfield" className="control-label">
                            End Date
                          </label>
                          <div className="col-sm-5">
                            <input
                              id="tosearch"
                              name="end"
                              className="form-control"
                              type="date"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <input
                          type="submit"
                          name="submit"
                          className="btn btn-primary btn-lg"
                          defaultValue="Search"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <br />
              {/*-form ends here*/}
              <div className="row" style={{ paddingLeft: '22px' }}>
                <div className="col-sm-12">
                  <div className="box box-color box-bordered">
                    <div className="box-title">
                      <h3>
                        <i className="fa fa-table" />
                        Recievable List
                      </h3>
                    </div>
                    <div className="box-content nopadding" id="search_result">
                      <table className="table table-hover table-nomargin table-bordered dataTable">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Party</th>
                            <th>Narration</th>
                            <th>Amount</th>
                            <th>Amount Recieved</th>
                            <th>Balance</th>
                            <th>Due On</th>
                            <th>Recieve Now</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/*?php
					if(@$searchTime=='')
					{
					$sql=mysqli_query($myconn,"SELECT * FROM `account_pending_v3` WHERE `status`='2' AND `type`='Receipt'");
					}
					if(@$searchTime=='1')
					{
					$sql=mysqli_query($myconn,"SELECT * FROM `account_pending_v3` WHERE `status`='2' AND `type`='Receipt' AND `tran_Date` BETWEEN '$start' AND '$end'");
					}
					while($row=mysqli_fetch_array($sql))
					 {
						 $transactionDate=$row['tran_Date'];
						 	$sundry=$row['sundry'];
							$partyName1=getLedgerDetails($sundry);
						$partyName=$partyName1['ledger_name'];
						$description=$row['description'];
						$amountRecieved=$row['paid'];
						$balance=$row['balance'];
						$dueDate=$row['due_Date'];
						$amount=$row['amount'];
					?*/}
                          <tr>
                            <td> {/*?php echo $transactionDate?*/} </td>
                            <td> {/*?php echo $partyName?*/} </td>
                            <td> {/*?php echo $description?*/} </td>
                            <td> {/*?php echo $amount?*/} </td>
                            <td> {/*?php echo $amountRecieved?*/} </td>
                            <td> {/*?php echo $balance?*/}</td>
                            <td> {/*?php echo $dueDate?*/} </td>
                            <td>
                              <a href="recieve_receipt.php?id=<?php echo $row['transactionID'];?>">
                                <button className="btn">Close Now</button>
                              </a>
                              <a href="recievable_reciept.php?id=<?php echo $row['transactionID'];?>">
                                <button className="btn">Reciept</button>
                              </a>
                              <a href="edit_recievable.php?id=<?php echo $row['transactionID'];?>">
                                <button className="btn">Edit</button>
                              </a>
                              <a
                                href="delete_recievable.php?id=<?php echo $row['transactionID']; ?>"
                                onclick="javascript:return confirm('Are you sure you want to delete this record ?')"
                              >
                                <button className="btn">Delete</button>
                              </a>
                            </td>
                          </tr>
                          {/*?php } ?*/}
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
  );
};

export default recievable;
