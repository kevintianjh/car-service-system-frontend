import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Car, DashboardComponent } from '../dashboard/dashboard.component';
import {MatDialogRef} from '@angular/material/dialog'; 
import { CarService } from '../_services/car.service';

@Component({
  selector: 'app-edit-car-dialog',
  templateUrl: './edit-car-dialog.component.html',
  styleUrls: ['./edit-car-dialog.component.css']
})
export class EditCarDialogComponent { 
  carId: number = 0; 

  isLoading:boolean = false;

  regisBox:string = ""; 
  modelBox:string = ""; 
  typeValue:string="";

  errors:Array<string> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {ref: DashboardComponent, selectedCar:Car},
              public dialogRef: MatDialogRef<EditCarDialogComponent>,
              private _carService:CarService) {} 

  ngOnInit() {
    this.carId = this.data.selectedCar.id;
    this.regisBox = this.data.selectedCar.registration;  
    this.modelBox = this.data.selectedCar.model;
    this.typeValue = this.data.selectedCar.type;
  }
   
  update(): void {  
    //validate inputs
    this.errors = [];

    this.regisBox = this.regisBox.trim();
    if(this.regisBox.length == 0) {
      this.errors.push("Registration cannot be blank"); 
    }

    this.modelBox = this.modelBox.trim();
    if(this.modelBox.length == 0) {
      this.errors.push("Model cannot be blank"); 
    }

    if(this.errors.length != 0) {
      return;
    }
    
    this.isLoading = true;

    this.data.selectedCar.model = this.modelBox;
    this.data.selectedCar.registration = this.regisBox;
    this.data.selectedCar.type = this.typeValue;
   
    this.data.ref.displayTable = false;

    this._carService.update(this.data.selectedCar).subscribe((data:any) => {
      if(data.header_rsp == "ok") {
        this.cancel();
        this.data.ref.displayTable = true; 
      }
    });
  }  

  cancel(): void {
    this.dialogRef.close();
  }
}
