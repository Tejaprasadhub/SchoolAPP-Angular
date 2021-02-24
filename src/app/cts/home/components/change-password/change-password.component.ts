import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmPasswordValidator } from './custom-password-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  formSubmitAttempt: boolean = false;
  errorMessage:string="";
  successMessage:string="";
  isRequired:boolean=false;
  oldPassword:  FormControl;
  newPassword: FormControl;
  confirmPassword: FormControl;

  constructor(private fb: FormBuilder, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ["",{validators:[Validators.required,Validators.minLength(8),Validators.pattern('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$')]}],
        newPassword: ["",{validators:[Validators.required,Validators.minLength(8),Validators.pattern('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$')]}],
        confirmPassword: ["",{validators:[Validators.required,Validators.minLength(8),Validators.pattern('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$')]}]
      },
      {
        validator: ConfirmPasswordValidator("newPassword", "confirmPassword","oldPassword")
      }      
    );
    this.changePasswordForm.controls["oldPassword"].setValue("Optum789@");
  }

  changePwdSubmit(): void {
    this.errorMessage="";
    this.successMessage="";
    this.formSubmitAttempt = true;
    if(this.changePasswordForm.valid){
      this.formSubmitAttempt=false;
      console.log(this.changePasswordForm.value);
      // this.changePasswordForm.reset();
      this.successMessage="Your changes have been successfully saved";
    }
  }

  
  list(): void {
    this.location.back();
  }

}
