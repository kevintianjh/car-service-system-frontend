import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CarService } from '../_services/car.service';
import { Car, DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-manage-service-dialog',
  templateUrl: './manage-service-dialog.component.html',
  styleUrls: ['./manage-service-dialog.component.css']
})
export class ManageServiceDialogComponent { 
  isLoading:boolean = false;

  carId:number = 0;
  registration:string = "";
  serviceStatus:string = "";
  serviceRequest:string = "";

  errors:Array<String> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {ref: DashboardComponent, selectedCar:Car},
              public dialogRef: MatDialogRef<ManageServiceDialogComponent>,
              private _carService:CarService) {}

  ngOnInit() {
    this.refresh();
  }
  
  refresh(): void {
    this.carId = this.data.selectedCar.id;
    this.registration = this.data.selectedCar.registration; 
    this.serviceRequest = this.data.selectedCar.serviceRequest;
 
    var index:string = this.data.selectedCar.serviceStatus;

    if(index == "1") {
      this.serviceStatus = "None";
    }
    else if(index == "2" ){
      this.serviceStatus = "Received";
    }
    else if(index == "3" ){
      this.serviceStatus = "Ongoing";
    }
    else if(index == "4" ){
      this.serviceStatus = "Completed";
    }
  } 

  requestService(): void {
    this.errors = []; 
    this.serviceRequest = this.serviceRequest.trim();

    if(this.serviceRequest.length == 0) {
      this.errors.push("Service request cannot be blank");
      return;
    }
    else if(this.serviceRequest.length > 100) {
      this.errors.push("Service request cannot be more than 100 chars");
      return;
    }

    this.data.selectedCar.serviceStatus = "2";
    this.data.selectedCar.serviceRequest = this.serviceRequest; 

    this.data.ref.displayTable = false;
    this.isLoading = true;

    this._carService.update(this.data.selectedCar).subscribe((data:any) => {
      if(data.header_rsp == "ok") {
        this.refresh();
        this.dialogRef.close();
        this.data.ref.displayTable = true;  
      }
    }); 
  } 

  acknowledge(): void {
    this.data.selectedCar.serviceStatus = "1";
    this.data.selectedCar.serviceRequest = "";

    this.data.ref.displayTable = false;
    this.isLoading = true;

    this._carService.update(this.data.selectedCar).subscribe((data:any) => {
      if(data.header_rsp == "ok") { 
        this.dialogRef.close();
        this.data.ref.displayTable = true;  
      } 
    }); 
  }

  close(): void {
    this.dialogRef.close();
  }
}
