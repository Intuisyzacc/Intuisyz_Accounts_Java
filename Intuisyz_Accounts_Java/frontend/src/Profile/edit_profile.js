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

const Edit_profile = () => {
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

  const [profileData, setProfileData] = useState();
  const [profileDataLoaded, setProfileDataLoaded] = useState(false);
  const [profileDataEmpty, setProfileDataEmpty] = useState(false);

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

    let finalObj1 = {};
    finalObj1.organization_id = 1;
    finalObj1.organization_name = data.OrganizationName;
    finalObj1.industry = data.Industry;
    finalObj1.location = 'India';
    finalObj1.street1 = data.Street1;
    finalObj1.street2 = data.Street2;
    finalObj1.city = data.City;
    finalObj1.state = data.State;
    finalObj1.zip = data.Zip;
    finalObj1.phone = data.Phone;
    finalObj1.fax = '';
    finalObj1.website = data.Website;
    finalObj1.ifsc = data.IFSC;
    finalObj1.swift_code = '';
    finalObj1.pan_no = data.PanNo;
    finalObj1.acc_no = data.AccNo;
    finalObj1.bank = data.Bank;
    finalObj1.branch = data.Branch;
    finalObj1.fiscal_year = data.FiscalYear;
    finalObj1.time_zone = '(GMT 5:30) India Standard Time';
    finalObj1.date_format = data.DateFormat;
    finalObj1.company_id = '';
    finalObj1.gst_id = data.GstID;
    finalObj1.signatory_name = data.SignatoryName;
    finalObj1.signatory_designation = data.SignatoryDesignation;
    finalObj1.gmail = data.gmail;

    console.log('finalObj1 value', finalObj1);

    let organization_name = finalObj1.organization_name;
    let finalString = '';

    if (organization_name.split(' ').length > 2) {
      for (let i = 0; i < organization_name.split(' ').length; i++) {
        if (i == 0) {
          finalString = finalString + organization_name.split(' ')[i] + ' ';
        } else {
          if (i % 2 !== 0) {
            finalString = finalString + organization_name.split(' ')[i] + '\n';
          } else {
            finalString = finalString + organization_name.split(' ')[i] + ' ';
          }
        }
      }
      finalObj1.organization_name = finalString;
    }

    let template_payTo =
      finalObj1.organization_name +
      'A/c No:' +
      finalObj1.acc_no +
      '\n' +
      finalObj1.bank +
      ',' +
      finalObj1.branch +
      ',' +
      '\n' +
      'IFSC:' +
      finalObj1.ifsc +
      '\n' +
      'Swift Code:' +
      finalObj1.swift_code +
      '\n' +
      'PANNO:' +
      finalObj1.pan_no +
      '\n';

    console.log(template_payTo);

    let template_Name =
      finalObj1.signatory_name + '\n' + finalObj1.signatory_designation;

    console.log(template_Name);

    let template_companyContact =
      finalObj1.gmail + '|India-+91' + finalObj1.phone;

    console.log(template_companyContact);

    let template_companyAddress = finalObj1.street1 + '\n' + finalObj1.street2;

    console.log(template_companyAddress);

    finalObj1.company_name = sessionStorage.getItem('CompanyName');
    finalObj1.cust_id = sessionStorage.getItem('CustId');

    let finalObj6 = {};
    finalObj6.template_id = 1;
    finalObj6.template_payTo = template_payTo;
    finalObj6.template_Name = template_Name;
    finalObj6.template_companyAddress = template_companyAddress;
    finalObj6.template_companyName = organization_name;
    finalObj6.template_companyContact = template_companyContact;

    if (profileDataEmpty === true) {
      axios
        .post(url + 'add_profile', finalObj1)
        .then((data) => {
          console.log('profile added successfully');
          successToast('profile added Successfully');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .put(url + `profile_update/${finalObj1.organization_id}`, finalObj1)
        .then(() => {
          console.log('Profile Updated Successfully');
          successToast('Profile Updated Successfully');
        })
        .catch((err) => {
          console.log(err);
        });
    }

    axios
      .get(
        url +
          `templateData?CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}`
      )
      .then(({ data }) => {
        finalObj6.template_logo = data[0].template_logo;
        finalObj6.template_sig = data[0].template_sig;

        finalObj6.company_name = sessionStorage.getItem('CompanyName');
        finalObj6.cust_id = sessionStorage.getItem('CustId');

        axios
          .put(url + `template_update/${finalObj6.template_id}`, finalObj6)
          .then(() => {
            console.log('Template   Updated Successfully');

            // reset();
            // setTimeout(function () {
            //   setEditMode(false);
            //   window.location.reload();
            // }, 1000);
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
        .get(
          url +
            `templateData?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
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

              var image3 = document.getElementById('logoImg3');
              // the result image data
              image3.src = url + `invoiceImgFetch?fileName=${logoName}`;
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

              var image4 = document.getElementById('signImg3');
              // the result image data
              image4.src = url + `invoiceImgFetch?fileName=${signName}`;
            })
            .catch((err) => {
              console.log(err);
            });

          // import('../Image/' + data[0].template_sig).then(setImage);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(
          url +
            `profileData?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
        .then(({ data }) => {
          console.log('profile data', data);
          setProfileData(data);

          if (data.length > 0) {
            setProfileDataEmpty(false);
            setProfileDataLoaded(true);
          } else {
            setProfileDataEmpty(true);
            setProfileDataLoaded(true);
          }
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
    setSignImageLoaded(false);

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
        .get(
          url +
            `templateData?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
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

          finalObj6.company_name = sessionStorage.getItem('CompanyName');
          finalObj6.cust_id = sessionStorage.getItem('CustId');

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
    setLogoImageLoaded(false);
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
        .get(
          url +
            `templateData?CompanyName=${sessionStorage.getItem(
              'CompanyName'
            )}&CustId=${sessionStorage.getItem('CustId')}`
        )
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

          finalObj6.company_name = sessionStorage.getItem('CompanyName');
          finalObj6.cust_id = sessionStorage.getItem('CustId');

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
      {/* <Headers /> */}

      {/* {templateDataLoaded && signImageLoaded ? ( */}
      {templateDataLoaded && profileDataLoaded ? (
        <div>
          <div>
            <div class="container" style={{ marginLeft: '-90px' }}>
              <form>
                <br></br>
                <div class="form-group row">
                  <label for="staticEmail" class="col-sm-8 col-form-label">
                    <h1>
                      {' '}
                      <b>Organization Profile</b>{' '}
                    </h1>
                  </label>
                  <div class="col-sm-3">
                    <label
                      for="staticEmail"
                      class="col-sm-2 col-form-label"
                    ></label>
                  </div>
                </div>
                <br></br>
                <br></br>
                <div class="form-group row ">
                  <label for="staticEmail" class="col-sm-4 col-form-label">
                    Your Logo
                  </label>
                  <div class="col-sm-2">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'Column',
                        alignItems: 'left',
                        justifyContent: 'center',
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
                          // e.preventDefault();
                          setFileUploadData(e.target.files[0]);
                          setLogoUploadFlag(true);
                          setLogoUploadData(e.target.files[0]);
                          uploadLogoDataFun();
                        }}
                      />

                      {logoImageLoaded ? (
                        <img
                          //src={'/assets/images/' + logo}
                          alt="Loading..."
                          style={{ width: '40%' }}
                          id="logoImg3"
                        />
                      ) : (
                        <img
                          //src={'/assets/images/' + image}
                          id="logoimg"
                          alt="Select One"
                          style={{
                            width: '40%',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div class="form-group row ">
                  <label for="OrganizationName" class="col-sm-4 col-form-label">
                    Organization Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div class="col-sm-3">
                    <input
                      class="form-control"
                      type="text"
                      // placeholder="Default input"
                      name="OrganizationName"
                      id="OrganizationName"
                      {...register('OrganizationName', {
                        required: true,
                      })}
                      defaultValue={
                        profileDataEmpty === false
                          ? profileData[0].organization_name
                          : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                  <div
                    style={{
                      color: 'red',
                      paddingTop: 5,
                      textAlign: 'left',
                    }}
                  >
                    {errors.OrganizationName && (
                      <p>Please enter Organization Name</p>
                    )}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-4 col-form-label">
                    Industry <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div class="col-sm-3">
                    <select
                      class="form-control"
                      name="Industry"
                      id="Industry"
                      {...register('Industry', {
                        required: true,
                      })}
                      defaultValue={
                        profileDataEmpty === false
                          ? profileData[0].industry
                          : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    >
                      <option value="">---Select---</option>
                      <option value="Agency or Sales House">
                        Agency or Sales House
                      </option>
                      <option value="Agriculture">Agriculture </option>
                      <option value="Art and Design">Art and Design </option>
                      <option value="Automotive">Automotive </option>
                      <option value="Construction">Construction </option>
                      <option value="Consulting">Consulting </option>
                      <option value="Consumer Packaged Goods">
                        Consumer Packaged Goods{' '}
                      </option>
                      <option value="Education">Education </option>
                      <option value="Engineering">Engineering </option>
                      <option value="Entertainment">Entertainment </option>
                      <option value="Financial Services">
                        Financial Services{' '}
                      </option>
                      <option value="Food Services">
                        Food Services (Restaurants/Fast Food){' '}
                      </option>
                      <option value="Gaming">Gaming </option>
                      <option value="Government">Government </option>
                      <option value="Health Care">Health Care </option>
                      <option value="Interior Design">Interior Design </option>
                      <option value="Internal">Internal </option>
                      <option value="Legal">Legal </option>
                      <option value="Manufacturing">Manufacturing </option>
                      <option value="Marketing">Marketing </option>
                      <option value="Mining and Logistics">
                        Mining and Logistics{' '}
                      </option>
                      <option value="Non-Profit">Non-Profit </option>
                      <option value="Publishing and Web Media">
                        Publishing and Web Media{' '}
                      </option>
                      <option value="Real Estate">Real Estate </option>
                      <option value="Retail">
                        Retail (E-Commerce and Offline){' '}
                      </option>
                      <option value="Services">Services </option>
                      <option value="Technology">Technology </option>
                      <option value="Telecommunications">
                        Telecommunications{' '}
                      </option>
                      <option value="Travel/Hospitality">
                        Travel/Hospitality{' '}
                      </option>
                      <option value="Web Designing">Web Designing </option>
                      <option value="Web Development">Web Development </option>
                      <option value="Writers">Writers </option>
                    </select>
                  </div>
                  <div
                    style={{
                      color: 'red',
                      paddingTop: 5,
                      textAlign: 'left',
                    }}
                  >
                    {errors.Industry && <p>Please select Industry </p>}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-4 col-form-label">
                    Business Location
                  </label>
                  <div class="col-sm-3">
                    <select
                      class="form-control"
                      disabled
                      name="Location"
                      id="Location"
                      {...register('Location', {})}
                      style={{ fontSize: '12.5px' }}
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-4 col-form-label">
                    Company Address
                  </label>
                  <div class="col-sm-3">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Street 1"
                      name="Street1"
                      id="Street1"
                      {...register('Street1', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].street1 : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label
                    for="inputPassword"
                    class="col-sm-4 col-form-label"
                  ></label>
                  <div class="col-sm-3">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Street 2"
                      name="Street2"
                      id="Street2"
                      {...register('Street2', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].street2 : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label
                    for="inputPassword"
                    class="col-sm-4 col-form-label"
                  ></label>
                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="City"
                      name="City"
                      id="City"
                      {...register('City', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].city : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                  <div class="col-sm-1">
                    <select
                      class="form-control"
                      name="State"
                      id="State"
                      {...register('State', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].state : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    >
                      <option value="">---Select--- </option>
                      <option value="Kerala">Kerala </option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">
                        Arunachal Pradesh{' '}
                      </option>
                      <option value="Assam">Assam </option>
                      <option value="Bihar">Bihar </option>
                      <option value="Goa">Goa </option>
                      <option value="Gujarat">Gujarat </option>
                      <option value="Haryana">Haryana </option>
                      <option value="Himachal Pradesh">
                        Himachal Pradesh{' '}
                      </option>
                      <option value="Jammu & Kashmir">Jammu & Kashmir </option>
                      <option value="Karnataka">Karnataka </option>
                      <option value="Madhya Pradesh">Madhya Pradesh </option>
                      <option value="Maharashtra">Maharashtra </option>
                      <option value="Manipur">Manipur </option>
                      <option value="Meghalaya">Meghalaya </option>
                      <option value="Mizoram">Mizoram </option>
                      <option value="Nagaland">Nagaland </option>
                      <option value="Orissa">Orissa </option>
                      <option value="Punjab">Punjab </option>
                      <option value="Rajasthan">Rajasthan </option>
                      <option value="Sikkim">Sikkim </option>
                      <option value="Tamil Nadu">Tamil Nadu </option>
                      <option value="Tripura">Tripura </option>
                      <option value="Uttar Pradesh">Uttar Pradesh </option>
                      <option value="West Bengal">West Bengal </option>
                      <option value="Chhattisgarh">Chhattisgarh </option>
                      <option value="Uttarakhand">Uttarakhand </option>
                      <option value="Jharkhand">Jharkhand </option>
                      <option value="Telangana">Telangana </option>
                    </select>
                  </div>
                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Zip/Postal Code"
                      name="Zip"
                      id="Zip"
                      {...register('Zip', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].zip : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label
                    for="inputPassword"
                    class="col-sm-4 col-form-label"
                  ></label>
                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Phone"
                      name="Phone"
                      id="Phone"
                      {...register('Phone', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].phone : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>

                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Gmail"
                      name="gmail"
                      id="gmail"
                      {...register('gmail', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].gmail : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>

                  {/* <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Fax"
                      name="Fax"
                      id="Fax"
                      {...register('Fax', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].fax : ''
                      }
                    />
                  </div> */}
                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Website"
                      name="Website"
                      id="Website"
                      {...register('Website', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].website : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label
                    for="inputPassword"
                    class="col-sm-4 col-form-label"
                  ></label>
                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="IFSC"
                      name="IFSC"
                      id="IFSC"
                      {...register('IFSC', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].ifsc : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                  {/* <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Swift Code"
                      name="SwiftCode"
                      id="SwiftCode"
                      {...register('SwiftCode', {})}
                      defaultValue={
                        profileDataEmpty === false
                          ? profileData[0].swift_code
                          : ''
                      }
                    />
                  </div> */}
                  <div class="col-sm-1"></div>
                </div>

                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-4 col-form-label">
                    Bank Details
                  </label>

                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="A/c No"
                      name="AccNo"
                      id="AccNo"
                      {...register('AccNo', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].acc_no : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Bank Name"
                      name="Bank"
                      id="Bank"
                      {...register('Bank', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].bank : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                  <div class="col-sm-1">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Branch"
                      name="Branch"
                      id="Branch"
                      {...register('Branch', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].branch : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-4 col-form-label">
                    PAN No
                  </label>
                  <div class="col-sm-3">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="PANNO"
                      name="PanNo"
                      id="PanNo"
                      {...register('PanNo', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].pan_no : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-4 col-form-label">
                    Fiscal Year
                  </label>
                  <div class="col-sm-3">
                    <select
                      class="form-control"
                      name="FiscalYear"
                      id="FiscalYear"
                      {...register('FiscalYear', {})}
                      defaultValue={
                        profileDataEmpty === false
                          ? profileData[0].fiscal_year
                          : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    >
                      <option value="">---Select---</option>
                      <option value="January - December">
                        January - December
                      </option>
                      <option value="February - January">
                        February - January
                      </option>
                      <option value="March - February">March - February</option>
                      <option value="April - March">April - March</option>
                      <option value="May - April">May - April</option>
                      <option value="June - May">June - May</option>
                      <option value="July - June">July - June</option>
                      <option value="August - July">August - July</option>
                      <option value="September - August">
                        September - August
                      </option>
                      <option value="October - September">
                        October - September
                      </option>
                      <option value="November - October">
                        November - October
                      </option>
                      <option value="December - November">
                        December - November
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-4 col-form-label">
                    Time Zone
                  </label>
                  <div class="col-sm-3">
                    <select
                      class="form-control"
                      disabled
                      name="TimeZone"
                      id="TimeZone"
                      {...register('TimeZone', {})}
                      defaultValue=""
                      style={{ fontSize: '12.5px' }}
                    >
                      <option value="(GMT 5:30) India Standard Time">
                        {' '}
                        (GMT 5:30) India Standard Time
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-4 col-form-label">
                    Date Format
                  </label>
                  <div class="col-sm-3">
                    <select
                      class="form-control"
                      name="DateFormat"
                      id="DateFormat"
                      {...register('DateFormat', {})}
                      defaultValue={
                        profileDataEmpty === false
                          ? profileData[0].date_format
                          : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    >
                      <option value="">---Select---</option>
                      <option value="MM-dd-yy">MM-dd-yy [ 02-03-22 ]</option>
                      <option value="dd-MM-yy">dd-MM-yy [ 03-02-22 ] </option>
                      <option value="yy-MM-dd">yy-MM-dd [ 22-02-03 ] </option>
                      <option value="MM-dd-yyyy">
                        MM-dd-yyyy [ 02-03-2022 ]{' '}
                      </option>
                      <option value="dd-MM-yyyy">
                        dd-MM-yyyy [ 03-02-2022 ]{' '}
                      </option>
                      <option value="yyyy-MM-dd">
                        yyyy-MM-dd [ 2022-02-03 ]{' '}
                      </option>
                    </select>
                  </div>
                </div>
                {/* <div class="form-group row">
                  <label for="staticEmail" class="col-sm-4 col-form-label">
                    Company ID
                  </label>
                  <div class="col-sm-3">
                    <input
                      class="form-control"
                      type="text"
                      // placeholder="Default input"
                      name="CompanyID"
                      id="CompanyID"
                      {...register('CompanyID', {})}
                      defaultValue={
                        profileDataEmpty === false
                          ? profileData[0].company_id
                          : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div> */}
                <div class="form-group row">
                  <label for="staticEmail" class="col-sm-4 col-form-label">
                    GST ID
                  </label>
                  <div class="col-sm-3">
                    <input
                      class="form-control"
                      type="text"
                      // placeholder="Default input"
                      name="GstID"
                      id="GstID"
                      {...register('GstID', {})}
                      defaultValue={
                        profileDataEmpty === false ? profileData[0].gst_id : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticEmail" class="col-sm-4 col-form-label">
                    Authorized Signatory Name
                  </label>
                  <div class="col-sm-3">
                    <input
                      class="form-control"
                      type="text"
                      // placeholder="Default input"
                      name="SignatoryName"
                      id="SignatoryName"
                      {...register('SignatoryName', {})}
                      defaultValue={
                        profileDataEmpty === false
                          ? profileData[0].signatory_name
                          : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticEmail" class="col-sm-4 col-form-label">
                    Authorized Signatory Designation
                  </label>
                  <div class="col-sm-3">
                    <textarea
                      class="form-control"
                      type="text"
                      // placeholder="Default input"
                      name="SignatoryDesignation"
                      id="SignatoryDesignation"
                      {...register('SignatoryDesignation', {})}
                      defaultValue={
                        profileDataEmpty === false
                          ? profileData[0].signatory_designation
                          : ''
                      }
                      style={{ fontSize: '12.5px' }}
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticEmail" class="col-sm-4 col-form-label">
                    Authorized Signatory Signature
                  </label>
                  <div class="col-sm-3">
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
                          }}
                        />

                        {signImageLoaded ? (
                          <img
                            // src={'/assets/images/' + image}
                            //  src="C://Users/SHERIN/git/JavaAccounts/Intuisyz_Accounts_Java/src/main/resources/image/Screenshot%20(395)%20(1).png"
                            alt="Loading..."
                            style={{ width: '70%' }}
                            id="signImg3"
                          />
                        ) : (
                          <img
                            //src={'/assets/images/' + image}
                            id="signimg"
                            alt="Select One"
                            style={{
                              width: '70%',
                            }}
                          />
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </form>
            </div>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <footer className="profile-footer">
              <p>
                <div style={{ alignItems: 'right', padding: 30 }} align="right">
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
                  &nbsp;
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

export default Edit_profile;
