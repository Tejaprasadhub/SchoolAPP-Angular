import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-teacher-class-section',
  templateUrl: './add-teacher-class-section.component.html',
  styleUrls: ['./add-teacher-class-section.component.scss']
})
export class AddTeacherClassSectionComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  classSectionForm: FormGroup;
  teacherclasses:any[] = [];
  teachersections:any[] = [];
  formSubmitAttempt: boolean = false;
  isRequired: boolean = true;
  cols: any[];

  @Input() isDisabled: boolean;
  @Input() teacherclasssections = [];
  @Output() arrayToEmit = new EventEmitter<any[]>();
  constructor(private dropdownService: DropdownService,private fb: FormBuilder) { 

     //Get Dropdowns API call
     var dropdowns = ["sections","classes"];
     this.dropdownService.getDropdowns(dropdowns)
     .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
       if (result.success) {
        this.teacherclasses = result.data.classes;
        this.teachersections = result.data.sections;
       }
  
});  
  }
  ngOnInit(): void {
    this.cols = [
      { field: 'class', header: 'Class' },
      { field: 'section', header: 'Sections' },
    ];
    this.createForm()
  }
  createForm() {
    this.classSectionForm = this.fb.group({
      'class': new FormControl('', { validators: [Validators.required] }),
      'section': new FormControl('', { validators: [Validators.required] })
    });
  }

  removeRow($event: any) {
    const index: number = this.teacherclasssections.indexOf($event);
    if (index !== -1) {
        this.teacherclasssections.splice(index, 1);
    }      
  }

  classSectionSubmit(): void {
    this.formSubmitAttempt = true;
    console.log(this.classSectionForm.value)
    if (this.classSectionForm.valid) {
      this.formSubmitAttempt = false;
      this.teacherclasssections.push(this.classSectionForm.value);
      this.arrayToEmit.emit(this.teacherclasssections)
      this.classSectionForm.reset();
    }
  }

  getClassName(id):string{    
    return this.teacherclasses.filter(item => item.value == id)[0].label;   
   }
   
   getSectionName(id):string{    
    return this.teachersections.filter(item => item.value == id)[0].label;   
   }
}
