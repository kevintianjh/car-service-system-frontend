import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { catchError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; 

@Injectable({
  providedIn: 'root'
}) 
export class AuthenticationService {   
  private role:string = "";
  private username:string = "";
  private expiry:string="";
  private signature:string="";

  baseHref:string = "http://localhost:8080"; 
 
  constructor(private http:HttpClient,
              private _cookieService:CookieService) {}
  
  getRole() {
    return this.role;
  }
  
  isCustomerRole():boolean {
    return this.role == "customer";
  } 

  isAdminRole():boolean {
    return this.role == "admin";
  }

  getUserName():string {
    return this.username;
  }

  clearCredentials():void {
    this.role = "";
    this.username = "";
    this.expiry = "";
    this.signature = "";
    this._cookieService.set("header_role", "");
    this._cookieService.set("header_username", "");
    this._cookieService.set("header_expiry", "");
    this._cookieService.set("header_signature", "");
  }

  isCredentialsEmpty():boolean {
    this.role = this._cookieService.get("header_role");
    this.username = this._cookieService.get("header_username");
    this.expiry = this._cookieService.get("header_expiry");
    this.signature = this._cookieService.get("header_signature");
 
    return (this.signature=="");
  }

  setCredentials(data:any) {
    this.role = data.header_role;
    this.username = data.header_username; 
    this.expiry = data.header_expiry;
    this.signature = data.header_signature;
    this._cookieService.set("header_role", this.role);
    this._cookieService.set("header_username", this.username);
    this._cookieService.set("header_expiry", this.expiry);
    this._cookieService.set("header_signature", this.signature);
  }  

  generateAuthParamsStr():string {
    var paramsStr = (new URLSearchParams(this.generateAuthHeaders())).toString();  
    return paramsStr;
  }

  generateAuthHeaders():any {
    var obj:any = {header_role: this.role, header_username:this.username, header_expiry:this.expiry, header_signature: this.signature};
    return obj;
  }
 
  login(username:string, password:string, role:string) { 
    var form_data = new FormData();
    form_data.append("username", username);
    form_data.append("password", password);
    form_data.append("role", role);

    return this.http.post(this.baseHref + "/authenticate", form_data).pipe(
      catchError((error) => {
        throw "ERROR"; 
      })
    );
  }  

  isUsernameAvail(username:string) { 
    var params = {username:username}; 
    return this.http.get(this.baseHref + "/check_un_avail", {params: params}).pipe(
      catchError((error) => { 
        throw "ERROR"; 
      })
    );
  }
  
  register(username:string, pw:string, name:string, email:string) {
    var params = {username:username, password:pw, name:name, email:email}; 
    return this.http.get(this.baseHref + "/register?", {params: params}).pipe(
      catchError((error) => {
        throw "ERROR"; 
      })
    );
  }
}