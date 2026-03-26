export interface ProductHome {
  id: string;
  sku: string;
  name: string;
  urlImage: string | null;
  price: number;
  averageRating: number;
  reviewsCount?: number;
}
