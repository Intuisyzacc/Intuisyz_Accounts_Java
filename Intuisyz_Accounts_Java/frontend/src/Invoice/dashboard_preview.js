import React, { useState, useEffect, useRef } from 'react';
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
import invoiceHeaderImg from '../Image/invoice_header.jpg';
import invoiceFooterImg from '../Image/invoice_footer.jpg';
import { parse } from 'uuid';
import Modal from 'react-modal';
import Edit_profile from '../Profile/edit_profile';
import Headers from '../Header/Headers';

const Dashboard_preview = () => {
  let location = useLocation();
  let history = useHistory();
  let url = baseUrl.url;

  const [profileData, setProfileData] = useState();
  const [profileDataLoaded, setProfileDataLoaded] = useState(false);
  const [profileDataEmpty, setProfileDataEmpty] = useState(false);
  const [invIdData, setInvIdData] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [invoiceSubData, setInvoiceSubData] = useState();
  const [invoiceLoaded, setInvoiceLoaded] = useState(false);
  const [invoiceSubLoaded, setInvoiceSubLoaded] = useState(false);

  const [templateData, setTemplateData] = useState();
  const [templateDataLoaded, setTemplateDataLoaded] = useState(false);
  const [image, setImage] = useState();
  const [logo, setLogo] = useState();

  const [logoImageLoaded, setLogoImageLoaded] = useState(false);
  const [signImageLoaded, setSignImageLoaded] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  let Obj1 = localStorage.getItem('finalObj1');
  let Obj2 = localStorage.getItem('finalObj2');

  const finalObj1 = JSON.parse(Obj1);
  const finalObj2 = JSON.parse(Obj2);
  const inputList = JSON.parse(Obj2);

  localStorage.setItem('invoicePageStatus', location.pathname);

  console.log('preview page finalObj1', finalObj1);

  console.log('preview page finalObj2', finalObj2);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  const customStyles = {
    content: {
      Top: '5%',
      Left: '20%',
      marginRight: '-80%',
      transform: 'translate(-50%, -50%)',
    },
  };

  useEffect(() => {
    if (sessionStorage.getItem('logDetails') === 'true') {
      if (location.post === undefined || location.post === null) {
        history.push({
          pathname: '/dashboard_invoice',
        });
      } else {
        console.log('location.post.inv_id', location.post.inv_id);
        let invId = location.post.inv_id;
        setInvIdData(invId);

        axios
          .get(url + `invoiceDataById?invoiceId=${invId}`)
          .then(({ data }) => {
            console.log('invoice data', data);
            setInvoiceData(data);

            setInvoiceLoaded(true);
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(url + `invoiceSubDataById?invoiceId=${invId}`)
          .then(({ data }) => {
            console.log('invoice sub data', data);

            setInvoiceSubData(data);
            setInvoiceSubLoaded(true);
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

              var image2 = document.getElementById('logoImg2');
              // the result image data
              image2.src = url + `invoiceImgFetch?fileName=${logoName}`;
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

              var image2 = document.getElementById('signImg2');
              // the result image data
              image2.src = url + `invoiceImgFetch?fileName=${signName}`;
            })
            .catch((err) => {
              console.log(err);
            });
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

      // let Obj1 = localStorage.getItem('finalObj1');

      // setPreviewInvoiceValue1(JSON.parse(Obj1));

      // if (localStorage.getItem('invoicePageStatus') !== '') {
      //   setTaxSelected(JSON.parse(localStorage.getItem('finalObj2'))[0].tax);

      //   setInputList(JSON.parse(localStorage.getItem('finalObj2')));

      //   setPlaceOfSupplySelected(
      //     JSON.parse(localStorage.getItem('finalObj1')).place_of_supply
      //   );
      // }
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
    history.push({
      pathname: '/dashboard_invoice',
    });
    window.location.reload();
  }

  function pdfFunNew() {
    let finalObj1 = {};

    finalObj1.igstAmnt = parseInt(
      (parseFloat(invoiceData[0].total_tax) /
        parseFloat(invoiceData[0].total_amount)) *
        100
    );

    finalObj1.cgstAmnt = parseInt(
      ((parseFloat(invoiceData[0].total_tax) /
        parseFloat(invoiceData[0].total_amount)) *
        100) /
        2
    );

    finalObj1.sgstAmnt = parseInt(
      ((parseFloat(invoiceData[0].total_tax) /
        parseFloat(invoiceData[0].total_amount)) *
        100) /
        2
    );

    if (invoiceData[0].place_of_supply === 'InterState') {
      finalObj1.totalTaxAmnt = parseFloat(invoiceData[0].total_tax);
    }

    if (invoiceData[0].place_of_supply === 'IntraState') {
      finalObj1.totalTaxAmnt = parseFloat(invoiceData[0].total_tax) / 2;
    }

    finalObj1.totalAmnt =
      parseFloat(invoiceData[0].total_amount) +
      parseFloat(invoiceData[0].total_tax);

    axios
      .get(
        url +
          `invoicePdfDownloadDashboard?inv_id=${
            invoiceData[0].inv_id
          }&invDate=${invoiceData[0].inv_date}&invNo=${
            invoiceData[0].inv_no
          }&gstNo=${invoiceData[0].gst_no}&billAddress=${
            invoiceData[0].bill_address
          }&place_of_supply=${invoiceData[0].place_of_supply}&igstAmnt=${
            finalObj1.igstAmnt
          }&cgstAmnt=${finalObj1.cgstAmnt}&sgstAmnt=${
            finalObj1.sgstAmnt
          }&totalTaxAmnt=${finalObj1.totalTaxAmnt}&totalAmnt=${
            finalObj1.totalAmnt
          }&hsn=${invoiceSubData[0].hsn}&CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}&ifsc=${
            invoiceData[0].ifsc
          }&swift_code=${invoiceData[0].swift_code}&gstId=${
            profileData[0].gst_id
          }`
      )
      .then((data) => {
        console.log(`Invoice download data`, data);

        // window.location.href = data;
        window.location.href =
          url +
          `invoicePdfDownloadDashboard?inv_id=${
            invoiceData[0].inv_id
          }&invDate=${invoiceData[0].inv_date}&invNo=${
            invoiceData[0].inv_no
          }&gstNo=${invoiceData[0].gst_no}&billAddress=${
            invoiceData[0].bill_address
          }&place_of_supply=${invoiceData[0].place_of_supply}&igstAmnt=${
            finalObj1.igstAmnt
          }&cgstAmnt=${finalObj1.cgstAmnt}&sgstAmnt=${
            finalObj1.sgstAmnt
          }&totalTaxAmnt=${finalObj1.totalTaxAmnt}&totalAmnt=${
            finalObj1.totalAmnt
          }&hsn=${invoiceSubData[0].hsn}&CompanyName=${sessionStorage.getItem(
            'CompanyName'
          )}&CustId=${sessionStorage.getItem('CustId')}&ifsc=${
            invoiceData[0].ifsc
          }&swift_code=${invoiceData[0].swift_code}&gstId=${
            profileData[0].gst_id
          }`;

        // history.push({
        //   pathname: '/dashboard_invoice',
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <Headers />
      {invoiceLoaded &&
        invoiceSubLoaded &&
        templateDataLoaded &&
        profileDataLoaded && (
          <div>
            <div>
              {logoImageLoaded === false ? (
                <div className="LogoSpacing"></div>
              ) : (
                <div className="imgStyle pad2050">
                  <div className="LogoLeft">
                    <img
                      //src={'/assets/images/' + logo}
                      alt="Loading..."
                      id="logoImg"
                    />
                  </div>
                  <div className="InvoiceTitle">
                    <h2>INVOICE</h2>
                  </div>
                </div>
              )}

              <div className="wrapperDiv pad050">
                <div className="invoiceHeadOne">
                  <div className="InvoiceHeadOneLeft">
                    <div className="TopAddress">
                      <p>
                        {templateData[0].template_companyAddress.split('\n')[0]}
                      </p>
                      <p>
                        {templateData[0].template_companyAddress.split('\n')[1]}
                      </p>
                      <p>
                        {templateData[0].template_companyAddress.split('\n')[2]}
                        {templateData[0].template_companyContact.split(
                          '|'
                        )[0] !== '' &&
                          templateData[0].template_companyContact.split('|')[0]}

                        {templateData[0].template_companyContact.split(
                          '|'
                        )[0] !== '' &&
                          templateData[0].template_companyContact.split(
                            '+91'
                          )[1] !== '' &&
                          '|'}

                        {templateData[0].template_companyContact.split(
                          '+91'
                        )[1] !== '' &&
                          'India-+91' +
                            templateData[0].template_companyContact.split(
                              '+91'
                            )[1]}
                      </p>
                    </div>
                  </div>
                  <div className="InvoiceHeadOneRight">
                    <p>
                      <label>Date : {invoiceData[0].inv_date}</label>
                    </p>
                    <p>
                      <label>Invoice No: {invoiceData[0].inv_no}</label>
                    </p>
                    <p>
                      <label>GSTIN: {profileData[0].gst_id}</label>
                    </p>
                    <p>
                      <label>SAC Code: {invoiceSubData[0].hsn}</label>
                    </p>
                  </div>
                </div>

                <div className="AddressSection">
                  <div className="BillToSection">
                    <h3>Bill To</h3>
                    <p>
                      {invoiceData[0].bill_address}
                      {invoiceData[0].gst_no !== '' &&
                        invoiceData[0].gst_no !== null && <br />}
                      {invoiceData[0].gst_no !== '' &&
                        invoiceData[0].gst_no !== null &&
                        'GSTIN :' + invoiceData[0].gst_no}
                    </p>
                  </div>

                  <div className="PayToSection">
                    <h3>Pay To</h3>
                    <p>
                      {templateData[0].template_payTo != '' &&
                        templateData[0].template_payTo != null && (
                          <>
                            {templateData[0].template_payTo
                              .split('\n')[0]
                              .split(':')[1] !== '' &&
                              templateData[0].template_payTo.split('\n')[0]}
                            {templateData[0].template_payTo
                              .split('\n')[0]
                              .split(':')[1] !== '' && <br />}
                            {templateData[0].template_payTo
                              .split('\n')[1]
                              .split(':')[1] !== '' &&
                              templateData[0].template_payTo.split('\n')[1]}
                            {templateData[0].template_payTo
                              .split('\n')[1]
                              .split(':')[1] !== '' && <br />}
                            {templateData[0].template_payTo
                              .split('\n')[2]
                              .split(',')[0] !== '' &&
                              templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[0]}
                            {templateData[0].template_payTo
                              .split('\n')[2]
                              .split(',')[0] !== '' &&
                              templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[1] !== '' &&
                              ','}

                            {templateData[0].template_payTo
                              .split('\n')[2]
                              .split(',')[1] !== '' &&
                              templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[1]}
                            {templateData[0].template_payTo
                              .split('\n')[2]
                              .split(':')[1] !== '' && <br />}
                            {templateData[0].template_payTo
                              .split('\n')[3]
                              .split(':')[1] !== '' &&
                              templateData[0].template_payTo.split('\n')[3]}
                            {templateData[0].template_payTo
                              .split('\n')[3]
                              .split(':')[1] !== '' && <br />}
                            {templateData[0].template_payTo
                              .split('\n')[4]
                              .split(':')[1] !== '' &&
                              templateData[0].template_payTo.split('\n')[4]}
                            {templateData[0].template_payTo
                              .split('\n')[4]
                              .split(':')[1] !== '' && <br />}
                            {templateData[0].template_payTo
                              .split('\n')[5]
                              .split(':')[1] !== '' &&
                              templateData[0].template_payTo.split('\n')[5]}
                            {invoiceData[0].swift_code !== '' &&
                              invoiceData[0].swift_code !== null && <br />}
                            {invoiceData[0].swift_code !== '' &&
                              invoiceData[0].swift_code !== null &&
                              'Swift Code :' + invoiceData[0].swift_code}
                            {invoiceData[0].ifsc !== '' &&
                              invoiceData[0].ifsc !== null && <br />}
                            {invoiceData[0].ifsc !== '' &&
                              invoiceData[0].ifsc !== null &&
                              'IFSC :' + invoiceData[0].ifsc}
                          </>
                        )}
                      {/* INTUISYZ TECHNOLOGIES
                  <br />
                  PRIVATE LIMITED <br />
                  A/c No: 074205500060 <br />
                  ICICI BANK, ANGAMALY, <br />
                  IFSC: ICIC0000742 <br />
                  Swift Code: ICICINBBNRI <br />
                  PANNO: AADCI6383A <br /> */}
                    </p>
                  </div>
                </div>
                <div>
                  <table className="preview-table">
                    <tr className="brownbg">
                      <th className="preview-th-td"></th>
                      <th className="preview-th-td">Sl No</th>
                      <th className="preview-th-td leftAlignTd">Description</th>
                      <th className="preview-th-td">Qty</th>
                      <th className="preview-th-td amountTh">Amount</th>
                      {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
                    </tr>

                    {invoiceSubData.map((item, index) => {
                      return (
                        <tr className="preview-tr" key={index + 1}>
                          <td className="preview-th-td brownbg"></td>
                          <td className="preview-th-td">{index + 1}</td>
                          <td className="preview-th-td leftAlignTd">
                            {item.description}
                          </td>
                          <td className="preview-th-td">{item.qty}</td>
                          <td className="preview-th-td amountTd">
                            {item.amount}
                          </td>
                          {/* <td className="preview-th-td">{'        '}</td> */}
                        </tr>
                      );
                    })}

                    <tr className="preview-tr">
                      <td className="preview-th-td brownbg"></td>
                      <td className="preview-th-td"></td>
                      <td className="preview-th-td rightAlignTd">
                        <ul className="gstUlLi">
                          <li>
                            <b>GST</b>
                          </li>

                          {invoiceData[0].place_of_supply === 'InterState' && (
                            <li>
                              IGST (
                              {parseInt(
                                (parseFloat(invoiceData[0].total_tax) /
                                  parseFloat(invoiceData[0].total_amount)) *
                                  100
                              )}
                              %)
                            </li>
                          )}
                          {invoiceData[0].place_of_supply === 'IntraState' && (
                            <>
                              <li>
                                CGST (
                                {parseInt(
                                  ((parseFloat(invoiceData[0].total_tax) /
                                    parseFloat(invoiceData[0].total_amount)) *
                                    100) /
                                    2
                                )}
                                %)
                              </li>
                              <li>
                                SGST (
                                {parseInt(
                                  ((parseFloat(invoiceData[0].total_tax) /
                                    parseFloat(invoiceData[0].total_amount)) *
                                    100) /
                                    2
                                )}
                                %)
                              </li>
                            </>
                          )}
                        </ul>
                      </td>
                      <td className="preview-th-td"></td>
                      <td className="preview-th-td amountTd">
                        <ul className="gstUlLi">
                          <li>&nbsp;</li>
                          {invoiceData[0].place_of_supply === 'InterState' && (
                            <>
                              <b>{parseFloat(invoiceData[0].total_tax)}</b>
                            </>
                          )}
                          {invoiceData[0].place_of_supply === 'IntraState' && (
                            <>
                              <li>
                                <b>
                                  {parseFloat(invoiceData[0].total_tax) / 2}
                                </b>
                              </li>
                              <li>
                                <b>
                                  {parseFloat(invoiceData[0].total_tax) / 2}
                                </b>
                              </li>
                            </>
                          )}
                        </ul>
                      </td>
                      {/* <td className="preview-th-td">{'        '}</td> */}
                    </tr>

                    <tr className="preview-tr">
                      <td className="preview-th-td brownbg"></td>
                      <td className="preview-th-td"></td>
                      <td className="preview-th-td amountTd">
                        <h4>Total</h4>
                      </td>
                      <td className="preview-th-td"></td>
                      <td className="preview-th-td amountTd">
                        <h4>
                          <b>
                            {parseFloat(invoiceData[0].total_amount) +
                              parseFloat(invoiceData[0].total_tax)}
                          </b>
                        </h4>{' '}
                      </td>
                      {/* <td className="preview-th-td">{'        '}</td> */}
                    </tr>
                  </table>

                  <div className="footerTable">
                    <table className="preview-footer-table">
                      <tr className="preview-footer-tr">
                        <th className="preview-footer-th-td posRel">
                          <span>Name</span>
                          <div className="designationTxt">
                            {templateData[0].template_Name.split('\n')[0]}
                            <br />
                            {templateData[0].template_Name.split('\n')[1]}
                            <br />
                            {templateData[0].template_Name.split('\n')[2]}
                          </div>
                        </th>
                        <th className="preview-footer-th-td posRel">
                          <span>Signature</span>
                          <div className="SignatureImage">
                            <img
                              //src={'/assets/images/' + image}
                              //  src="C://Users/SHERIN/git/JavaAccounts/Intuisyz_Accounts_Java/src/main/resources/image/Screenshot%20(395)%20(1).png"
                              alt="Loading..."
                              id="signImg"
                            />
                          </div>
                        </th>
                      </tr>
                    </table>
                  </div>
                </div>
                <div className="companyAddressSec">
                  <p>
                    {/* <b> INTUISYZ TECHNOLOGIES PRIVATE LIMITED</b> */}
                    <b>
                      {templateData[0].template_companyName.split('\n')[0]}
                    </b>{' '}
                    | {templateData[0].template_companyAddress.split('\n')[0]},
                    {templateData[0].template_companyAddress.split('\n')[1]}
                  </p>
                  <div>
                    {/* <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                    Third Floor, Kolenchery Tower, Angamaly -683572,
                    Kerala,India
                  </p>
                  <p style={{ fontSize: 14, fontFamily: '-moz-initial' }}>
                    Centre A, 7th Floor Alappat Business Tower, MG Road-
                    Ernakulam,Kerala,India
                  </p> */}

                    <p>
                      {templateData[0].template_companyAddress.split('\n')[2]}
                    </p>
                  </div>
                  <p>{templateData[0].template_companyContact}</p>
                </div>

                <footer className="invoice-footer">
                  <div className="RightButtonsSec">
                    <button
                      className="primary btn"
                      type="submit"
                      name="submit"
                      onClick={(e) => {
                        history.push({
                          pathname: '/dashboard_invoice',
                        });
                      }}
                    >
                      Back{' '}
                    </button>
                    <button
                      className="primary btn"
                      type="submit"
                      name="submit"
                      onClick={(e) => {
                        // prints('printrec');

                        pdfFunNew();
                      }}
                    >
                      PDF
                    </button>
                    <button
                      className="primary btn"
                      type="submit"
                      name="submit"
                      onClick={(e) => {
                        prints('printrec');
                      }}
                    >
                      Print
                    </button>
                    <a
                      href
                      className="btn btn-default btn-rounded mb-4"
                      data-toggle="modal"
                      data-target="#modalContactForm"
                    >
                      Customize
                    </a>
                  </div>
                </footer>
              </div>
            </div>

            <div
              className="modal fade"
              id="modalContactForm"
              tabIndex={-1}
              role="dialog"
              aria-labelledby="myModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header text-center">
                    <h4 className="modal-title w-100 font-weight-bold">
                      Customize
                    </h4>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">x</span>
                    </button>
                  </div>
                  <Edit_profile />
                </div>
              </div>
            </div>

            <div id="id2" hidden>
              <div className="PdfPreviewWrapper">
                {logoImageLoaded === false ? (
                  <div className="LogoSpacings"></div>
                ) : (
                  <div className="imgStyle pad2000">
                    <div className="LogoLeft">
                      <img
                        //src={'/assets/images/' + logo}
                        alt="Loading..."
                        id="logoImg2"
                      />
                    </div>
                    <div className="InvoiceTitle">
                      <h2>INVOICE</h2>
                    </div>
                  </div>
                )}

                <div className="wrapperDiv ">
                  <div className="invoiceHeadOne">
                    <div className="InvoiceHeadOneLeft">
                      <div className="TopAddress">
                        <p>
                          {
                            templateData[0].template_companyAddress.split(
                              '\n'
                            )[0]
                          }
                        </p>
                        <p>
                          {
                            templateData[0].template_companyAddress.split(
                              '\n'
                            )[1]
                          }
                        </p>
                        <p>
                          {
                            templateData[0].template_companyAddress.split(
                              '\n'
                            )[2]
                          }

                          {templateData[0].template_companyContact.split(
                            '|'
                          )[0] !== '' &&
                            templateData[0].template_companyContact.split(
                              '|'
                            )[0]}

                          {templateData[0].template_companyContact.split(
                            '|'
                          )[0] !== '' &&
                            templateData[0].template_companyContact.split(
                              '+91'
                            )[1] !== '' &&
                            '|'}

                          {templateData[0].template_companyContact.split(
                            '+91'
                          )[1] !== '' &&
                            'India-+91' +
                              templateData[0].template_companyContact.split(
                                '+91'
                              )[1]}
                        </p>
                      </div>
                    </div>
                    <div className="InvoiceHeadOneRight">
                      <p>
                        <label>Date : {invoiceData[0].inv_date}</label>
                      </p>
                      <p>
                        <label>Invoice No: {invoiceData[0].inv_no}</label>
                      </p>
                      <p>
                        <label>GSTIN: {profileData[0].gst_id}</label>
                      </p>
                      <p>
                        <label>SAC Code: {invoiceSubData[0].hsn}</label>
                      </p>
                    </div>
                  </div>

                  <div className="AddressSection">
                    <div className="BillToSection">
                      <label>Bill To</label>
                      <p>
                        {invoiceData[0].bill_address}
                        {invoiceData[0].gst_no !== '' &&
                          invoiceData[0].gst_no !== null && <br />}
                        {invoiceData[0].gst_no !== '' &&
                          invoiceData[0].gst_no !== null &&
                          'GSTIN :' + invoiceData[0].gst_no}
                      </p>
                    </div>
                    <div className="PayToSection">
                      <label>Pay To</label>
                      <p>
                        {templateData[0].template_payTo != '' &&
                          templateData[0].template_payTo != null && (
                            <>
                              {templateData[0].template_payTo
                                .split('\n')[0]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[0]}
                              {templateData[0].template_payTo
                                .split('\n')[0]
                                .split(':')[1] !== '' && <br />}
                              {templateData[0].template_payTo
                                .split('\n')[1]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[1]}
                              {templateData[0].template_payTo
                                .split('\n')[1]
                                .split(':')[1] !== '' && <br />}

                              {templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[0] !== '' &&
                                templateData[0].template_payTo
                                  .split('\n')[2]
                                  .split(',')[0]}
                              {templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[0] !== '' &&
                                templateData[0].template_payTo
                                  .split('\n')[2]
                                  .split(',')[1] !== '' &&
                                ','}

                              {templateData[0].template_payTo
                                .split('\n')[2]
                                .split(',')[1] !== '' &&
                                templateData[0].template_payTo
                                  .split('\n')[2]
                                  .split(',')[1]}
                              {templateData[0].template_payTo
                                .split('\n')[2]
                                .split(':')[1] !== '' && <br />}

                              {templateData[0].template_payTo
                                .split('\n')[3]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[3]}
                              {templateData[0].template_payTo
                                .split('\n')[3]
                                .split(':')[1] !== '' && <br />}
                              {templateData[0].template_payTo
                                .split('\n')[4]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[4]}
                              {templateData[0].template_payTo
                                .split('\n')[4]
                                .split(':')[1] !== '' && <br />}
                              {templateData[0].template_payTo
                                .split('\n')[5]
                                .split(':')[1] !== '' &&
                                templateData[0].template_payTo.split('\n')[5]}
                              {invoiceData[0].swift_code !== '' &&
                                invoiceData[0].swift_code !== null && <br />}
                              {invoiceData[0].swift_code !== '' &&
                                invoiceData[0].swift_code !== null &&
                                'Swift Code :' + invoiceData[0].swift_code}
                              {invoiceData[0].ifsc !== '' &&
                                invoiceData[0].ifsc !== null && <br />}
                              {invoiceData[0].ifsc !== '' &&
                                invoiceData[0].ifsc !== null &&
                                'IFSC :' + invoiceData[0].ifsc}
                            </>
                          )}
                        {/* {templateData[0].template_payTo.split('\n')[0]} <br />
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
                    {templateData[0].template_payTo.split('\n')[7]} */}
                      </p>
                    </div>
                  </div>

                  <div>
                    <table className="preview-table">
                      <tr>
                        <th className="preview-th-td">Sl No</th>
                        <th className="preview-th-td alignLeft">Description</th>
                        <th className="preview-th-td">Qty</th>
                        <th className="preview-th-td alignRight"> Amount</th>
                        {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
                      </tr>

                      {invoiceSubData.map((item, index) => {
                        return (
                          <tr className="preview-tr" key={index + 1}>
                            <td className="preview-th-td brownbg"></td>
                            <td className="preview-th-td">{index + 1}</td>
                            <td className="preview-th-td alignLeft">
                              {item.description}
                            </td>
                            <td className="preview-th-td">{item.qty}</td>
                            <td className="preview-th-td alignRight">
                              {item.amount}
                            </td>
                            {/* <td className="preview-th-td">{'        '}</td> */}
                          </tr>
                        );
                      })}

                      <tr className="preview-tr">
                        <td className="preview-th-td brownbg"></td>
                        <td className="preview-th-td"></td>
                        <td className="preview-th-td alignRight">
                          <ul className="gstUlLi">
                            <li>
                              <b>GST</b>
                            </li>
                            {invoiceData[0].place_of_supply ===
                              'InterState' && (
                              <li>
                                IGST (
                                {parseInt(
                                  (parseFloat(invoiceData[0].total_tax) /
                                    parseFloat(invoiceData[0].total_amount)) *
                                    100
                                )}
                                %)
                              </li>
                            )}
                            {invoiceData[0].place_of_supply ===
                              'IntraState' && (
                              <>
                                <li>
                                  CGST (
                                  {parseInt(
                                    ((parseFloat(invoiceData[0].total_tax) /
                                      parseFloat(invoiceData[0].total_amount)) *
                                      100) /
                                      2
                                  )}
                                  %)
                                </li>

                                <li>
                                  SGST (
                                  {parseInt(
                                    ((parseFloat(invoiceData[0].total_tax) /
                                      parseFloat(invoiceData[0].total_amount)) *
                                      100) /
                                      2
                                  )}
                                  %)
                                </li>
                              </>
                            )}
                          </ul>
                        </td>
                        <td className="preview-th-td"></td>
                        <td className="preview-th-td alignRight">
                          <ul className="gstUlLi">
                            <li>&nbsp;</li>
                            {invoiceData[0].place_of_supply ===
                              'InterState' && (
                              <>
                                <li>{parseFloat(invoiceData[0].total_tax)}</li>
                              </>
                            )}
                            {invoiceData[0].place_of_supply ===
                              'IntraState' && (
                              <>
                                <li>
                                  {parseFloat(invoiceData[0].total_tax) / 2}
                                </li>
                                <li>
                                  {parseFloat(invoiceData[0].total_tax) / 2}
                                </li>
                              </>
                            )}
                          </ul>
                        </td>
                        {/* <td className="preview-th-td">{'        '}</td> */}
                      </tr>

                      <tr className="preview-tr">
                        <td className="preview-th-td brownbg"></td>
                        <td className="preview-th-td"></td>
                        <td className="preview-th-td alignRight amountTd">
                          <h4>Total</h4>
                        </td>
                        <td className="preview-th-td"></td>
                        <td className="preview-th-td alignRight amountTd">
                          <h4>
                            {parseFloat(invoiceData[0].total_amount) +
                              parseFloat(invoiceData[0].total_tax)}
                          </h4>
                        </td>
                      </tr>
                    </table>

                    <div className="DesiGnationandSign">
                      <table className="table">
                        <tr>
                          <td>
                            <div className="designationCopy">
                              <span>Name</span>
                              <div className="desigTxt">
                                <p>
                                  <b>
                                    {
                                      templateData[0].template_Name.split(
                                        '\n'
                                      )[0]
                                    }
                                  </b>
                                </p>
                                <p>
                                  {templateData[0].template_Name.split('\n')[1]}{' '}
                                </p>
                                <p>
                                  {templateData[0].template_Name.split('\n')[2]}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td style={{ width: '50%' }}>
                            <div className="SignatureCopy">
                              <span>Signature</span>
                              <div>
                                <img
                                  alt="Loading..."
                                  className="signImgTwo"
                                  id="signImg2"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="footerAddresses">
                    <p>
                      <span>
                        <b>
                          {templateData[0].template_companyName.split('\n')[0]}
                        </b>
                      </span>
                      <span>|</span>
                      <span>
                        {templateData[0].template_companyAddress.split('\n')[0]}
                        ,
                      </span>
                      <span>
                        {templateData[0].template_companyAddress.split('\n')[1]}
                      </span>
                      <span>
                        {templateData[0].template_companyAddress.split('\n')[2]}
                      </span>
                    </p>

                    <p>{templateData[0].template_companyContact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard_preview;

////////////OLD code//////////

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
// import { successToast, errorToast } from '../common/global';
// import uuid from 'react-uuid';
// import { ToastContainer, toast } from 'react-toastify';
// import baseUrl from '../Base Url/baseUrl';
// import '../Invoice/style_invoice.css';
// import invoiceHeaderImg from '../Image/invoice_header.jpg';
// import invoiceFooterImg from '../Image/invoice_footer.jpg';
// import { parse } from 'uuid';

// const Dashboard_preview = () => {
//   let location = useLocation();
//   let history = useHistory();
//   let url = baseUrl.url;

//   const [invIdData, setInvIdData] = useState();
//   const [invoiceData, setInvoiceData] = useState();
//   const [invoiceSubData, setInvoiceSubData] = useState();
//   const [invoiceLoaded, setInvoiceLoaded] = useState(false);
//   const [invoiceSubLoaded, setInvoiceSubLoaded] = useState(false);

//   let Obj1 = localStorage.getItem('finalObj1');
//   let Obj2 = localStorage.getItem('finalObj2');

//   const finalObj1 = JSON.parse(Obj1);
//   const finalObj2 = JSON.parse(Obj2);
//   const inputList = JSON.parse(Obj2);

//   localStorage.setItem('invoicePageStatus', location.pathname);

//   console.log('preview page finalObj1', finalObj1);

//   console.log('preview page finalObj2', finalObj2);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     mode: 'onSubmit',
//   });

//   useEffect(() => {
//     if (location.post === undefined || location.post === null) {
//       history.push({
//         pathname: '/dashboard_invoice',
//       });
//     } else {
//       console.log('location.post.inv_id', location.post.inv_id);
//       let invId = location.post.inv_id;
//       setInvIdData(invId);

//       axios
//         .get(url + `invoiceDataById?invoiceId=${invId}`)
//         .then(({ data }) => {
//           console.log('invoice data', data);
//           setInvoiceData(data);

//           setInvoiceLoaded(true);
//         })
//         .catch((err) => {
//           console.log(err);
//         });

//       axios
//         .get(url + `invoiceSubDataById?invoiceId=${invId}`)
//         .then(({ data }) => {
//           console.log('invoice sub data', data);

//           setInvoiceSubData(data);
//           setInvoiceSubLoaded(true);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }

//     // let Obj1 = localStorage.getItem('finalObj1');

//     // setPreviewInvoiceValue1(JSON.parse(Obj1));

//     // if (localStorage.getItem('invoicePageStatus') !== '') {
//     //   setTaxSelected(JSON.parse(localStorage.getItem('finalObj2'))[0].tax);

//     //   setInputList(JSON.parse(localStorage.getItem('finalObj2')));

//     //   setPlaceOfSupplySelected(
//     //     JSON.parse(localStorage.getItem('finalObj1')).place_of_supply
//     //   );
//     // }
//   }, []);

//   function prints(el) {
//     var restorepage = document.body.innerHTML;
//     var printcontent = document.getElementById('id2').innerHTML;
//     document.body.innerHTML = printcontent;
//     window.print();

//     document.body.innerHTML = restorepage;
//     history.push({
//       pathname: '/dashboard_invoice',
//     });
//     window.location.reload();
//   }

//   return (
//     <div>
//       {invoiceLoaded && invoiceSubLoaded && (
//         <div>
//           <br />

//           <div>
//             <div>
//               <img src={invoiceHeaderImg} alt="Loading..." />
//             </div>
//             <br />
//             <br />
//             <div>
//               <label style={{ fontSize: 18, fontWeight: 'bold' }}>
//                 <b>INVOICE</b>
//               </label>
//             </div>

//             <div style={{ textAlign: 'left' }}>
//               <br />
//               <label
//                 style={{
//                   paddingLeft: 200,
//                   fontWeight: 'bold',
//                   fontSize: 15,
//                 }}
//               >
//                 Date : {invoiceData[0].inv_date}
//               </label>
//             </div>
//             <div style={{ textAlign: 'right' }}>
//               <label
//                 style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
//               >
//                 Invoice No: {invoiceData[0].inv_no}
//               </label>
//               <br />
//               <label
//                 style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
//               >
//                 GSTIN: {invoiceData[0].gst_no}
//               </label>
//               <br />
//               <label
//                 style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
//               >
//                 SAC Code: {invoiceSubData[0].hsn}
//               </label>
//             </div>

//             <div style={{ textAlign: 'left' }}>
//               <br />
//               <label
//                 style={{
//                   paddingLeft: 200,
//                   fontWeight: 'bold',
//                   fontSize: 15,
//                 }}
//               >
//                 Bill To
//               </label>
//               <br />

//               <p
//                 style={{
//                   paddingLeft: 200,
//                   fontSize: 15,
//                 }}
//               >
//                 {invoiceData[0].bill_address}
//               </p>
//             </div>
//             <div style={{ textAlign: 'left' }}>
//               <br />
//               <label
//                 style={{
//                   paddingLeft: 200,
//                   fontWeight: 'bold',
//                   fontSize: 15,
//                 }}
//               >
//                 Pay To
//               </label>
//               <br />

//               <p
//                 style={{
//                   paddingLeft: 200,
//                   fontSize: 15,
//                 }}
//               >
//                 INTUISYZ TECHNOLOGIES
//                 <br />
//                 PRIVATE LIMITED <br />
//                 A/c No: 074205500060 <br />
//                 ICICI BANK, ANGAMALY, <br />
//                 IFSC: ICIC0000742 <br />
//                 Swift Code: ICICINBBNRI <br />
//                 PANNO: AADCI6383A <br />
//               </p>
//             </div>
//             <br />
//             <div style={{ paddingLeft: 200, paddingRight: 200 }}>
//               <table className="preview-table">
//                 <tr className="preview-tr">
//                   <th className="preview-th-td">Sl No</th>
//                   <th className="preview-th-td">Description</th>
//                   <th className="preview-th-td">Qty</th>
//                   <th className="preview-th-td"> Amount</th>
//                   {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
//                 </tr>

//                 {invoiceSubData.map((item, index) => {
//                   return (
//                     <tr className="preview-tr" key={index + 1}>
//                       <td className="preview-th-td">{index + 1}</td>
//                       <td className="preview-th-td">{item.description}</td>
//                       <td className="preview-th-td">{item.qty}</td>
//                       <td className="preview-th-td">{item.amount}</td>
//                       {/* <td className="preview-th-td">{'        '}</td> */}
//                     </tr>
//                   );
//                 })}

//                 <tr className="preview-tr">
//                   <td className="preview-th-td"></td>
//                   <td className="preview-th-td">
//                     {' '}
//                     <b>GST</b>
//                     <br />
//                     {invoiceData[0].place_of_supply === 'InterState' && (
//                       <b>
//                         IGST ({' '}
//                         {parseInt(
//                           (parseFloat(invoiceData[0].total_tax) /
//                             parseFloat(invoiceData[0].total_amount)) *
//                             100
//                         )}
//                         %){' '}
//                       </b>
//                     )}
//                     {invoiceData[0].place_of_supply === 'IntraState' && (
//                       <>
//                         <b>
//                           CGST ({' '}
//                           {parseInt(
//                             ((parseFloat(invoiceData[0].total_tax) /
//                               parseFloat(invoiceData[0].total_amount)) *
//                               100) /
//                               2
//                           )}{' '}
//                           %){' '}
//                         </b>
//                         <br />
//                         <b>
//                           SGST ({' '}
//                           {parseInt(
//                             ((parseFloat(invoiceData[0].total_tax) /
//                               parseFloat(invoiceData[0].total_amount)) *
//                               100) /
//                               2
//                           )}{' '}
//                           %)
//                         </b>
//                       </>
//                     )}
//                   </td>
//                   <td className="preview-th-td"></td>
//                   <td className="preview-th-td">
//                     {' '}
//                     {invoiceData[0].place_of_supply === 'InterState' && (
//                       <>
//                         <br />
//                         <b>{parseFloat(invoiceData[0].total_tax)}</b>
//                       </>
//                     )}
//                     {invoiceData[0].place_of_supply === 'IntraState' && (
//                       <>
//                         <br />
//                         <b>{parseFloat(invoiceData[0].total_tax) / 2}</b>
//                         <br />
//                         <b>{parseFloat(invoiceData[0].total_tax) / 2}</b>
//                       </>
//                     )}
//                   </td>
//                   {/* <td className="preview-th-td">{'        '}</td> */}
//                 </tr>

//                 <tr className="preview-tr">
//                   <td className="preview-th-td"></td>
//                   <td className="preview-th-td">
//                     <h4>
//                       {' '}
//                       <b>Total</b>
//                     </h4>{' '}
//                   </td>
//                   <td className="preview-th-td"></td>
//                   <td className="preview-th-td">
//                     <h4>
//                       {' '}
//                       <b>
//                         {parseFloat(invoiceData[0].total_amount) +
//                           parseFloat(invoiceData[0].total_tax)}
//                       </b>
//                     </h4>{' '}
//                   </td>
//                   {/* <td className="preview-th-td">{'        '}</td> */}
//                 </tr>
//               </table>
//               <br />
//               <br />
//               <br />
//               <br />
//               <br />

//               <div style={{ paddingRight: 150 }}>
//                 <table className="preview-footer-table">
//                   <tr className="preview-footer-tr">
//                     <th className="preview-footer-th-td">
//                       Name <br />
//                       <br />
//                       Sijin Stephen <br />
//                       Managing <br />
//                       Director
//                     </th>
//                     <th className="preview-footer-th-td">
//                       Signature <br />
//                       <br />
//                       <br />
//                       <br />
//                       <br />
//                     </th>
//                     <th className="preview-footer-th-td">
//                       Date
//                       <br />
//                       <br />
//                       <br />
//                       {invoiceData[0].inv_date}
//                       <br />
//                       <br />
//                     </th>
//                   </tr>
//                 </table>
//               </div>
//               <br></br>
//               <br></br>
//               <br></br>
//             </div>
//             <div>
//               <img src={invoiceFooterImg} width="85%" alt="Loading..." />
//             </div>
//           </div>
//           <br></br>
//           <br></br>
//           <br></br>

//           <div id="id2" hidden>
//             <div>
//               <img src={invoiceHeaderImg} alt="Loading..." />
//             </div>
//             <br />
//             <br />
//             <div style={{ textAlign: 'center' }}>
//               <label style={{ fontSize: 18, fontWeight: 'bold' }}>
//                 <b>INVOICE</b>
//               </label>
//             </div>

//             <div style={{ textAlign: 'left' }}>
//               <br />
//               <label
//                 style={{
//                   paddingLeft: 60,
//                   fontWeight: 'bold',
//                   fontSize: 15,
//                 }}
//               >
//                 Date : {invoiceData[0].inv_date}
//               </label>
//             </div>
//             <div style={{ textAlign: 'right' }}>
//               <label
//                 style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}
//               >
//                 Invoice No: {invoiceData[0].inv_no}
//               </label>
//               <br />
//               <label
//                 style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}
//               >
//                 GSTIN: {invoiceData[0].gst_no}
//               </label>
//               <br />
//               <label
//                 style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}
//               >
//                 SAC Code: {invoiceSubData[0].hsn}
//               </label>
//             </div>

//             <div style={{ textAlign: 'left' }}>
//               <br />
//               <label
//                 style={{
//                   paddingLeft: 60,
//                   fontWeight: 'bold',
//                   fontSize: 15,
//                 }}
//               >
//                 Bill To
//               </label>
//               <br />

//               <p
//                 style={{
//                   paddingLeft: 60,
//                   fontSize: 15,
//                 }}
//               >
//                 {invoiceData[0].bill_address}
//               </p>
//             </div>
//             <div style={{ textAlign: 'left' }}>
//               <br />
//               <label
//                 style={{
//                   paddingLeft: 60,
//                   fontWeight: 'bold',
//                   fontSize: 15,
//                 }}
//               >
//                 Pay To
//               </label>
//               <br />

//               <p
//                 style={{
//                   paddingLeft: 60,
//                   fontSize: 15,
//                 }}
//               >
//                 INTUISYZ TECHNOLOGIES
//                 <br />
//                 PRIVATE LIMITED <br />
//                 A/c No: 074205500060 <br />
//                 ICICI BANK, ANGAMALY, <br />
//                 IFSC: ICIC0000742 <br />
//                 Swift Code: ICICINBBNRI <br />
//                 PANNO: AADCI6383A <br />
//               </p>
//             </div>
//             <br />
//             <div style={{ paddingLeft: 60, paddingRight: 60 }}>
//               <table className="preview-table">
//                 <tr className="preview-tr">
//                   <th className="preview-th-td">Sl No</th>
//                   <th className="preview-th-td">Description</th>
//                   <th className="preview-th-td">Qty</th>
//                   <th className="preview-th-td"> Amount</th>
//                   {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
//                 </tr>

//                 {invoiceSubData.map((item, index) => {
//                   return (
//                     <tr className="preview-tr" key={index + 1}>
//                       <td className="preview-th-td">{index + 1}</td>
//                       <td className="preview-th-td">{item.description}</td>
//                       <td className="preview-th-td">{item.qty}</td>
//                       <td className="preview-th-td">{item.amount}</td>
//                       {/* <td className="preview-th-td">{'        '}</td> */}
//                     </tr>
//                   );
//                 })}

//                 <tr className="preview-tr">
//                   <td className="preview-th-td"></td>
//                   <td className="preview-th-td">
//                     {' '}
//                     <b>GST</b>
//                     <br />
//                     {invoiceData[0].place_of_supply === 'InterState' && (
//                       <b>
//                         IGST ({' '}
//                         {parseInt(
//                           (parseFloat(invoiceData[0].total_tax) /
//                             parseFloat(invoiceData[0].total_amount)) *
//                             100
//                         )}
//                         %){' '}
//                       </b>
//                     )}
//                     {invoiceData[0].place_of_supply === 'IntraState' && (
//                       <>
//                         <b>
//                           CGST ({' '}
//                           {parseInt(
//                             ((parseFloat(invoiceData[0].total_tax) /
//                               parseFloat(invoiceData[0].total_amount)) *
//                               100) /
//                               2
//                           )}{' '}
//                           %){' '}
//                         </b>
//                         <br />
//                         <b>
//                           SGST ({' '}
//                           {parseInt(
//                             ((parseFloat(invoiceData[0].total_tax) /
//                               parseFloat(invoiceData[0].total_amount)) *
//                               100) /
//                               2
//                           )}{' '}
//                           %)
//                         </b>
//                       </>
//                     )}
//                   </td>
//                   <td className="preview-th-td"></td>
//                   <td className="preview-th-td">
//                     {' '}
//                     {invoiceData[0].place_of_supply === 'InterState' && (
//                       <>
//                         <br />
//                         <b>{parseFloat(invoiceData[0].total_tax)}</b>
//                       </>
//                     )}
//                     {invoiceData[0].place_of_supply === 'IntraState' && (
//                       <>
//                         <br />
//                         <b>{parseFloat(invoiceData[0].total_tax) / 2}</b>
//                         <br />
//                         <b>{parseFloat(invoiceData[0].total_tax) / 2}</b>
//                       </>
//                     )}
//                   </td>
//                   {/* <td className="preview-th-td">{'        '}</td> */}
//                 </tr>

//                 <tr className="preview-tr">
//                   <td className="preview-th-td"></td>
//                   <td className="preview-th-td">
//                     <h4>
//                       {' '}
//                       <b>Total</b>
//                     </h4>{' '}
//                   </td>
//                   <td className="preview-th-td"></td>
//                   <td className="preview-th-td">
//                     <h4>
//                       {' '}
//                       <b>
//                         {parseFloat(invoiceData[0].total_amount) +
//                           parseFloat(invoiceData[0].total_tax)}
//                       </b>
//                     </h4>{' '}
//                   </td>
//                   {/* <td className="preview-th-td">{'        '}</td> */}
//                 </tr>
//               </table>
//               <br />
//               <br />

//               <div style={{ paddingRight: 110 }}>
//                 <table className="preview-footer-table">
//                   <tr className="preview-footer-tr">
//                     <th className="preview-footer-th-td">
//                       Name <br />
//                       <br />
//                       Sijin Stephen <br />
//                       Managing <br />
//                       Director
//                     </th>
//                     <th className="preview-footer-th-td">
//                       Signature <br />
//                       <br />
//                       <br />
//                       <br />
//                       <br />
//                     </th>
//                     <th className="preview-footer-th-td">
//                       Date
//                       <br />
//                       <br />
//                       <br />
//                       {invoiceData[0].inv_date}
//                       <br />
//                       <br />
//                     </th>
//                   </tr>
//                 </table>
//               </div>
//               <br></br>
//             </div>
//             <div>
//               <img src={invoiceFooterImg} width="100%" alt="Loading..." />
//             </div>
//           </div>

//           <footer className="invoice-footer">
//             <p>
//               <div style={{ alignItems: 'center', padding: 10 }} align="center">
//                 <button
//                   type="submit"
//                   name="submit"
//                   onClick={(e) => {
//                     history.push({
//                       pathname: '/dashboard_invoice',
//                     });
//                   }}
//                   style={{
//                     backgroundColor: 'green',
//                     width: 100,
//                   }}
//                 >
//                   Back{' '}
//                 </button>
//                 &nbsp;
//                 <button
//                   type="submit"
//                   name="submit"
//                   style={{ backgroundColor: 'green', width: 100 }}
//                   onClick={(e) => {
//                     prints('printrec');
//                   }}
//                 >
//                   Print
//                 </button>
//               </div>
//             </p>
//           </footer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard_preview;
