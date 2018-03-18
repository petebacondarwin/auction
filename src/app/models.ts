export type Identifier = string;

export interface User {
  id: Identifier;
  email: string;
  phone: string;
  displayName: string;
  isAdmin: boolean;
  childDetails: string;
  notify: boolean;
}

export interface Category {
  id: Identifier;
  name: string;
  itemCount: number;
}

export interface Item {
  id: Identifier;
  lot: string;
  category: string;
  categoryName: string;
  title: string;
  value: number;
  showValue: boolean;
  quantity: number;
  longDescription: string;
  shortDescription: string;
  comments: string;
  imageName: string;
  active: boolean;
  donor: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  bidWinningAmount: number;
  bidCount: number;
}


export interface Bid {
  id: Identifier;
  bidder: Identifier;
  item: Identifier;
  amount: number;
  date: Date;
}