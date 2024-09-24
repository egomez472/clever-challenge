import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../api/services/products.service';
import { Product } from '../../../api/models/Product.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { productMapper } from '../../../api/mappers/product.mapper';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NewProductModel } from '../../../api/models/NewProduct.model';
import { CheckboxModule } from 'primeng/checkbox';

const modules = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  InputNumberModule,
  DropdownModule,
  ButtonModule,
  FloatLabelModule,
  ToastModule,
  ConfirmDialogModule,
  CheckboxModule
]

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: modules,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class AddProductComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly productSvc = inject(ProductsService);
  private readonly confirmationSvc = inject(ConfirmationService);
  private readonly messageSvc = inject(MessageService)

  firstEntry = false;
  action = this.route.snapshot.paramMap.get('action');

  inventoryItems: any[] = [
    {
      name: 'In stock',
      code: 'INSTOCK'
    },
    {
      name: 'Low stock',
      code: 'LOWSTOCK'
    },
    {
      name: 'Out of stock',
      code: 'OUTOFSTOCK'
    }
  ];;
  formGroup!: FormGroup;
  product!: Product;

  async ngOnInit(): Promise<void> {
    let data = this.route.snapshot.queryParamMap.get('id');
    if(data !== null) {
      this.productSvc.getProductById$(data).subscribe(
        product => {
          const _product = productMapper(product)[0];
          if(_product && _product.id) {
            this.idControl?.setValue(_product.id)
            this.nameControl?.setValue(_product.name);
            this.descriptionControl?.setValue(_product.description);
            this.imageControl?.setValue(_product.image);
            this.defaultCheckControl?.setValue(_product.withoutImage ? ['https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg'] : [])
            this.priceControl?.setValue(_product.price);
            this.quantityControl?.setValue(_product.quantity);
            this.inventoryControl?.setValue(this.inventoryItems.find(status => status.code == _product.inventoryStatus));
          }
        }
      )
    }

    this.formGroup = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      defaultCheck: new FormControl<string | null>(null),
      price: new FormControl(0, Validators.required),
      quantity: new FormControl(0, Validators.required),
      inventory: new FormControl('', Validators.required)
    })

    this.route.url.subscribe(valor => {
      if(valor[1].path !== 'edit') {
        this.formGroup.reset()
        this.action = valor[1].path
      }

    })
    if(data!== null) {
      this.product = await this.productSvc.getProductById(data);
    }

    this.defaultCheckControl?.valueChanges.subscribe(valor => {
      if(valor.length > 0) {
        this.imageControl?.setValue(valor[0]);
        this.imageControl?.disable();
      } else {
        if(this.product !== null && this.action == 'edit') {
          this.imageControl?.setValue(this.product?.image ? this.product.image : '');
        } else {
          this.imageControl?.setValue('');
        }
        this.imageControl?.enable();
      }
    })
  }

  onChange(event: any) {
    console.log({event});

  }

  get idControl() {
    return this.formGroup.get('id');
  }

  get defaultCheckControl() {
    return this.formGroup.get('defaultCheck');
  }

  get nameControl() {
    return this.formGroup.get('name');
  }

  get descriptionControl() {
    return this.formGroup.get('description');
  }

  get imageControl() {
    return this.formGroup.get('image');
  }

  get priceControl() {
    return this.formGroup.get('price');
  }

  get quantityControl() {
    return this.formGroup.get('quantity');
  }

  get inventoryControl() {
    return this.formGroup.get('inventory');
  }

  onSubmit(event: Event, form: FormGroup, action?: string | null) {

    switch(action) {
      case 'edit': {
        this.confirmationSvc.confirm({
          target: event.target as EventTarget,
          message: '¿Are you sure you want to upgrade the product?',
          header: 'Confirmation',
          icon: 'pi pi-sync',
          acceptIcon:"none",
          rejectIcon:"none",
          acceptButtonStyleClass: 'p-button-success',
          rejectButtonStyleClass:"p-button-text p-button-success",
          accept: () => {
            this.updateProduct(form.value)
          }
        });
        return;
      }
      case('add'): {
        this.confirmationSvc.confirm({
          target: event.target as EventTarget,
          message: '¿Are you sure to add this product?',
          header: 'Confirmation',
          icon: 'pi pi-user-plus',
          acceptIcon:"none",
          rejectIcon:"none",
          acceptButtonStyleClass: 'p-button-success',
          rejectButtonStyleClass:"p-button-text p-button-success",
          accept: () => {
            this.addProduct(form.value)
          }
        });
        return;
      }
    }

  }

  updateProduct(product:Product) {
    const _product = productMapper([product])[0]

    if(this.formGroup.valid) {
      let productEdited = new Product(
        _product.id,
        _product.name,
        _product.description,
        _product.withoutImage ? this.defaultCheckControl?.value[0] : _product.image,
        _product.withoutImage,
        _product.price,
        _product.quantity,
        this.inventoryControl?.value.code
      )
      console.log(productEdited);

      this.productSvc.updateProduct(productEdited).subscribe(
        response => {
          if(response.id) {
            this.messageSvc.add({ severity: 'success', summary: 'Success', detail: 'Product successfully updated', key:'br', life:1500});
          }
        }
      )
    }
  }

  addProduct(product: NewProductModel) {
    const newProduct = new NewProductModel(
      product.name,
      product.description,
      product.image,
      product.price,
      product.quantity,
      this.inventoryControl?.value.code,
      3
    )
    this.productSvc.addProduct(newProduct).subscribe(
      response => {
        if(response.id) {
          this.formGroup.reset();
          this.messageSvc.add({ severity: 'success', summary: 'Success', detail: 'Product successfully added', key:'br', life:1500});
        }
      }
    )
  }

}
