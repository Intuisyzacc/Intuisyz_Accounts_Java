import React, { useState, useEffect, useRef } from 'react';
import {
  useHistory,
  useLocation,
  Redirect,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { successToast } from '../common/global';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../Base Url/baseUrl';
import Headers from '../Header/Headers';

const Edit_group = () => {
  const [groupData, setGroupData] = useState([]);
  const [postDataLoaded, setPostDataLoaded] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [acTitle, setAcTitle] = useState([]);
  const [validationMsg, setValidationMsg] = useState();
  const [grpIdData, setGrpIdData] = useState();
  const [grpNameData, setGrpNameData] = useState();
  const [acTypeData, setAcTypeData] = useState();
  const [acTypeDataFlag, setAcTypeDataFlag] = useState(false);

  let location = useLocation();
  let history = useHistory();

  let url = baseUrl.url;

  // console.log(grpName);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });
  const submitFinal = handleSubmit((data) => {
    grpId = grpIdData;
    grpName = grpNameData;
    ///////////////////////////////////////////////////////////////////////

    let finalObj = {};
    finalObj.group_id = grpId;
    finalObj.ac_title = data.ac_title;

    if (acTypeDataFlag) {
      finalObj.ac_type = acTypeData;
    } else {
      finalObj.ac_type = data.under;
    }

    finalObj.group_name = data.group_name;
    finalObj.created_date = groupData[0].created_date;
    finalObj.time = groupData[0].time;
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
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        if (data.length >= 1) {
          if (finalObj.group_name === grpName) {
            setValidationMsg(false);
            // if (validationMsg === false) {
            axios
              //.put(`http://localhost:8080/grp_update/${grpId}`, finalObj)
              .put(url + `grp_update/${grpId}`, finalObj)
              .then(() => {
                successToast('Group Updated Successfully');
                reset();
                setTimeout(function () {
                  history.push({
                    pathname: '/view_group',
                  });
                }, 1000);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setValidationMsg(true);
          }
        } else {
          setValidationMsg(false);
          // if (validationMsg === false) {
          axios
            //.put(`http://localhost:8080/grp_update/${grpId}`, finalObj)
            .put(url + `grp_update/${grpId}`, finalObj)
            .then(() => {
              successToast('Group Updated Successfully');
              reset();
              setTimeout(function () {
                history.push({
                  pathname: '/view_group',
                });
              }, 1000);
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
  // let grpId = localStorage.getItem('updateId');
  // console.log(grpId);

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
        setAcTypeDataFlag(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let grpId, grpName;
  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        history.push({
          pathname: '/view_group',
        });
      } else {
        console.log('location.post.group_id', location.post.group_id);
        grpId = location.post.group_id;
        grpName = location.post.group_name;

        setGrpIdData(grpId);
        setGrpNameData(grpName);

        axios
          //.get(`http://localhost:8080/grp_by_id?grpId=${grpId}`)
          .get(url + `grp_by_id?grpId=${grpId}`)
          .then(({ data }) => {
            console.log(data);
            setGroupData(data);
            console.log(groupData.group_name);
            setPostDataLoaded(true);
          })
          .catch((err) => {
            console.log(err);
          });

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
            setEventsLoaded(true);
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
      {postDataLoaded && eventsLoaded && (
        <div className="container-fluid" id="content">
          <div id="main" style={{ marginLeft: '50px', marginRight: '50px' }}>
            <form>
              <div className="container-fluid">
                <div className="page-header">
                  <div className="pull-left">
                    <h1>Edit Groups</h1>
                  </div>
                  <div className="pull-right"></div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="box-content">
                      <div className="col-sm-8">
                        <div className="box">
                          <div className="box-title">
                            <h3>
                              <i className="fa fa-bars" />
                            </h3>
                          </div>
                          <div className="box-content nopadding">
                            <table className="table table-hover table-nomargin">
                              <tbody>
                                <tr>
                                  <th>Group Name</th>
                                  <td>
                                    <input
                                      type="text"
                                      defaultValue={groupData[0].group_name}
                                      className="form-control"
                                      name="group_name"
                                      {...register('group_name', {
                                        required: true,
                                      })}
                                    />
                                    <div style={{ color: 'red' }}>
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
                                  <th>A/c Title</th>
                                  <td>
                                    <select
                                      name="ac_title"
                                      id="ac_title1"
                                      defaultValue={groupData[0].ac_title}
                                      className="form-control"
                                      onchange="return vehicle1(this.value);"
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
                                      {acTitle
                                        ? acTitle.map((item) => {
                                            return (
                                              <option
                                                key={item.ac_id}
                                                value={item.ac_id}
                                              >
                                                {item.ac_title}
                                              </option>
                                            );
                                          })
                                        : null}
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
                                      defaultValue={groupData[0].ac_type}
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
                                      Update
                                    </button>
                                    &nbsp;
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={(e) => {
                                        history.push({
                                          pathname: '/view_group',
                                        });
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <ToastContainer />
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
      )}
    </div>
  );
};

export default Edit_group;
