import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarService } from './_services/car.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { EditCarDialogComponent } from './edit-car-dialog/edit-car-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DeleteCarDialogComponent } from './delete-car-dialog/delete-car-dialog.component';
import { ManageServiceDialogComponent } from './manage-service-dialog/manage-service-dialog.component';
import { AddCarDialogComponent } from './add-car-dialog/add-car-dialog.component'; 
import { AuthenticationService } from './_services/authentication.service';
import { RegistrationComponent } from './registration/registration.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatToolbarModule} from '@angular/material/toolbar';  
import { MatDialogModule} from '@angular/material/dialog';   
import { AdminCarService } from './_services/admin-car.service';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatSelectModule } from '@angular/material/select';
import { AdminCustomersComponent } from './admin-customers/admin-customers.component';
import { CustomerService } from './_services/customer.service';  
import { CookieService } from 'ngx-cookie-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminChatComponent } from './admin-chat/admin-chat.component'; 
import { StompService } from './_services/stomp.service';
import { ChatComponent } from './chat/chat.component'; 
import { ChatService } from './_services/chat.service';
import { ChatUploadPopupComponent } from './chat-upload-popup/chat-upload-popup.component';
import { MatCardModule } from '@angular/material/card';
 
@NgModule({  
  declarations: [
    AppComponent, 
    EditCarDialogComponent,
    DashboardComponent,
    LoginComponent,
    DeleteCarDialogComponent,
    ManageServiceDialogComponent,
    AddCarDialogComponent,
    RegistrationComponent,
    AdminDashboardComponent,
    AdminCustomersComponent,
    AdminChatComponent,
    ChatComponent,
    ChatUploadPopupComponent
  ], 
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,  
    MatButtonModule,
    MatIconModule, 
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule
  ],
  providers: [CarService, AuthenticationService, AdminCarService, CustomerService,
    CookieService, StompService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule {} 
 