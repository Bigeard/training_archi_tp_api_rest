import { BookModel } from "./book.model";

export interface OrderModel {
    id: string;
    userId: string;
    books: BookModel[];
}