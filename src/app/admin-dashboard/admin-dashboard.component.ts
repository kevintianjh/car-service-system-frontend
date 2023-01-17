import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminCarService } from '../_services/admin-car.service';
import { Customer } from '../app.component';
import { AuthenticationService } from '../_services/authentication.service';
import { Car } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent { 
  carList:Array<Car> = [];
  usernameFilter:string = "";
  svcStsFilter:string = "0";
  currentPage = 1;
  totalPages:Array<number> = [];
  pageLoading = false; 
  changeFlags:Array<boolean> = [];
  updateInProgressFlags:Array<boolean> = [];  
 
  constructor(public router:Router,
              private _adminCarService:AdminCarService,
              private _snackBar:MatSnackBar,
              private _authService:AuthenticationService) {}

  ngOnInit() {
    if(this._authService.isCredentialsEmpty() || !this._authService.isAdminRole()) {
      this.router.navigate(['login', {'expired': '1'}]);
      return;
    } 

    this.changePage(1);
  }  
 
  changePage(pageNo=1) {
    this.pageLoading = true;
 
    this._adminCarService.load(pageNo, this.svcStsFilter, this.usernameFilter).subscribe(
      (data:any) => {
        if(data.header_rsp=="ok") {  
          this.currentPage = pageNo;
          this.totalPages = [];
          this.carList = [];
          this.changeFlags = [];
          this.updateInProgressFlags = [];
          
          for(let i=1; i<=data.total_pages; i++) {
            this.totalPages.push(i);
          }

          for(var i of data.cars) {
            this.carList.push(new Car(i.id, i.registration, i.model, i.type, i.serviceRequest, i.serviceStatus, new Customer(i.customer.username)));
            this.changeFlags.push(false);
            this.updateInProgressFlags.push(false);
          } 
        }
        else {
          this.router.navigate(['login', {'expired': '1'}]); 
          return;
        }

        this.pageLoading = false;
      },
      (error) => {
        this.pageLoading = false;  
        this.router.navigate(['login', {'expired': '1'}]); 
      } 
    );
  }

  batchUpdateStatus() { 
    var ids:Array<any> = [];
    var svcStatuses:Array<any> = [];

    for(let i = 0; i<this.changeFlags.length; i++) {
      if(this.changeFlags[i]) {
        this.updateInProgressFlags[i] = true;
        ids.push(this.carList[i].id);
        svcStatuses.push(this.carList[i].serviceStatus);
      }
    }

    if(ids.length == 0) {
      return;
    }

    this._adminCarService.update(ids, svcStatuses).subscribe(
      (data:any) => {
        if(data.header_rsp=="ok") {
          this.setChangeFlagsToFalse();
          this._snackBar.open('Successfully updated!', '', {
            duration: 2000 
          });
        }
        else {
          this.router.navigate(['login', {'expired': '1'}]); 
          return;
        }

        this.setUpdateInProgressFlagsToFalse();
      },
      (error) => {
        this._snackBar.open('Failed to update, please try again', 'Close');
        this.setUpdateInProgressFlagsToFalse();
      }
    ) 
  }

  private setChangeFlagsToFalse() {
    for(let i=0; i<this.changeFlags.length; i++) {
      this.changeFlags[i] = false;
    }
  }

  private setUpdateInProgressFlagsToFalse() {
    for(let i=0; i<this.updateInProgressFlags.length; i++) {
      this.updateInProgressFlags[i] = false;
    }
  }

  updateStatus(i:number):void { 
    this.updateInProgressFlags[i] = true;

    this._adminCarService.update([this.carList[i].id], [this.carList[i].serviceStatus]).subscribe(
      (data:any) => {
        if(data.header_rsp == "ok") {
          this.changeFlags[i] = false; 
          this._snackBar.open('Successfully updated!', '', {
            duration: 2000 
          });
        }
        else {
          this.router.navigate(['login', {'expired': '1'}]); 
          return;
        }

        this.setUpdateInProgressFlagsToFalse();
      },
      (error) => {
        this._snackBar.open('Failed to update, please try again', 'Close');
        this.setUpdateInProgressFlagsToFalse();
      }
    ) 
  } 

  isUpdateInProgress():boolean {
    var ret = false; 
    this.updateInProgressFlags.forEach((i)=> {
      if(i == true) {
        ret = true; 
      }
    });
 
    return ret;
  } 

  svcStsRadioUpdate(i:number, newVal:string) {
    this.carList[i].serviceStatus = newVal;
    this.changeFlags[i] = true;
  }

  navigateToManageCustomers() {
    this.router.navigateByUrl("admin/customers");
  }

  logout():void {
    this.router.navigate(['login', {'logout': '1'}]);
  } 

  openChat() {
    window.open("/admin/chat", '_blank');
  }
}