
export interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  year: number;
  location: string;
  imageUrl: string;
  currentBid: number;
  auctionDate: string;
  description: string;
}

export interface Auction {
  id: string;
  title: string;
  location: string;
  date: string;
  itemCount: number;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}
