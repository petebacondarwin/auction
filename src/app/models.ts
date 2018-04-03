import { User } from '@firebase/auth-types';

export type Identifier = string;

export interface UserInfo {
  id: Identifier;
  user: User;
  phone: string;
  roles?: {
    admin?: boolean;
  };
  childDetails: string;
  notify: boolean;
  bidding: UserBidding[];
  initialized?: boolean;
}

export interface UserBidding {
  item: Item;
  winning: boolean;
  bids: Bid[];
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
  winningBids: { bid: Identifier, amount: number }[];
  bidCount: number;
}

export interface Bid {
  id?: Identifier;
  bidder: Identifier;
  item: Identifier;
  amount: number;
}
