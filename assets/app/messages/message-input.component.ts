import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Message} from './message.model'
import {MessageService} from "./message.service";
@Component({
    selector:'app-message-input',
    templateUrl:'./message-input.component.html'
})
export class MessageInputComponent implements OnInit{
    message: Message;
    constructor(private messageService: MessageService){

    }
    onSubmit(form:NgForm){
       // console.log(form);
       if(this.message){
           //edit
           this.message.content=form.value.content;
           this.messageService.updateMessage(this.message)
           .subscribe(
            result=>console.log(result)
        );
           this.message=null;
       }
       else
        {
            const message = new Message(form.value.content, 'Sean');
            this.messageService.addMessage(message)
            .subscribe(
                data => console.log(data),
                error => console.log(error)
            );
        }
       
        form.resetForm();
    }
    onClear(form:NgForm){
        this.message=null;
        form.resetForm();
    }
    ngOnInit(){
        this.messageService.messageIsEdit.subscribe(
            (message: Message)=> this.message = message
        );
    }
}