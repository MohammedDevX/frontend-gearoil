export interface Product {
  id?: string;
  name: string;
  sku: string;
  volume?: number;
  category: Category;
  supplier: Supplier;
  carType: string[]; // Enum values: "SUV", "Sedan", etc.
  specifications: { [key: string]: string };
  urlImage?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
  '@id'?: string;
}
