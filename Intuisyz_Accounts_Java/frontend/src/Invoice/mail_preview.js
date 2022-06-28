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
import invoiceHeaderImg from '../Image/invoice_header.jpg';
import invoiceFooterImg from '../Image/invoice_footer.jpg';
import { parse } from 'uuid';
import { useParams } from 'react-router-dom';

const Mail_preview = () => {
  let location = useLocation();
  let history = useHistory();
  let url = baseUrl.url;

  const [invIdData, setInvIdData] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [invoiceSubData, setInvoiceSubData] = useState();
  const [invoiceLoaded, setInvoiceLoaded] = useState(false);
  const [invoiceSubLoaded, setInvoiceSubLoaded] = useState(false);

  //   let Obj1 = localStorage.getItem('finalObj1');
  //   let Obj2 = localStorage.getItem('finalObj2');

  //   const finalObj1 = JSON.parse(Obj1);
  //   const finalObj2 = JSON.parse(Obj2);
  //   const inputList = JSON.parse(Obj2);

  //   localStorage.setItem('invoicePageStatus', location.pathname);

  //   console.log('preview page finalObj1', finalObj1);

  //   console.log('preview page finalObj2', finalObj2);

  //   const { state } = useLocation();

  const { id } = useParams();

  console.log(`id`, id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
  });

  useEffect(() => {
    let invId = id;
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

    // let Obj1 = localStorage.getItem('finalObj1');

    // setPreviewInvoiceValue1(JSON.parse(Obj1));

    // if (localStorage.getItem('invoicePageStatus') !== '') {
    //   setTaxSelected(JSON.parse(localStorage.getItem('finalObj2'))[0].tax);

    //   setInputList(JSON.parse(localStorage.getItem('finalObj2')));

    //   setPlaceOfSupplySelected(
    //     JSON.parse(localStorage.getItem('finalObj1')).place_of_supply
    //   );
    // }
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

  return (
    <div>
      {invoiceLoaded && invoiceSubLoaded && (
        <div>
          <br />

          <div>
            <div>
              <img src={invoiceHeaderImg} alt="Loading..." />
            </div>
            <br />
            <br />
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
                Date : {invoiceData[0].inv_date}
              </label>
            </div>
            <div style={{ textAlign: 'right' }}>
              <label
                style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
              >
                Invoice No: {invoiceData[0].inv_no}
              </label>
              <br />
              <label
                style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
              >
                GSTIN: {invoiceData[0].gst_no}
              </label>
              <br />
              <label
                style={{ paddingRight: 200, fontWeight: 'bold', fontSize: 15 }}
              >
                SAC Code: {invoiceSubData[0].hsn}
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
                {invoiceData[0].bill_address}
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

              <p
                style={{
                  paddingLeft: 200,
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
            <div style={{ paddingLeft: 200, paddingRight: 200 }}>
              <table className="preview-table">
                <tr className="preview-tr">
                  <th className="preview-th-td">Sl No</th>
                  <th className="preview-th-td">Description</th>
                  <th className="preview-th-td">Qty</th>
                  <th className="preview-th-td"> Amount</th>
                  {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
                </tr>

                {invoiceSubData.map((item, index) => {
                  return (
                    <tr className="preview-tr" key={index + 1}>
                      <td className="preview-th-td">{index + 1}</td>
                      <td className="preview-th-td">{item.description}</td>
                      <td className="preview-th-td">{item.qty}</td>
                      <td className="preview-th-td">{item.amount}</td>
                      {/* <td className="preview-th-td">{'        '}</td> */}
                    </tr>
                  );
                })}

                <tr className="preview-tr">
                  <td className="preview-th-td"></td>
                  <td className="preview-th-td">
                    {' '}
                    <b>GST</b>
                    <br />
                    {invoiceData[0].place_of_supply === 'InterState' && (
                      <b>
                        IGST ({' '}
                        {parseInt(
                          (parseFloat(invoiceData[0].total_tax) /
                            parseFloat(invoiceData[0].total_amount)) *
                            100
                        )}
                        %){' '}
                      </b>
                    )}
                    {invoiceData[0].place_of_supply === 'IntraState' && (
                      <>
                        <b>
                          CGST ({' '}
                          {parseInt(
                            ((parseFloat(invoiceData[0].total_tax) /
                              parseFloat(invoiceData[0].total_amount)) *
                              100) /
                              2
                          )}{' '}
                          %){' '}
                        </b>
                        <br />
                        <b>
                          SGST ({' '}
                          {parseInt(
                            ((parseFloat(invoiceData[0].total_tax) /
                              parseFloat(invoiceData[0].total_amount)) *
                              100) /
                              2
                          )}{' '}
                          %)
                        </b>
                      </>
                    )}
                  </td>
                  <td className="preview-th-td"></td>
                  <td className="preview-th-td">
                    {' '}
                    {invoiceData[0].place_of_supply === 'InterState' && (
                      <>
                        <br />
                        <b>{parseFloat(invoiceData[0].total_tax)}</b>
                      </>
                    )}
                    {invoiceData[0].place_of_supply === 'IntraState' && (
                      <>
                        <br />
                        <b>{parseFloat(invoiceData[0].total_tax) / 2}</b>
                        <br />
                        <b>{parseFloat(invoiceData[0].total_tax) / 2}</b>
                      </>
                    )}
                  </td>
                  {/* <td className="preview-th-td">{'        '}</td> */}
                </tr>

                <tr className="preview-tr">
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
                      <b>
                        {parseFloat(invoiceData[0].total_amount) +
                          parseFloat(invoiceData[0].total_tax)}
                      </b>
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
                      {invoiceData[0].inv_date}
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
              <img src={invoiceFooterImg} width="85%" alt="Loading..." />
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>

          <div id="id2" hidden>
            <div>
              <img src={invoiceHeaderImg} alt="Loading..." />
            </div>
            <br />
            <br />
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
                Date : {invoiceData[0].inv_date}
              </label>
            </div>
            <div style={{ textAlign: 'right' }}>
              <label
                style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}
              >
                Invoice No: {invoiceData[0].inv_no}
              </label>
              <br />
              <label
                style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}
              >
                GSTIN: {invoiceData[0].gst_no}
              </label>
              <br />
              <label
                style={{ paddingRight: 60, fontWeight: 'bold', fontSize: 15 }}
              >
                SAC Code: {invoiceSubData[0].hsn}
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
                {invoiceData[0].bill_address}
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
                <tr className="preview-tr">
                  <th className="preview-th-td">Sl No</th>
                  <th className="preview-th-td">Description</th>
                  <th className="preview-th-td">Qty</th>
                  <th className="preview-th-td"> Amount</th>
                  {/* <th className="preview-th-td">{'     bjhjghjgj   '}</th> */}
                </tr>

                {invoiceSubData.map((item, index) => {
                  return (
                    <tr className="preview-tr" key={index + 1}>
                      <td className="preview-th-td">{index + 1}</td>
                      <td className="preview-th-td">{item.description}</td>
                      <td className="preview-th-td">{item.qty}</td>
                      <td className="preview-th-td">{item.amount}</td>
                      {/* <td className="preview-th-td">{'        '}</td> */}
                    </tr>
                  );
                })}

                <tr className="preview-tr">
                  <td className="preview-th-td"></td>
                  <td className="preview-th-td">
                    {' '}
                    <b>GST</b>
                    <br />
                    {invoiceData[0].place_of_supply === 'InterState' && (
                      <b>
                        IGST ({' '}
                        {parseInt(
                          (parseFloat(invoiceData[0].total_tax) /
                            parseFloat(invoiceData[0].total_amount)) *
                            100
                        )}
                        %){' '}
                      </b>
                    )}
                    {invoiceData[0].place_of_supply === 'IntraState' && (
                      <>
                        <b>
                          CGST ({' '}
                          {parseInt(
                            ((parseFloat(invoiceData[0].total_tax) /
                              parseFloat(invoiceData[0].total_amount)) *
                              100) /
                              2
                          )}{' '}
                          %){' '}
                        </b>
                        <br />
                        <b>
                          SGST ({' '}
                          {parseInt(
                            ((parseFloat(invoiceData[0].total_tax) /
                              parseFloat(invoiceData[0].total_amount)) *
                              100) /
                              2
                          )}{' '}
                          %)
                        </b>
                      </>
                    )}
                  </td>
                  <td className="preview-th-td"></td>
                  <td className="preview-th-td">
                    {' '}
                    {invoiceData[0].place_of_supply === 'InterState' && (
                      <>
                        <br />
                        <b>{parseFloat(invoiceData[0].total_tax)}</b>
                      </>
                    )}
                    {invoiceData[0].place_of_supply === 'IntraState' && (
                      <>
                        <br />
                        <b>{parseFloat(invoiceData[0].total_tax) / 2}</b>
                        <br />
                        <b>{parseFloat(invoiceData[0].total_tax) / 2}</b>
                      </>
                    )}
                  </td>
                  {/* <td className="preview-th-td">{'        '}</td> */}
                </tr>

                <tr className="preview-tr">
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
                      <b>
                        {parseFloat(invoiceData[0].total_amount) +
                          parseFloat(invoiceData[0].total_tax)}
                      </b>
                    </h4>{' '}
                  </td>
                  {/* <td className="preview-th-td">{'        '}</td> */}
                </tr>
              </table>
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
                      {invoiceData[0].inv_date}
                      <br />
                      <br />
                    </th>
                  </tr>
                </table>
              </div>
              <br></br>
            </div>
            <div>
              <img src={invoiceFooterImg} width="100%" alt="Loading..." />
            </div>
          </div>

          <footer className="invoice-footer">
            <p>
              <div style={{ alignItems: 'center', padding: 10 }} align="center">
                {/* <button
                  type="submit"
                  name="submit"
                  onClick={(e) => {
                    history.push({
                      pathname: '/dashboard_invoice',
                    });
                  }}
                  style={{
                    backgroundColor: 'green',
                    width: 100,
                  }}
                >
                  Back{' '}
                </button> */}
                &nbsp;
                <button
                  type="submit"
                  name="submit"
                  style={{ backgroundColor: 'green', width: 100 }}
                  onClick={(e) => {
                    prints('printrec');
                  }}
                >
                  Print
                </button>
              </div>
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Mail_preview;
