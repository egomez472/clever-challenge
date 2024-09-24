import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/Product.model';
import { EndpointsConstants } from '../constants/endpoints.constants';
import { productMapper } from '../mappers/product.mapper';
import { NewProductModel } from '../models/NewProduct.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly baseUrl = 'http://localhost:3000'
  private readonly _http = inject(HttpClient);

  public urlAssembler(endPoint: string): string {
    return `${this.baseUrl}/${endPoint}`;
  }

  getProducts$() {
    return this._http.get<Product[]>(this.urlAssembler(EndpointsConstants.getProducts));
  }

  getProductById$(id: string) {
    let params = new HttpParams()
      .set('id', id)
    return this._http.get<Product[]>(this.urlAssembler(EndpointsConstants.getProducts), {params})
  }

  getProductById(id: string): Promise<Product> {
    let params = new HttpParams()
      .set('id', id)
    return new Promise((resolve, reject): void => {
      this._http.get<Product[]>(this.urlAssembler(EndpointsConstants.getProducts), {params})
        .subscribe((response: Product[]) => {
          resolve(productMapper(response)[0])
        })
    });
  }

  getProducts(): Promise<Product[]> {
    return new Promise((resolve, reject): void => {
      this._http.get<Product[]>(this.urlAssembler(EndpointsConstants.getProducts))
        .subscribe((response: Product[]) => {
          resolve(productMapper(response))
        });
    });
  }

  updateProduct(product: Product) {
    return this._http.patch<Product>(`${this.urlAssembler(EndpointsConstants.getProducts)}/${product.id}`, product)
  }

  addProduct(product: NewProductModel) {
    return this._http.post<Product>(`${this.urlAssembler(EndpointsConstants.getProducts)}`, product);
  }

}
