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
import { successToast, errorToast } from '../common/global';
import uuid from 'react-uuid';
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../Base Url/baseUrl';
import '../Invoice/style_invoice.css';
import invoiceHeaderImg from '../Image/logo.jpg';
import invoiceFooterImg from '../Image/invoice_footer.jpg';
import { parse } from 'uuid';
//import dsad from 'C://Users/SHERIN/git/JavaAccounts/Intuisyz_Accounts_Java/src/main/resources/image/Screenshot%20(395)%20(1).png';
import PageLoader from '../Page Loader/pageloader';
import Headers from '../Header/Headers';

const Edit_template = () => {
  let location = useLocation();
  let history = useHistory();
  let url = baseUrl.url;

  const [invIdData, setInvIdData] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [invoiceSubData, setInvoiceSubData] = useState();
  const [invoiceLoaded, setInvoiceLoaded] = useState(false);
  const [invoiceSubLoaded, setInvoiceSubLoaded] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [downloadUri, setDownloadUri] = React.useState('Nil');
  const [fileUploadFlag, setFileUploadFlag] = useState(false);
  const [fileUploadData, setFileUploadData] = useState('');

  const [signatureImgPath, setSignatureImgPath] = useState('');

  const [templateData, setTemplateData] = useState();
  const [templateDataLoaded, setTemplateDataLoaded] = useState(false);
  const [image, setImage] = useState();
  const [logo, setLogo] = useState();

  const [signUploadFlag, setSignUploadFlag] = useState(false);
  const [logoUploadFlag, setLogoUploadFlag] = useState(false);

  const [signUploadData, setSignUploadData] = useState(false);
  const [logoUploadData, setLogoUploadData] = useState(false);

  const [logoImageLoaded, setLogoImageLoaded] = useState(false);
  const [signImageLoaded, setSignImageLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const submitFinal = handleSubmit((data) => {
    if (signUploadFlag) {
      // e.preventDefault();
      uploadImage(signUploadData);
    }

    if (logoUploadFlag) {
      // e.preventDefault();
      uploadImage(logoUploadData);
    }

    let finalObj6 = {};
    finalObj6.template_id = 1;
    finalObj6.template_payTo = data.template_payTo;
    finalObj6.template_Name = data.template_Name;
    finalObj6.template_companyAddress = data.template_companyAddress;
    finalObj6.template_companyName = data.template_companyName;
    finalObj6.template_companyContact = data.template_companyContact;

    axios
      .get(url + `templateData`)
      .then(({ data }) => {
        finalObj6.template_logo = data[0].template_logo;
        finalObj6.template_sig = data[0].template_sig;

        axios
          .put(url + `template_update/${finalObj6.template_id}`, finalObj6)
          .then(() => {
            console.log('Template   Updated Successfully');
            successToast('Template Updated Successfully');

            // reset();
            setTimeout(function () {
              setEditMode(false);
              window.location.reload();
            }, 1000);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      axios
        .get(url + `templateData`)
        .then(({ data }) => {
          console.log('template data', data);
          setTemplateData(data);

          setImage(data[0].template_sig);
          setLogo(data[0].template_logo);
          setTemplateDataLoaded(true);

          let logoName = data[0].template_logo;
          let signName = data[0].template_sig;

          axios
            .get(url + `invoiceImgFetch?fileName=${data[0].template_logo}`)
            .then(({ data }) => {
              console.log('img fetch data', data);
              setLogoImageLoaded(true);
              // import('../Image/' + data[0].template_sig).then(setImage);

              // var reader = new FileReader();
              // // it's onload event and you forgot (parameters)
              // reader.onload = function (e) {
              //   var image = document.getElementById('testImg');
              //   // the result image data
              //   image.src = e.target.result;
              //   // document.body.appendChild(image);
              // };
              // // you have to declare the file loading
              // reader.readAsDataURL(data);

              // window.location.href = url + `invoiceImgFetch?fileName=${l}`;

              var image = document.getElementById('logoImg');
              // the result image data
              image.src = url + `invoiceImgFetch?fileName=${logoName}`;
            })
            .catch((err) => {
              console.log(err);
            });

          axios
            .get(url + `invoiceImgFetch?fileName=${data[0].template_sig}`)
            .then(({ data }) => {
              console.log('img fetch data', data);
              setSignImageLoaded(true);
              // window.location.href = url + `invoiceImgFetch?fileName=${l}`;

              var image = document.getElementById('signImg');
              // the result image data
              image.src = url + `invoiceImgFetch?fileName=${signName}`;
            })
            .catch((err) => {
              console.log(err);
            });

          // import('../Image/' + data[0].template_sig).then(setImage);
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

  function prints(el) {
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById('id2').innerHTML;
    document.body.innerHTML = printcontent;
    window.print();

    document.body.innerHTML = restorepage;
    // history.push({
    //   pathname: '/dashboard_invoice',
    // });
    window.location.reload();
  }

  function uploadDataFun(file) {
    var file1 = document.getElementById('upload123').files[0];
    var reader = new FileReader();
    // it's onload event and you forgot (parameters)
    reader.onload = function (e) {
      var image = document.getElementById('signimg');
      // the result image data
      image.src = e.target.result;
      // document.body.appendChild(image);
    };
    // you have to declare the file loading
    reader.readAsDataURL(file1);

    var fullPath = document.getElementById('upload123').value;
    if (fullPath) {
      var startIndex =
        fullPath.indexOf('\\') >= 0
          ? fullPath.lastIndexOf('\\')
          : fullPath.lastIndexOf('/');
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }

      setDownloadUri(filename);
      setFileUploadFlag(true);

      let finalObj6 = {};
      finalObj6.template_sig = filename;

      axios
        .get(url + `templateData`)
        .then(({ data }) => {
          console.log('template data', data);
          // setTemplateData(data);

          // setImage(data[0].template_sig);
          // setLogo(data[0].template_logo);
          // setTemplateDataLoaded(true);

          // import('../Image/' + data[0].template_sig).then(setImage);

          finalObj6.template_id = data[0].template_id;
          finalObj6.template_logo = data[0].template_logo;
          finalObj6.template_payTo = data[0].template_payTo;
          finalObj6.template_Name = data[0].template_Name;
          finalObj6.template_companyAddress = data[0].template_companyAddress;
          finalObj6.template_companyName = data[0].template_companyName;
          finalObj6.template_companyContact = data[0].template_companyContact;

          axios
            .put(url + `template_update/${finalObj6.template_id}`, finalObj6)
            .then(() => {
              console.log('signature  Updated Successfully');
              // reset();
              // setTimeout(function () {
              //   history.push({
              //     pathname: '/view_journal',
              //   });
              // }, 1000);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function uploadLogoDataFun(file) {
    var file1 = document.getElementById('upload1234').files[0];
    var reader = new FileReader();
    // it's onload event and you forgot (parameters)
    reader.onload = function (e) {
      var image = document.getElementById('logoimg');

      // the result image data
      image.src = e.target.result;
      // document.body.appendChild(image);
      console.log(`image height`, image.clientHeight);
      console.log(`image width`, image.clientWidth);

      if (image.clientHeight === 172 && image.clientWidth === 173) {
        console.log(`image diamensions perfect`);
      } else {
        console.log(`check image diamensions `);
      }
    };
    // you have to declare the file loading
    reader.readAsDataURL(file1);

    if (!/^image\/(png|jpe?g|gif)$/.test(file1.type)) {
      console.log(`File type not support`);
    }

    console.log(`file size`, Math.round(file1.size / 1024));

    var fullPath = document.getElementById('upload1234').value;
    if (fullPath) {
      var startIndex =
        fullPath.indexOf('\\') >= 0
          ? fullPath.lastIndexOf('\\')
          : fullPath.lastIndexOf('/');
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }

      setDownloadUri(filename);
      setFileUploadFlag(true);
      setLogo(filename);

      let finalObj6 = {};
      finalObj6.template_logo = filename;

      axios
        .get(url + `templateData`)
        .then(({ data }) => {
          console.log('template data', data);
          // setTemplateData(data);

          // setImage(data[0].template_sig);
          // setLogo(data[0].template_logo);
          // setTemplateDataLoaded(true);

          // import('../Image/' + data[0].template_sig).then(setImage);

          finalObj6.template_id = data[0].template_id;
          finalObj6.template_payTo = data[0].template_payTo;
          finalObj6.template_sig = data[0].template_sig;
          finalObj6.template_Name = data[0].template_Name;
          finalObj6.template_companyAddress = data[0].template_companyAddress;
          finalObj6.template_companyName = data[0].template_companyName;
          finalObj6.template_companyContact = data[0].template_companyContact;

          axios
            .put(url + `template_update/${finalObj6.template_id}`, finalObj6)
            .then(() => {
              console.log('signature  Updated Successfully');
              // reset();
              // setTimeout(function () {
              //   history.push({
              //     pathname: '/view_journal',
              //   });
              // }, 1000);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(`finalObj6 value`, finalObj6);
    }
  }

  // const submitFinal = handleSubmit((data) =>

  const uploadImage = async (file) => {
    try {
      // setImageUploaded(false);
      console.log('uploadedimg', file);
      let formdata = new FormData();
      formdata.append('file', file);
      console.log(formdata);
      const response = await axios.put(url + 'uploadTemplateFile', formdata);
      // .post('http://intz.live:8080/upload_image', formdata)

      // successToast('file uploaded Successfully');

      // showConsole('uploaded img url', data);
      // setImageMethod('select');
      // refreshUploadedImageArray();

      console.log(`response`, response);

      setImage(downloadUri);

      console.log(
        'response.data.fileDownloadUri',
        response.data.fileDownloadUri
      );

      let newUrl = response.data.fileDownloadUri.split('image');

      console.log('newUrl', newUrl[1]);

      // setTimeout(function () {
      //   const response1 = axios.get(url + `fileDownload?fileName=${newUrl}`);
      //   console.log('response1', response1);
      //   // setDownloadUri(
      //   //   'http://localhost:8080/fileDownload?fileName=KTU-EX-V-3-Registration.pdf'
      //   // );

      //   // window.location.href =
      //   //   'http://localhost:8080/fileDownload?fileName=KTU-EX-V-3-Registration.pdf';

      //   // history.push({
      //   //   pathname:
      //   //     'http://localhost:8080/fileDownload?fileName=KTU-EX-V-3-Registration.pdf',
      //   // });
      // }, 3000);

      // .post('http://intz.live:8080/upload_image', formdata)

      ///////////////
    } catch (err) {
      errorToast('Something went wrong , Try a file with maximum size 200MB');
    }
  };

  return (
    <div>
      <Headers />
      {templateDataLoaded && signImageLoaded ? (
        <div>
          <div>
            {/* {logoImageLoaded && (
              <img
                // src={'/assets/images/' + logo}
                alt="Loading..."
                style={{ width: '80%' }}
                id="testImg"
              />
            )} */}

            {logoImageLoaded === false ? (
              <div
                style={{
                  width: '250px',
                  height: '250px',
                  paddingLeft: 150,
                  paddingTop: 50,
                }}
              ></div>
            ) : editMode === false ? (
              <div className="imgStyle">
                <img
                  //src={'/assets/images/' + logo}
                  alt="Loading..."
                  style={{ width: '80%' }}
                  id="logoImg"
                />
              </div>
            ) : (
              <div
                // style={{
                //   display: 'flex',
                //   flexDirection: 'row',
                //   alignItems: 'center',
                //   justifyContent: 'center',
                // }}
                style={{
                  marginTop: 80,
                  paddingLeft: '200px',
                  paddingRight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <input
                  id="upload1234"
                  name="uploads"
                  type="file"
                  {...register('uploads', {
                    // required: true,
                  })}
                  onChange={(e) => {
                    //e.preventDefault();
                    setFileUploadData(e.target.files[0]);
                    setLogoUploadFlag(true);
                    setLogoUploadData(e.target.files[0]);
                    uploadLogoDataFun();
                    // uploadImage(e.target.files[0]);
                  }}
                />

                <img
                  //src={'/assets/images/' + image}
                  id="logoimg"
                  alt="Select One"
                  style={{
                    width: '20%',
                  }}
                />

                {/* <button
                              type="submit"
                              name="upload"
                              className="btn btn-primary"
                              onClick={(e) => {
                                if (fileUploadFlag) {
                                  // e.preventDefault();
                                  uploadImage(fileUploadData);
                                }
                              }}
                            >
                              Upload{' '}
                            </button> */}
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </div>
            )}

            <div style={{ marginTop: -110 }}>
              <div>
                <label style={{ fontSize: 18, fontWeight: 'bold' }}>
                  <b>INVOICE</b>
                </label>
              </div>

              <div style={{ textAlign: 'left' }}>
                <br />
                <label
                  style={{
                    paddingLeft: 200,
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  Date : 04-01-2022
                </label>
              </div>
              <div style={{ textAlign: 'right' }}>
                <label
                  style={{
                    paddingRight: 200,
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  Invoice No: xxx123
                </label>
                <br />
                <label
                  style={{
                    paddingRight: 200,
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  GSTIN: xxx444
                </label>
                <br />
                <label
                  style={{
                    paddingRight: 200,
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  SAC Code: xxx556
                </label>
              </div>

              <div style={{ textAlign: 'left' }}>
                <br />
                <label
                  style={{
                    paddingLeft: 200,
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  Bill To
                </label>
                <br />

                <p
                  style={{
                    paddingLeft: 200,
                    fontSize: 15,
                  }}
                >
                  Demo Bill
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <br />
                <label
                  style={{
                    paddingLeft: 200,
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  Pay To
                </label>
                <br />

                {editMode === false ? (
                  <p
                    style={{
                      paddingLeft: 200,
                      fontSize: 15,
                    }}
                  >
                    {' '}
                    <br />
                    {templateData[0].template_payTo.split('\n')[0]} <br />
                    {templateData[0].template_payTo.split('\n')[1]}
                    <br />
                    {templateData[0].template_payTo.split('\n')[2]}
                    <br />
                    {templateData[0].template_payTo.split('\n')[3]}
                    <br />
                    {templateData[0].template_payTo.split('\n')[4]}
                    <br />
                    {templateData[0].template_payTo.split('\n')[5]}
                    <br />
                    {templateData[0].template_payTo.split('\n')[6]}
                    <br />
                    {templateData[0].template_payTo.split('\n')[7]}
                    {/* INTUISYZ TECHNOLOGIES
                  <br />
                  PRIVATE LIMITED <br />
                  A/c No: 074205500060 <br />
                  ICICI BANK, ANGAMALY, <br />
                  IFSC: ICIC0000742 <br />
                  Swift Code: ICICINBBNRI <br />
                  PANNO: AADCI6383A <br /> */}
                  </p>
                ) : (
                  <p
                    style={{
                      paddingLeft: 200,
                      fontSize: 15,
                    }}
                  >
                    <textarea
                      className="form-control"
                      id="template_payTo"
                      {...register('template_payTo')}
                      rows="8"
                      style={{ width: '25%', border: '1px solid black' }}
                      defaultValue={templateData[0].template_payTo}
                    />
                  </p>
                )}
              </div>

              <br />
              <div style={{ paddingLeft: 200, paddingRight: 200 }}>
                <table className="preview-table">
                  <tr
                    style={{
                      background: '#969390',
                      color: 'white',
                      padding: '8px',
                      border: '1px solid white',
                    }}
                  >
                    <th className="preview-th-td"></th>
                    <th className="preview-th-td">Sl No</th>
                    <th className="preview-th-td">Description</th>
                    <th className="preview-th-td">Qty</th>
                    <th className="preview-th-td"> Amount</th>
                    {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
                  </tr>

                  <tr className="preview-tr">
                    <td
                      className="preview-th-td"
                      style={{ background: '#969390', borderColor: 'white' }}
                    ></td>
                    <td className="preview-th-td">1</td>
                    <td className="preview-th-td">Incoie Des</td>
                    <td className="preview-th-td">4</td>
                    <td className="preview-th-td">20000</td>
                    {/* <td className="preview-th-td">{'        '}</td> */}
                  </tr>

                  <tr className="preview-tr">
                    <td
                      className="preview-th-td"
                      style={{ background: '#969390', borderColor: 'white' }}
                    ></td>
                    <td className="preview-th-td"></td>
                    <td className="preview-th-td">
                      {' '}
                      <b>GST</b>
                      <br />
                      <>
                        <b>CGST ( 9 %) </b>
                        <br />
                        <b>SGST ( 9 %)</b>
                      </>
                    </td>
                    <td className="preview-th-td"></td>
                    <td className="preview-th-td">
                      {' '}
                      <>
                        <br />
                        <b></b>
                      </>
                      <>
                        <br />
                        <b>1500</b>
                        <br />
                        <b>1500</b>
                      </>
                    </td>
                    {/* <td className="preview-th-td">{'        '}</td> */}
                  </tr>

                  <tr className="preview-tr">
                    <td
                      className="preview-th-td"
                      style={{ background: '#969390', borderColor: 'white' }}
                    ></td>
                    <td className="preview-th-td"></td>
                    <td className="preview-th-td">
                      <h4>
                        {' '}
                        <b>Total</b>
                      </h4>{' '}
                    </td>
                    <td className="preview-th-td"></td>
                    <td className="preview-th-td">
                      <h4>
                        {' '}
                        <b>23000</b>
                      </h4>{' '}
                    </td>
                    {/* <td className="preview-th-td">{'        '}</td> */}
                  </tr>
                </table>
                <br />
                <br />
                <br />
                <br />
                <br />

                <div style={{ paddingRight: 150 }}>
                  <table className="preview-footer-table">
                    <tr className="preview-footer-tr">
                      {editMode === false ? (
                        <th
                          className="preview-footer-th-td"
                          style={{ width: '25%' }}
                        >
                          Name <br />
                          {/* <br />
                        Sijin Stephen <br />
                        Managing <br />
                        Director */}
                          <br />
                          {templateData[0].template_Name.split('\n')[0]}
                          <br />
                          {templateData[0].template_Name.split('\n')[1]}
                          <br />
                          {templateData[0].template_Name.split('\n')[2]}
                        </th>
                      ) : (
                        <th
                          className="preview-footer-th-td"
                          style={{ width: '25%' }}
                        >
                          Name <br />
                          <textarea
                            className="form-control"
                            id="template_Name"
                            {...register('template_Name')}
                            rows="3"
                            style={{ border: '1px solid black' }}
                            defaultValue={templateData[0].template_Name}
                          />
                        </th>
                      )}
                      {editMode === false ? (
                        <th
                          className="preview-footer-th-td"
                          style={{ width: '25%' }}
                        >
                          Signature <br />
                          <br />
                          <img
                            // src={'/assets/images/' + image}
                            //  src="C://Users/SHERIN/git/JavaAccounts/Intuisyz_Accounts_Java/src/main/resources/image/Screenshot%20(395)%20(1).png"
                            alt="Loading..."
                            style={{ width: '70%' }}
                            id="signImg"
                          />
                          <br />
                        </th>
                      ) : (
                        <th
                          className="preview-footer-th-td"
                          style={{ width: '25%' }}
                        >
                          Signature <br />
                          <br />
                          {/* <PicUpload /> */}
                          <form>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <input
                                id="upload123"
                                name="upload"
                                type="file"
                                {...register('upload', {
                                  // required: true,
                                })}
                                onChange={(e) => {
                                  setFileUploadData(e.target.files[0]);
                                  setSignUploadData(e.target.files[0]);
                                  setSignUploadFlag(true);
                                  uploadDataFun();
                                  // uploadImage(e.target.files[0]);
                                }}
                              />
                              <img
                                //src={'/assets/images/' + image}
                                id="signimg"
                                alt="Select One"
                                style={{
                                  width: '70%',
                                }}
                              />
                              {/* <button
                              type="submit"
                              name="upload"
                              className="btn btn-primary"
                              onClick={(e) => {
                                if (fileUploadFlag) {
                                  // e.preventDefault();
                                  uploadImage(fileUploadData);
                                }
                              }}
                            >
                              Upload{' '}
                            </button> */}
                            </div>
                            {/* <img
                            // src="C:\Users\SHERIN\git\JavaAccounts\Intuisyz_Accounts_Java\src\main\resources\image\Screenshot%20(395)%20(1).png"
                            src={'/assets/images/' + image}
                            alt="Loading..."
                            style={{ width: '70%' }}
                          /> */}
                          </form>
                          <br />
                        </th>
                      )}

                      <th
                        className="preview-footer-th-td"
                        style={{ width: '25%' }}
                      >
                        Date
                        <br />
                        <br />
                        <br />
                        04-01-2022
                        <br />
                        <br />
                      </th>
                    </tr>
                  </table>
                </div>
                <br></br>
                <br></br>
                <br></br>
              </div>
              <div>
                {/* <img src={invoiceFooterImg} width="85%" alt="Loading..." /> */}

                {editMode === false ? (
                  <p style={{ fontSize: 16 }}>
                    {/* <b> INTUISYZ TECHNOLOGIES PRIVATE LIMITED</b> */}

                    {templateData[0].template_companyName.split('\n')[0]}
                  </p>
                ) : (
                  <div align="center">
                    <textarea
                      className="form-control"
                      id="template_companyName"
                      {...register('template_companyName')}
                      rows="1"
                      style={{ border: '1px solid black' }}
                      style={{ width: '35%' }}
                      placeholder="Company Name"
                      defaultValue={templateData[0].template_companyName}
                    />
                  </div>
                )}
                {editMode === false ? (
                  <div>
                    {/* <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                    Third Floor, Kolenchery Tower, Angamaly -683572,
                    Kerala,India
                  </p>
                  <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                    Centre A, 7th Floor Alappat Business Tower, MG Road-
                    Ernakulam,Kerala,India
                  </p> */}
                    <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                      {' '}
                      {templateData[0].template_companyAddress.split('\n')[0]}
                    </p>
                    <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                      {templateData[0].template_companyAddress.split('\n')[1]}
                    </p>
                    <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                      {templateData[0].template_companyAddress.split('\n')[2]}
                    </p>
                  </div>
                ) : (
                  <div align="center">
                    <br></br>
                    <textarea
                      className="form-control"
                      id="template_companyAddress"
                      {...register('template_companyAddress')}
                      rows="3"
                      style={{ border: '1px solid black' }}
                      style={{ width: '40%' }}
                      placeholder="Address Details"
                      defaultValue={templateData[0].template_companyAddress}
                    />
                  </div>
                )}
                {editMode === false ? (
                  <p
                    style={{
                      color: '#e67e17',
                      fontSize: 14,
                      fontFamily: '-moz-initial',
                    }}
                  >
                    {/* info@intuisyz.com|India-+918592902277 */}
                    {templateData[0].template_companyContact}
                  </p>
                ) : (
                  <div align="center">
                    <br></br>
                    <textarea
                      className="form-control"
                      id="template_companyContact"
                      {...register('template_companyContact')}
                      rows="1"
                      style={{ border: '1px solid black' }}
                      style={{ width: '35%' }}
                      placeholder="Contact Details"
                      defaultValue={templateData[0].template_companyContact}
                    />
                  </div>
                )}
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>

            <div id="id2" hidden>
              <div
                style={{ paddingLeft: 10, paddingRight: 460, marginTop: -50 }}
              >
                <img
                  src={invoiceHeaderImg}
                  alt="Loading..."
                  style={{ width: '80%' }}
                />
              </div>
              <div style={{ marginTop: -70 }}>
                <div style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: 18, fontWeight: 'bold' }}>
                    <b>INVOICE</b>
                  </label>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <br />
                  <label
                    style={{
                      paddingLeft: 60,
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}
                  >
                    Date : 04-01-2022
                  </label>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <label
                    style={{
                      paddingRight: 60,
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}
                  >
                    Invoice No: xxx123
                  </label>
                  <br />
                  <label
                    style={{
                      paddingRight: 60,
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}
                  >
                    GSTIN: xxx444
                  </label>
                  <br />
                  <label
                    style={{
                      paddingRight: 60,
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}
                  >
                    SAC Code: xxx556
                  </label>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <br />
                  <label
                    style={{
                      paddingLeft: 60,
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}
                  >
                    Bill To
                  </label>
                  <br />

                  <p
                    style={{
                      paddingLeft: 60,
                      fontSize: 15,
                    }}
                  >
                    Demo Bill
                  </p>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <br />
                  <label
                    style={{
                      paddingLeft: 60,
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}
                  >
                    Pay To
                  </label>
                  <br />

                  <p
                    style={{
                      paddingLeft: 60,
                      fontSize: 15,
                    }}
                  >
                    INTUISYZ TECHNOLOGIES
                    <br />
                    PRIVATE LIMITED <br />
                    A/c No: 074205500060 <br />
                    ICICI BANK, ANGAMALY, <br />
                    IFSC: ICIC0000742 <br />
                    Swift Code: ICICINBBNRI <br />
                    PANNO: AADCI6383A <br />
                  </p>
                </div>
                <br />
                <div style={{ paddingLeft: 60, paddingRight: 60 }}>
                  <table className="preview-table">
                    <tr
                      style={{
                        background: '#969390',
                        color: 'white',
                        padding: '8px',
                        border: '1px solid white',
                      }}
                    >
                      <th className="preview-th-td"></th>
                      <th className="preview-th-td">Sl No</th>
                      <th className="preview-th-td">Description</th>
                      <th className="preview-th-td">Qty</th>
                      <th className="preview-th-td"> Amount</th>
                      {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
                    </tr>

                    <tr className="preview-tr">
                      <td
                        className="preview-th-td"
                        style={{ background: '#969390', borderColor: 'white' }}
                      ></td>
                      <td className="preview-th-td">1</td>
                      <td className="preview-th-td">Incoie Des</td>
                      <td className="preview-th-td">4</td>
                      <td className="preview-th-td">20000</td>
                      {/* <td className="preview-th-td">{'        '}</td> */}
                    </tr>

                    <tr className="preview-tr">
                      <td
                        className="preview-th-td"
                        style={{ background: '#969390', borderColor: 'white' }}
                      ></td>
                      <td className="preview-th-td">
                        {' '}
                        <b>GST</b>
                        <br />
                        <>
                          <b>CGST ( 9 %) </b>
                          <br />
                          <b>SGST ( 9 %)</b>
                        </>
                      </td>
                      <td className="preview-th-td"></td>
                      <td className="preview-th-td">
                        {' '}
                        <>
                          <br />
                          <b>3000</b>
                        </>
                        <>
                          <br />
                          <b>1500</b>
                          <br />
                          <b>1500</b>
                        </>
                      </td>
                      {/* <td className="preview-th-td">{'        '}</td> */}
                    </tr>

                    <tr className="preview-tr">
                      <td
                        className="preview-th-td"
                        style={{ background: '#969390', borderColor: 'white' }}
                      ></td>
                      <td className="preview-th-td">
                        <h4>
                          {' '}
                          <b>Total</b>
                        </h4>{' '}
                      </td>
                      <td className="preview-th-td"></td>
                      <td className="preview-th-td">
                        <h4>
                          {' '}
                          <b>23000</b>
                        </h4>{' '}
                      </td>
                      {/* <td className="preview-th-td">{'        '}</td> */}
                    </tr>
                  </table>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />

                  <div style={{ paddingRight: 110 }}>
                    <table className="preview-footer-table">
                      <tr className="preview-footer-tr">
                        <th className="preview-footer-th-td">
                          Name <br />
                          <br />
                          Sijin Stephen <br />
                          Managing <br />
                          Director
                        </th>
                        <th className="preview-footer-th-td">
                          Signature <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </th>
                        <th className="preview-footer-th-td">
                          Date
                          <br />
                          <br />
                          <br />
                          04-01-2022
                          <br />
                          <br />
                        </th>
                      </tr>
                    </table>
                  </div>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>
                <div style={{ textAlign: 'center' }}>
                  {/* <img src={invoiceFooterImg} width="85%" alt="Loading..." /> */}
                  <p style={{ fontSize: 16 }}>
                    <b> INTUISYZ TECHNOLOGIES PRIVATE LIMITED</b>
                  </p>
                  <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                    Third Floor, Kolenchery Tower, Angamaly -683572,
                    Kerala,India
                  </p>
                  <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                    Centre A, 7th Floor Alappat Business Tower, MG Road-
                    Ernakulam,Kerala,India
                  </p>
                  <p
                    style={{
                      color: '#e67e17',
                      fontSize: 14,
                      fontFamily: '-moz-initial',
                    }}
                  >
                    info@intuisyz.com|India-+918592902277
                  </p>
                </div>
              </div>
            </div>

            <footer className="invoice-footer">
              <p>
                <div
                  style={{ alignItems: 'center', padding: 10 }}
                  align="center"
                >
                  {editMode === false ? (
                    <button
                      type="submit"
                      name="submit"
                      onClick={(e) => {
                        setEditMode(true);
                      }}
                      style={{
                        backgroundColor: 'green',
                        width: 100,
                      }}
                    >
                      Edit{' '}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      name="submit"
                      onClick={(e) => {
                        e.preventDefault();

                        // if (signUploadFlag) {
                        //   // e.preventDefault();
                        //   uploadImage(signUploadData);
                        // }

                        // if (logoUploadFlag) {
                        //   // e.preventDefault();
                        //   uploadImage(logoUploadData);
                        // }

                        submitFinal();
                      }}
                      style={{
                        backgroundColor: 'green',
                        width: 100,
                      }}
                    >
                      Save{' '}
                    </button>
                  )}
                  &nbsp;
                  {/* <button
                  type="submit"
                  name="submit"
                  style={{ backgroundColor: 'green', width: 100 }}
                  onClick={(e) => {
                    prints('printrec');
                  }}
                >
                  Print
                </button> */}
                </div>
              </p>
            </footer>
            <ToastContainer />
          </div>
        </div>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default Edit_template;
