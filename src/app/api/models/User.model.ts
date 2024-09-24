import { Product } from "./Product.model";

export class User {
  constructor(
    public id: string,
    public username: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public rol: string,
    public cart: Product[]
  ) {}
}
