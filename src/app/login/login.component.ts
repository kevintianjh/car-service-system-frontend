import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']   
})
export class LoginComponent { 
  usertype:string = "customer";
  username:string = "";
  password:string = "";
  isLoading:boolean = false; 
  errors:Array<string> = []; 
  success:string = "";

  constructor(
    private _authService:AuthenticationService,
    private router:Router,
    private activatedRoute:ActivatedRoute) {} 

  ngOnInit() {
    if(this.activatedRoute.snapshot.paramMap.get("error") == "1") { 
      this.errors.push("Opps! We ran into some problems, please try to login again");
    }
    else if(this.activatedRoute.snapshot.paramMap.get("success") == "1") {
      this.success = "Registration success! Please login here";
    }
    else if(this.activatedRoute.snapshot.paramMap.get("logout") == "1") {
      this._authService.clearCredentials();
    }
    else if(this.activatedRoute.snapshot.paramMap.get("expired") == "1") {
      this._authService.clearCredentials();
      this.errors.push("You idle for too long, please login again");
    }
  } 

  login():void { 
    this.errors = []; 
    this.username = this.username.trim();

    if(this.username == "") {
      this.errors.push("Username cannot be empty")
    }

    if(this.password == "") {
      this.errors.push("Password cannot be empty"); 
    } 

    if(this.errors.length != 0) {
      return;
    }

    this.isLoading = true; 

    if(this.usertype == "customer") {
      this._authService.login(this.username, this.password, this.usertype).subscribe(
        (data:any) => {
          if(data.header_rsp == "ok") { 
            this._authService.setCredentials(data);
            this.router.navigateByUrl("dashboard");
          }
          else {
            this.errors.push("Incorrect login credentials");
            this.password = "";
            this.isLoading = false;
          }
        },
        (error:any) => { 
          this.errors.push("Opps! We ran into some problems, please try to login again");
          this.password = "";
          this.isLoading = false; 
        }
      ); 
    }
    else if(this.usertype == "admin") {
      this._authService.login(this.username, this.password, this.usertype).subscribe(
        (data:any) => {
          if(data.header_rsp == "ok") { 
            this._authService.setCredentials(data);
            this.router.navigateByUrl("admin/dashboard");
            return;
          }
          else {
            this.errors.push("Incorrect login credentials");
            this.password = "";
            this.isLoading = false;
          }
        },
        (error:any) => { 
          this.errors.push("Opps! We ran into some problems, please try to login again");
          this.password = "";
          this.isLoading = false; 
        }
      ); 
    } 
    
  }
}