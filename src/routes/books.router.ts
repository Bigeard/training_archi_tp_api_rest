import { Router } from 'express';
import { UnknownBookError } from '../errors/unknown-book.error';
import { BooksService } from '../services/books.service';
import Auth from '../middlewares/auth';
const booksRouter = Router();

const booksService = new BooksService();


/**
 * @openapi
 * /api/books:
 *   get:
 *     summary: Retrieve a list of books
 *     description: Retrieve a list of books
 *     tags: ['Books']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
booksRouter.get('/', Auth.token, Auth.role('user'), (req, res) => {
    const books = booksService.getAllBooks();
    res.status(200).send(books);
})


/**
 * @openapi
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     description: Creates a new book
 *     tags: ['Books']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: email !
 *                 example: postman@fake.com
 *               password:
 *                 type: string
 *                 description: email !
 *                 example: test
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
booksRouter.post('/', Auth.token, Auth.role('administrator'), (req, res) => {
    try {
        booksService.createBook(req.body)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


/**
 * @openapi
 * /api/books/{bookID}:
 *   put:
 *     summary: Put book by id.
 *     description: Put book by id.
 *     tags: ['Books']
 *     parameters:
 *       - in: path
 *         name: bookID
 *         required: true
 *         description: String ID of the book.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
booksRouter.put('/:bookID', Auth.token, Auth.role('administrator'), (req, res) => {
    try {
        booksService.updateBook(req.body);
    } catch (error) {
        res.status(400).send(error.message);
    }
})


/**
 * @openapi
 * /api/books/{bookID}:
 *   delete:
 *     summary: Delete book by id.
 *     description: Delete book by id.
 *     tags: ['Books']
 *     parameters:
 *       - in: path
 *         name: bookID
 *         required: true
 *         description: String ID of the book.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
booksRouter.delete('/:bookID', Auth.token, Auth.role('administrator'), (req: any, res) => {
    try {
        booksService.deleteBook(req.params.bookID, req.book.id)
    } catch (error) {
        if (error instanceof UnknownBookError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})

export default booksRouter;