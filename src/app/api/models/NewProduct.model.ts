export class NewProductModel {
  constructor(
    public name: string,
    public description: string,
    public image: string,
    public price: number,
    public quantity: number,
    public inventoryStatus: string,
    public rating: number
  ) {}
}
