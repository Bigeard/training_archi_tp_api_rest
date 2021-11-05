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
 *     summary: Retrieve a list of books.
 *     description: Retrieve a list of books (User).
 *     tags: ['Books']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
booksRouter.get('/', Auth.token, Auth.role('user', 'administrator'), (req, res) => {
    const books = booksService.getAllBooks(req.query);
    res.status(200).send(books);
})


/**
 * @openapi
 * /api/books:
 *   post:
 *     summary: Create a new book (Admin).
 *     description: Creates a new book (Admin).
 *     tags: ['Books']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
booksRouter.post('/', Auth.token, Auth.role('administrator'), (req, res) => {
    try {
        const data = booksService.createBook(req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


/**
 * @openapi
 * /api/books/{bookID}:
 *   put:
 *     summary: Put book by id (Admin).
 *     description: Put book by id (Admin).
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
        const data = booksService.updateBook(req.body);
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message);
    }
})


/**
 * @openapi
 * /api/books/{bookID}:
 *   delete:
 *     summary: Delete book by id (Admin).
 *     description: Delete book by id (Admin).
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
        const data = booksService.deleteBook(req.params.bookID)
        res.send(data)
    } catch (error) {
        if (error instanceof UnknownBookError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})

/**
 * @openapi
 * /api/books/{bookID}/comments:
 *   post:
 *     summary: Create a new comment (User).
 *     description: Creates a new comment (User).
 *     tags: ['Books']
 *     parameters:
 *       - in: path
 *         name: bookID
 *         required: true
 *         description: String ID of the book.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: message !
 *                 example: Hello, I comment the book !
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
 booksRouter.post('/:bookID/comments', Auth.token, Auth.role('user', 'administrator'), (req: any, res) => {
    try {
        const data = booksService.createComment(req.user.id, req.params.bookID, req.body.message)
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


export default booksRouter;