import { Component } from '@angular/core';
import {MessageService} from "./messages/message.service";
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styles:[`
        
    `],
    providers: [MessageService]
})
export class AppComponent {

   
}