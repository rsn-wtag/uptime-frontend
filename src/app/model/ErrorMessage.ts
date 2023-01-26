import {Timestamp} from "rxjs";

export class ErrorMessage{
 statusCode:number;
   timestamp: Timestamp<any>;
   errorMessage: string;
   customMessage: string;
}
