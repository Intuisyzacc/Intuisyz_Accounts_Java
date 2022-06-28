package com.example.demo.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Account_user_v3;
import com.example.demo.model.Profile;
import com.example.demo.repository.AcTitleRepo;
import com.example.demo.repository.UserRepo;



@Service
public class UserService {
	
	@Autowired
	private UserRepo userRepo;
	
	public String login(String userName,String password) {
		// TODO Auto-generated method stub
		
		String result = "";
		
		List<Account_user_v3> li=(List<Account_user_v3>) userRepo.logins(userName,password);
		
		System.out.println("li val "+li.size());
		
		if(0<li.size())
		  {
			 result=li.get(0).getPassword();
			
	      }
		  else
		  {
		      result="not success";
		       	  
		   }
		
//		if(0<li.size())
//		{
//			System.out.println("Inside loop");
//			
//		  for(int i=0; i < li.size() ; i++)
//		  {
//			  System.out.println("Inside loop no "+i);
//			  
//			  if(li.get(i).getUser_name().equals(userName) && li.get(i).getPassword().equals(password))
//              {
//            	  result="success";
//	
//              }
//			  else
//		      {
//		       	  result="not success";
//		       	  
//		      }
//             
//		  }
//
//			
//		}
//		 else
//         {
//       	  result="not success";
//       	  
//         }
		  
		System.out.println("result "+result);
		
		return result;
	}
	
	
	public List<Account_user_v3> userSearchs(String userName) {
	
		List<Account_user_v3> li=(List<Account_user_v3>) userRepo.userSearch(userName);
		
		return li;
	}
		
	
	public List<Account_user_v3> userLists() {
		
		List<Account_user_v3> li=(List<Account_user_v3>) userRepo.userList();
		
		return li;
	}
	
	 public Account_user_v3 addUsers(Account_user_v3 fp) {
		 
//		 String uniqueID = UUID.randomUUID().toString();
//		 fp.setCust_id(uniqueID);
		
			
		 userRepo.save(fp);
		   	    
			return null;
		}
	
	
	 
		public String userDeletes(int id) {
			
			userRepo.deleteById(id);
			// TODO Auto-generated method stub
			return "Deleted successfully";
		}
		
		
		public List<Account_user_v3> userSearchByIds(int id) {
			
			List<Account_user_v3> li=(List<Account_user_v3>) userRepo.userSearchById(id);
			
			return li;
		}
			
	
		
		public List<Account_user_v3> loginDetail(String userName,String password) {
			// TODO Auto-generated method stub
			
			
			
			List<Account_user_v3> li=(List<Account_user_v3>) userRepo.logins(userName,password);
	
			
			return li;
		}
		
		
		public List<Account_user_v3> companySearchs(String companyName) {
			// TODO Auto-generated method stub
			
			
			
			List<Account_user_v3> li=(List<Account_user_v3>) userRepo.companySearch(companyName);
	
			
			System.out.print("company name list "+li.size());
			
			return li;
		}
		
		
		
}
