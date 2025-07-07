export interface User {
  _id?: string;
  name: string;
  lastName: string;
  dni: number;
  date_of_birth: Date;
  email: string;
  role: string;
}


export interface Role{
    _id? :number,
    name: string
}