import { Router } from 'express';
import { UnknownUserError } from '../errors/unknown-user.error';
import { UsersService } from '../services/users.service';

const loginRouter = Router();

const usersService = new UsersService();

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login user
 *     description: Login user
 *     tags: ['Login']
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
loginRouter.post('/', (request, response) => {
    try {
        const user = usersService.login(request.body.email, request.body.password)
        response.send(user)
    } catch (error) {
        if (error instanceof UnknownUserError) {
            response.status(401)
        } else {
            response.status(400)
        }
        response.send(error.message)
    }
})

export default loginRouter;