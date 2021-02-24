import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { threadId } from 'worker_threads';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SelectItem } from 'primeng/api/selectitem';
import { examswisesubject } from 'src/app/cts/shared/models/exams';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss']
})
export class FeesComponent implements OnInit {
  examForm: FormGroup;
  // isDisabled: boolean = false;
  isRequired: boolean = true;
  formSubmitAttempt: boolean = false;
  errorMessage: string = "";
  successMessage: string = "";
  pageTitle: string;
  private ngUnsubscribe = new Subject();
  subject: SelectItem[];
  cols: any[];
  // exams: any = [];
  @Input() isDisabled: boolean;
  @Input() examwisesubjects = [];
  @Output() arrayToEmit = new EventEmitter<any[]>();



  constructor(private fb: FormBuilder, private dropdownService: DropdownService) {
    var dropdowns = ["subjects"];
    this.dropdownService.getDropdowns(dropdowns)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.subject = result.data.subjects;
        }
      });
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'subjectid', header: 'Subject' },
      { field: 'cutoff', header: 'Cutoff Marks' },
      { field: 'total', header: 'Total Marks' }
    ];

    this.createForm()
  }
  createForm() {
    this.examForm = this.fb.group({
      'subjectid': new FormControl('', { validators: [Validators.required] }),
      'cutoff': new FormControl('', { validators: [Validators.required] }),
      'total': new FormControl('', { validators: [Validators.required] })
    });
  }

 
  examSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    console.log(this.examwisesubjects)
    if (this.examForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new examswisesubject();
      customObj = this.examForm.value;
      this.examwisesubjects.push(customObj);
      this.arrayToEmit.emit(this.examwisesubjects)
      this.examForm.reset();
    }
  }

  removeRow($event: any) {
    const index: number = this.examwisesubjects.indexOf($event);
    if (index !== -1) {
        this.examwisesubjects.splice(index, 1);
    }  
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getSubjectName(id):string{  
   return this.subject.filter(item => item.value == id)[0].label;   
  }
}