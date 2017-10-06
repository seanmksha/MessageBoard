import { AuthService } from './auth.service';
import {Component, OnInit} from "@angular/core";
import {FormGroup, FormControl,Validators} from "@angular/forms";
import {User} from "./user.model";
import {AbstractControl} from '@angular/forms';
@Component({
    selector:'app-signup',
    templateUrl:'./signup.component.html'
})
export class SignupComponent implements OnInit{
    myForm: FormGroup;
    constructor(private authService: AuthService){

    }
    onSubmit(){
        const user = new User(this.myForm.value.email, this.myForm.value.password,
            this.myForm.value.firstName, this.myForm.value.lastName,
            this.myForm.value.username);
        console.log(this.myForm);
        this.authService.signup(user)
        .subscribe(
            data=>console.log(data),
            error=> console.error(error)
        );
        this.myForm.reset();
    }
    MatchPassword(AC: AbstractControl){
    
        if(AC.get('password') && AC.get('password2'))
            {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('password2').value; // to get value in input tag
        
         if(password != confirmPassword) {
             console.log('false');
             AC.get('password2').setErrors( {MatchPassword: true} )
         } else {
             console.log('true');
             return null;
         }
        }
    }
    ngOnInit(){
        this.myForm = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*")
            ]),
            password: new FormControl(null, Validators.required),
            password2: new FormControl(null, [Validators.required,this.MatchPassword]),
            username: new FormControl(null,Validators.required)
        });
    }
    
}