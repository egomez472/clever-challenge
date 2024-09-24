import { Product } from "../models/Product.model"

export function productMapper(response: Product[]): Product[] {
  let products = new Array<Product>();
  if(response.length > 0) {
    for(let prod of response) {
      let product = new Product(
        prod.id,
        prod.name,
        prod.description,
        prod.image,
        Boolean(prod.withoutImage),
        prod.price,
        prod.quantity,
        prod.inventoryStatus,
        prod.rating
      );
      products.push(product);
    }
    return products;
  }
  return products;
}
