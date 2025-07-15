import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {
    
    //Whitespace Validations

    // if validation check fails , return the validation error else return null 
    static notOnlyWhitespace(control : FormControl) : ValidationErrors | null {
        if ((control.value != null) && (control.value.trim().length === 0)) {
            // invalid, has only whitespace
            return { 'notOnlyWhitespace': true };
        } else {
            // valid
            return null;
        }
    }

}
