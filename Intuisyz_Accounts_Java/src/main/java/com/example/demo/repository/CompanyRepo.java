package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.Company;
import com.example.demo.model.Profile;

public interface CompanyRepo extends CrudRepository<Company,Integer>{
	
	
String ss3="select * from company";
	
	@Query(nativeQuery =true, value=ss3)
	List<Company> companyDatas();

}
