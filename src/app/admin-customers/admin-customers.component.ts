import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Customer } from '../app.component';
import { AuthenticationService } from '../_services/authentication.service';
import { CustomerService } from '../_services/customer.service';

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.css']
})
export class AdminCustomersComponent {
  currentPage = 1;
  totalPages:Array<number> = [];
  pageSize:string = "10";
  pageLoading:boolean = false;
  customerList:Array<Customer> = [];
  usernameFilter:string = "";
  emailFilter:string = "";

  updateInProgress = false;
  updateFlags:Array<boolean> = [];
 
  updatedName = "";
  updatedEmail = "";

  nameError = "";
  emailError = "";

  constructor(private _custService:CustomerService,
              public router: Router,
              private _authService:AuthenticationService,
              private snackBar:MatSnackBar) {}

  ngOnInit() {
    if(this._authService.isCredentialsEmpty() || !this._authService.isAdminRole()) {
      this.router.navigate(['login', {expired: '1'}]);
      return;
    }

    this.changePage();
  }

  changePage(page=1) {
    this.pageLoading = true;

    this.usernameFilter = this.usernameFilter.trim().toLowerCase();
    this.emailFilter = this.emailFilter.trim().toLowerCase();
 
    this._custService.load(page, this.pageSize, this.usernameFilter, this.emailFilter).subscribe(
      (data:any) => {
        if(data.header_rsp == "ok") {
          this.currentPage = page; 
           
          this.customerList = []; 
          for(let i of data.customers) {
            let c = new Customer(i.username);
            c.name = i.name;
            c.email = i.email;
            this.customerList.push(c);
            this.updateFlags.push(false);
          } 

          this.totalPages = [];
          for(let i=1; i<=data.total_pages; i++) {
            this.totalPages.push(i);
          }

          this.pageLoading = false;
        }
        else {
          this.router.navigate(['login', {expired: '1'}]); 
        }
      },
      (error) => {
        this.router.navigate(['login', {expired: '1'}]);
      }
    )
  }

  processUpdate(i:number) {
    if(this.nameError != "" || this.emailError != "") {
      return;
    }

    this._custService.update(this.customerList[i].username, this.updatedName, this.updatedEmail).subscribe(
      (data:any) => {
        if(data.header_rsp == "ok") {
          this.customerList[i].name = this.updatedName;
          this.customerList[i].email = this.updatedEmail; 
          this.cancelUpdate(i);
          this.snackBar.open("Successfully updated!", "", {
            duration: 2000
          });
        }
        else {
          this.router.navigate(['login', {expired: '1'}]);
        }
      },
      (error) => {
        this.router.navigate(['login', {expired: '1'}]);
      }
    );
  }

  initUpdate(i:number) { 
    this.updatedName = this.customerList[i].name;
    this.updatedEmail = this.customerList[i].email;
    this.updateFlags[i] = true;
    this.updateInProgress = true;
  } 

  cancelUpdate(i:number) {
    this.updateInProgress = false;
    this.updateFlags[i] = false; 
    this.updatedName = "";
    this.updatedEmail = "";
    this.nameError = "";
    this.emailError = "";
  }

  validateEmail(): void { 
    this.updatedEmail = this.updatedEmail.trim().toLowerCase();

    if(this.updatedEmail.length == 0) {
      this.emailError = "Email cannot be blank";  
      return;
    } 

    var regexTest = /^(?=.{1,30}$)[a-z0-9\._-]+@[a-z0-9-]+\.[a-z]+(\.[a-z]+)?$/; 

    if(!regexTest.test(this.updatedEmail)) {
      this.emailError = "Email must be proper format and all lowercase";  
      return;
    } 

    this.emailError = ""; 
  }

  validateName(): void {
    this.updatedName = this.updatedName.trim();

    if(this.updatedName.length == 0) {
      this.nameError = "Name cannot be blank";  
      return;
    } 

    var regexTest = /^[a-zA-Z ]{1,30}$/;

    if(!regexTest.test(this.updatedName)) {
      this.nameError = "Name can only contain alphabets and space, max 30 chars";  
      return;
    }  
    
    this.nameError = ""; 
  }

  nagivateToDashboard() {
    this.router.navigateByUrl("admin/dashboard");
  }

  logout() {
    this.router.navigate(['login', {logout: '1'}]);
  }
}