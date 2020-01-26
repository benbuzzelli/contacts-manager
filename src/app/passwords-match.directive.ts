import { Directive, Input } from '@angular/core';
import {AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

// export function confirmPasswords(p1: string, p2: string): ValidatorFn {
//   return (control: AbstractControl): {[key: string]: any} | null => {
//     return p1 === p2 ? null : {notSame: true};
//   };
// }

@Directive({
  selector: '[appPasswordsMatch]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordsMatchDirective, multi: true}]
})
export class PasswordsMatchDirective implements Validator {
  @Input('passwordsMatch') passwordsMatch: {p1: string, p2: string};

  validate(control: AbstractControl): {[key: string]: any} | null {
    let password = control.get('password');
    let confirmPassword = control.get('confirmPassword');
    return password === confirmPassword ? null : {'noMatch': {value: control.get('confirmPassword')}};
  }
}
