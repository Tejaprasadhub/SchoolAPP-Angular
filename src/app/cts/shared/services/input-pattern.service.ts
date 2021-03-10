import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputPatternService {

  constructor() { }

  // Only Integer Numbers
  Integers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Only Numbers with Decimals
  Decimals(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Only AlphaNumeric
  AlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9 ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  // Only AlphaNumeric with comma
  AlphaNumericwithcomma(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9 ,]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

   // Only Alphabet
   Alphabet(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
   AlphaNumericwithspecialsymbols(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9 ;_/,:*&.-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
