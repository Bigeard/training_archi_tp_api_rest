import { Router } from 'express';
import { UnknownUserError } from '../errors/unknown-user.error';
import { UsersService } from '../services/users.service';
import Auth from '../middlewares/auth';
import { UserModel } from '../models/user.model';
const usersRouter = Router();

const usersService = new UsersService();


/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Get Me (User).
 *     description: Get my profile (User).
 *     tags: ['Users']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
 usersRouter.get('/me', Auth.token, Auth.role('user', 'administrator'), (req: any, res) => {
    try {
        const data = usersService.getUserByID(req.user.id);
        delete data.password
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message);
    }
})

/**
 * @openapi
 * /api/users/me:
 *   put:
 *     summary: Put Me (User).
 *     description: Put my profile (User).
 *     tags: ['Users']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
 usersRouter.put('/me', Auth.token, Auth.role('user', 'administrator'), (req: any, res) => {
    req.body.id = req.user.id;
    try {
        const data = usersService.updateUser(req.body);
        delete data.password
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message);
    }
})


/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users (Admin).
 *     description: Retrieve a list of users (Admin).
 *     tags: ['Users']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
usersRouter.get('/', Auth.token, Auth.role('administrator'), (req, res) => {
    const users = usersService.getAllUsers();
    res.status(200).send(users);
})


/**
 * @openapi
 * /api/users/userId/{userID}:
 *   get:
 *     summary: Retrieve user by ID
 *     tags: ['Users']
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: String ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
usersRouter.get('/userId/:userID', Auth.token, Auth.role('administrator'), (req, res) => {
    try {
        const data = usersService.getUserByID(req.params.userID);
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message);
    }
})


/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user (Global)
 *     description: creates a new user (Global)
 *     tags: ['Users']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
usersRouter.post('/', (req, res) => {
    try {
        const data = usersService.createUser(req.body)
        delete data.password
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


/**
 * @openapi
 * /api/users/{userID}:
 *   put:
 *     summary: Put user by id (Admin).
 *     description: Put user by id (Admin).
 *     tags: ['Users']
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: String ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
 usersRouter.put('/:userID', Auth.token, Auth.role('administrator'), (req, res) => {
    try {
        const data = usersService.updateUser(req.body);
        delete data.password
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message);
    }
})


/**
 * @openapi
 * /api/users/{userID}:
 *   delete:
 *     summary: Delete user by id (Admin).
 *     description: Delete user by id (Admin).
 *     tags: ['Users']
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: String ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
usersRouter.delete('/:userID', Auth.token, Auth.role('administrator'), (req: any, res) => {
    try {
        const data = usersService.deleteUser(req.params.userID, req.user.id)
        res.send(data)
    } catch (error) {
        if (error instanceof UnknownUserError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})

export default usersRouter;