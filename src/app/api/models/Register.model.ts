import { Product } from "./Product.model";

export class RegisterModel {
  constructor(
    public username: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public password: string,
    public rol: string,
    public cart: Product[]
  ) {}
}
