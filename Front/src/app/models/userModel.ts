import { Address } from "cluster";
export interface User {
  _id?: string;
  name: string;
  lastName: string;
  dni: number;
  date_of_birth: Date;
  email: string;
  phoneNumber: string;
  role: string;
  address?: Address
}

export interface UserWithPassword extends User {
  password: string;
}


export interface Role{
    _id? :number,
    name: string
}