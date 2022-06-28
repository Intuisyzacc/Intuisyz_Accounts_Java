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
import { successToast } from '../common/global';
import baseUrl from '../Base Url/baseUrl';
import { cashBookData, cashBookBnDates } from '../modal';
import PageLoader from '../Page Loader/pageloader';
import ReactToExcel from 'react-html-table-to-excel';
import { ToastContainer, toast } from 'react-toastify';
import Headers from '../Header/Headers';

const Cashbook = () => {
  let history = useHistory();
  let url = baseUrl.url;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [startDateFlag, setStartDateFlag] = useState(false);
  const [endDateFlag, setEndDateFlag] = useState(false);
  const [cashBook, setCashBook] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [countPerPage, setCountPerPage] = useState(10);
  const [accountStatementData, setAccountStatementData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dateSortFlag, setDateSortFlag] = useState(1);
  const [ledgerSortFlag, setLedgerSortFlag] = useState(0);
  const [voucherTypeSortFlag, setVoucherTypeSortFlag] = useState(0);
  const [voucherNoSortFlag, setVoucherNoSortFlag] = useState(0);
  const [narrationSortFlag, setNarrationSortFlag] = useState(0);
  const [debitSortFlag, setDebitSortFlag] = useState(0);
  const [creditSortFlag, setCreditSortFlag] = useState(0);

  const [dataLoadedError, setDataLoadedError] = useState(true);
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false);

  const [cashBookOpeningBalance, setCashBookOpeningBalance] = useState([]);
  const [openingBalanceDataLoaded, setOpeningBalanceDataLoaded] =
    useState(false);

  const [dateDropDownFlag, setDateDropDownFlag] = useState(true);
  const [ledgerDropDownFlag, setLedgerDropDownFlag] = useState(true);
  const [voucherTypeDropDownFlag, setVoucherTypeDropDownFlag] = useState(true);
  const [voucherNoDropDownFlag, setVoucherNoDropDownFlag] = useState(true);

  const [dropdownFlag, setDropdownFlag] = useState(false);
  const [narrationDropDownFlag, setNarrationDropDownFlag] = useState(true);
  const [debitDropDownFlag, setDebitDropDownFlag] = useState(true);
  const [creditDropDownFlag, setCreditDropDownFlag] = useState(true);

  const [openBalanceData, setOpenBalanceData] = useState([]);
  const [openBalanceData2, setOpenBalanceData2] = useState([]);
  const [openBalanceDataLoaded, setOpenBalanceDataLoaded] = useState(false);
  const [openBalanceDataLoaded2, setOpenBalanceDataLoaded2] = useState(false);

  const [loadViewFlag, setLoadViewFlag] = useState(true);
  const [dateViewFlag, setDateViewFlag] = useState(false);

  const [flag, setFlag] = useState(0);
  // const [flag2, setFlag2] = useState(0);
  // const [loadFlag, setLoadFlag] = useState(0);
  // const [dateSearchFlag, setDateSearchFlag] = useState(0);
  const [lastBalance, setLastBalance] = useState();
  const [flag3, setFlag3] = useState(0);

  const usersPerPage = parseInt(countPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(openBalanceData2.length / usersPerPage);

  // console.log(
  //   'pagesVisited',
  //   pagesVisited,
  //   '',
  //   'pageCount',
  //   pageCount,
  //   'pageNumber',
  //   pageNumber
  // );

  let sDate;
  let lastBalanceVal;

  const displayUsers = openBalanceData2
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (
        val.tran_Date.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        //    let k = val.ledger_name;
        //    let i  = val.ac_group;
        // if(k==searchTerm)
        // {
        //   return val;
        // }

        // else if(i==searchTerm)
        // {
        //
        // }
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.tranID}>
          {dateDropDownFlag && <td>{item.tran_Date}</td>}
          {ledgerDropDownFlag && (
            <td>
              {dateViewFlag && item.type === 'Receipt' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_receipt',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {loadViewFlag && item.type === 'Receipt' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_receipt',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {dateViewFlag && item.type === 'Voucher' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_voucher',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {loadViewFlag && item.type === 'Voucher' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_voucher',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {dateViewFlag && item.type === 'Contra' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_journal',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {loadViewFlag && item.type === 'Contra' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_journal',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {loadViewFlag && item.type === 'Nil' && item.branch}
              {dateViewFlag && item.type === 'Nil' && item.filename}
            </td>
          )}
          {voucherTypeDropDownFlag && <td>{item.type}</td>}
          {voucherNoDropDownFlag && (
            <td>
              {' '}
              {item.type === 'Receipt' && 'RCPT' + item.tranID}
              {item.type === 'Voucher' && 'VCHR' + item.tranID}
              {item.type === 'Contra' && 'CNTR' + item.tranID}
            </td>
          )}
          {narrationDropDownFlag && (
            <td>
              {' '}
              {item.type === 'Nil' ? 'Opening Balance' : item.description}
            </td>
          )}
          {/* {debitDropDownFlag && (
            <td>{item.dbt_ac === '30' ? addCommas(item.amount) : '-'}</td>
          )}
          {creditDropDownFlag && (
            <td>{item.crdt_ac === '30' ? addCommas(item.amount) : '-'}</td>
          )} */}

          {debitDropDownFlag && (
            <td>
              {item.dbt_ac === sessionStorage.getItem('cashIdVal')
                ? addCommas(item.amount)
                : '-'}
            </td>
          )}
          {creditDropDownFlag && (
            <td>
              {item.crdt_ac === sessionStorage.getItem('cashIdVal')
                ? addCommas(item.amount)
                : '-'}
            </td>
          )}

          <td>
            {item.bank > 0
              ? addCommas(item.bank)
              : addCommas(Math.abs(item.bank)) + '(debit)'}

            {/* {loadViewFlag && item.amount} */}
          </td>

          <td>
            <a
              onClick={(e) => {
                confirmAlert({
                  title: 'Confirm to Delete',
                  message: 'Are you sure to do this.',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: () => deleting(item.tranID),
                    },
                    {
                      label: 'No',
                      // onClick: () => alert('Click No')
                    },
                  ],
                });
              }}
            >
              <button className="btn">Delete</button>
            </a>
          </td>
        </tr>
      );
    });

  // console.log('displayUsers', displayUsers);

  const displayUsersOnSearch = openBalanceData2
    .filter((val) => {
      // console.log('val', val);
      if (searchTerm == '') {
        return val;
      } else if (
        val.tran_Date.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (
        val.filename.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (val.type.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (
        val.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      } else if (val.amount.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (val.bank.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val;
      } else if (
        val.filepath.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      }
    })
    .map((item) => {
      return (
        <tr key={item.tranID}>
          {dateDropDownFlag && <td>{item.tran_Date}</td>}
          {ledgerDropDownFlag && (
            <td>
              {dateViewFlag && item.type === 'Receipt' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_receipt',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {loadViewFlag && item.type === 'Receipt' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_receipt',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {dateViewFlag && item.type === 'Voucher' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_voucher',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {loadViewFlag && item.type === 'Voucher' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_voucher',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {dateViewFlag && item.type === 'Contra' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_journal',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {loadViewFlag && item.type === 'Contra' && (
                <a
                  onClick={(e) => {
                    history.push({
                      pathname: '/edit_journal',
                      post: item,
                    });
                  }}
                >
                  {item.filename}
                </a>
              )}

              {loadViewFlag && item.type === 'Nil' && item.branch}
              {dateViewFlag && item.type === 'Nil' && item.filename}
            </td>
          )}
          {voucherTypeDropDownFlag && <td>{item.type}</td>}
          {voucherNoDropDownFlag && <td> {item.filepath}</td>}
          {narrationDropDownFlag && (
            <td>
              {' '}
              {item.type === 'Nil' ? 'Opening Balance' : item.description}
            </td>
          )}
          {/* {debitDropDownFlag && (
            <td>{item.dbt_ac === '30' ? addCommas(item.amount) : '-'}</td>
          )}
          {creditDropDownFlag && (
            <td>{item.crdt_ac === '30' ? addCommas(item.amount) : '-'}</td>
          )} */}

          {debitDropDownFlag && (
            <td>
              {item.dbt_ac === sessionStorage.getItem('cashIdVal')
                ? addCommas(item.amount)
                : '-'}
            </td>
          )}
          {creditDropDownFlag && (
            <td>
              {item.crdt_ac === sessionStorage.getItem('cashIdVal')
                ? addCommas(item.amount)
                : '-'}
            </td>
          )}

          <td>
            {item.bank > 0
              ? addCommas(item.bank)
              : addCommas(Math.abs(item.bank)) + '(debit)'}

            {/* {loadViewFlag && item.amount} */}
          </td>

          <td>
            <a
              onClick={(e) => {
                confirmAlert({
                  title: 'Confirm to Delete',
                  message: 'Are you sure to do this.',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: () => deleting(item.tranID),
                    },
                    {
                      label: 'No',
                      // onClick: () => alert('Click No')
                    },
                  ],
                });
              }}
            >
              <button className="btn">Delete</button>
            </a>
          </td>
        </tr>
      );
    });

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    // console.log('selected', selected);
  };

  const submitFinal = handleSubmit((data) => {
    // setDataLoaded(false);
    // setDataLoadedError(true);
    // console.log('data loaded', dataLoaded);
    // console.log('dataLoadedError', dataLoadedError);
    setOpenBalanceData([
      {
        obCreated_date: openBalanceData[0].obCreated_date,
        obBalance_type: '',
        obOpen_balance: openBalanceData[0].obOpen_balance,
        ob: openBalanceData[0].ob,
        ledger_name: openBalanceData[0].ledger_name,
        pin: openBalanceData[0].pin,
        mobile: openBalanceData[0].mobile,
        fax: openBalanceData[0].fax,
      },
    ]);
    setOpenBalanceDataLoaded2(false);
    console.log(`openBalanceDataLoaded2`, openBalanceDataLoaded2);

    if (startDate === null || startDate === undefined) {
      setStartDateFlag(true);
      if (endDate === null || endDate === undefined) {
        setEndDateFlag(true);
      } else {
        setEndDateFlag(false);
      }
    } else if (endDate === null || endDate === undefined) {
      setEndDateFlag(true);
      if (startDate === null || startDate === undefined) {
        setStartDateFlag(true);
      } else {
        setStartDateFlag(false);
      }
    } else {
      setStartDateFlag(false);
      setEndDateFlag(false);
      setDataLoaded(false);
      setDataLoadedError(true);
      console.log('data loaded', dataLoaded);
      console.log('dataLoadedError', dataLoadedError);

      if (startDate.getDate() < 10) {
        var currentDay = '0' + startDate.getDate();
      } else {
        var currentDay = startDate.getDate();
      }

      if (startDate.getMonth() + 1 < 10) {
        var currentMonth = '0' + (startDate.getMonth() + 1);
      } else {
        var currentMonth = startDate.getMonth() + 1;
      }

      var sDate =
        startDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

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

      console.log(sDate, '', eDate);

      // let ledger_id = '30';

      let ledger_id = sessionStorage.getItem('cashIdVal');

      axios
        .get(url + `ledger_search?ledgerId=${ledger_id}`)
        .then(({ data }) => {
          console.log('ledger date', data[0].ledger_date);

          if (data[0].ledger_date >= sDate && data[0].ledger_date <= eDate) {
            setFlag(1);

            let cur_balance = data[0].open_balance;
            let balance_type = data[0].balance_type;
            let cur_amount = data[0].amount;
            let cur_balance1 = data[0].open_balance;
            let ob = data[0].open_balance;
            let created_date = data[0].ledger_date;
            let ledger_name = data[0].ledger_name;
            let pin = data[0].pin;
            let fax = data[0].fax;
            let mobile = data[0].mobile;
            ////////////starting calculating opening and closing balance///////////
            let debit_total = '';
            let credit_total = '';
            let description = 'ledger creation';
            console.log('data', data);
            axios
              .get(
                url +
                  `list_account_statement_transactionBnDates?id=${ledger_id}&description=${description}&start=${sDate}&end=${eDate}`
              )
              .then(({ data }) => {
                console.log('data', data);

                if (data.length > 1) {
                  console.log('debit_total', debit_total);
                  // let amount = result2[0].amount;

                  console.log(
                    'result2.dbt_ac',
                    data[0].dbt_ac,
                    'result2.crdt_ac',
                    data[0].crdt_ac,
                    'ledger_id',
                    ledger_id
                  );

                  if (data[0].dbt_ac === ledger_id) {
                    console.log('dbt');
                    if (balance_type === 'debit') {
                      cur_balance =
                        parseFloat(cur_balance) + parseFloat(data[0].amount);
                    } else if (balance_type == 'credit') {
                      cur_balance =
                        parseFloat(cur_balance) - parseFloat(data[0].amount);
                    }
                    debit_total =
                      parseFloat(debit_total) + parseFloat(data[0].amount);
                  }

                  if (data[0].crdt_ac === ledger_id) {
                    console.log('crdt');
                    if (balance_type == 'debit') {
                      cur_balance =
                        parseFloat(cur_balance) - parseFloat(data[0].amount);
                    } else if (balance_type == 'credit') {
                      cur_balance =
                        parseFloat(cur_balance) + parseFloat(data[0].amount);
                    }
                    credit_total =
                      parseFloat(credit_total) + parseFloat(data[0].amount);
                  }
                  console.log('credit_total', credit_total);
                  let balance =
                    parseFloat(debit_total) - parseFloat(credit_total);

                  // let ob = (cur_balance = result1[0].open_balance);

                  console.log('ob', ob);

                  let obArray = [];
                  obArray.push({
                    obCreated_date: created_date,
                    obBalance_type: balance_type,
                    obOpen_balance: ob,
                    ob: ob,
                    ledger_name: ledger_name,
                    pin: pin,
                    mobile: mobile,
                    fax: fax,
                  });

                  setOpenBalanceData(obArray);
                  console.log('obArray', obArray);
                  setOpenBalanceDataLoaded(true);
                  console.log('OpenBalanceData', openBalanceData);
                  // openBalanceFun2(result1, ledger_id, result2);
                } else {
                  let obArray = [];
                  obArray.push({
                    obCreated_date: created_date,
                    obBalance_type: balance_type,
                    obOpen_balance: ob,
                    ob: ob,
                    ledger_name: ledger_name,
                    pin: pin,
                    mobile: mobile,
                    fax: fax,
                  });

                  setOpenBalanceData(obArray);
                  console.log('obArray', obArray);
                  setOpenBalanceDataLoaded(true);
                  console.log('OpenBalanceData', openBalanceData);
                  // openBalanceFun2(result1, ledger_id, result2);
                }
              })
              .catch((err) => {
                console.log(err);
              });

            ////////////////ending calculating open and closing balance/////////////////
          } else {
            setOpenBalanceDataLoaded(true);
            setFlag(0);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      /////////////////////next calculation////////////////////

      axios
        .get(
          url +
            `account_statementDataBnDates?ledgerId=${ledger_id}&start=${'2017-04-01'}&end=${eDate}&CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}
            `
        )
        .then(({ data }) => {
          console.log('openBalanceFun2 data', data);

          let creditTot = 0,
            debitTot = 0;

          let debitVal;
          let creditVal;
          let closingBal;

          if (data.length > 0) {
            ///////////////////new code////////////////
            for (let i = 0; i < data.length; i++) {
              if (data[i].type === 'Receipt') {
                data[i].filepath = 'RCPT' + data[i].tranID;
              }
              if (data[i].type === 'Voucher') {
                data[i].filepath = 'VCHR' + data[i].tranID;
              }
              if (data[i].type === 'Contra') {
                data[i].filepath = 'CNTR' + data[i].tranID;
              }

              /////////////////////////////////////////////

              if (data[i].filename === null || data[i].filename === undefined) {
                data[i].filename = '';
              }
            }

            ///////////////new code added////////////////
            debitVal = data[0].chq_no;
            creditVal = data[0].chq_date;
            closingBal = data[0].createdTime;

            let obArray1 = [];
            let obArray2 = [];

            //////////Balance upto Today code////////////

            for (let i = 0; i < data.length; i++) {
              if (data[i].tran_Date < sDate) {
                obArray2.push(data[i]);
              }
            }

            if (obArray2.length > 0) {
              console.log(
                `obArray2 Last val`,
                obArray2[obArray2.length - 1].bank
              );

              setLastBalance(obArray2[obArray2.length - 1].bank);
              lastBalanceVal = obArray2[obArray2.length - 1].bank;
            } else {
              // if (flag === 1) {
              setLastBalance(
                parseFloat(0.0) + parseFloat(openBalanceData[0].ob)
              );

              lastBalanceVal =
                parseFloat(0.0) + parseFloat(openBalanceData[0].ob);
              // }
              // setLastBalance('0.00');
            }

            console.log(`openBalanceData[0].ob`, openBalanceData[0].ob);
            console.log(`obArray2`, obArray2);
            console.log(`lastBalanceVal`, lastBalanceVal);
            //////////////////////////////////////////////

            for (let i = 0; i < data.length; i++) {
              if (data[i].tran_Date >= sDate && data[i].tran_Date <= eDate) {
                obArray1.push(data[i]);

                if (data[i].branch === 'debit') {
                  debitTot = debitTot + parseFloat(data[i].amount);
                }

                if (data[i].branch === 'credit') {
                  creditTot = creditTot + parseFloat(data[i].amount);
                }

                // if (obArray1.length > 0) {
                //   if (i === data.length - 1) {
                //     obArray1[0].createdTime = data[i].bank;
                //     console.log(' data[i].bank', data[i].bank);
                //   }
                // }
              }
            }

            if (obArray1.length > 0) {
              // setFlag2(1);
              // if (openBalanceData[0].obBalance_type === 'debit') {
              //   debitTot =
              //     debitTot + parseFloat(openBalanceData[0].obOpen_balance);
              // }
              // if (openBalanceData[0].obBalance_type === 'credit') {
              //   creditTot =
              //     creditTot + parseFloat(openBalanceData[0].obOpen_balance);
              // }

              obArray1[0].chq_no =
                parseFloat(debitTot) + parseFloat(lastBalanceVal);
              obArray1[0].chq_date = parseFloat(creditTot);
              obArray1[0].createdTime = closingBal;

              console.log('obArray1 new val', obArray1);
              setOpenBalanceData2(obArray1);
              setOpenBalanceDataLoaded2(true);
              setFlag3(1);
            } else {
              setOpenBalanceDataLoaded2(false);
              setFlag3(0);
            }

            ///////////////////////new code end////////////////////
          } else {
            // setOpenBalanceData2(data);
            // setFlag2(0);
            setOpenBalanceDataLoaded2(false);
            setFlag3(0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  function deleting(tranId) {
    axios
      .get(url + `cashBookDelete?tranId=${tranId}`)
      .then(({ data }) => {
        console.log('deleted data', data);
        if (data[0].user_bank === "can't") {
          successToast('We can not delete this data...try something else ');
        } else {
          successToast('Delete successfully');
        }

        dataLoading();
      })
      .catch((error) => {});
  }

  function sorting(field, type) {
    setDataLoaded(false);
    setDataLoadedError(true);
    console.log(field, type);
    axios
      .get(url + `cashbook_sorting?field=${field}&type=${type}`)
      .then(({ data }) => {
        console.log(data);
        setCashBook(data);

        if (data.length === 0) {
          setDataLoaded(false);
          setDataLoadedError(false);
        } else {
          setDataLoaded(true);
          setDataLoadedError(false);
        }

        setDataLoadedFlag(true);
      })
      .catch((err) => {
        console.log(err);
        setDataLoadedError(true);
        setDataLoadedFlag(true);
      });
  }

  const dataLoading = async () => {
    axios
      .get(
        url +
          `cashBookAccount_statementDatas?ledgerId=${sessionStorage.getItem(
            'cashIdVal'
          )}`
      )
      .then(({ data }) => {
        console.log('openBalanceFun2 data', data);

        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].type === 'Receipt') {
              data[i].filepath = 'RCPT' + data[i].tranID;
            }
            if (data[i].type === 'Voucher') {
              data[i].filepath = 'VCHR' + data[i].tranID;
            }
            if (data[i].type === 'Contra') {
              data[i].filepath = 'CNTR' + data[i].tranID;
            }

            /////////////////////////////////////////////

            if (data[i].filename === null || data[i].filename === undefined) {
              data[i].filename = '';
            }
          }

          setOpenBalanceData2(data);
          setOpenBalanceDataLoaded2(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // try {
    //   const result = await cashBookData();
    //   console.log('result ', result);
    //   setCashBook(result);

    //   if (result.length === 0) {
    //     setDataLoaded(false);
    //     setDataLoadedError(false);
    //   } else {
    //     setDataLoaded(true);
    //     setDataLoadedError(false);
    //   }

    //   setDataLoadedFlag(true);
    // } catch (error) {
    //   console.log(error);
    //   setDataLoadedError(true);
    //   setDataLoadedFlag(true);
    // }
  };

  function dataLoading1() {
    axios
      .get(
        url + `ledger_search?ledgerId=${sessionStorage.getItem('cashIdVal')}`
      )
      .then(({ data }) => {
        setFlag(1);

        let cur_balance = data[0].open_balance;
        let balance_type = data[0].balance_type;
        let cur_amount = data[0].amount;
        let cur_balance1 = data[0].open_balance;
        let ob = data[0].open_balance;
        let created_date = data[0].ledger_date;
        let ledger_name = data[0].ledger_name;
        let pin = data[0].pin;
        let fax = data[0].fax;
        let mobile = data[0].mobile;
        ////////////starting calculating opening and closing balance///////////
        let debit_total = '';
        let credit_total = '';
        let description = 'ledger creation';
        console.log('data', data);
        if (
          data[0].open_balance === '' ||
          data[0].open_balance === undefined ||
          data[0].open_balance === null
        ) {
          ob = 0;
        }

        axios
          .get(url + 'cashBookOpeningBalanceData')
          .then(({ data }) => {
            console.log('data', data);

            if (data.length > 1) {
              console.log('debit_total', debit_total);
              // let amount = result2[0].amount;

              console.log(
                'result2.dbt_ac',
                data[0].dbt_ac,
                'result2.crdt_ac',
                data[0].crdt_ac,
                'ledger_id',
                sessionStorage.getItem('cashIdVal')
              );

              if (data[0].dbt_ac === sessionStorage.getItem('cashIdVal')) {
                console.log('dbt');
                if (balance_type === 'debit') {
                  cur_balance =
                    parseFloat(cur_balance) + parseFloat(data[0].amount);
                } else if (balance_type == 'credit') {
                  cur_balance =
                    parseFloat(cur_balance) - parseFloat(data[0].amount);
                }
                debit_total =
                  parseFloat(debit_total) + parseFloat(data[0].amount);
              }

              if (data[0].crdt_ac === sessionStorage.getItem('cashIdVal')) {
                console.log('crdt');
                if (balance_type == 'debit') {
                  cur_balance =
                    parseFloat(cur_balance) - parseFloat(data[0].amount);
                } else if (balance_type == 'credit') {
                  cur_balance =
                    parseFloat(cur_balance) + parseFloat(data[0].amount);
                }
                credit_total =
                  parseFloat(credit_total) + parseFloat(data[0].amount);
              }
              console.log('credit_total', credit_total);
              let balance = parseFloat(debit_total) - parseFloat(credit_total);

              // let ob = (cur_balance = result1[0].open_balance);

              console.log('ob', ob);

              let obArray = [];
              obArray.push({
                obCreated_date: created_date,
                obBalance_type: balance_type,
                obOpen_balance: ob,
                ob: ob,
                ledger_name: ledger_name,
                pin: pin,
                mobile: mobile,
                fax: fax,
              });

              setOpenBalanceData(obArray);
              console.log('obArray', obArray);
              setOpenBalanceDataLoaded(true);
              console.log('OpenBalanceData', openBalanceData);
              // openBalanceFun2(result1, ledger_id, result2);
            } else {
              let obArray = [];
              obArray.push({
                obCreated_date: created_date,
                obBalance_type: balance_type,
                obOpen_balance: ob,
                ob: ob,
                ledger_name: ledger_name,
                pin: pin,
                mobile: mobile,
                fax: fax,
              });

              setOpenBalanceData(obArray);
              console.log('obArray', obArray);
              setOpenBalanceDataLoaded(true);
              console.log('OpenBalanceData', openBalanceData);
              // openBalanceFun2(result1, ledger_id, result2);
            }

            // console.log(data);
            // setCashBookOpeningBalance(data);

            // if (data.length === 0) {
            //   setOpeningBalanceDataLoaded(false);
            //   // setDataLoadedError(false);
            // } else {
            //   setOpeningBalanceDataLoaded(true);
            //   // setDataLoadedError(false);
            // }

            // setDataLoadedFlag(true);
            // console.log('cashBookOpeningBalance ', cashBookOpeningBalance);
            // console.log('dataLoadedError', dataLoadedError);
          })
          .catch((err) => {
            console.log(err);
            // setDataLoadedError(true);
            // setDataLoadedFlag(true);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      dataLoading1();
      dataLoading();
    } else {
      history.push({
        pathname: '/login',
      });
    }
  }, []);

  function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '.00';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    if (x2.length === 2) {
      x2 = x2 + '0';
    }
    return x1 + x2;
  }

  function dateReset() {
    window.location.reload();
  }

  return (
    <div>
      <Headers />
      {openBalanceDataLoaded ? (
        <div className="container-fluid" id="content">
          <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
            <div className="container-fluid">
              <div className="page-header">
                <div className="pull-left">
                  <h1>Cash Book</h1>
                </div>
                <div className="pull-right"></div>
              </div>
              <div className="box">
                <div className="box-title">
                  <div className="box-content">
                    <form className="form-horizontal" method="post">
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="txtAlignWrapper">
                            <label
                              htmlFor="textfield"
                              className="control-label"
                            >
                              Start Date
                            </label>
                            <div className="datePickerWrapper">
                              <DatePicker
                                name="start"
                                className="form-control datepicker"
                                dateFormat="dd/MM/yyyy"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                defaultValue=""
                              />
                              <div style={{ color: 'red' }}>
                                {startDateFlag && <p>Date is required.</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4 form-group">
                          <div className="txtAlignWrapper">
                            <label
                              htmlFor="textfield"
                              className="control-label"
                            >
                              End Date
                            </label>
                            <div className="datePickerWrapper">
                              <DatePicker
                                name="end"
                                className="form-control datepicker"
                                dateFormat="dd/MM/yyyy"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                defaultValue=""
                              />
                              <div style={{ color: 'red' }}>
                                {endDateFlag && <p>Date is required.</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="MultibuttonWrapper">
                            <input
                              type="submit"
                              name="submit"
                              className="btn btn-primary btn-lg"
                              defaultValue="Search"
                              onClick={(e) => {
                                e.preventDefault();
                                submitFinal();
                              }}
                            />
                            <input
                              type="button"
                              name="reset"
                              className="btn btn-secondary btn-lg"
                              onClick={(e) => {
                                e.preventDefault();
                                dateReset();
                              }}
                              defaultValue="Reset"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
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
                      Cash Transactions
                    </h3>
                  </div>
                  <div className="box-content nopadding" id="search_result">
                    <div
                      id="DataTables_Table_0_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      <div
                        className="ColVis"
                        // style={{
                        //   height: '30px',
                        //   width: '152px',
                        //   top: '509px',
                        //   left: '965px',
                        // }}
                      >
                        <button
                          className="ColVis_Button ColVis_MasterButton"
                          onClick={() => {
                            if (dropdownFlag === true) {
                              setDropdownFlag(false);
                            } else {
                              setDropdownFlag(true);
                            }
                          }}
                        >
                          <span>
                            Show/hide columns <i className="fa fa-angle-down" />
                          </span>
                        </button>
                        {dropdownFlag && (
                          <ul
                            className="ColVis_collection"
                            style={{
                              display: 'block',
                              opacity: 1,
                              // position: 'absolute',
                              // top: '509px',
                              // left: '965px',
                            }}
                            align="left"
                          >
                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={dateDropDownFlag && 'true'}
                                  onClick={() => {
                                    if (dateDropDownFlag === true) {
                                      setDateDropDownFlag(false);
                                    } else {
                                      setDateDropDownFlag(true);
                                    }
                                  }}
                                />
                                Date
                              </label>
                            </li>
                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={ledgerDropDownFlag && 'true'}
                                  onClick={() => {
                                    if (ledgerDropDownFlag === true) {
                                      setLedgerDropDownFlag(false);
                                    } else {
                                      setLedgerDropDownFlag(true);
                                    }
                                  }}
                                />
                                Ledger
                              </label>
                            </li>
                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={voucherTypeDropDownFlag && 'true'}
                                  onClick={() => {
                                    if (voucherTypeDropDownFlag === true) {
                                      setVoucherTypeDropDownFlag(false);
                                    } else {
                                      setVoucherTypeDropDownFlag(true);
                                    }
                                  }}
                                />
                                Voucher Type
                              </label>
                            </li>
                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={voucherNoDropDownFlag && 'true'}
                                  onClick={() => {
                                    if (voucherNoDropDownFlag === true) {
                                      setVoucherNoDropDownFlag(false);
                                    } else {
                                      setVoucherNoDropDownFlag(true);
                                    }
                                  }}
                                />
                                Voucher No
                              </label>
                            </li>

                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={narrationDropDownFlag && 'true'}
                                  onClick={() => {
                                    if (narrationDropDownFlag === true) {
                                      setNarrationDropDownFlag(false);
                                    } else {
                                      setNarrationDropDownFlag(true);
                                    }
                                  }}
                                />
                                <span
                                // _msthash={481381}
                                // _msttexthash={136708}
                                >
                                  Narration
                                </span>
                              </label>
                            </li>
                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={debitDropDownFlag && 'true'}
                                  onClick={() => {
                                    if (debitDropDownFlag === true) {
                                      setDebitDropDownFlag(false);
                                    } else {
                                      setDebitDropDownFlag(true);
                                    }
                                  }}
                                />
                                Debit Account
                              </label>
                            </li>
                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={creditDropDownFlag && 'true'}
                                  onClick={() => {
                                    if (creditDropDownFlag === true) {
                                      setCreditDropDownFlag(false);
                                    } else {
                                      setCreditDropDownFlag(true);
                                    }
                                  }}
                                />
                                Credit Account
                              </label>
                            </li>
                          </ul>
                        )}
                      </div>

                      <div
                        className="dataTables_length"
                        id="DataTables_Table_0_length"
                      >
                        <label>
                          Show{' '}
                          <select
                            name="DataTables_Table_0_length"
                            aria-controls="DataTables_Table_0"
                            className
                            onChange={(e) => {
                              setCountPerPage(e.target.value);
                              setPageNumber(0);
                              //  changePage({selected:'0'})
                            }}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>{' '}
                          entries
                        </label>
                      </div>
                      <div
                        id="DataTables_Table_0_filter"
                        className="dataTables_filter"
                      >
                        <label>
                          Search:
                          <input
                            type="search"
                            className
                            placeholder
                            aria-controls="DataTables_Table_0"
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                            }}
                          />
                        </label>
                      </div>
                      <table
                        className="table table-hover table-nomargin table-bordered dataTable dataTable-colvis no-footer"
                        id="DataTables_Table_0"
                        role="grid"
                        aria-describedby="DataTables_Table_0_info"
                        // style={{ width: '840px' }}
                      >
                        <thead>
                          <tr role="row">
                            {dateDropDownFlag && (
                              <th
                                className={
                                  (dateSortFlag == 0 && 'sorting') ||
                                  (dateSortFlag == 1 && 'sorting_asc') ||
                                  (dateSortFlag == 2 && 'sorting_desc')
                                }
                                width={250}
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Date: activate to sort column descending"
                                style={{ width: '30px' }}
                                aria-sort={
                                  (dateSortFlag == 0 && '') ||
                                  (dateSortFlag == 1 && ' ascending') ||
                                  (dateSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (dateSortFlag == 0) {
                                    setDateSortFlag(1);
                                    setLedgerSortFlag(0);
                                    setVoucherTypeSortFlag(0);
                                    setVoucherNoSortFlag(0);
                                    setNarrationSortFlag(0);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(0);

                                    sorting('tran_Date', 'ASC');
                                  }
                                  if (dateSortFlag == 1) {
                                    setDateSortFlag(2);
                                    sorting('tran_Date', 'DESC');
                                  }
                                  if (dateSortFlag == 2) {
                                    setDateSortFlag(1);
                                    sorting('tran_Date', 'ASC');
                                  }
                                }}
                              >
                                Date
                              </th>
                            )}
                            {ledgerDropDownFlag && (
                              <th
                                width={250}
                                className={
                                  (ledgerSortFlag == 0 && 'sorting') ||
                                  (ledgerSortFlag == 1 && 'sorting_asc') ||
                                  (ledgerSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Ledger: activate to sort column ascending"
                                style={{ width: '47px' }}
                                aria-sort={
                                  (ledgerSortFlag == 0 && '') ||
                                  (ledgerSortFlag == 1 && ' ascending') ||
                                  (ledgerSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (ledgerSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setLedgerSortFlag(1);
                                    setVoucherTypeSortFlag(0);
                                    setVoucherNoSortFlag(0);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(0);
                                    setNarrationSortFlag(0);

                                    sorting('ledger_name', 'ASC');
                                  }
                                  if (ledgerSortFlag == 1) {
                                    setLedgerSortFlag(2);
                                    sorting('ledger_name', 'DESC');
                                  }
                                  if (ledgerSortFlag == 2) {
                                    setLedgerSortFlag(1);
                                    sorting('ledger_name', 'ASC');
                                  }
                                }}
                              >
                                Ledger
                              </th>
                            )}
                            {voucherTypeDropDownFlag && (
                              <th
                                width={250}
                                className={
                                  (voucherTypeSortFlag == 0 && 'sorting') ||
                                  (voucherTypeSortFlag == 1 && 'sorting_asc') ||
                                  (voucherTypeSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Voucher Type: activate to sort column ascending"
                                style={{ width: '83px' }}
                                aria-sort={
                                  (voucherTypeSortFlag == 0 && '') ||
                                  (voucherTypeSortFlag == 1 && ' ascending') ||
                                  (voucherTypeSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (voucherTypeSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setLedgerSortFlag(0);
                                    setVoucherTypeSortFlag(1);
                                    setVoucherNoSortFlag(0);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(0);
                                    setNarrationSortFlag(0);

                                    sorting('type', 'ASC');
                                  }
                                  if (voucherTypeSortFlag == 1) {
                                    setVoucherTypeSortFlag(2);
                                    sorting('type', 'DESC');
                                  }
                                  if (voucherTypeSortFlag == 2) {
                                    setVoucherTypeSortFlag(1);
                                    sorting('type', 'ASC');
                                  }
                                }}
                              >
                                Voucher Type
                              </th>
                            )}
                            {voucherNoDropDownFlag && (
                              <th
                                width={250}
                                className={
                                  (voucherNoSortFlag == 0 && 'sorting') ||
                                  (voucherNoSortFlag == 1 && 'sorting_asc') ||
                                  (voucherNoSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Voucher No/Receipt No: activate to sort column ascending"
                                style={{ width: '142px' }}
                                aria-sort={
                                  (voucherNoSortFlag == 0 && '') ||
                                  (voucherNoSortFlag == 1 && ' ascending') ||
                                  (voucherNoSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (voucherNoSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setLedgerSortFlag(0);
                                    setVoucherTypeSortFlag(0);
                                    setVoucherNoSortFlag(1);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(0);
                                    setNarrationSortFlag(0);

                                    sorting('typeWithNo', 'ASC');
                                  }
                                  if (voucherNoSortFlag == 1) {
                                    setVoucherNoSortFlag(2);
                                    sorting('typeWithNo', 'DESC');
                                  }
                                  if (voucherNoSortFlag == 2) {
                                    setVoucherNoSortFlag(1);
                                    sorting('typeWithNo', 'ASC');
                                  }
                                }}
                              >
                                Voucher No/Receipt No
                              </th>
                            )}
                            {narrationDropDownFlag && (
                              <th
                                width={250}
                                className={
                                  (narrationSortFlag == 0 && 'sorting') ||
                                  (narrationSortFlag == 1 && 'sorting_asc') ||
                                  (narrationSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Narration: activate to sort column ascending"
                                style={{ width: '60px' }}
                                aria-sort={
                                  (narrationSortFlag == 0 && '') ||
                                  (narrationSortFlag == 1 && ' ascending') ||
                                  (narrationSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (narrationSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setLedgerSortFlag(0);
                                    setVoucherTypeSortFlag(0);
                                    setVoucherNoSortFlag(0);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(0);
                                    setNarrationSortFlag(1);

                                    sorting('description', 'ASC');
                                  }
                                  if (narrationSortFlag == 1) {
                                    setNarrationSortFlag(2);
                                    sorting('description', 'DESC');
                                  }
                                  if (narrationSortFlag == 2) {
                                    setNarrationSortFlag(1);
                                    sorting('description', 'ASC');
                                  }
                                }}
                              >
                                Narration
                              </th>
                            )}
                            {debitDropDownFlag && (
                              <th
                                width={250}
                                className={
                                  (debitSortFlag == 0 && 'sorting') ||
                                  (debitSortFlag == 1 && 'sorting_asc') ||
                                  (debitSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Debit: activate to sort column ascending"
                                style={{ width: '56px' }}
                                aria-sort={
                                  (debitSortFlag == 0 && '') ||
                                  (debitSortFlag == 1 && ' ascending') ||
                                  (debitSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (debitSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setLedgerSortFlag(0);
                                    setVoucherTypeSortFlag(0);
                                    setVoucherNoSortFlag(0);
                                    setDebitSortFlag(1);
                                    setCreditSortFlag(0);
                                    setNarrationSortFlag(0);

                                    sorting('amount', 'ASC');
                                  }
                                  if (debitSortFlag == 1) {
                                    setDebitSortFlag(2);
                                    sorting('amount', 'DESC');
                                  }
                                  if (debitSortFlag == 2) {
                                    setDebitSortFlag(1);
                                    sorting('amount', 'ASC');
                                  }
                                }}
                              >
                                Debit
                              </th>
                            )}
                            {creditDropDownFlag && (
                              <th
                                width={250}
                                className={
                                  (creditSortFlag == 0 && 'sorting') ||
                                  (creditSortFlag == 1 && 'sorting_asc') ||
                                  (creditSortFlag == 2 && 'sorting_desc')
                                }
                                tabIndex={0}
                                aria-controls="DataTables_Table_0"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Credit: activate to sort column ascending"
                                style={{ width: '56px' }}
                                aria-sort={
                                  (creditSortFlag == 0 && '') ||
                                  (creditSortFlag == 1 && ' ascending') ||
                                  (creditSortFlag == 2 && 'descending')
                                }
                                onClick={(e) => {
                                  if (creditSortFlag == 0) {
                                    setDateSortFlag(0);
                                    setLedgerSortFlag(0);
                                    setVoucherTypeSortFlag(0);
                                    setVoucherNoSortFlag(0);
                                    setDebitSortFlag(0);
                                    setCreditSortFlag(1);
                                    setNarrationSortFlag(0);

                                    sorting('amount', 'ASC');
                                  }
                                  if (creditSortFlag == 1) {
                                    setCreditSortFlag(2);
                                    sorting('amount', 'DESC');
                                  }
                                  if (creditSortFlag == 2) {
                                    setCreditSortFlag(1);
                                    sorting('amount', 'ASC');
                                  }
                                }}
                              >
                                Credit
                              </th>
                            )}

                            <th
                              tabIndex={0}
                              aria-controls="DataTables_Table_0"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Action: activate to sort column ascending"
                              style={{ width: '47px' }}
                            >
                              Balance
                            </th>
                            <th
                              tabIndex={0}
                              aria-controls="DataTables_Table_0"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Action: activate to sort column ascending"
                              style={{ width: '47px' }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {flag === 1 && (
                            <>
                              <tr>
                                <td>{openBalanceData[0].obCreated_date}</td>
                                <td>Cash</td>
                                <td />
                                <td></td>
                                <td>Opening balance</td>
                                <td align="center">
                                  {openBalanceData[0].obBalance_type ===
                                    'debit' &&
                                    (openBalanceData[0].obOpen_balance === ''
                                      ? 0.0
                                      : addCommas(openBalanceData[0].ob))}
                                </td>
                                <td align="center">
                                  {openBalanceData[0].obBalance_type ===
                                    'credit' &&
                                    (openBalanceData[0].obOpen_balance === ''
                                      ? 0.0
                                      : addCommas(openBalanceData[0].ob))}
                                </td>
                                <td align="center">
                                  {openBalanceData[0].obOpen_balance === ''
                                    ? 0.0
                                    : addCommas(openBalanceData[0].ob)}
                                </td>
                                <td />
                              </tr>
                            </>
                          )}

                          {/* {openingBalanceDataLoaded
                            ? cashBookOpeningBalance[0].tran_gen === 'Yes' && (
                                <tr>
                                  <td>{cashBookOpeningBalance[0].tran_Date}</td>
                                  <td>{cashBookOpeningBalance[0].branch}</td>
                                  <td>{cashBookOpeningBalance[0].type}</td>
                                  <td>{''}</td>
                                  <td>{'Opening Balance'}</td>
                                  <td>
                                    {cashBookOpeningBalance[0].dbt_ac === '30'
                                      ? addCommas(
                                          cashBookOpeningBalance[0].amount
                                        )
                                      : '-'}
                                  </td>
                                  <td>
                                    {cashBookOpeningBalance[0].crdt_ac === '30'
                                      ? addCommas(
                                          cashBookOpeningBalance[0].amount
                                        )
                                      : '-'}
                                  </td>
                                  <td>
                                    {' '}
                                    {cashBookOpeningBalance[0].crdt_ac ===
                                      '30' ||
                                    cashBookOpeningBalance[0].dbt_ac === '30'
                                      ? addCommas(
                                          cashBookOpeningBalance[0].amount
                                        )
                                      : '-'}
                                  </td>
                                  <td></td>
                                </tr>
                              )
                            : ''} */}

                          {flag3 === 1 && (
                            <>
                              <tr>
                                <td>{sDate}</td>
                                <td>Balance upto date</td>
                                <td />
                                <td />
                                <td />
                                <td align="center">{addCommas(lastBalance)}</td>
                                <td align="center">{''}</td>
                                <td align="center">{addCommas(lastBalance)}</td>
                                <td />
                              </tr>
                            </>
                          )}
                        </tbody>

                        {searchTerm == '' && (
                          <tbody>
                            {openBalanceDataLoaded2 && displayUsers}
                          </tbody>
                        )}

                        {searchTerm !== '' && (
                          <tbody>
                            {openBalanceDataLoaded2 && displayUsersOnSearch}
                          </tbody>
                        )}

                        <tbody>
                          <tr>
                            {/*<td colspan="3"></td>
                                 <td align="right"><b>Opening Balance</b></td>
                                 	<td><b>0.00</b></td>
                                 		<td></td>
                                 </tr>*/}
                          </tr>
                          <tr>
                            <td colSpan={5}>
                              <b>Current total</b>
                            </td>
                            <td align="right">
                              <b>
                                {openBalanceDataLoaded2
                                  ? addCommas(openBalanceData2[0].chq_no)
                                  : openBalanceData[0].obBalance_type ===
                                    'debit'
                                  ? openBalanceData[0].obOpen_balance === ''
                                    ? 0.0
                                    : addCommas(openBalanceData[0].ob)
                                  : '0.00'}

                                {/* {openBalanceDataLoaded2 &&
                                  addCommas(openBalanceData2[0].ac_no)} */}
                              </b>
                            </td>
                            <td align="right">
                              <b>
                                {openBalanceDataLoaded2
                                  ? addCommas(openBalanceData2[0].chq_date)
                                  : openBalanceData[0].obBalance_type ===
                                    'credit'
                                  ? openBalanceData[0].obOpen_balance === ''
                                    ? 0.0
                                    : addCommas(openBalanceData[0].ob)
                                  : '0.00'}

                                {/* {openBalanceDataLoaded2 &&
                                  addCommas(openBalanceData2[0].bank)} */}
                              </b>
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td colSpan={5}>
                              <b>Closing Balance</b>
                            </td>
                            <td align="right">
                              <b>
                                {openBalanceDataLoaded2
                                  ? openBalanceData2[0].createdTime > 0 &&
                                    addCommas(openBalanceData2[0].createdTime)
                                  : addCommas(openBalanceData[0].ob)}
                                {/* {!dataLoadedError &&
                                dataLoaded &&
                                parseInt(cashBook[0].ac_no) >
                                  parseInt(cashBook[0].bank)
                                  ? addCommas(
                                      cashBook[0].ac_no - cashBook[0].bank
                                    ) + '(Debit)'
                                  : ''} */}
                              </b>
                            </td>
                            <td align="right">
                              <b>
                                {openBalanceDataLoaded2 &&
                                  openBalanceData2[0].createdTime < 0 &&
                                  addCommas(
                                    Math.abs(openBalanceData2[0].createdTime)
                                  )}

                                {/* {!dataLoadedError &&
                                dataLoaded &&
                                parseInt(cashBook[0].ac_no) <
                                  parseInt(cashBook[0].bank)
                                  ? addCommas(
                                      cashBook[0].bank - cashBook[0].ac_no
                                    ) + '(Credit)'
                                  : ''} */}
                              </b>
                            </td>
                            <td></td>
                            <td align="right">
                              <b></b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        className="dataTables_info"
                        id="DataTables_Table_0_info"
                        role="status"
                        aria-live="polite"
                      >
                        {openBalanceDataLoaded2 && (
                          <>
                            Showing {pagesVisited * 1 + 1} to{' '}
                            {openBalanceData2.length - pagesVisited <
                            parseInt(usersPerPage)
                              ? pagesVisited +
                                (openBalanceData2.length - pagesVisited)
                              : pagesVisited * 1 + parseInt(usersPerPage)}{' '}
                            of {openBalanceData2.length} entries
                          </>
                        )}

                        {/* {!dataLoadedError ? (
                          !dataLoaded ? (
                            <h1>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No
                              data fetch&nbsp;&nbsp;&nbsp;&nbsp;
                            </h1>
                          ) : (
                            <>
                              Showing {pagesVisited * 1 + 1} to{' '}
                              {cashBook.length - pagesVisited <
                              parseInt(usersPerPage)
                                ? pagesVisited +
                                  (cashBook.length - pagesVisited)
                                : pagesVisited * 1 +
                                  parseInt(usersPerPage)}{' '}
                              of {cashBook.length} entries
                            </>
                          )
                        ) : (
                          <h1>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error
                            on data fetch&nbsp;&nbsp;&nbsp;&nbsp;
                          </h1>
                        )} */}
                      </div>
                      {openBalanceDataLoaded2 && (
                        <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="DataTables_Table_0_paginate"
                        >
                          <ReactPaginate
                            previousLabel={' Previous'}
                            nextLabel={'Next'}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={'paginationBttns'}
                            previousLinkClassName={
                              'paginate_button previous disabled'
                            }
                            nextLinkClassName={'paginate_button next disabled'}
                            activeClassName={'paginationActive'}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <br></br>
                  {/* 
/////////////////////excel export///////////////// */}

                  <div>
                    <table border="1px" id="id1" hidden>
                      <tbody>
                        <tr>
                          <th colSpan={7}>
                            <b>
                              &nbsp; Cash Book
                              <b />
                            </b>
                          </th>
                        </tr>
                        <tr>
                          <th>Date</th>
                          <th>Ledger</th>
                          <th>Voucher Type</th>
                          <th>Voucher No/Receipt No</th>
                          <th>Narration</th>
                          <th>Debit</th>
                          <th>Credit</th>
                          <th>Balance</th>
                        </tr>

                        {flag === 1 && (
                          <>
                            <tr>
                              <td>{openBalanceData[0].obCreated_date}</td>
                              <td>Cash</td>
                              <td />
                              <td></td>
                              <td>Opening balance</td>
                              <td align="center">
                                {openBalanceData[0].obBalance_type ===
                                  'debit' &&
                                  (openBalanceData[0].obOpen_balance === ''
                                    ? 0.0
                                    : addCommas(openBalanceData[0].ob))}
                              </td>
                              <td align="center">
                                {openBalanceData[0].obBalance_type ===
                                  'credit' &&
                                  (openBalanceData[0].obOpen_balance === ''
                                    ? 0.0
                                    : addCommas(openBalanceData[0].ob))}
                              </td>
                              <td align="center">
                                {openBalanceData[0].obOpen_balance === ''
                                  ? 0.0
                                  : addCommas(openBalanceData[0].ob)}
                              </td>
                              {/* <td /> */}
                            </tr>
                          </>
                        )}

                        {flag3 === 1 && (
                          <>
                            <tr>
                              <td>{sDate}</td>
                              <td>Balance upto date</td>
                              <td />
                              <td />
                              <td />
                              <td align="center">{addCommas(lastBalance)}</td>
                              <td align="center">{''}</td>
                              <td align="center">{addCommas(lastBalance)}</td>
                              {/* <td /> */}
                            </tr>
                          </>
                        )}

                        {openBalanceDataLoaded2 &&
                          openBalanceData2.map((item) => {
                            return (
                              <tr key={item.tranID}>
                                {dateDropDownFlag && <td>{item.tran_Date}</td>}
                                {ledgerDropDownFlag && (
                                  <td>
                                    {dateViewFlag && item.type === 'Receipt' && (
                                      <a
                                        onClick={(e) => {
                                          history.push({
                                            pathname: '/edit_receipt',
                                            post: item,
                                          });
                                        }}
                                      >
                                        {item.filename}
                                      </a>
                                    )}

                                    {loadViewFlag && item.type === 'Receipt' && (
                                      <a
                                        onClick={(e) => {
                                          history.push({
                                            pathname: '/edit_receipt',
                                            post: item,
                                          });
                                        }}
                                      >
                                        {item.filename}
                                      </a>
                                    )}

                                    {dateViewFlag && item.type === 'Voucher' && (
                                      <a
                                        onClick={(e) => {
                                          history.push({
                                            pathname: '/edit_voucher',
                                            post: item,
                                          });
                                        }}
                                      >
                                        {item.filename}
                                      </a>
                                    )}

                                    {loadViewFlag && item.type === 'Voucher' && (
                                      <a
                                        onClick={(e) => {
                                          history.push({
                                            pathname: '/edit_voucher',
                                            post: item,
                                          });
                                        }}
                                      >
                                        {item.filename}
                                      </a>
                                    )}

                                    {dateViewFlag && item.type === 'Contra' && (
                                      <a
                                        onClick={(e) => {
                                          history.push({
                                            pathname: '/edit_journal',
                                            post: item,
                                          });
                                        }}
                                      >
                                        {item.filename}
                                      </a>
                                    )}

                                    {loadViewFlag && item.type === 'Contra' && (
                                      <a
                                        onClick={(e) => {
                                          history.push({
                                            pathname: '/edit_journal',
                                            post: item,
                                          });
                                        }}
                                      >
                                        {item.filename}
                                      </a>
                                    )}

                                    {loadViewFlag &&
                                      item.type === 'Nil' &&
                                      item.branch}
                                    {dateViewFlag &&
                                      item.type === 'Nil' &&
                                      item.filename}
                                  </td>
                                )}
                                {voucherTypeDropDownFlag && (
                                  <td>{item.type}</td>
                                )}
                                {voucherNoDropDownFlag && (
                                  <td>
                                    {' '}
                                    {item.type === 'Receipt' &&
                                      'RCPT' + item.tranID}
                                    {item.type === 'Voucher' &&
                                      'VCHR' + item.tranID}
                                    {item.type === 'Contra' &&
                                      'CNTR' + item.tranID}
                                  </td>
                                )}
                                {narrationDropDownFlag && (
                                  <td>
                                    {' '}
                                    {item.type === 'Nil'
                                      ? 'Opening Balance'
                                      : item.description}
                                  </td>
                                )}
                                {debitDropDownFlag && (
                                  <td align="center">
                                    {item.dbt_ac ===
                                    sessionStorage.getItem('cashIdVal')
                                      ? addCommas(item.amount)
                                      : '-'}
                                  </td>
                                )}
                                {creditDropDownFlag && (
                                  <td align="center">
                                    {item.crdt_ac ===
                                    sessionStorage.getItem('cashIdVal')
                                      ? addCommas(item.amount)
                                      : '-'}
                                  </td>
                                )}
                                <td align="center">
                                  {item.bank > 0
                                    ? addCommas(item.bank)
                                    : addCommas(Math.abs(item.bank)) +
                                      '(debit)'}

                                  {/* {loadViewFlag && item.amount} */}
                                </td>
                              </tr>
                            );
                          })}

                        <tr>
                          {/*<td colspan="3"></td>
                                 <td align="right"><b>Opening Balance</b></td>
                                 	<td><b>0.00</b></td>
                                 		<td></td>
                                 </tr>*/}
                        </tr>
                        <tr>
                          <td colSpan={5}>
                            <b>Current total</b>
                          </td>
                          <td align="right">
                            <b>
                              {openBalanceDataLoaded2
                                ? addCommas(openBalanceData2[0].chq_no)
                                : openBalanceData[0].obBalance_type === 'debit'
                                ? openBalanceData[0].obOpen_balance === ''
                                  ? 0.0
                                  : addCommas(openBalanceData[0].ob)
                                : '0.00'}

                              {/* {!dataLoadedError &&
                                dataLoaded &&
                                addCommas(cashBook[0].ac_no)} */}
                            </b>
                          </td>
                          <td align="right">
                            <b>
                              {openBalanceDataLoaded2
                                ? addCommas(openBalanceData2[0].chq_date)
                                : openBalanceData[0].obBalance_type === 'credit'
                                ? openBalanceData[0].obOpen_balance === ''
                                  ? 0.0
                                  : addCommas(openBalanceData[0].ob)
                                : '0.00'}

                              {/* {!dataLoadedError &&
                                dataLoaded &&
                                addCommas(cashBook[0].bank)} */}
                            </b>
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td colSpan={5}>
                            <b>Closing Balance</b>
                          </td>
                          <td align="right">
                            <b>
                              {openBalanceDataLoaded2
                                ? openBalanceData2[0].createdTime > 0 &&
                                  addCommas(openBalanceData2[0].createdTime)
                                : addCommas(openBalanceData[0].ob)}

                              {/* {!dataLoadedError &&
                                dataLoaded &&
                                cashBook[0].ac_no > cashBook[0].bank &&
                                addCommas(
                                  cashBook[0].ac_no - cashBook[0].bank
                                ) + '(Debit)'} */}
                            </b>
                          </td>
                          <td>
                            <b>
                              {openBalanceDataLoaded2 &&
                                openBalanceData2[0].createdTime < 0 &&
                                addCommas(
                                  Math.abs(openBalanceData2[0].createdTime)
                                )}
                              {/* {!dataLoadedError &&
                                dataLoaded &&
                                cashBook[0].ac_no < cashBook[0].bank &&
                                addCommas(
                                  cashBook[0].bank - cashBook[0].ac_no
                                ) + '(Credit)'} */}
                            </b>
                          </td>
                          <td align="right">
                            <b></b>
                          </td>
                          {/* <td></td> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div align="center">
                    <br />
                    <ReactToExcel
                      table="id1"
                      filename="cashbook_excelFileIntuisyz"
                      sheet="sheet 1"
                      buttonText=" Export Excel"
                      className="btn btn-primary"
                    />
                  </div>
                </div>
              </div>
              <ToastContainer />
            </div>
          </div>
        </div>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default Cashbook;

//////////////Old code/////////////////////

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import {
//   useHistory,
//   useLocation,
//   Redirect,
//   Link,
//   BrowserRouter as Router,
// } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import ReactPaginate from 'react-paginate';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
// import { successToast } from '../common/global';
// import baseUrl from '../Base Url/baseUrl';
// import { cashBookData, cashBookBnDates } from '../modal';
// import PageLoader from '../Page Loader/pageloader';
// import ReactToExcel from 'react-html-table-to-excel';
// import { ToastContainer, toast } from 'react-toastify';

// const Cashbook = () => {
//   let history = useHistory();
//   let url = baseUrl.url;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     mode: 'onSubmit',
//   });

//   const [startDate, setStartDate] = useState();
//   const [endDate, setEndDate] = useState(new Date());
//   const [startDateFlag, setStartDateFlag] = useState(false);
//   const [endDateFlag, setEndDateFlag] = useState(false);
//   const [cashBook, setCashBook] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pageNumber, setPageNumber] = useState(0);
//   const [countPerPage, setCountPerPage] = useState(10);
//   const [accountStatementData, setAccountStatementData] = useState([]);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [dateSortFlag, setDateSortFlag] = useState(1);
//   const [ledgerSortFlag, setLedgerSortFlag] = useState(0);
//   const [voucherTypeSortFlag, setVoucherTypeSortFlag] = useState(0);
//   const [voucherNoSortFlag, setVoucherNoSortFlag] = useState(0);
//   const [narrationSortFlag, setNarrationSortFlag] = useState(0);
//   const [debitSortFlag, setDebitSortFlag] = useState(0);
//   const [creditSortFlag, setCreditSortFlag] = useState(0);

//   const [dataLoadedError, setDataLoadedError] = useState(true);
//   const [dataLoadedFlag, setDataLoadedFlag] = useState(false);

//   const [cashBookOpeningBalance, setCashBookOpeningBalance] = useState([]);
//   const [openingBalanceDataLoaded, setOpeningBalanceDataLoaded] =
//     useState(false);

//   const [dateDropDownFlag, setDateDropDownFlag] = useState(true);
//   const [ledgerDropDownFlag, setLedgerDropDownFlag] = useState(true);
//   const [voucherTypeDropDownFlag, setVoucherTypeDropDownFlag] = useState(true);
//   const [voucherNoDropDownFlag, setVoucherNoDropDownFlag] = useState(true);

//   const [dropdownFlag, setDropdownFlag] = useState(false);
//   const [narrationDropDownFlag, setNarrationDropDownFlag] = useState(true);
//   const [debitDropDownFlag, setDebitDropDownFlag] = useState(true);
//   const [creditDropDownFlag, setCreditDropDownFlag] = useState(true);

//   const usersPerPage = parseInt(countPerPage);
//   const pagesVisited = pageNumber * usersPerPage;
//   const pageCount = Math.ceil(cashBook.length / usersPerPage);

//   // console.log(
//   //   'pagesVisited',
//   //   pagesVisited,
//   //   '',
//   //   'pageCount',
//   //   pageCount,
//   //   'pageNumber',
//   //   pageNumber
//   // );

//   const displayUsers = cashBook
//     .slice(pagesVisited, pagesVisited + usersPerPage)
//     .filter((val) => {
//       // console.log('val', val);
//       if (searchTerm == '') {
//         return val;
//       } else if (val.branch.toLowerCase().includes(searchTerm.toLowerCase())) {
//         //    let k = val.ledger_name;
//         //    let i  = val.ac_group;
//         // if(k==searchTerm)
//         // {
//         //   return val;
//         // }

//         // else if(i==searchTerm)
//         // {
//         //
//         // }
//         return val;
//       }
//     })
//     .map((item) => {
//       return (
//         <tr key={item.tranID}>
//           {dateDropDownFlag && <td>{item.tran_Date}</td>}
//           {ledgerDropDownFlag && (
//             <td>
//               {item.type === 'Receipt' && (
//                 <a
//                   onClick={(e) => {
//                     history.push({
//                       pathname: '/edit_receipt',
//                       post: item,
//                     });
//                   }}
//                 >
//                   {item.branch}
//                 </a>
//               )}

//               {item.type === 'Voucher' && (
//                 <a
//                   onClick={(e) => {
//                     history.push({
//                       pathname: '/edit_voucher',
//                       post: item,
//                     });
//                   }}
//                 >
//                   {item.branch}
//                 </a>
//               )}

//               {item.type === 'Contra' && (
//                 <a
//                   onClick={(e) => {
//                     history.push({
//                       pathname: '/edit_journal',
//                       post: item,
//                     });
//                   }}
//                 >
//                   {item.branch}
//                 </a>
//               )}

//               {item.type === 'Nil' && item.branch}
//             </td>
//           )}
//           {voucherTypeDropDownFlag && <td>{item.type}</td>}
//           {voucherNoDropDownFlag && (
//             <td>
//               {' '}
//               {item.type === 'Receipt' && 'RCPT' + item.tranID}
//               {item.type === 'Voucher' && 'VCHR' + item.tranID}
//               {item.type === 'Contra' && 'CNTR' + item.tranID}
//             </td>
//           )}
//           {narrationDropDownFlag && (
//             <td>
//               {' '}
//               {item.type === 'Nil' ? 'Opening Balance' : item.description}
//             </td>
//           )}
//           {debitDropDownFlag && (
//             <td>{item.dbt_ac === '30' ? addCommas(item.amount) : '-'}</td>
//           )}
//           {creditDropDownFlag && (
//             <td>{item.crdt_ac === '30' ? addCommas(item.amount) : '-'}</td>
//           )}
//           <td>{addCommas(item.filename)}</td>

//           <td>
//             <a
//               onClick={(e) => {
//                 confirmAlert({
//                   title: 'Confirm to Delete',
//                   message: 'Are you sure to do this.',
//                   buttons: [
//                     {
//                       label: 'Yes',
//                       onClick: () => deleting(item.tranID),
//                     },
//                     {
//                       label: 'No',
//                       // onClick: () => alert('Click No')
//                     },
//                   ],
//                 });
//               }}
//             >
//               <button className="btn">Delete</button>
//             </a>
//           </td>
//         </tr>
//       );
//     });

//   // console.log('displayUsers', displayUsers);

//   const changePage = ({ selected }) => {
//     setPageNumber(selected);
//     // console.log('selected', selected);
//   };

//   const submitFinal = handleSubmit((data) => {
//     // setDataLoaded(false);
//     // setDataLoadedError(true);
//     // console.log('data loaded', dataLoaded);
//     // console.log('dataLoadedError', dataLoadedError);

//     if (startDate === null || startDate === undefined) {
//       setStartDateFlag(true);
//       if (endDate === null || endDate === undefined) {
//         setEndDateFlag(true);
//       } else {
//         setEndDateFlag(false);
//       }
//     } else if (endDate === null || endDate === undefined) {
//       setEndDateFlag(true);
//       if (startDate === null || startDate === undefined) {
//         setStartDateFlag(true);
//       } else {
//         setStartDateFlag(false);
//       }
//     } else {
//       setStartDateFlag(false);
//       setEndDateFlag(false);
//       setDataLoaded(false);
//       setDataLoadedError(true);
//       console.log('data loaded', dataLoaded);
//       console.log('dataLoadedError', dataLoadedError);

//       if (startDate.getDate() < 10) {
//         var currentDay = '0' + startDate.getDate();
//       } else {
//         var currentDay = startDate.getDate();
//       }

//       if (startDate.getMonth() + 1 < 10) {
//         var currentMonth = '0' + (startDate.getMonth() + 1);
//       } else {
//         var currentMonth = startDate.getMonth() + 1;
//       }

//       var sDate =
//         startDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

//       if (endDate.getDate() < 10) {
//         var currentDay = '0' + endDate.getDate();
//       } else {
//         var currentDay = endDate.getDate();
//       }

//       if (endDate.getMonth() + 1 < 10) {
//         var currentMonth = '0' + (endDate.getMonth() + 1);
//       } else {
//         var currentMonth = endDate.getMonth() + 1;
//       }

//       var eDate = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;

//       console.log(sDate, '', eDate);

//       axios
//         .get(url + `cashBookBnDates?start=${sDate}&end=${eDate}`)
//         .then(({ data }) => {
//           console.log(data);
//           setCashBook(data);

//           if (data.length === 0) {
//             setDataLoaded(false);
//             setDataLoadedError(false);
//           } else {
//             setDataLoaded(true);
//             setDataLoadedError(false);
//           }

//           setDataLoadedFlag(true);
//           console.log('data loaded', dataLoaded);
//           console.log('dataLoadedError', dataLoadedError);
//         })
//         .catch((err) => {
//           console.log(err);
//           setDataLoadedError(true);
//           setDataLoadedFlag(true);
//         });

//       ////////cashbook opening balance date search////////

//       axios
//         .get(url + `cashBookOpeningBalanceBnDates?start=${sDate}&end=${eDate}`)
//         .then(({ data }) => {
//           console.log('cash book opening balance data', data);
//           setCashBookOpeningBalance(data);

//           if (data.length === 0) {
//             setOpeningBalanceDataLoaded(false);
//             //setDataLoadedError(false);
//           } else {
//             setOpeningBalanceDataLoaded(true);
//             //setDataLoadedError(false);
//           }

//           setDataLoadedFlag(true);
//           console.log('openingBalance loaded', openingBalanceDataLoaded);
//           // console.log('dataLoadedError', dataLoadedError);
//         })
//         .catch((err) => {
//           console.log(err);
//           //setDataLoadedError(true);
//           setDataLoadedFlag(true);
//         });

//       // try {
//       //   const result1 = await cashBookBnDates({ start: sDate, end: eDate });
//       //   console.log('result1 ', result1);
//       //   setCashBook(result1);

//       //   if (result1.length >= 0) {
//       //     setDataLoaded(true);
//       //     setDataLoadedError(false);
//       //     setDataLoadedFlag(true);
//       //   }
//       //   console.log('data loaded', dataLoaded);
//       //   console.log('data loaded', dataLoadedError);
//       // } catch (error) {
//       //   console.log('error', error);
//       //   setDataLoadedError(true);
//       //   setDataLoadedFlag(true);
//       // }
//     }
//   });

//   function deleting(tranId) {
//     axios
//       .get(url + `cashBookDelete?tranId=${tranId}`)
//       .then(({ data }) => {
//         console.log('deleted data', data);
//         if (data[0].user_bank === "can't") {
//           successToast('We can not delete this data...try something else ');
//         } else {
//           successToast('Delete successfully');
//         }

//         dataLoading();
//       })
//       .catch((error) => {});
//   }

//   function sorting(field, type) {
//     setDataLoaded(false);
//     setDataLoadedError(true);
//     console.log(field, type);
//     axios
//       .get(url + `cashbook_sorting?field=${field}&type=${type}`)
//       .then(({ data }) => {
//         console.log(data);
//         setCashBook(data);

//         if (data.length === 0) {
//           setDataLoaded(false);
//           setDataLoadedError(false);
//         } else {
//           setDataLoaded(true);
//           setDataLoadedError(false);
//         }

//         setDataLoadedFlag(true);
//       })
//       .catch((err) => {
//         console.log(err);
//         setDataLoadedError(true);
//         setDataLoadedFlag(true);
//       });
//   }

//   const dataLoading = async () => {
//     try {
//       const result = await cashBookData();
//       console.log('result ', result);
//       setCashBook(result);

//       if (result.length === 0) {
//         setDataLoaded(false);
//         setDataLoadedError(false);
//       } else {
//         setDataLoaded(true);
//         setDataLoadedError(false);
//       }

//       setDataLoadedFlag(true);
//     } catch (error) {
//       console.log(error);
//       setDataLoadedError(true);
//       setDataLoadedFlag(true);
//     }
//   };

//   function dataLoading1() {
//     axios
//       .get(url + 'cashBookOpeningBalanceData')
//       .then(({ data }) => {
//         console.log(data);
//         setCashBookOpeningBalance(data);

//         if (data.length === 0) {
//           setOpeningBalanceDataLoaded(false);
//           // setDataLoadedError(false);
//         } else {
//           setOpeningBalanceDataLoaded(true);
//           // setDataLoadedError(false);
//         }

//         setDataLoadedFlag(true);
//         console.log('cashBookOpeningBalance ', cashBookOpeningBalance);
//         console.log('dataLoadedError', dataLoadedError);
//       })
//       .catch((err) => {
//         console.log(err);
//         // setDataLoadedError(true);
//         setDataLoadedFlag(true);
//       });
//   }

//   useEffect(() => {
//     dataLoading1();
//     dataLoading();
//   }, []);

//   function addCommas(nStr) {
//     nStr += '';
//     var x = nStr.split('.');
//     var x1 = x[0];
//     var x2 = x.length > 1 ? '.' + x[1] : '.00';
//     var rgx = /(\d+)(\d{3})/;
//     while (rgx.test(x1)) {
//       x1 = x1.replace(rgx, '$1' + ',' + '$2');
//     }

//     if (x2.length === 2) {
//       x2 = x2 + '0';
//     }
//     return x1 + x2;
//   }

//   return (
//     <div>
//       {dataLoadedFlag ? (
//         <div className="container-fluid" id="content">
//           <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
//             <div className="container-fluid">
//               <div className="page-header">
//                 <div className="pull-left">
//                   <h1>Cash Book</h1>
//                 </div>
//                 <div className="pull-right"></div>
//               </div>
//               <div className="box">
//                 <div className="box-title">
//                   <div className="box-content">
//                     <form className="form-horizontal" method="post">
//                       <div className="row">
//                         <div className="col-sm-5 form-group">
//                           <label
//                             htmlFor="textfield"
//                             className="control-label col-sm-2"
//                           >
//                             Start Date
//                           </label>
//                           <div className="col-sm-6">
//                             <DatePicker
//                               name="start"
//                               className="form-control datepicker"
//                               dateFormat="dd/MM/yyyy"
//                               selected={startDate}
//                               onChange={(date) => setStartDate(date)}
//                               defaultValue=""
//                             />
//                             <div style={{ color: 'red' }}>
//                               {startDateFlag && <p>Date is required.</p>}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-sm-5 form-group">
//                           <label
//                             htmlFor="textfield"
//                             className="control-label col-sm-2"
//                           >
//                             End Date
//                           </label>
//                           <div className="col-sm-6">
//                             <DatePicker
//                               className="form-control"
//                               name="end"
//                               className="form-control datepicker"
//                               dateFormat="dd/MM/yyyy"
//                               selected={endDate}
//                               onChange={(date) => setEndDate(date)}
//                               defaultValue=""
//                             />
//                             <div style={{ color: 'red' }}>
//                               {endDateFlag && <p>Date is required.</p>}
//                             </div>
//                           </div>
//                           <div className="col-sm-2">
//                             <input
//                               type="submit"
//                               name="submit"
//                               className="btn btn-primary btn-lg"
//                               defaultValue="Search"
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 submitFinal();
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <br />
//             {/*-form ends here*/}
//             <div className="row" style={{ paddingLeft: '22px' }}>
//               <div className="col-sm-12">
//                 <div className="box box-color box-bordered">
//                   <div className="box-title">
//                     <h3>
//                       <i className="fa fa-table" />
//                       Cash Transactions
//                     </h3>
//                   </div>
//                   <div className="box-content nopadding" id="search_result">
//                     <div
//                       id="DataTables_Table_0_wrapper"
//                       className="dataTables_wrapper no-footer"
//                     >
//                       <div
//                         className="ColVis"
//                         // style={{
//                         //   height: '30px',
//                         //   width: '152px',
//                         //   top: '509px',
//                         //   left: '965px',
//                         // }}
//                       >
//                         <button
//                           className="ColVis_Button ColVis_MasterButton"
//                           onClick={() => {
//                             if (dropdownFlag === true) {
//                               setDropdownFlag(false);
//                             } else {
//                               setDropdownFlag(true);
//                             }
//                           }}
//                         >
//                           <span>
//                             Show/hide columns <i className="fa fa-angle-down" />
//                           </span>
//                         </button>
//                         {dropdownFlag && (
//                           <ul
//                             className="ColVis_collection"
//                             style={{
//                               display: 'block',
//                               opacity: 1,
//                               // position: 'absolute',
//                               // top: '509px',
//                               // left: '965px',
//                             }}
//                             align="left"
//                           >
//                             <li>
//                               <label>
//                                 <input
//                                   type="checkbox"
//                                   checked={dateDropDownFlag && 'true'}
//                                   onClick={() => {
//                                     if (dateDropDownFlag === true) {
//                                       setDateDropDownFlag(false);
//                                     } else {
//                                       setDateDropDownFlag(true);
//                                     }
//                                   }}
//                                 />
//                                 Date
//                               </label>
//                             </li>
//                             <li>
//                               <label>
//                                 <input
//                                   type="checkbox"
//                                   checked={ledgerDropDownFlag && 'true'}
//                                   onClick={() => {
//                                     if (ledgerDropDownFlag === true) {
//                                       setLedgerDropDownFlag(false);
//                                     } else {
//                                       setLedgerDropDownFlag(true);
//                                     }
//                                   }}
//                                 />
//                                 Ledger
//                               </label>
//                             </li>
//                             <li>
//                               <label>
//                                 <input
//                                   type="checkbox"
//                                   checked={voucherTypeDropDownFlag && 'true'}
//                                   onClick={() => {
//                                     if (voucherTypeDropDownFlag === true) {
//                                       setVoucherTypeDropDownFlag(false);
//                                     } else {
//                                       setVoucherTypeDropDownFlag(true);
//                                     }
//                                   }}
//                                 />
//                                 Voucher Type
//                               </label>
//                             </li>
//                             <li>
//                               <label>
//                                 <input
//                                   type="checkbox"
//                                   checked={voucherNoDropDownFlag && 'true'}
//                                   onClick={() => {
//                                     if (voucherNoDropDownFlag === true) {
//                                       setVoucherNoDropDownFlag(false);
//                                     } else {
//                                       setVoucherNoDropDownFlag(true);
//                                     }
//                                   }}
//                                 />
//                                 Voucher No
//                               </label>
//                             </li>

//                             <li>
//                               <label>
//                                 <input
//                                   type="checkbox"
//                                   checked={narrationDropDownFlag && 'true'}
//                                   onClick={() => {
//                                     if (narrationDropDownFlag === true) {
//                                       setNarrationDropDownFlag(false);
//                                     } else {
//                                       setNarrationDropDownFlag(true);
//                                     }
//                                   }}
//                                 />
//                                 <span
//                                 // _msthash={481381}
//                                 // _msttexthash={136708}
//                                 >
//                                   Narration
//                                 </span>
//                               </label>
//                             </li>
//                             <li>
//                               <label>
//                                 <input
//                                   type="checkbox"
//                                   checked={debitDropDownFlag && 'true'}
//                                   onClick={() => {
//                                     if (debitDropDownFlag === true) {
//                                       setDebitDropDownFlag(false);
//                                     } else {
//                                       setDebitDropDownFlag(true);
//                                     }
//                                   }}
//                                 />
//                                 Debit Account
//                               </label>
//                             </li>
//                             <li>
//                               <label>
//                                 <input
//                                   type="checkbox"
//                                   checked={creditDropDownFlag && 'true'}
//                                   onClick={() => {
//                                     if (creditDropDownFlag === true) {
//                                       setCreditDropDownFlag(false);
//                                     } else {
//                                       setCreditDropDownFlag(true);
//                                     }
//                                   }}
//                                 />
//                                 Credit Account
//                               </label>
//                             </li>
//                           </ul>
//                         )}
//                       </div>

//                       <div
//                         className="dataTables_length"
//                         id="DataTables_Table_0_length"
//                       >
//                         <label>
//                           Show{' '}
//                           <select
//                             name="DataTables_Table_0_length"
//                             aria-controls="DataTables_Table_0"
//                             className
//                             onChange={(e) => {
//                               setCountPerPage(e.target.value);
//                               setPageNumber(0);
//                               //  changePage({selected:'0'})
//                             }}
//                           >
//                             <option value={10}>10</option>
//                             <option value={25}>25</option>
//                             <option value={50}>50</option>
//                             <option value={100}>100</option>
//                           </select>{' '}
//                           entries
//                         </label>
//                       </div>
//                       <div
//                         id="DataTables_Table_0_filter"
//                         className="dataTables_filter"
//                       >
//                         <label>
//                           Search:
//                           <input
//                             type="search"
//                             className
//                             placeholder
//                             aria-controls="DataTables_Table_0"
//                             onChange={(e) => {
//                               setSearchTerm(e.target.value);
//                             }}
//                           />
//                         </label>
//                       </div>
//                       <table
//                         className="table table-hover table-nomargin table-bordered dataTable dataTable-colvis no-footer"
//                         id="DataTables_Table_0"
//                         role="grid"
//                         aria-describedby="DataTables_Table_0_info"
//                         // style={{ width: '840px' }}
//                       >
//                         <thead>
//                           <tr role="row">
//                             {dateDropDownFlag && (
//                               <th
//                                 className={
//                                   (dateSortFlag == 0 && 'sorting') ||
//                                   (dateSortFlag == 1 && 'sorting_asc') ||
//                                   (dateSortFlag == 2 && 'sorting_desc')
//                                 }
//                                 width={250}
//                                 tabIndex={0}
//                                 aria-controls="DataTables_Table_0"
//                                 rowSpan={1}
//                                 colSpan={1}
//                                 aria-label="Date: activate to sort column descending"
//                                 style={{ width: '30px' }}
//                                 aria-sort={
//                                   (dateSortFlag == 0 && '') ||
//                                   (dateSortFlag == 1 && ' ascending') ||
//                                   (dateSortFlag == 2 && 'descending')
//                                 }
//                                 onClick={(e) => {
//                                   if (dateSortFlag == 0) {
//                                     setDateSortFlag(1);
//                                     setLedgerSortFlag(0);
//                                     setVoucherTypeSortFlag(0);
//                                     setVoucherNoSortFlag(0);
//                                     setNarrationSortFlag(0);
//                                     setDebitSortFlag(0);
//                                     setCreditSortFlag(0);

//                                     sorting('tran_Date', 'ASC');
//                                   }
//                                   if (dateSortFlag == 1) {
//                                     setDateSortFlag(2);
//                                     sorting('tran_Date', 'DESC');
//                                   }
//                                   if (dateSortFlag == 2) {
//                                     setDateSortFlag(1);
//                                     sorting('tran_Date', 'ASC');
//                                   }
//                                 }}
//                               >
//                                 Date
//                               </th>
//                             )}
//                             {ledgerDropDownFlag && (
//                               <th
//                                 width={250}
//                                 className={
//                                   (ledgerSortFlag == 0 && 'sorting') ||
//                                   (ledgerSortFlag == 1 && 'sorting_asc') ||
//                                   (ledgerSortFlag == 2 && 'sorting_desc')
//                                 }
//                                 tabIndex={0}
//                                 aria-controls="DataTables_Table_0"
//                                 rowSpan={1}
//                                 colSpan={1}
//                                 aria-label="Ledger: activate to sort column ascending"
//                                 style={{ width: '47px' }}
//                                 aria-sort={
//                                   (ledgerSortFlag == 0 && '') ||
//                                   (ledgerSortFlag == 1 && ' ascending') ||
//                                   (ledgerSortFlag == 2 && 'descending')
//                                 }
//                                 onClick={(e) => {
//                                   if (ledgerSortFlag == 0) {
//                                     setDateSortFlag(0);
//                                     setLedgerSortFlag(1);
//                                     setVoucherTypeSortFlag(0);
//                                     setVoucherNoSortFlag(0);
//                                     setDebitSortFlag(0);
//                                     setCreditSortFlag(0);
//                                     setNarrationSortFlag(0);

//                                     sorting('ledger_name', 'ASC');
//                                   }
//                                   if (ledgerSortFlag == 1) {
//                                     setLedgerSortFlag(2);
//                                     sorting('ledger_name', 'DESC');
//                                   }
//                                   if (ledgerSortFlag == 2) {
//                                     setLedgerSortFlag(1);
//                                     sorting('ledger_name', 'ASC');
//                                   }
//                                 }}
//                               >
//                                 Ledger
//                               </th>
//                             )}
//                             {voucherTypeDropDownFlag && (
//                               <th
//                                 width={250}
//                                 className={
//                                   (voucherTypeSortFlag == 0 && 'sorting') ||
//                                   (voucherTypeSortFlag == 1 && 'sorting_asc') ||
//                                   (voucherTypeSortFlag == 2 && 'sorting_desc')
//                                 }
//                                 tabIndex={0}
//                                 aria-controls="DataTables_Table_0"
//                                 rowSpan={1}
//                                 colSpan={1}
//                                 aria-label="Voucher Type: activate to sort column ascending"
//                                 style={{ width: '83px' }}
//                                 aria-sort={
//                                   (voucherTypeSortFlag == 0 && '') ||
//                                   (voucherTypeSortFlag == 1 && ' ascending') ||
//                                   (voucherTypeSortFlag == 2 && 'descending')
//                                 }
//                                 onClick={(e) => {
//                                   if (voucherTypeSortFlag == 0) {
//                                     setDateSortFlag(0);
//                                     setLedgerSortFlag(0);
//                                     setVoucherTypeSortFlag(1);
//                                     setVoucherNoSortFlag(0);
//                                     setDebitSortFlag(0);
//                                     setCreditSortFlag(0);
//                                     setNarrationSortFlag(0);

//                                     sorting('type', 'ASC');
//                                   }
//                                   if (voucherTypeSortFlag == 1) {
//                                     setVoucherTypeSortFlag(2);
//                                     sorting('type', 'DESC');
//                                   }
//                                   if (voucherTypeSortFlag == 2) {
//                                     setVoucherTypeSortFlag(1);
//                                     sorting('type', 'ASC');
//                                   }
//                                 }}
//                               >
//                                 Voucher Type
//                               </th>
//                             )}
//                             {voucherNoDropDownFlag && (
//                               <th
//                                 width={250}
//                                 className={
//                                   (voucherNoSortFlag == 0 && 'sorting') ||
//                                   (voucherNoSortFlag == 1 && 'sorting_asc') ||
//                                   (voucherNoSortFlag == 2 && 'sorting_desc')
//                                 }
//                                 tabIndex={0}
//                                 aria-controls="DataTables_Table_0"
//                                 rowSpan={1}
//                                 colSpan={1}
//                                 aria-label="Voucher No/Receipt No: activate to sort column ascending"
//                                 style={{ width: '142px' }}
//                                 aria-sort={
//                                   (voucherNoSortFlag == 0 && '') ||
//                                   (voucherNoSortFlag == 1 && ' ascending') ||
//                                   (voucherNoSortFlag == 2 && 'descending')
//                                 }
//                                 onClick={(e) => {
//                                   if (voucherNoSortFlag == 0) {
//                                     setDateSortFlag(0);
//                                     setLedgerSortFlag(0);
//                                     setVoucherTypeSortFlag(0);
//                                     setVoucherNoSortFlag(1);
//                                     setDebitSortFlag(0);
//                                     setCreditSortFlag(0);
//                                     setNarrationSortFlag(0);

//                                     sorting('typeWithNo', 'ASC');
//                                   }
//                                   if (voucherNoSortFlag == 1) {
//                                     setVoucherNoSortFlag(2);
//                                     sorting('typeWithNo', 'DESC');
//                                   }
//                                   if (voucherNoSortFlag == 2) {
//                                     setVoucherNoSortFlag(1);
//                                     sorting('typeWithNo', 'ASC');
//                                   }
//                                 }}
//                               >
//                                 Voucher No/Receipt No
//                               </th>
//                             )}
//                             {narrationDropDownFlag && (
//                               <th
//                                 width={250}
//                                 className={
//                                   (narrationSortFlag == 0 && 'sorting') ||
//                                   (narrationSortFlag == 1 && 'sorting_asc') ||
//                                   (narrationSortFlag == 2 && 'sorting_desc')
//                                 }
//                                 tabIndex={0}
//                                 aria-controls="DataTables_Table_0"
//                                 rowSpan={1}
//                                 colSpan={1}
//                                 aria-label="Narration: activate to sort column ascending"
//                                 style={{ width: '60px' }}
//                                 aria-sort={
//                                   (narrationSortFlag == 0 && '') ||
//                                   (narrationSortFlag == 1 && ' ascending') ||
//                                   (narrationSortFlag == 2 && 'descending')
//                                 }
//                                 onClick={(e) => {
//                                   if (narrationSortFlag == 0) {
//                                     setDateSortFlag(0);
//                                     setLedgerSortFlag(0);
//                                     setVoucherTypeSortFlag(0);
//                                     setVoucherNoSortFlag(0);
//                                     setDebitSortFlag(0);
//                                     setCreditSortFlag(0);
//                                     setNarrationSortFlag(1);

//                                     sorting('description', 'ASC');
//                                   }
//                                   if (narrationSortFlag == 1) {
//                                     setNarrationSortFlag(2);
//                                     sorting('description', 'DESC');
//                                   }
//                                   if (narrationSortFlag == 2) {
//                                     setNarrationSortFlag(1);
//                                     sorting('description', 'ASC');
//                                   }
//                                 }}
//                               >
//                                 Narration
//                               </th>
//                             )}
//                             {debitDropDownFlag && (
//                               <th
//                                 width={250}
//                                 className={
//                                   (debitSortFlag == 0 && 'sorting') ||
//                                   (debitSortFlag == 1 && 'sorting_asc') ||
//                                   (debitSortFlag == 2 && 'sorting_desc')
//                                 }
//                                 tabIndex={0}
//                                 aria-controls="DataTables_Table_0"
//                                 rowSpan={1}
//                                 colSpan={1}
//                                 aria-label="Debit: activate to sort column ascending"
//                                 style={{ width: '56px' }}
//                                 aria-sort={
//                                   (debitSortFlag == 0 && '') ||
//                                   (debitSortFlag == 1 && ' ascending') ||
//                                   (debitSortFlag == 2 && 'descending')
//                                 }
//                                 onClick={(e) => {
//                                   if (debitSortFlag == 0) {
//                                     setDateSortFlag(0);
//                                     setLedgerSortFlag(0);
//                                     setVoucherTypeSortFlag(0);
//                                     setVoucherNoSortFlag(0);
//                                     setDebitSortFlag(1);
//                                     setCreditSortFlag(0);
//                                     setNarrationSortFlag(0);

//                                     sorting('amount', 'ASC');
//                                   }
//                                   if (debitSortFlag == 1) {
//                                     setDebitSortFlag(2);
//                                     sorting('amount', 'DESC');
//                                   }
//                                   if (debitSortFlag == 2) {
//                                     setDebitSortFlag(1);
//                                     sorting('amount', 'ASC');
//                                   }
//                                 }}
//                               >
//                                 Debit
//                               </th>
//                             )}
//                             {creditDropDownFlag && (
//                               <th
//                                 width={250}
//                                 className={
//                                   (creditSortFlag == 0 && 'sorting') ||
//                                   (creditSortFlag == 1 && 'sorting_asc') ||
//                                   (creditSortFlag == 2 && 'sorting_desc')
//                                 }
//                                 tabIndex={0}
//                                 aria-controls="DataTables_Table_0"
//                                 rowSpan={1}
//                                 colSpan={1}
//                                 aria-label="Credit: activate to sort column ascending"
//                                 style={{ width: '56px' }}
//                                 aria-sort={
//                                   (creditSortFlag == 0 && '') ||
//                                   (creditSortFlag == 1 && ' ascending') ||
//                                   (creditSortFlag == 2 && 'descending')
//                                 }
//                                 onClick={(e) => {
//                                   if (creditSortFlag == 0) {
//                                     setDateSortFlag(0);
//                                     setLedgerSortFlag(0);
//                                     setVoucherTypeSortFlag(0);
//                                     setVoucherNoSortFlag(0);
//                                     setDebitSortFlag(0);
//                                     setCreditSortFlag(1);
//                                     setNarrationSortFlag(0);

//                                     sorting('amount', 'ASC');
//                                   }
//                                   if (creditSortFlag == 1) {
//                                     setCreditSortFlag(2);
//                                     sorting('amount', 'DESC');
//                                   }
//                                   if (creditSortFlag == 2) {
//                                     setCreditSortFlag(1);
//                                     sorting('amount', 'ASC');
//                                   }
//                                 }}
//                               >
//                                 Credit
//                               </th>
//                             )}

//                             <th
//                               tabIndex={0}
//                               aria-controls="DataTables_Table_0"
//                               rowSpan={1}
//                               colSpan={1}
//                               aria-label="Action: activate to sort column ascending"
//                               style={{ width: '47px' }}
//                             >
//                               Balance
//                             </th>
//                             <th
//                               tabIndex={0}
//                               aria-controls="DataTables_Table_0"
//                               rowSpan={1}
//                               colSpan={1}
//                               aria-label="Action: activate to sort column ascending"
//                               style={{ width: '47px' }}
//                             >
//                               Action
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {openingBalanceDataLoaded
//                             ? cashBookOpeningBalance[0].tran_gen === 'Yes' && (
//                                 <tr>
//                                   <td>{cashBookOpeningBalance[0].tran_Date}</td>
//                                   <td>{cashBookOpeningBalance[0].branch}</td>
//                                   <td>{cashBookOpeningBalance[0].type}</td>
//                                   <td>{''}</td>
//                                   <td>{'Opening Balance'}</td>
//                                   <td>
//                                     {cashBookOpeningBalance[0].dbt_ac === '30'
//                                       ? addCommas(
//                                           cashBookOpeningBalance[0].amount
//                                         )
//                                       : '-'}
//                                   </td>
//                                   <td>
//                                     {cashBookOpeningBalance[0].crdt_ac === '30'
//                                       ? addCommas(
//                                           cashBookOpeningBalance[0].amount
//                                         )
//                                       : '-'}
//                                   </td>
//                                   <td></td>
//                                   <td></td>
//                                 </tr>
//                               )
//                             : ''}
//                         </tbody>
//                         <tbody>{displayUsers}</tbody>
//                         <tbody>
//                           <tr>
//                             {/*<td colspan="3"></td>
//                                  <td align="right"><b>Opening Balance</b></td>
//                                  	<td><b>0.00</b></td>
//                                  		<td></td>
//                                  </tr>*/}
//                           </tr>
//                           <tr>
//                             <td colSpan={5}>
//                               <b>Current total</b>
//                             </td>
//                             <td align="right">
//                               <b>
//                                 {!dataLoadedError &&
//                                   dataLoaded &&
//                                   addCommas(cashBook[0].ac_no)}
//                               </b>
//                             </td>
//                             <td align="right">
//                               <b>
//                                 {!dataLoadedError &&
//                                   dataLoaded &&
//                                   addCommas(cashBook[0].bank)}
//                               </b>
//                             </td>
//                             <td></td>
//                             <td></td>
//                           </tr>
//                           <tr>
//                             <td colSpan={5}>
//                               <b>Closing Balance</b>
//                             </td>
//                             <td align="right">
//                               <b>
//                                 {!dataLoadedError &&
//                                 dataLoaded &&
//                                 parseInt(cashBook[0].ac_no) >
//                                   parseInt(cashBook[0].bank)
//                                   ? addCommas(
//                                       cashBook[0].ac_no - cashBook[0].bank
//                                     ) + '(Debit)'
//                                   : ''}
//                               </b>
//                             </td>
//                             <td align="right">
//                               <b>
//                                 {!dataLoadedError &&
//                                 dataLoaded &&
//                                 parseInt(cashBook[0].ac_no) <
//                                   parseInt(cashBook[0].bank)
//                                   ? addCommas(
//                                       cashBook[0].bank - cashBook[0].ac_no
//                                     ) + '(Credit)'
//                                   : ''}
//                               </b>
//                             </td>
//                             <td></td>
//                             <td align="right">
//                               <b></b>
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                       <div
//                         className="dataTables_info"
//                         id="DataTables_Table_0_info"
//                         role="status"
//                         aria-live="polite"
//                       >
//                         {!dataLoadedError ? (
//                           !dataLoaded ? (
//                             <h1>
//                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No
//                               data fetch&nbsp;&nbsp;&nbsp;&nbsp;
//                             </h1>
//                           ) : (
//                             <>
//                               Showing {pagesVisited * 1 + 1} to{' '}
//                               {cashBook.length - pagesVisited <
//                               parseInt(usersPerPage)
//                                 ? pagesVisited +
//                                   (cashBook.length - pagesVisited)
//                                 : pagesVisited * 1 +
//                                   parseInt(usersPerPage)}{' '}
//                               of {cashBook.length} entries
//                             </>
//                           )
//                         ) : (
//                           <h1>
//                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error
//                             on data fetch&nbsp;&nbsp;&nbsp;&nbsp;
//                           </h1>
//                         )}
//                       </div>
//                       {dataLoaded && (
//                         <div
//                           className="dataTables_paginate paging_simple_numbers"
//                           id="DataTables_Table_0_paginate"
//                         >
//                           <ReactPaginate
//                             previousLabel={' Previous'}
//                             nextLabel={'Next'}
//                             pageCount={pageCount}
//                             onPageChange={changePage}
//                             containerClassName={'paginationBttns'}
//                             previousLinkClassName={
//                               'paginate_button previous disabled'
//                             }
//                             nextLinkClassName={'paginate_button next disabled'}
//                             activeClassName={'paginationActive'}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <br></br>
//                   <br></br>
//                   {/*
// /////////////////////excel export///////////////// */}

//                   <div>
//                     <table border="1px" id="id1" hidden>
//                       <tbody>
//                         <tr>
//                           <th colSpan={7}>
//                             <b>
//                               &nbsp; Cash Book
//                               <b />
//                             </b>
//                           </th>
//                         </tr>
//                         <tr>
//                           <th>Date</th>
//                           <th>Ledger</th>
//                           <th>Voucher Type</th>
//                           <th>Voucher No/Receipt No</th>
//                           <th>Narration</th>
//                           <th>Debit</th>
//                           <th>Credit</th>
//                           <th>Balance</th>
//                         </tr>
//                         {cashBook.map((item) => {
//                           return (
//                             <tr key={item.tranID}>
//                               <td align="right">
//                                 {item.tran_Date} &nbsp; &nbsp; &nbsp; &nbsp;
//                               </td>
//                               <td>
//                                 {item.type === 'Receipt' && (
//                                   <a
//                                     onClick={(e) => {
//                                       history.push({
//                                         pathname: '/edit_receipt',
//                                         post: item,
//                                       });
//                                     }}
//                                   >
//                                     {item.branch}
//                                   </a>
//                                 )}

//                                 {item.type === 'Voucher' && (
//                                   <a
//                                     onClick={(e) => {
//                                       history.push({
//                                         pathname: '/edit_voucher',
//                                         post: item,
//                                       });
//                                     }}
//                                   >
//                                     {item.branch}
//                                   </a>
//                                 )}

//                                 {item.type === 'Contra' && (
//                                   <a
//                                     onClick={(e) => {
//                                       history.push({
//                                         pathname: '/edit_journal',
//                                         post: item,
//                                       });
//                                     }}
//                                   >
//                                     {item.branch}
//                                   </a>
//                                 )}
//                               </td>
//                               <td>{item.type}</td>
//                               <td>
//                                 {' '}
//                                 {item.type === 'Receipt' &&
//                                   'RCPT' + item.tranID}
//                                 {item.type === 'Voucher' &&
//                                   'VCHR' + item.tranID}
//                                 {item.type === 'Contra' && 'CNTR' + item.tranID}
//                               </td>
//                               <td>{item.description}</td>
//                               <td align="right">
//                                 {item.dbt_ac === '30'
//                                   ? addCommas(item.amount)
//                                   : '-'}
//                               </td>
//                               <td align="right">
//                                 {item.crdt_ac === '30'
//                                   ? addCommas(item.amount)
//                                   : '-'}
//                               </td>
//                               <td></td>
//                               <td></td>
//                             </tr>
//                           );
//                         })}

//                         <tr>
//                           {/*<td colspan="3"></td>
//                                  <td align="right"><b>Opening Balance</b></td>
//                                  	<td><b>0.00</b></td>
//                                  		<td></td>
//                                  </tr>*/}
//                         </tr>
//                         <tr>
//                           <td colSpan={5}>
//                             <b>Current total</b>
//                           </td>
//                           <td align="right">
//                             <b>
//                               {!dataLoadedError &&
//                                 dataLoaded &&
//                                 addCommas(cashBook[0].ac_no)}
//                             </b>
//                           </td>
//                           <td align="right">
//                             <b>
//                               {!dataLoadedError &&
//                                 dataLoaded &&
//                                 addCommas(cashBook[0].bank)}
//                             </b>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td colSpan={5}>
//                             <b>Closing Balance</b>
//                           </td>
//                           <td align="right">
//                             <b>
//                               {!dataLoadedError &&
//                                 dataLoaded &&
//                                 cashBook[0].ac_no > cashBook[0].bank &&
//                                 addCommas(
//                                   cashBook[0].ac_no - cashBook[0].bank
//                                 ) + '(Debit)'}
//                             </b>
//                             <b>
//                               {!dataLoadedError &&
//                                 dataLoaded &&
//                                 cashBook[0].ac_no < cashBook[0].bank &&
//                                 addCommas(
//                                   cashBook[0].bank - cashBook[0].ac_no
//                                 ) + '(Credit)'}
//                             </b>
//                           </td>
//                           <td align="right">
//                             <b></b>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>

//                   <div align="center">
//                     <br />
//                     <ReactToExcel
//                       table="id1"
//                       filename="cashbook_excelFileIntuisyz"
//                       sheet="sheet 1"
//                       buttonText=" Export Excel"
//                       className="btn btn-primary"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <ToastContainer />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <PageLoader />
//       )}
//     </div>
//   );
// };

// export default Cashbook;
