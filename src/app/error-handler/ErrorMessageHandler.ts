import {FormGroup, NgForm} from "@angular/forms";
import {FieldError} from "../model/FieldError";
import {UnprocessableEntityErrorMessage} from "../model/UnprocessableEntityErrorMessage";

export class ErrorMessageHandler{

  getErrorMessage(fieldName:string,form:NgForm) {
    let field=form.control.get(fieldName);
    if(field){
      if (field.hasError('required')) return 'This field must not be empty';

      if(field.hasError('bindError')) return field.getError('bindError');

      if(field.hasError('email')) return  'Not a valid email';

    }
    return "There is something wrong with input";
  }

  handleUnprocessableEntityError(unprocError:UnprocessableEntityErrorMessage, formGroup: FormGroup):String{
    let fieldErrors:FieldError[]=unprocError.fieldErrors;
    if(fieldErrors){
      //console.log("coming "+ fieldErrors);
      for(let fieldError of fieldErrors){
        console.log("coming "+ fieldError.fieldErrorMessage);
        const control=formGroup.get(fieldError.field);
        if (control) {
          control.markAsDirty();
          control.markAsTouched();

          control.setErrors({ 'bindError' : fieldError.fieldErrorMessage });
        }
        console.log("end "+ fieldError.fieldErrorMessage);
      }
      return "";
    }else{
      return unprocError.customMessage;
    }
  }
}
