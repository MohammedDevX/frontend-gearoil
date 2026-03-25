export interface IProduct {
  id?: string;
  sku: string;
  name: string;
  urlImage: string;
  averageRating: number;
  reviewsCount: number;
  specifications: { [key: string]: string };
  category: string;
  volume: number;
  isActive: boolean;
  isDefault: boolean;
  reviews?: any[]; // Simplified for now
}
