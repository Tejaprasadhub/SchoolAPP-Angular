import { Component } from '@angular/core';
import { SessionTimeoutService } from './core/security/session-timeout.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CTCAPP';
  display:boolean = true;
  constructor(private sessionTimeoutService:SessionTimeoutService){

  }

  get countdownTimerText():string{
    if(!this.sessionTimeoutService.timeLeft || !this.timeoutWarningVisible) return "";

    var date= new Date(null);
    date.setSeconds(this.sessionTimeoutService.timeLeft); //specify value for seconds here
    return date.toISOString().substr(14,5);
  }

  get timeoutWarningVisible(): boolean{
    var result =  this.sessionTimeoutService.showWarning;
    
    return result;

  }

  KeepAlive(){
    if(!this.sessionTimeoutService.showWarning) return;
    this.sessionTimeoutService.resetTimer();
    // this.sessionTimeoutService.KeepAlive().subscribe(r=>{});
  }
}
