import { Router } from 'express';
import { UnknownOrderError } from '../errors/unknown-order.error';
import { OrdersService } from '../services/orders.service';
import Auth from '../middlewares/auth';
const ordersRouter = Router();

const ordersService = new OrdersService();


/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Retrieve a list of orders.
 *     description: Retrieve a list of orders (User).
 *     tags: ['Orders']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
ordersRouter.get('/', Auth.token, Auth.role('user'), (req, res) => {
    const orders = ordersService.getAllOrders();
    res.status(200).send(orders);
})


/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Create a new order (Admin).
 *     description: Creates a new order (Admin).
 *     tags: ['Orders']
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
ordersRouter.post('/', Auth.token, Auth.role('administrator'), (req, res) => {
    try {
        ordersService.createOrder(req.body)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


/**
 * @openapi
 * /api/orders/{orderID}:
 *   put:
 *     summary: Put order by id (Admin).
 *     description: Put order by id (Admin).
 *     tags: ['Orders']
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         description: String ID of the order.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
ordersRouter.put('/:orderID', Auth.token, Auth.role('administrator'), (req, res) => {
    try {
        ordersService.updateOrder(req.body);
    } catch (error) {
        res.status(400).send(error.message);
    }
})


/**
 * @openapi
 * /api/orders/{orderID}:
 *   delete:
 *     summary: Delete order by id (Admin).
 *     description: Delete order by id (Admin).
 *     tags: ['Orders']
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         description: String ID of the order.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
ordersRouter.delete('/:orderID', Auth.token, Auth.role('administrator'), (req: any, res) => {
    try {
        ordersService.deleteOrder(req.params.orderID, req.order.id)
    } catch (error) {
        if (error instanceof UnknownOrderError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})

export default ordersRouter;