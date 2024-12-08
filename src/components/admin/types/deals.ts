export type DealCategory = "weekend" | "seasonal" | "business" | "all";

export interface Deal {
  id?: string;
  title: string;
  description: string;
  discount: string;
  valid_until: string;
  price: number;
  category: DealCategory;
  original_price: number;
  destination: string;
  image_url: string;
}

export interface NewDeal extends Omit<Deal, 'id'> {}