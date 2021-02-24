import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/cts/app-constants';
import { map, takeUntil } from 'rxjs/operators';
import { RoleAccessService } from 'src/app/cts/shared/services/role-access.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';


@Component({
  selector: 'app-role-access',
  templateUrl: './role-access.component.html',
  styleUrls: ['./role-access.component.scss']
})
export class RoleAccessComponent implements OnInit {
  users: any;
  rowGroupMetadata: any;
  userFeatures:any;
  errorMessage: string = "";
  successMessage: string = "";
  userid:string="";
  formSubmitAttempt: boolean = false;
  checked: boolean = false;
  private ngUnsubscribe = new Subject();
  constructor(private dropdownService: DropdownService,private roleaccessService:RoleAccessService,private router: Router) {
         //Get Dropdowns API call
       var dropdowns = ["users"];
       this.dropdownService.getDropdowns(dropdowns)
       .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
         if (result.success) {
          this.users = result.data.users;
         }
       });  
  }
  ngOnInit(): void {
  }

  dropdownChange(event): void {
    // alert(event.value);
    this.userid = event.value;
    this.getUserFeatures(event.value);
    
  }
  getUserFeatures(id){
    this.roleaccessService.UserFeatures(id)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      this.userFeatures= result;
      console.log(this.userFeatures)
      this.updateRowGroupMetaData();
    })
  }

  onSort() {
    this.updateRowGroupMetaData();
}

updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.userFeatures) {
        for (let i = 0; i < this.userFeatures.length; i++) {
            let rowData = this.userFeatures[i];
            let brand = rowData.featureTitle;
            if (i == 0) {
                this.rowGroupMetadata[brand] = { index: 0, size: 1 };
            }
            else {
                let previousRowData = this.userFeatures[i - 1];
                let previousRowGroup = previousRowData.featureTitle;
                if (brand === previousRowGroup)
                    this.rowGroupMetadata[brand].size++;
                else
                    this.rowGroupMetadata[brand] = { index: i, size: 1 };
            }
        }
    }
}

onSubmit(permissionData){
  this.errorMessage = "";
  this.successMessage = "";
  this.formSubmitAttempt = true;
  if (this.userFeatures.length > 0) {
    this.formSubmitAttempt = false;
    //AED Branches API call
    this.roleaccessService.AEDRoleAccess(this.userFeatures,this.userid)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {         
          this.successMessage = AppConstants.Messages.successMessage;
        }else{
          this.errorMessage = "Unable to perform request";
        }
      },
      error =>{  
        this.router.navigate(['/admin/app-error'], {  queryParams: { message: window.btoa(error.message)} });     
      });
  }
}

fullControlCheck(event){
  let GetArray = this.userFeatures;
  if(event){
    this.userFeatures.forEach(element => {
      element.status = 'Y';
    });
  }
  else{
    this.userFeatures = GetArray;
  }
}

checkPermissions(permissionValue){
 return  AuthorizationGuard.checkPermission(permissionValue);
}


}
