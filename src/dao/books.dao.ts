import { BookModel } from '../models/book.model'
import { DatabaseConnection } from './database-connection'
import { JsonDB } from 'node-json-db';

export class BookDao {

    private databaseConnection: JsonDB

    constructor() {
        // initialize database connection
        this.databaseConnection = DatabaseConnection.getConnection();
    }

    public list(params: any): BookModel[] {
    return this.databaseConnection.filter("/books", (book) =>
            Object.keys(params).every((param, i) => book[param] === Object.values(params)[i])
        );
    }

    public create(book: BookModel): BookModel {
        this.databaseConnection.push('/books[]', book);
        return book;
    }

    public delete(bookID: string): string {
        const index = this.getBookIndexByID(bookID);
        if (index > -1) {
            this.databaseConnection.delete(`/books[${index}]`)
            return bookID;
        }
    }

    public getByID(bookID: string): BookModel {
        const index = this.getBookIndexByID(bookID);
        if (index > -1) {
            return this.databaseConnection.getData(`/books[${index}]`)
        }
    }

    public update(book: BookModel): BookModel {
        const index = this.getBookIndexByID(book.id);
        if (index > -1) {
            this.databaseConnection.push(`/books[${index}]`, book, true)
            return book
        }
    }

    private getBookIndexByID(bookID: string): number {
        return this.databaseConnection.getIndex('/books', bookID, 'id');
    }
}