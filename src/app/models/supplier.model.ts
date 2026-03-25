export interface Supplier {
  id: string | number;
  nameSupplier: string;
  email: string;
  phone: string;
  address?: string;
  status?: 'Active' | 'Inactive';
  imageUrl: string;
}

export interface SupplierResponse {
  member: Supplier[];
  totalItems: number;
}
