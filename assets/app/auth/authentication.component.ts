import { AuthService } from './auth.service';
import {Component} from "@angular/core";
@Component({
    selector:'app-authentication',
    templateUrl:'./authentication.component.html'
})
export class AuthenticationComponent{
    constructor(private authService: AuthService){

    }
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }
}