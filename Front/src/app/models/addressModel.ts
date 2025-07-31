export interface Address {
  _id: string
  userId: string;
  street: string;
  number: string;
  city: string;
  zipCode: string;
  province: string;
  country: string;
  isDefault: boolean;
}

export interface AddressPayload {
  street: string;
  number: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
 
}