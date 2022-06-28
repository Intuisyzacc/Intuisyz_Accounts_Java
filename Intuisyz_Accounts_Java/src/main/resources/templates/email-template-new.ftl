<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Java Techie Mail</title>

    <style>




.invoice-table {
  border-collapse: collapse;
  width: 100%;
}

.wrapperDiv {
  font-family:'Helvetica', 'Arial', sans-serif;
}


.actionButton {
  display: flex;
}

.invoice-th-td {
  text-align: left;
  padding: 4px;
}

.invoice-tr:nth-child(even) {
  background-color: #d6eeee;
}

.button-style {
  background-color: #04aa6d;
  border: none;
  color: white;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  border-radius: 8px;
}

.cl {
  border: 1px solid #ddd;
  padding: 6px;
  margin-bottom: 0;
  width: calc(100% - 40px);
}

.cl1 {
  padding: 6px 6px 7px 6px;
  margin-bottom: 0;
  border: 1px solid #ddd;
  text-decoration: none;
  border-left: 0;
}

.invoice-footer {
  text-align: center;

  background-color: rgb(36, 34, 33);
  color: white;
}

.preview-table {
  width: 100%;
  border: 1px solid black;
}

.preview-tr {
  padding: 4px;
  border: 1px solid black;
}

.preview-th-td {
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  padding: 1px 3px;
}

.preview-th-td p
  {
   font-size: 10px;
   padding:0;
   margin:0;
  }

.preview-th-td:nth-child(2) {
  min-width: 10px;
  max-width: 10px;
}

.preview-th-td.leftAlignTd {
  text-align: left;
}

.posRel {
  position: relative;
  min-width: 200px;
  min-height: 300px;
}

.posRel span {
  position: absolute;
  top: 5px;
  left: 8px;
}

.designationTxt,
.dateTxt {
  position: absolute;
  left: 8px;
  bottom: 5px;
}

.companyAddressSec {
  padding: 20px 0;
}

.companyAddressSec p,
.footerAddresses p {
  margin: 0;
  padding: 0;
}

#signImg,
#signImg2 {
  max-width: 65px;
  max-height: 65px;
  margin-top: 20px;
}





.preview-th-td.rightAlignTd {
  text-align: right;
}

.preview-footer-table {
  width: 100%;
  border: 1px solid #e5e5e5;
}

.brownbg {
  background-color: #969390;
}

.brownbg th {
  color: #fff;
}

.amountTd,
.amountTh {
  text-align: right;
}

.preview-footer-tr {
  padding: 8px;
  border: 1px solid #e5e5e5;
}

.preview-footer-th-td {
  text-align: left;
  border: 1px solid #e5e5e5;
  padding: 8px;
}


.datepickerStyle1 {
  text-align: left;
}

.datepickerStyle1 .react-datepicker-wrapper {
  width: 100%;
}



.invoice-footer button {
  margin: 20px 0px;
}



.invoice-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
}

.footerTable {
  margin: 40px 0;
}
.RightButtonsSec {
  margin-left: auto;
  padding: 20px 0;
}

.selectWrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: left;
  margin-right: 10px;
  margin-bottom: 10px;
}

.selectWrapper label {
  width: 100%;
  font-weight: normal;
}

.imgStyle {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.imgStyle h2 {
  padding: 0;
  margin: 10px 0 0 0;
  font-weight: bold;
}

.pad050 {
  padding: 0px 50px;
}
.pad2050 {
  padding: 20px 50px;
}

.pad2000 {
  padding: 0 0 20px 0;
}

.invoiceHeadOne {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 10px;
}

.AddressSection {
  display: flex;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 20px;
}

.AddressSection .BillToSection {
  padding: 0 20px 0 0;
  width: 25%;
}

.AddressSection h3 {
  font-weight: bold;
  padding: 10px 0;
  margin: 0;
  font-size: 1.5rem;
}
.InvoiceHeadOneRight p {
  text-align: right;
  padding: 0;
  margin: 0;
}
.InvoiceHeadOneRight p label {
  padding: 0;
  margin: 0;
}

.profile-footer {
  text-align: center;
  background-color: rgb(36, 34, 33);
  color: white;
}

.InvoiceDashBoardRightBtns {
  text-align: right;
}

.LinkBtns {
  text-align: center;
  padding: 0px 5px;
  cursor: pointer;
}

.actionButton button,
.RightButtonsSec button {
  margin: 0 2px;
  border: none;
  border-radius: 0.25rem;
  color: #fff;
  padding: 0.375rem 0.75rem;
}

.actionButton button.primary,
.RightButtonsSec button.primary {
  background: #04aa6d;
}
.actionButton button.primary:hover,
.RightButtonsSec button.primary:hover {
  background: #188d62 !important;
}

.actionButton button.secondary {
  background: #457fca !important;
}

.actionButton button.deletebtn {
  background: #ec3b57 !important;
}
.alignRight {
  text-align: right;
}

.alignLeft {
  text-align: left;
}

.designationCopy p {
  margin: 0;
  padding: 0;
}

.desigTxt {
  margin-top: 20px;
}
.footerAddresses {
  width: 100%;
  bottom: 0;
  display: none;
}

.companyAddressSec {
  display: none;
}

.TopAddress {
  text-align: left;
  margin-bottom: 20px;
}

.footerAddresses p,
.TopAddress p {
  text-align: left;
  margin: 0;
  padding: 0;
}
.footerAddresses p span {
  padding: 0 3px;
}

.DesiGnationandSign {
  margin: 60px 0;
}

.InvoiceHeadOneRight p {
  line-height: normal;
}

.amountTd h4 {
  font-size: 1.375rem;
  font-weight: bold;
  font-family: 'Helvetica', 'Arial', sans-serif;
}


.preview-table p
  {
   font-size: 11px;
   padding:0;
   margin:0;
  }





@media print {
  #navigation,
  Title {
    display: none;
  }

  .brownbg {
    display: none;
  }

  .wrapperDiv label,
  .wrapperDiv input,
  .wrapperDiv button,
  .wrapperDiv select,
  .wrapperDiv textarea,
  .footerAddresses p,
  .TopAddress p,
  .AddressSection p,
  .preview-table,
   {
    font-size: 11px;
  }
  
  .preview-table p
  {
   font-size: 11px;
   padding:0;
   margin:0;
  }
  
  .InvoiceHeadOneRight p {
    line-height: normal;
  }

  .amountTd h4 {
    font-size: 1.375rem;
    font-weight: bold;
    font-family:'Helvetica', 'Arial', sans-serif;
  }
}


#logoJava
{

 max-height: 60px;
}

    </style>
  </head>

  <body>
    <div>
    
           <div style="text-align:left ; display:flex; align-items:center; justify-content: space-between;">
             <div>
              <img
               <#-- src="C:\Users\SHERIN\git\JavaAccounts\Intuisyz_Accounts_Java\src\main\resources\image\${templateLogo}" -->
                
              src="\images/${templateLogo}" 
                alt="Loading..."
                style=" max-height:60px;"
                id="logoJava"
                height="60px"
              />
               </div>
               
               <div style="text-align:right; padding-top:-40px ; font-size: 30 ; font-family:''Helvetica', 'Arial', sans-serif' ;  font-weight: 500; padding-right: -10px ;">
                     <p>INVOICE</p>
               </div>
            </div>
        
        
        
                <div style=" padding-top: -15px; padding-left:-10px ; font-family:''Helvetica', 'Arial', sans-serif' ;">
                      <div class="TopAddress">
                        <p style="font-size: 11px;">
                            <#list templateCompanyAddress as item>
                               ${item}
                              <br/>
      			            </#list>
                         </p>
                         <p style="font-size: 11px;">
                            <#list templateCompanyContact as item>
                                ${item}
                              <br/>
      			            </#list>
                          </p>
                      </div>
                  </div>
                    
                    <div style=" padding-top: -45px; padding-right:-10px ;  border: 1px solid black; font-family:''Helvetica', 'Arial', sans-serif' ;">
                      <p style="  text-align: right; padding: 0; margin: 0;  line-height: normal; font-size: 11px;">
                        <label style=" padding: 0; margin: 0; font-weight: 600;">Date : ${invDate}</label>
                      </p>
                      <p style="  text-align: right; padding: 0; margin: 0; line-height: normal; font-size: 11px;">
                        <label style=" padding: 0; margin: 0; font-weight: 600;">Invoice No: ${invNo}</label>
                      </p>
                      <p style="  text-align: right; padding: 0; margin: 0; line-height: normal; font-size: 11px;">
                        <label style=" padding: 0; margin: 0; font-weight: 600;">GSTIN:  ${gstId}</label>
                      </p>
                      <p style="  text-align: right; padding: 0; margin: 0; line-height: normal; font-size: 11px;">
                        <label style=" padding: 0; margin: 0; font-weight: 600;">SAC Code: ${hsn}</label>
                      </p>
                    </div>
                 
              <hr style=" border: 1px solid black; color:#e5e5e5" width="103%"/>
              
     <table width="100%">
     
     <tr>
         <td  valign='top' width="30%">
                  <div  style=" font-size: 11px;" class="bill">
                      <label style="font-weight: 600;">Bill To</label>
                      <div style=" padding-top: 5px; font-size: 10px;  display:block; overflow:hidden; word-break:break-word;">
                        ${billAddress}
                      </div>
                      
                      <div style=" padding-top: 5px; font-size: 10px;">
                    
                    
                    <#if gstNo != ''>  <p style="font-size: 9.5px;"> GSTIN:  ${gstNo} </p> </#if>
                     </div>
                     </div>
          </td>
          <td  valign='top' width="70%">
                 <div  style=" font-size: 11px;" class="pay">
                      <label style="font-weight: 600;">Pay To</label>
                      <div  style=" float:left; padding-top: 5px; font-size: 10px; ">
                        <#list templateData as item>
                          <#if item != ''>
         					 ${item}
          					 <br/>
          				  </#if>
      					</#list>
                       
                      </div>
                    </div>
             </td>
         </tr>
     </table>
              
                   
                 
                  
                   <div style=" padding-left:-10px ; padding-right:-10px;">
                        <table cellpadding=4 cellspacing=0  style="font-size: 10px; width : 100%;"  >
                      <tr class="brownbg">
                        <th class="preview-th-td " style="width:2px"></th>
                        <th class="preview-th-td">Sl No</th>
                        <th class="preview-th-td alignLeft">Description</th>
                        <th class="preview-th-td">Qty</th>
                        <th class="preview-th-td alignRight"> Amount</th>                      
                      </tr>
      
                        <#list invoiceSubData as item>
                          <tr class="preview-tr">
                            <td class="preview-th-td brownbg" style="width:2px"></td>
                            <td class="preview-th-td"><p>${item?index+1}</p></td>
                            <td class="preview-th-td alignLeft">
                             <p>${item.description}</p>
                            </td>
                            <td class="preview-th-td"><p>${item.qty}</p></td>
                            <td class="preview-th-td alignRight">
                              <p>${item.amount}</p>
                            </td>                           
                          </tr>
                        </#list>

                      <tr class="preview-tr">
                        <td class="preview-th-td brownbg"></td>
                        <td class="preview-th-td"></td>
                        <td class="preview-th-td alignRight">
                           <b>GST</b>
                <br />
                <#if place_of_supply == 'InterState'>
                  
                    IGST (
                    ${igstAmnt}
                    %)
                 
                </#if>
              
                <#if place_of_supply == 'IntraState'>
              
                   
                      CGST (
                     ${cgstAmnt}
                      
                      %)
                    
                    <br />
                   
                      SGST (
                      ${sgstAmnt}
                     
                      %)
                   
                    
                 </#if>                       
                 </td>
                        <td class="preview-th-td"></td>
                        <td class="preview-th-td alignRight">
                           <#if place_of_supply == 'InterState'>
                           <br />
                    		 ${totalTaxAmnt} 
                		   </#if>
                 
                 			<#if place_of_supply == 'IntraState'>
                            <br />
                    		 ${totalTaxAmnt} 
                    		<br />
                    		 ${totalTaxAmnt} 
                 			</#if>
                        </td>                     
                      </tr>

                      <tr class="preview-tr">
                        <td class="preview-th-td brownbg"></td>
                        <td class="preview-th-td"></td>
                        <td class="preview-th-td alignRight amountTd" style="padding-top:10px">
                          <h4 style="font-size:13px;padding:0;margin:0; ">Total</h4>
                        </td>
                        <td class="preview-th-td"></td>
                        <td class="preview-th-td alignRight amountTd" style="padding-top:10px">
                          <h4 style="font-size:13px;padding:0;margin:0;">
                             ${totalAmnt}
                          </h4>
                        </td>
                      </tr>
                    </table>
                   </div>
                  
                  <br/>
                   <hr style=" border: 1px solid black; color:#e5e5e5" width="103%"/>
                  
                  <div style="padding-top:-15px;">
                      <table class="table">
                        <tr>
                          <td>
                            <div style="padding:0px 0px 20px 0px ;font-size:11px ;">
                              <span >Name</span>
                              
                             </div>
                              <div class="desigTxt">
                                <p style="font-size:11px ;">
                                  
                                    <#list templateName as item>
                   					   ${item}
                    				   <br/>
      			  					 </#list>
                                  
                                </p>
                             
                             
                            </div>
                          </td>
                          <td style="padding-left:300px">
                            <div style="padding:11px 0px 20px 0px ;font-size:11px ;">
                              <span>Signature</span>
                            </div>  
                              <div>
                                
                                 <img
                    				<#-- src="C:\Users\SHERIN\git\JavaAccounts\Intuisyz_Accounts_Java\src\main\resources\image\${templateSign}" -->
                					 src="\images/${templateSign}" 
                					alt="Loading..."  
                					class="signImgTwo"
                					style="width: 50%; "
                				  />
                              </div>
                            
                          </td>
                        </tr>
                      </table>
                    </div>
          
              </div>
        </body>
</html>
