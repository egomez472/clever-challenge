import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductsService } from '../../../api/services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ProductComponent } from './product/product.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RolesDirective } from '../../../public/directives/roles.directive';

const modules = [
  ProductComponent,
  ButtonModule,
  CommonModule,
  RolesDirective
]

@Component({
  selector: 'app-products',
  standalone: true,
  imports: modules,
  providers: [MessageService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {

  private readonly productSvc = inject(ProductsService);
  productList = toSignal(this.productSvc.getProducts$());

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.productList());
    }, 150);
  }

}
