import { User } from "./userModel";

export interface loginResponse {
    success : boolean,
    message: string,
    token: string,
    user : User
}