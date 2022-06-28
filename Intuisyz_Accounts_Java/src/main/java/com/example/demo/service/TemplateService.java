package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Invoice;
import com.example.demo.model.Invoice_template;
import com.example.demo.model.Profile;
import com.example.demo.repository.TemplateRepo;



@Service
public class TemplateService {
	
	
	@Autowired
	private TemplateRepo templateRepo;
	
	
	
	public Invoice_template add_Templates(Invoice_template fp) {
		
		templateRepo.save(fp);
		   	    
			return null;
		}
	
	
	
	
	 public List<Invoice_template> templateData(String CompanyName,String CustId)  {
	    	
	  	  
	    	List<Invoice_template> li=(List<Invoice_template>) templateRepo.templateDatas(CompanyName,CustId);
	    	
	    	  System.out.println("li "+ li.size());
	    	  
	    	  return li;
	    }
	
	

}
