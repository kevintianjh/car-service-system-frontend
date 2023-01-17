import { Component } from '@angular/core'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {} 

export class Customer {
  public username:string = "";
  public name:string = "";
  public email:string = "";

  constructor(username:string) {
    this.username = username;
  } 
}
