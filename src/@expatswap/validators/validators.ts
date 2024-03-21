import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ExpatswapValidators
{
    /**
     * Check for empty (optional fields) values
     *
     * @param value
     */
    static isEmptyInputValue(value: any): boolean
    {
        return value == null || value.length === 0;
    }

    /**
     * Must match validator
     *
     * @param controlPath A dot-delimited string values that define the path to the control.
     * @param matchingControlPath A dot-delimited string values that define the path to the matching control.
     */
    static mustMatch(controlPath: string, matchingControlPath: string): ValidatorFn
    {
        return (formGroup: AbstractControl): ValidationErrors | null =>
        {
            // Get the control and matching control
            const control = formGroup.get(controlPath);
            const matchingControl = formGroup.get(matchingControlPath);

            // Return if control or matching control doesn't exist
            if ( !control || !matchingControl )
            {
                return null;
            }

            // Delete the mustMatch error to reset the error on the matching control
            if ( matchingControl.hasError('mustMatch') )
            {
                delete matchingControl.errors.mustMatch;
                matchingControl.updateValueAndValidity();
            }

            // Don't validate empty values on the matching control
            // Don't validate if values are matching
            if ( this.isEmptyInputValue(matchingControl.value) || control.value === matchingControl.value )
            {
                return null;
            }

            // Prepare the validation errors
            const errors = {mustMatch: true};

            // Set the validation error on the matching control
            matchingControl.setErrors(errors);

            // Return the errors
            return errors;
        };
    }


    static passwordValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const value: string = control.value;
          const hasLowerCase = /[a-z]/.test(value);
          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
          const isValid = hasLowerCase && hasUpperCase && hasNumber && hasSymbol && value.length >= 8;
      
          return isValid ? null : { invalidPassword: true };
        };
    }
}
