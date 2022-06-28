import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { successToast } from '../common/global';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../Base Url/baseUrl';
import Headers from '../Header/Headers';
import {
  useHistory,
  useLocation,
  Redirect,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';

const Add_group = () => {
  let history = useHistory();
  const [acTitle, setAcTitle] = useState([]);
  const [acTitleLoaded, setAcTitleLoaded] = useState([]);
  const [grpData, setGrpData] = useState([]);
  // const { register, handleSubmit, errors, setValue, reset } = useForm({
  //   mode: 'onSubmit',
  // });

  let urlDetails = window.location.href;
  let myArray = urlDetails.split('?');

  if (myArray.length > 1) {
    let urlVal = myArray[1].split('&');

    if (urlVal[0].split('=')[0] == 'CompanyName') {
      sessionStorage.setItem('CompanyName', urlVal[0].split('=')[1]);
    }

    if (urlVal[1].split('=')[0] == 'logDetails') {
      sessionStorage.setItem('logDetails', urlVal[1].split('=')[1]);
    }

    if (urlVal[2].split('=')[0] == 'tdsIdVal') {
      sessionStorage.setItem('tdsIdVal', urlVal[2].split('=')[1]);
    }

    if (urlVal[3].split('=')[0] == 'gstIdVal') {
      sessionStorage.setItem('gstIdVal', urlVal[3].split('=')[1]);
    }

    if (urlVal[4].split('=')[0] == 'cashIdVal') {
      sessionStorage.setItem('cashIdVal', urlVal[4].split('=')[1]);
    }

    if (urlVal[5].split('=')[0] == 'CustId') {
      sessionStorage.setItem('CustId', urlVal[5].split('=')[1]);
    }
  }

  const [checkGrpName, setCheckGrpName] = useState([]);
  const [validationMsg, setValidationMsg] = useState();
  const [acTypeData, setAcTypeData] = useState();
  // const [grpFlag, setGrpFlag] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  let url = baseUrl.url;

  const submitFinal = handleSubmit((data) => {
    ////////////////////////Date and Time /////////////////////////////////
    var currentdate = new Date();

    if (currentdate.getDate() < 10) {
      var currentDay = '0' + currentdate.getDate();
    } else {
      var currentDay = currentdate.getDate();
    }

    if (currentdate.getMonth() + 1 < 10) {
      var currentMonth = '0' + (currentdate.getMonth() + 1);
    } else {
      var currentMonth = currentdate.getMonth() + 1;
    }

    var cDate =
      currentdate.getFullYear() + '-' + currentMonth + '-' + currentDay;

    if (currentdate.getHours() < 10) {
      var currentHour = '0' + currentdate.getHours();
    } else {
      var currentHour = currentdate.getHours();
    }

    if (currentdate.getMinutes() < 10) {
      var currentMinutes = '0' + currentdate.getMinutes();
    } else {
      var currentMinutes = currentdate.getMinutes();
    }

    if (currentdate.getSeconds() < 10) {
      var currentSeconds = '0' + currentdate.getSeconds();
    } else {
      var currentSeconds = currentdate.getSeconds();
    }

    var cTime = currentHour + ':' + currentMinutes + ':' + currentSeconds;

    console.log('date', cTime, cDate);

    ///////////////////////////////////////////////////////////////////////

    // let a = [];
    // grpData.map((item) => {
    //   a.push(item.group_name);
    // });
    // console.log(a);
    // a.find(la);

    // function la(jj) {
    //   if (data.group_name === jj) {
    //     console.log('contain');
    //     setGrpFlag(1);
    //     setValidationMsg(true);
    //   }
    // }
    // console.log(grpFlag);
    // if (grpFlag===0) {
    //   setValidationMsg(false);
    // }

    let finalObj = {};

    finalObj.ac_title = data.ac_title;
    finalObj.ac_type = acTypeData;
    finalObj.group_name = data.group_name;
    finalObj.created_date = cDate;
    finalObj.time = cTime;
    finalObj.company_name = sessionStorage.getItem('CompanyName');
    finalObj.cust_id = sessionStorage.getItem('CustId');

    console.log(finalObj);
    console.log(JSON.stringify(finalObj));

    axios
      //.get(`http://localhost:8080/grp_name_search?grpName=${data.group_name}`)
      .get(
        url +
          `grp_name_search?grpName=${
            data.group_name
          }&CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${custId}`
      )
      .then(({ data }) => {
        if (data.length >= 1) {
          setValidationMsg(true);
        } else {
          setValidationMsg(false);
          // if (validationMsg === false) {
          axios
            //.post('http://localhost:8080/add_group', finalObj)
            .post(url + 'add_group', finalObj)
            .then(() => {
              successToast('Group Created Successfully');
              reset();
            })
            .catch((err) => {
              console.log(err);
            });
          // }
        }

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  function acTypeSearch(acId) {
    setAcTypeData('');
    axios
      .get(url + `acTitle_search?acId=${acId}`)
      .then(({ data }) => {
        // let optionSchoolArray = [];
        // data.map((item) => {
        //   optionSchoolArray.push({
        //     value: item.schoolId,
        //     label: item.schoolName,
        //   });
        // setAcTitle(data);
        setAcTypeData(data[0].ac_type);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let custId, companyName;

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      companyName = sessionStorage.getItem('CompanyName');
      custId = sessionStorage.getItem('CustId');
      setAcTypeData('');
      axios
        //.get('http://localhost:8080/ac_title')
        .get(url + 'ac_title')
        .then(({ data }) => {
          // let optionSchoolArray = [];
          // data.map((item) => {
          //   optionSchoolArray.push({
          //     value: item.schoolId,
          //     label: item.schoolName,
          //   });
          setAcTitle(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        //.get('http://localhost:8080/view_group')
        .get(url + `view_group?CompanyName=${companyName}&CustId=${custId}`)
        .then(({ data }) => {
          // let optionSchoolArray = [];
          // data.map((item) => {
          //   optionSchoolArray.push({
          //     value: item.schoolId,
          //     label: item.schoolName,
          //   });
          // setAcTitle(data);
          setGrpData(data);
          console.log(data);
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

  let x;

  return (
    <div>
      <Headers />
      <div className="container-fluid" id="content">
        <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
          <form>
            <div className="container-fluid">
              <div className="page-header">
                <div className="pull-left">
                  <h1>Create Group</h1>
                </div>
                <div className="pull-right"></div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="box">
                    <div className="box-title"></div>
                  </div>
                  <div className="box-content">
                    <div className="col-sm-5">
                      <font color="#FF0000">
                        <p id="wrn" />
                      </font>
                      <div className="box">
                        <div className="box-title">
                          <h3>
                            <i className="fa fa-bars" />
                          </h3>
                        </div>
                        <div className="box-content nopadding">
                          <form
                            method="post"
                            name="add_head"
                            onsubmit="return myFunction()"
                          >
                            <font color="#FF0000"></font>
                            <table className="table table-hover table-nomargin">
                              <tbody>
                                <tr align="center"></tr>
                                <tr>
                                  <th>Group Name</th>
                                  <td>
                                    <input
                                      type="text"
                                      name="group_name"
                                      id="group_name"
                                      className="form-control"
                                      // onBlur={(e) => {
                                      //   //  setCheckGrpName(e.target.value);
                                      //   x = e.target.value;
                                      //   checkGroup(x);
                                      // }}
                                      //  ref={register({ required: true })}
                                      {...register('group_name', {
                                        required: true,
                                      })}
                                    />
                                    <div
                                      id="warning_group"
                                      style={{ color: 'red' }}
                                    >
                                      {errors.group_name && (
                                        <p>Group Name is required.</p>
                                      )}
                                      {validationMsg && (
                                        <p>Group Name is repeated.</p>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <th>A/c Category</th>
                                  <td>
                                    <select
                                      name="ac_title"
                                      id="ac_title"
                                      className="form-control"
                                      // ref={register({ required: true })}
                                      {...register('ac_title', {
                                        required: true,
                                      })}
                                      onChange={(e) => {
                                        // setCountPerPage(e.target.value);
                                        // setPageNumber(0);

                                        acTypeSearch(e.target.value);
                                        //  changePage({selected:'0'})
                                      }}
                                    >
                                      <option value="">---Select---</option>
                                      {acTitle.map((item) => {
                                        return (
                                          item.ac_title !== 'Loans' && (
                                            <option
                                              key={item.ac_id}
                                              value={item.ac_id}
                                            >
                                              {item.ac_title}
                                            </option>
                                          )
                                        );
                                      })}
                                    </select>
                                    <div style={{ color: 'red' }}>
                                      {errors.ac_title && (
                                        <p>A/c Category is required.</p>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                                <tr id="tochange">
                                  <th>Under</th>
                                  <td>
                                    <select
                                      name="under"
                                      id="select"
                                      className="form-control"
                                      // ref={register({ required: true })}
                                      {...register('under')}
                                      value={acTypeData}
                                    >
                                      <option value="">---Selects---</option>
                                      <option value="1">Asset</option>
                                      <option value="2">Liability</option>
                                      <option value="3">Income</option>
                                      <option value="4">Expense</option>
                                    </select>
                                    {/* <div style={{ color: 'red' }}>
                                      {errors.under && (
                                        <p>Under is required.</p>
                                      )}
                                    </div> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th />
                                  <td align="left">
                                    <button
                                      type="submit"
                                      name="submit"
                                      className="btn btn-primary"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        submitFinal();
                                      }}
                                    >
                                      Save
                                    </button>
                                    &nbsp;
                                    <button type="reset" className="btn">
                                      Cancel
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <ToastContainer />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add_group;
