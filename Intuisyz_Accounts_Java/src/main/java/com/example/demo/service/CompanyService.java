package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Account_title_v3;
import com.example.demo.model.Account_user_v3;
import com.example.demo.model.Company;
import com.example.demo.repository.AcTitleRepo;
import com.example.demo.repository.CompanyRepo;

@Service
public class CompanyService {
	
	@Autowired
	private CompanyRepo companyRepo;
	
	
	
	
	 public Company addCompanys(Company fp) {

		
		 companyRepo.save(fp);
		   	    
			return null;
		}
	
	
	
	
	
	public List<Company> companyLists() {
		// TODO Auto-generated method stub
		
		List<Company> list=(List<Company>) companyRepo.companyDatas();
		
		return list;
	}

}
