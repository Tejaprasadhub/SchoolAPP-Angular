import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationGuardService } from 'src/app/core/security/authentication-guard.service';
import { LocalstoragetokenService } from 'src/app/core/security/localstoragetoken.service';
import { LoginService } from 'src/app/cts/shared/services/login.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  userName:string;
  constructor(private loginService:LoginService,private router: Router,private route:ActivatedRoute, public TokenProvider: LocalstoragetokenService) { 
   
  }

  ngOnInit(): void {
    this.userName=this.TokenProvider.getUsername();
  }
  logout(){
    this.loginService.logout();
  }

  navigateToUser():void{
    let userId = this.TokenProvider.getUserId();
    this.router.navigate(['users/add-user'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(userId) }});
  }

}
