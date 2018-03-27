export type Identifier = string;

export interface UserInfo {
  id: Identifier;
  phone: string;
  roles?: {
    admin?: boolean;
  };
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
  lot: number;
  category: string;
  title: string;
  value: number;
  showValue: boolean;
  quantity: number;
  longDescription: string;
  shortDescription: string;
  comments: string;
  imageName: string;
  active: boolean;
  donor: Donor;
  bidInfo?: BidInfo;
}

export interface Donor {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface BidInfo {
  winningBids: number[];
  bidCount: number;
}

export interface Bid {
  bidder: Identifier;
  item: Identifier;
  amount: number;
}
