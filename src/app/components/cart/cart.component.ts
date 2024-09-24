import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CartStore } from '../../public/store/cart.store';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../api/models/Product.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserStore } from '../../public/store/user.store';
import { CartService } from '../../api/services/cart.service';

const modules = [
  CommonModule,
  ToastModule,
  ConfirmDialogModule,
  ButtonModule
]

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: modules,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class CartComponent {
  readonly cartStore = inject(CartStore);
  private readonly confirmationSvc = inject(ConfirmationService);
  private readonly messageSvc = inject(MessageService);
  private readonly userStore = inject(UserStore);
  private readonly cartSvc = inject(CartService);


  formatCurrency(num: number) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
  }

  removeItemFromCart(event: Event, product: Product) {
    this.confirmationSvc.confirm({
      target: event.target as EventTarget,
      message: '¿Are you sure you want to remove the item from the cart ?',
      header: 'Confirmation',
      icon: 'pi pi-cart-minus',
      acceptIcon:"none",
      rejectIcon:"none",
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass:"p-button-text p-button-success",
      accept: () => {
        if(product.id !== null) {
          if(this.userStore.user()?.rol !== 'GUEST') {
            this.cartSvc.removeProductFromCart(this.userStore.user()?.id, product.id).subscribe();
            this.cartStore.removeItemFromCart(product.id);
          }
          this.cartStore.removeItemFromCart(product.id);
          this.messageSvc.add({ severity: 'success', summary: 'Success', detail: 'Item removed from cart', key:'br', life:1500});
        }
      }
    });
  }

  clearCart(event: Event) {
    this.confirmationSvc.confirm({
      target: event.target as EventTarget,
      message: '¿Are you sure you want to clean the items from the cart ?',
      header: 'Confirmation',
      icon: 'pi pi-eraser',
      acceptIcon:"none",
      rejectIcon:"none",
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass:"p-button-text p-button-success",
      accept: () => {
        if(this.userStore.user()?.rol !== 'GUEST') {
          this.cartSvc.removeAllItems(this.userStore.user()?.id).subscribe();
        } else {
          this.cartStore.clearCart();
        }
        this.messageSvc.add({ severity: 'success', summary: 'Success', detail: 'Cart clean', key:'br', life:1500});
      }
    });
  }

  evaluatePrice(cartStore: Product[]) {
    let total = 0;
    for(let item of cartStore) {
      total += item.price;
    }

    return this.formatCurrency(total);
  }
}
