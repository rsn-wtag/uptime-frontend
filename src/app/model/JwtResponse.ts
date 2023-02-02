import {User} from "./User";

export  class JwtResponse{
  jwtToken: string;
  userDTO:User;
  roles:string[];


}
