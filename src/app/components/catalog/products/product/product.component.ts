import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProductDetailComponent } from '../../product-detail/product-detail.component';
import { Product } from '../../../../api/models/Product.model';
import { CartStore } from '../../../../public/store/cart.store';
import { MessageService } from 'primeng/api';
import { RolesDirective } from '../../../../public/directives/roles.directive';
import { UserStore } from '../../../../public/store/user.store';
import { CartService } from '../../../../api/services/cart.service';

const modules = [
  RouterLink,
  ProductDetailComponent,
  DataViewModule,
  ButtonModule,
  TagModule,
  CardModule,
  RatingModule,
  FormsModule,
  ToastModule,
  RolesDirective
]

@Component({
  selector: 'app-product',
  standalone: true,
  imports: modules,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent {
  @Input('product') product!: Product;

  private readonly cartStore = inject(CartStore);
  private readonly messageSvc = inject(MessageService);
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);
  private readonly cartSvc = inject(CartService);

  addProductToCart(product: Product): void {
    const hasProduct = this.cartStore.cartItems().find(p => p.id === product.id);
    if(Boolean(hasProduct)) {
      this.messageSvc.add({ severity: 'info', summary: 'It already exists', detail: 'This product is already in your cart', key: 'br', life: 1000 });
    } else {
      if(this.userStore.user()?.rol !== 'GUEST') {
        this.cartStore.addToCart(product),
        this.cartSvc.addProductInCart(this.userStore.user()?.id, product).subscribe()
      } else {
        this.cartStore.addToCart(product);
      }
      this.messageSvc.add({ severity: 'success', summary: 'Added', detail: 'Product added to cart', key: 'br', life: 3000 });
    }
  }

  getRating(product: Product): number | undefined {
    return product.rating
  }

  formatCurrency(num: number) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
  }

  getSeverity (product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return undefined;
    }
  };

  goToEditProduct(product: Product) {
    this.router.navigate(['product/edit'], {queryParams: {id: product.id}})
  }

  viewProductDetail(product: Product) {
    this.router.navigate(['product-details', product.id])
  }

  navigate(url:string) {
    this.router.navigate([url])
  }

}
