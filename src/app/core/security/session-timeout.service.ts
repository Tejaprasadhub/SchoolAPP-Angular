import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { inflateSync } from 'zlib';
import { timer } from 'rxjs/internal/observable/timer';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {

  constructor(private router: Router) { }

  static countdown;
  static timerSubscription;

  private started: boolean = false;
  private sessionTime: number;
  private sessionWarning: number;

  timeLeft: number;

  get showWarning(): boolean {
    return this.started && this.timeLeft < this.sessionWarning;
  }

  get expired(): boolean {
    return this.started && this.timeLeft <= 0;
  }

  public startTimer(timeoutMinutes: number, warningMinutes: number) {
    if (this.started) return;

    this.started = true;

    this.sessionTime = timeoutMinutes * 60;
    this.sessionWarning = warningMinutes * 60;

    sessionStorage.setItem('sessionTime', this.sessionTime.toString());
    sessionStorage.setItem('sessionWarning', this.sessionWarning.toString());

    this.resetTimer();
  }

  private resetting: boolean = false;
  public checkForSessionValues() {
    if (isNaN(this.sessionTime)) {
      this.sessionTime = Number(sessionStorage.getItem('sessionTime'));
      this.sessionWarning = Number(sessionStorage.getItem('sessionWarning'));
    }
  }
  private lastTimeTick: Date;
  public resetTimer() {
    this.checkForSessionValues();

    if (this.resetting) return;

    this.resetting = true;
    this.started = true;

    if (SessionTimeoutService.countdown) {
      SessionTimeoutService.timerSubscription.unsubscribe();
    }

    SessionTimeoutService.countdown = timer(0, 1000);

    SessionTimeoutService.timerSubscription = SessionTimeoutService.countdown.subscribe(val => {
      this.timeLeft = this.sessionTime - val;

      if (this.lastTimeTick) {
        var now = new Date();
        var seconds = (now.getTime() - this.lastTimeTick.getTime()) / 1000;

        if (seconds > 2) {
          this.timeLeft = this.timeLeft - seconds;
        }
        this.lastTimeTick = now;
      }

      if (this.timeLeft <= 0) {
        this.cancelTimer();
      }
    });

    this.resetting = false;

  }

  public cancelTimer() {
    this.lastTimeTick = null;
    this.started = false;
    if (SessionTimeoutService.countdown) {
      SessionTimeoutService.timerSubscription.unsubscribe();
      SessionTimeoutService.countdown = null;
    }

    sessionStorage.removeItem('sessionTime');
    sessionStorage.removeItem('sessionWarning');
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);      
  }

}
