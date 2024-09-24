import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserStore } from "../../public/store/user.store";
import { Product } from "../models/Product.model";
import { Observable, switchMap } from "rxjs";
import { User } from "../models/User.model";
import { CartStore } from "../../public/store/cart.store";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly baseUrl = 'http://localhost:3000'
  private readonly _http = inject(HttpClient);
  private readonly userState = inject(UserStore);

  public urlAssembler(endPoint: string): string {
    return `${this.baseUrl}/${endPoint}`;
  }

  private readonly cartStore = inject(CartStore);

  addProductInCart(userId: any, product: Product) {
    const url = this.urlAssembler(`users/${userId}`);
    return this._http.get<User>(url).pipe(
      switchMap((user) => {
        const updatedCart = [...user.cart, product];
        this.cartStore.addToCartItems(updatedCart);
        return this._http.patch<User>(url, { cart: updatedCart });
      })
    );
  }

  removeProductFromCart(userId: any, productId: any): Observable<User> {
    const url = this.urlAssembler(`users/${userId}`);

    return this._http.get<User>(url).pipe(
      switchMap((user) => {
        const updatedCart = user.cart.filter(product => product.id !== productId);
        this.cartStore.removeItemFromCart(productId)
        return this._http.patch<User>(url, { cart: updatedCart });
      })
    );
  }

  removeAllItems(userId: any) {
    const url = this.urlAssembler(`users/${userId}`);

    return this._http.get<User>(url).pipe(
      switchMap((user) => {
        const updatedCart: any = [];
        this.cartStore.clearCart();
        return this._http.patch<User>(url, { cart: updatedCart });
      })
    );
  }

}
