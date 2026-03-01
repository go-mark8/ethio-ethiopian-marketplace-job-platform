// Local type definitions for frontend use
// These mirror the backend types that will be implemented

export interface Product {
  id: string;
  title: string;
  price: bigint;
  description: string;
  images: any[];
  seller: any;
  category: ProductCategory;
  createdAt: bigint;
  views: bigint;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  company: string;
  category: JobCategory;
  postedBy: any;
  postedAt: bigint;
  salary: bigint | null;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  createdAt: bigint;
}

export interface Message {
  id: string;
  sender: any;
  receiver: any;
  content: string;
  timestamp: bigint;
  isRead: boolean;
}

export enum ProductCategory {
  clothing = 'clothing',
  electronics = 'electronics',
  handmade = 'handmade',
  furniture = 'furniture',
  books = 'books',
  art = 'art',
  food = 'food',
  cars = 'cars',
  bikes = 'bikes',
  music = 'music',
  services = 'services',
  none = 'none',
}

export enum JobCategory {
  technology = 'technology',
  education = 'education',
  healthcare = 'healthcare',
  construction = 'construction',
  hospitality = 'hospitality',
  retail = 'retail',
  transportation = 'transportation',
  none = 'none',
}

export interface ConversationPreview {
  userId: any;
  userName: string | null;
  lastMessage: string;
  lastMessageTime: bigint;
  unreadCount: number;
}
