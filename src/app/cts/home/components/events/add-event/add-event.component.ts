import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  eventId: string;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addEventForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  branchids: SelectItem[] = [];
  categories: SelectItem[] = [];
  registration: SelectItem[] = [];

  
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private location: Location) {
    this.branchids = [
      { label: 'skota', value: '1' },
      { label: 'boddam', value: '2' }
    ];
    this.categories = [
      { label: 'major', value: 'mjr' },
      { label: 'minor', value: 'mnr' },
      { label: 'medium', value: 'mdm' },

    ];
    this.registration = [
      { label: 'yes', value: 'y' },
      { label: 'no', value: 'n' }
    ];
   }

  ngOnInit(): void {// On page load
    //to get the query parameter values
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.eventId = params['id'];
      this.formType = params['type'];
    });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Event";
      this.isDisabled = false;
      this.isRequired = true;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Event";
      this.editControls();
      this.fetchData();
    } else {
      this.pageTitle = "View Details";
      this.isDisabled = true;
      this.isRequired = false;
      this.fetchData();
    }

  }

  createForm() {
    this.addEventForm = this.fb.group({
      'name': new FormControl('', { validators: [Validators.required]}),
      'branchid': new FormControl('', { validators: [Validators.required] }),
      'category': new FormControl('', { validators: [Validators.required] }),
      'register': new FormControl('', { validators: [Validators.required] }),
      'description': new FormControl('', { validators: [Validators.required] })
    });
  }

  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditEventDetails();
  }
  bindEditEventDetails() {
    this.editData = {
      'name': 'Ganesh',
      'branchid': '1',
      'category': 'mjr',
      'register': 'y',
      'description': 'Ganeshchandra'
      
    }
    this.addEventForm.setValue({
      'name': this.editData.name,
      'branchid': this.editData.branchid,
      'category': this.editData.category,
      'register': this.editData.register,
      'description': this.editData.description
      
    })
  }







  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Event";
  }

  addEventSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addEventForm.valid) {
      this.formSubmitAttempt = false;
      console.log(this.addEventForm.value);
      this.addEventForm.reset();
      this.successMessage = "Your changes have been successfully saved";
    }
  }

  resetForm(): void {
    this.addEventForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

}
