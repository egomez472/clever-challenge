import { Product } from "../../api/models/Product.model";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";

export interface CartState {
  cartItems: Product[];
}

const initialState: CartState = {
  cartItems: getCartFromLocalStorage()
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(({cartItems, ...store}) => ({

    addToCart(product: Product) {
      const updatedProducts = [...cartItems(), product];
      localStorage.setItem('cart', JSON.stringify(updatedProducts));
      patchState(store, {cartItems: updatedProducts});
    },

    addToCartItems(products: Product[]) {
      const updatedProducts = products;
      localStorage.setItem('cart', JSON.stringify(updatedProducts));
      patchState(store, {cartItems: updatedProducts});
    },

    removeItemFromCart(id: number) {
      const updatedProducts = cartItems().filter(cartItems => cartItems.id !== id);
      localStorage.setItem('cart', JSON.stringify(updatedProducts));
      patchState(store, {cartItems: updatedProducts});
    },

    clearCart() {
      localStorage.removeItem('cart');
      patchState(store, {cartItems: []});
    }

  })),

  withHooks({
    onInit: (store) => console.log('Store init:', store),
    onDestroy: (store) => console.log('Store destroy:', store)
  })
);

function getCartFromLocalStorage(): Product[] {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}
