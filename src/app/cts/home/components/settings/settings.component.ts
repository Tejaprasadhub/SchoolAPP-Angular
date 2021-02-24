import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  sms: SelectItem[] = [];
  email: SelectItem[] = [];
  vendor: SelectItem[] = [];
  settingsForm: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";
  formSubmitAttempt: boolean = false;
  smsDiv: boolean = false;
  emailDiv: boolean = false;
  isRequired: boolean = true;

  constructor(private fb: FormBuilder) {
    this.sms = [
      { label: 'Yes', value: 'Y' },
      { label: 'No', value: 'N' }
    ];
    this.email = [
      { label: 'Yes', value: 'Y' },
      { label: 'No', value: 'N' }
    ];
    this.vendor = [
      { label: 'Test Local', value: 'text' },
      { label: 'Web Sms', value: 'sms' }
    ];
  }

  ngOnInit(): void {
    this.createForm();
    this.settingsForm.get('sms').valueChanges.subscribe(
      (sms: string) => {
        if (sms === 'Y') {
          this.settingsForm.get('vendor').setValidators([Validators.required]);
          this.settingsForm.get('sender').setValidators([Validators.required]);
          this.settingsForm.get('transkey').setValidators([Validators.required]);
          this.settingsForm.get('promkey').setValidators([Validators.required]);
        } else if (sms === 'N'){
          this.settingsForm.get('vendor').setValidators(null);
          this.settingsForm.get('sender').setValidators(null);
          this.settingsForm.get('transkey').setValidators(null);
          this.settingsForm.get('promkey').setValidators(null);
        }
        this.settingsForm.get('vendor').updateValueAndValidity();
        this.settingsForm.get('sender').updateValueAndValidity();
        this.settingsForm.get('transkey').updateValueAndValidity();
        this.settingsForm.get('promkey').updateValueAndValidity();
      })

      this.settingsForm.get('email1').valueChanges.subscribe(
        (email1: string) => {
          if (email1 === 'Y') {
            this.settingsForm.get('email2').setValidators([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]);
            this.settingsForm.get('password').setValidators([Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
          } else if (email1 === 'N') {
            this.settingsForm.get('email2').setValidators(null);
            this.settingsForm.get('password').setValidators(null);
          }
          this.settingsForm.get('email2').updateValueAndValidity();
          this.settingsForm.get('password').updateValueAndValidity();
        })
  }

  createForm() {
    this.settingsForm = this.fb.group({
      'sms': new FormControl('', { validators: [Validators.required] }),
      'email1': new FormControl('', { validators: [Validators.required] }),
      'vendor': new FormControl(''),
      'sender': new FormControl(''),
      'transkey': new FormControl(''),
      'promkey': new FormControl(''),
      'email2': new FormControl(''),
      'password': new FormControl('')
    });
  }

  settingsSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.settingsForm.valid) {
      this.formSubmitAttempt = false;
      console.log(this.settingsForm.value);
      this.successMessage = "Your changes have been successfully saved";
    }
  }
  dropdownChange(event, type): void {
    if (type == 'sms') {
      if (event.value == "Y")
        this.smsDiv = true
      else
        this.smsDiv = false
    }
    else {
      if (event.value == "Y")
        this.emailDiv = true
      else
        this.emailDiv = false
    }
  }
}
