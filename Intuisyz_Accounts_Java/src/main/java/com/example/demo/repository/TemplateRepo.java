package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.Invoice_sub;
import com.example.demo.model.Invoice_template;



public interface TemplateRepo extends CrudRepository<Invoice_template,Integer>{
	
	
String ss3="select * from invoice_template where company_name=?1";
	
	@Query(nativeQuery =true, value=ss3)
	List<Invoice_template> templateDatas(String CompanyName,String CustId);

}
