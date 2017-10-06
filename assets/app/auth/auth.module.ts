import { authRouting } from './auth.routing';
import { ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';
import { SignupComponent } from './signup.component';
import { SigninComponent } from './signin.component';
import {NgModule} from '@angular/core';

@NgModule({
    declarations:[
        SigninComponent,
        SignupComponent,
        LogoutComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        authRouting
    ]
})
export class AuthModule{

}