import { Injectable } from '@angular/core';
import { TokenProvider } from './token-provider';

@Injectable({
  providedIn: 'root'
})
export class LocalstoragetokenService implements TokenProvider {
  getToken(): string {
    return JSON.parse(sessionStorage.getItem('currentUser')) != null ? JSON.parse(sessionStorage.getItem('currentUser')).token : null;
  }
  getUsername(): string {
    return JSON.parse(sessionStorage.getItem('currentUser')).UserName
  }
  getUserId(): string {
    return JSON.parse(sessionStorage.getItem('currentUser')).userId
  }
}
