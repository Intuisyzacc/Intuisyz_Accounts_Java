package com.example.demo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="account_user_v3")
public class Account_user_v3 {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	private String user_id;
	private String user_name;
	private String password;
	private String user_type;
	private String company_name;
	private String cust_id;
	private String cashId;
	private String gstId;
	private String tdsId;
	
	
	public Account_user_v3()
	{
	
		
	}







	public Account_user_v3(int id, String user_id, String user_name, String password, String user_type,
			String company_name, String cust_id, String cashId, String gstId, String tdsId) {
		super();
		this.id = id;
		this.user_id = user_id;
		this.user_name = user_name;
		this.password = password;
		this.user_type = user_type;
		this.company_name = company_name;
		this.cust_id = cust_id;
		this.cashId = cashId;
		this.gstId = gstId;
		this.tdsId = tdsId;
	}











	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public String getUser_id() {
		return user_id;
	}


	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}


	public String getUser_name() {
		return user_name;
	}


	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}





	public String getUser_type() {
		return user_type;
	}





	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}




	public String getCompany_name() {
		return company_name;
	}




	public void setCompany_name(String company_name) {
		this.company_name = company_name;
	}




	public String getCust_id() {
		return cust_id;
	}



	public void setCust_id(String cust_id) {
		this.cust_id = cust_id;
	}







	public String getCashId() {
		return cashId;
	}







	public void setCashId(String cashId) {
		this.cashId = cashId;
	}







	public String getGstId() {
		return gstId;
	}







	public void setGstId(String gstId) {
		this.gstId = gstId;
	}







	public String getTdsId() {
		return tdsId;
	}







	public void setTdsId(String tdsId) {
		this.tdsId = tdsId;
	}

	
	

	
	
}
