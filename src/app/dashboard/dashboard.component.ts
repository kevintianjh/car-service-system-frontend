import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';  
import { Router } from '@angular/router';
import { AddCarDialogComponent } from '../add-car-dialog/add-car-dialog.component';
import { Customer } from '../app.component';
import { AuthenticationService } from '../_services/authentication.service';
import { CarService } from '../_services/car.service';
import { DeleteCarDialogComponent } from '../delete-car-dialog/delete-car-dialog.component';
import { EditCarDialogComponent } from '../edit-car-dialog/edit-car-dialog.component';
import { ManageServiceDialogComponent } from '../manage-service-dialog/manage-service-dialog.component';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html', 
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  customerName:string = "";  
  carList:Array<Car> = []; 
  displayTable:boolean = false; 
   
  constructor(private _carService:CarService,  
              private _authService:AuthenticationService,
              private dialog:MatDialog,
              public router:Router) {} 

  ngOnInit() { 
    if(this._authService.isCredentialsEmpty() || !this._authService.isCustomerRole()) {
      this.router.navigate(['login', {'expired': '1'}]);
      return;
    } 

    this.displayTable = false;
    this.carList = [];

    this._carService.getCars().subscribe(
      (data:any) => { 
        if(data.header_rsp == "ok") { 
          this.customerName = data.customer.name;

          for(var i of data.cars) {
            this.carList.push(new Car(i.id, i.registration, i.model, i.type, i.serviceRequest, i.serviceStatus, new Customer(i.customer.username)));
          } 

          this.displayTable = true; 
        }
        else {
          this.router.navigate(['login', {'expired': '1'}]);
        }
      },
      (error) => {
        this.router.navigate(['login', {'error': '1'}]);
      }
    );
  }

  manageService(carId:number): void {
    var selectedCar = null;
    selectedCar = this.carList.find((element:Car) => {
      if(element.id == carId) {
        return true;
      }
      else {
        return false;
      }
    });

    if(selectedCar == null) {
      return;
    }

    this.dialog.open(ManageServiceDialogComponent, {
      disableClose: true,
      data: {
        ref: this,
        selectedCar: selectedCar
      }
    });
  }

  removeFromList(delCar: Car):void {
    var selectedIndex:any = -1;

    for(var i in this.carList) {
      if(this.carList[i].id == delCar.id) {
        selectedIndex = i; 
        break;
      }
    }

    if(selectedIndex != -1) {
      this.carList.splice(selectedIndex, 1);
    }
  }
 
  logout(): void { 
    this.router.navigate(['login', {'logout': '1'}]);
  }

  delete(carId: number) {
    var selectedCar = null;
    selectedCar = this.carList.find((element:Car) => {
      if(element.id == carId) {
        return true;
      }
      else {
        return false;
      }
    });

    if(selectedCar == null) {
      return;
    }

    this.dialog.open(DeleteCarDialogComponent, {
      disableClose: true,
      data: {
        ref: this,
        selectedCar: selectedCar
      }
    });
  }
  
  update(carId:number) { 
    var selectedCar = null;
    selectedCar = this.carList.find((element:Car) => {
      if(element.id == carId) {
        return true;
      }
      else {
        return false;
      }
    });

    if(selectedCar == null) {
      return;
    }
 
    this.dialog.open(EditCarDialogComponent, {
      disableClose: true,
      data: {
        ref: this,
        selectedCar: selectedCar
      }
    });
  }

  add() { 
    this.dialog.open(AddCarDialogComponent, {
      disableClose: true,
      data: {
        ref: this
      }
    });
  }
}

export class Car { 
  constructor(public id:number, 
              public registration:string, 
              public model:string, 
              public type:string, 
              public serviceRequest:string, 
              public serviceStatus:string,
              public customer:Customer) { 
  }
}