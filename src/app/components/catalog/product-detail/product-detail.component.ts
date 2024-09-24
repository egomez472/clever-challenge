import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../../api/services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../api/models/Product.model';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';

const modules = [
  CommonModule,
  RouterLink,
  RatingModule,
  ButtonModule,
  FormsModule,
  TagModule
]

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: modules,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private readonly productSvc = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  product!: Product;

  ngOnInit(): void {
    this.route.url.subscribe(async valor => {
      this.product = await this.productSvc.getProductById(valor[1].path);
    })
  }

  getRating(product: Product): number | undefined {
    return product.rating
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

  formatCurrency(num: number) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
  }
}
