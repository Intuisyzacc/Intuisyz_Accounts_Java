package com.example.demo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="company")
public class Company {
	
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int company_id;
	private String 	company_name;
	
	
	public Company()
	{
	
		
	}


	public Company(int company_id, String company_name) {
		super();
		this.company_id = company_id;
		this.company_name = company_name;
	}


	public int getCompany_id() {
		return company_id;
	}


	public void setCompany_id(int company_id) {
		this.company_id = company_id;
	}


	public String getCompany_name() {
		return company_name;
	}


	public void setCompany_name(String company_name) {
		this.company_name = company_name;
	}
	
	
	
	
	

}
