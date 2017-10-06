import { ErrorService } from './errors/error.service';
import { ErrorComponent } from './errors/error.component';
import { AuthService } from './auth/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from "./app.component";

import {AuthenticationComponent} from "./auth/authentication.component";
import {HeaderComponent} from "./header.component";
import {routing} from "./app.routing";
import {HttpModule} from "@angular/http";
import {MessageModule} from "./messages/message.module";
@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        HeaderComponent,
        ErrorComponent
    ],
    imports: [BrowserModule,
        MessageModule,
        routing,
          HttpModule
        ],
        providers:[AuthService,ErrorService],
    bootstrap: [AppComponent]
})
export class AppModule {

}