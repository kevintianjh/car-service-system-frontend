import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../app.component';
import { CarService } from '../_services/car.service';
import { Car, DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-add-car-dialog',
  templateUrl: './add-car-dialog.component.html',
  styleUrls: ['./add-car-dialog.component.css']
})
export class AddCarDialogComponent {  
  disabledControls:boolean = false; 

  regisBox:string = ""; 
  modelBox:string = ""; 
  typeValue:string="";

  errors:Array<string> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {ref: DashboardComponent},
              public dialogRef: MatDialogRef<AddCarDialogComponent>,
              private _carService:CarService) {} 

  add():void { 
    this.errors = [];

    this.regisBox = this.regisBox.trim();
    if(this.regisBox.length == 0) {
      this.errors.push("Registration cannot be blank"); 
    }

    this.modelBox = this.modelBox.trim();
    if(this.modelBox.length == 0) {
      this.errors.push("Model cannot be blank"); 
    }

    if(this.typeValue == "") {
      this.errors.push("Type cannot be blank"); 
    }

    if(this.errors.length != 0) {
      return;
    }

    var newCar = new Car(0, this.regisBox, this.modelBox, this.typeValue, "", "1", new Customer(""));
 
    this.disabledControls = true;
    this.data.ref.displayTable = false;

    this._carService.add(newCar).subscribe((data:any) => { 
      if(data.header_rsp == "ok") {
        newCar.id = data.car.id;
        this.data.ref.carList.push(newCar);
        this.data.ref.displayTable = true;
        this.dialogRef.close();
      }
    }); 
  }

  cancel(): void {
    this.dialogRef.close();
  }
}