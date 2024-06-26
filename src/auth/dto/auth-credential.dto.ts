import { IsString, Matches, MaxLength, Min, MinLength, maxLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/,{
        message: 'password only accepts english and number'
    })
    password: string;
    
}