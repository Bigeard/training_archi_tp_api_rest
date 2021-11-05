import { UnknownBookError } from '../errors/unknown-book.error';
import { BookDao } from '../dao/books.dao';
import { BookModel } from '../models/book.model';

const uuid = require('uuid')

export class BooksService {
    private bookDAO: BookDao = new BookDao()

    public getAllBooks(params: any): BookModel[] {
        return this.bookDAO.list(params);
    }

    public createBook(book: BookModel) {
        if (!this.checkBookToCreateIsValid(book)) {
            throw new Error('invalid book');
        }

        const bookToCreate = {
            ...book,
            id: uuid.v4()
        }
        return this.bookDAO.create(bookToCreate);
    }

    public deleteBook(bookID: string) {
        const book = this.bookDAO.getByID(bookID);
        if (!book) {
            throw new UnknownBookError('unknown book')
        }
        return this.bookDAO.delete(bookID);
    }

    public updateBook(book: BookModel): BookModel {
        const existingBook = this.bookDAO.getByID(book.id);
        if (!existingBook) {
            throw new UnknownBookError('unknown book')
        }
        const bookToUpdate = {
            ...existingBook,
            ...book
        }

        return this.bookDAO.update(bookToUpdate)
    }

    public createComment(userId: string, bookID: string, message: string) {
        const existingBook = this.bookDAO.getByID(bookID);
        if (!existingBook) {
            throw new UnknownBookError('unknown book')
        }

        existingBook.comments.push({
            id: uuid.v4(),
            userId,
            message
        })

        return this.bookDAO.update(existingBook)
    }

    private checkBookToCreateIsValid(book: BookModel) {
        return book && book.isbn && book.title && book.subtitle && book.author && book.published && book.publisher && book.pages && book.description && book.website
    }

}