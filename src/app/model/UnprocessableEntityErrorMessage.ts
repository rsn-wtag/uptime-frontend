import {FieldError} from "./FieldError";

export class UnprocessableEntityErrorMessage {
  fieldErrors: FieldError[];
  timestamp: Date;
  errorMessage:String;
  customMessage: String;

}
