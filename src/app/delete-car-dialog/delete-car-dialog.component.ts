import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CarService } from '../_services/car.service';
import { Car, DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-delete-car-dialog',
  templateUrl: './delete-car-dialog.component.html',
  styleUrls: ['./delete-car-dialog.component.css']
})
export class DeleteCarDialogComponent {
  carId: number = 0;
  registration: string = "";
  model: string = "";
  type: string = "";

  displayBtns:string = "inline";
  displaySpinner:string = "none";
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: {ref: DashboardComponent, selectedCar:Car},
              public dialogRef: MatDialogRef<DeleteCarDialogComponent>,
              private _carService:CarService) {} 

  ngOnInit() {
    this.carId = this.data.selectedCar.id;
    this.registration = this.data.selectedCar.registration;  
    this.model = this.data.selectedCar.model;
    this.type = this.data.selectedCar.type;
  }

  delete(): void {
    this.data.ref.displayTable = false;
    this.displayBtns = "none";
    this.displaySpinner = "block";

    this._carService.delete(this.data.selectedCar).subscribe((data:any) => {
      if(data.header_rsp == "ok") {
        this.data.ref.removeFromList(this.data.selectedCar);
        this.data.ref.displayTable = true;
        this.dialogRef.close();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
