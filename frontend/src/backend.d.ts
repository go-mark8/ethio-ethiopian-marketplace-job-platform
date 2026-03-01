import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface ProductView {
    id: string;
    title: string;
    views: bigint;
    createdAt: Time;
    description: string;
    seller: Principal;
    category: ProductCategory;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface ProductCreationData {
    title: string;
    description: string;
    category: ProductCategory;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    name: string;
    createdAt: Time;
    email: string;
    phone: string;
}
export enum ProductCategory {
    art = "art",
    music = "music",
    clothing = "clothing",
    cars = "cars",
    food = "food",
    none = "none",
    furniture = "furniture",
    bikes = "bikes",
    books = "books",
    handmade = "handmade",
    services = "services",
    electronics = "electronics"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(data: ProductCreationData): Promise<string>;
    getAllProducts(): Promise<Array<ProductView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductsBySeller(seller: Principal): Promise<Array<ProductView>>;
    getTopViewedProducts(limit: bigint): Promise<Array<ProductView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementProductViews(productId: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerUserProfile(name: string, email: string, phone: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
