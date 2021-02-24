import { AbstractControl, FormGroup } from '@angular/forms';

export function ConfirmPasswordValidator(controlName: string, matchingControlName: string,previousControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName]
      let previousControl = formGroup.controls[previousControlName]
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmPasswordValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
      if (
        control.errors &&
        !control.errors.samePasswordValidator
      ) {
        return;
      }
      if (control.value === previousControl.value) {
        control.setErrors({ samePasswordValidator: true });
      } else {
        control.setErrors(null);
      }

    };
  }

export class customLessThanCurrentDateValidator{
    static ValidDate(AC:AbstractControl){
        const formGroup = AC.parent;
        if(formGroup){
            const doiControl = formGroup.get('doi');
            const selectedDoi = doiControl.value;
            const currentDate = new Date().getTime()-(30*24*60*60*1000)
            if(currentDate > selectedDoi){
                return {ValidDate: true};
            }else{
                return null;
            }
        }
    }
}
