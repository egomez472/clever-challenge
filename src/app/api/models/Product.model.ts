export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public image: string,
    public withoutImage: boolean,
    public price: number,
    public quantity: number,
    public inventoryStatus: string,
    public rating?: number
  ) {}
}
