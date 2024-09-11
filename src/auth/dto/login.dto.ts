import { IsString, Length } from "class-validator";

export class LoginDto {  
     @IsString()  
     @Length(5, 20)  
     email: string;  
   
     @IsString()  
     @Length(6, 12)  
     password: string;  
   
     @IsString()  
     @Length(6, 12)  
     username: string;  
   }