import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
 
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  username:string = "";
  password:string = "";
  cfm_password:string = "";
  cust_name:string="";
  email:string="";
 
  username_error:string = "";
  password_error:string = "";
  cfm_password_error:string = "";
  cust_name_error:string = "";
  email_error:string = "";
 
  checking_un_avail:boolean = false;
  registering_cust:boolean = false;

  error:string = "";

  constructor(private _authService:AuthenticationService,
              private router:Router) {}
   
  register(): void {  
    this.error = ""; 
    this.validateUsername();
    this.validatePw();
    this.validateCfmPw();
    this.validateCustName();
    this.validateEmail();

    var validSts = this.username_error == "" && this.password_error == "" &&
    this.cfm_password_error == "" && this.cust_name_error == "" &&
    this.email_error == ""; 

    if(!validSts) {
      return;
    }

    this.registering_cust = true;

    this._authService.register(this.username, this.password, this.cust_name, this.email)
    .subscribe(
      (data:any)=> {
        if(data.header_rsp == "ok") {
          if(data.register_success == "yes") {
            this.router.navigate(['/login', {success: "1"}]);
            return;
          }
          else {
            this.username_error = "Username not available, choose another one";
          }
        }
        else {
          this.error = "Opps! We ran into some problems, please try again";
        }

        this.registering_cust = false;
      },
      (error)=> {
        this.error = "Opps! We ran into some problems, please try again";
        this.registering_cust = false;
      }
    );
  }
    
  validateEmail(): void { 
    this.email = this.email.trim();

    if(this.email.length == 0) {
      this.email_error = "Email cannot be blank";  
      return;
    } 

    var regexTest = /^(?=.{1,30}$)[a-z0-9\._-]+@[a-z0-9-]+\.[a-z]+(\.[a-z]+)?$/; 

    if(!regexTest.test(this.email)) {
      this.email_error = "Email must be proper format and all lowercase";  
      return;
    } 

    this.email_error = ""; 
  }

  validateCustName(): void {
    this.cust_name = this.cust_name.trim();

    if(this.cust_name.length == 0) {
      this.cust_name_error = "Name cannot be blank";  
      return;
    } 

    var regexTest = /^[a-zA-Z ]{1,30}$/;

    if(!regexTest.test(this.cust_name)) {
      this.cust_name_error = "Name can only contain alphabets and space, max 30 chars";  
      return;
    }  
    
    this.cust_name_error = ""; 
  }

  validateCfmPw(): void {  
    if(this.cfm_password == "" || this.cfm_password !== this.password) {
      this.cfm_password_error = "Please confirm your password correctly";  
      return; 
    } 

    this.cfm_password_error = "";  
  }

  validatePw(): void { 
    if(this.password.length == 0) {
      this.password_error = "Password cannot be blank";  
      return;
    } 

    if(this.password.length < 8) {
      this.password_error = "Password must be 8-20 chars"; 
      return;
    } 

    this.password_error = "";  
  }

  validateUsername(full=false):void { 
    this.username = this.username.trim(); 

    if(this.username.length == 0) {
      this.username_error = "Username cannot be blank";  
      return;
    } 

    var regexTest = /^[\.0-9a-z_-]{8,20}$/;   

    if(!regexTest.test(this.username)) {
      this.username_error = "Username must be 8-20 chars, all lowercase, numbers, -, _ only"; 
      return;
    }  

    if(full) { 
      this.checking_un_avail = true; 
      this._authService.isUsernameAvail(this.username).subscribe(
        (data:any)=> {
          if(data.header_rsp == "ok") {
            if(data.is_username_avail == "yes") {
              this.username_error = "";
            }  
            else {
              this.username_error = "Username not available, choose another one"; 
            } 

            this.checking_un_avail = false; 
          }
        } ,
        (error)=> { 
          this.username_error = ""; 
          this.checking_un_avail = false;
        }
      )
    } 
  }
}