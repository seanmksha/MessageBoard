import { ErrorService } from './../errors/error.service';
import {Message} from "./message.model";
import {Http,Response, Headers} from "@angular/http";
import {Injectable,EventEmitter} from "@angular/core";
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class MessageService{
    private messages:Message[]=[];
    messageIsEdit = new EventEmitter;

    constructor(private http: Http, private errorService:ErrorService)
    {

    }

    addMessage(message: Message){
        const body = JSON.stringify(message);
        const headers= new Headers({'Content-Type':'application/json'});
        const token = localStorage.getItem('token') 
        ? '?token=' + localStorage.getItem('token')
        : '';
        return this.http.post('http://localhost:6000/api/message'+token,body,{headers:headers})
            .map((response: Response)=> {
                const result = response.json();
                console.log(result.obj);
                const message = new Message(result.obj.content, 
                    result.obj.username, 
                    result.obj._id, 
                    result.obj.user);
                this.messages.push(message);
                return message;
            })
            .catch((error:Response)=>{
                this.errorService.handleError(error.json()); 
                return Observable.throw(error.json());
            });
    }

    getMessage(){
        return this.http.get('http://localhost:6000/api/message')
        .map((response: Response)=> {
            const messages = response.json().obj;
            let transformedMessages: Message[]=[];
            for(let message of messages){
                console.log()
                transformedMessages.push(new Message(
                    message.content,  
                    message.username,
                    message._id,
                    message.user._id));
            }
            this.messages=transformedMessages;
            return transformedMessages;
        })
        .catch((error:Response)=>{
            this.errorService.handleError(error.json()); 
            return Observable.throw(error.json());
        });
    }

    updateMessage(message:Message){
        const body = JSON.stringify(message);
        const headers= new Headers({'Content-Type':'application/json'});
        const token = localStorage.getItem('token') 
        ? '?token=' + localStorage.getItem('token')
        : '';
        return this.http.patch('http://45.33.40.106:6000/api/message/'+message.messageId+token,body,{headers:headers})
            .map((response: Response)=> response.json())
            .catch((error:Response)=>{
                this.errorService.handleError(error.json()); 
                return Observable.throw(error.json());
            });
    }

    editMessage(message:Message){
        this.messageIsEdit.emit(message);
    }

    deleteMessage(message:Message){
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token') 
        ? '?token=' + localStorage.getItem('token')
        : '';
        return this.http.delete('http://45.33.40.106/app2/api/message/'+message.messageId+token)
        .map((response: Response)=> response.json())
        .catch((error:Response)=>{
            this.errorService.handleError(error.json()); 
            return Observable.throw(error.json());
        });
    }


}