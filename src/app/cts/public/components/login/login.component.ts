import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/cts/shared/services/login.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage:string = "";
  addLoginForm: FormGroup;
  formSubmitAttempt: boolean = false;
  private ngUnsubscribe = new Subject();
  constructor(private fb: FormBuilder, private router: Router,private route:ActivatedRoute,private loginService:LoginService) {
  }
  ngOnInit(): void {
    this.addLoginForm = this.fb.group({
      'userName': new FormControl('', { validators: [Validators.required, Validators.pattern('^([A-Za-z0-9 _\'-])*$')] }),
      'password': new FormControl('', {
        // validators: [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        validators: [Validators.required, Validators.pattern('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$')
        ]
      }),    
      // 'userName': new FormControl(''),
      // 'password': new FormControl(''),
    });
  }
  addLoginSubmit(): void {
    this.errorMessage = "";
     this.formSubmitAttempt = true;
      if (this.addLoginForm.valid){     
        this.formSubmitAttempt=false;
        this.loginService.submitUserAccessDetails(this.addLoginForm.value)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
          if(result.token){
            this.router.navigate(['/admin/dashboard'], {relativeTo: this.route});
          }else{
            this.errorMessage="The login information you entered does not match our records. Please try again.";
          }
        })
        
    }
  

  }
  

}
