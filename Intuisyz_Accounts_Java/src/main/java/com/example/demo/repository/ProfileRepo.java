package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.Invoice_template;
import com.example.demo.model.Profile;

public interface ProfileRepo extends CrudRepository<Profile,Integer>{
	
	
String ss3="select * from profile where company_name=?1";
	
	@Query(nativeQuery =true, value=ss3)
	List<Profile> profileDatas(String CompanyName,String CustId);

	
	

}
