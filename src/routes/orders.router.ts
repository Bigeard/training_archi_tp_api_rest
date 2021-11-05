import { Router } from 'express';
import { UnknownOrderError } from '../errors/unknown-order.error';
import { OrdersService } from '../services/orders.service';
import Auth from '../middlewares/auth';
const ordersRouter = Router();

const ordersService = new OrdersService();

/**
 * @openapi
 * /api/orders/me:
 *   post:
 *     summary: Add order to Me (User).
 *     description: Add order to my profile (User).
 *     tags: ['Orders']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
 ordersRouter.post('/', Auth.token, Auth.role('user', 'administrator'), (req: any, res) => {
    try {
        const data = ordersService.createOrder(req.body)
        res.send(data)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/**
 * @openapi
 * /api/orders/me:
 *   get:
 *     summary: Get all Me orders (User).
 *     description: Get all of my orders (User).
 *     tags: ['Orders']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
 ordersRouter.get('/', Auth.token, Auth.role('administrator'), (req: any, res) => {
    const orders = ordersService.getAllOrders({"userId": req.user.id});
    res.status(200).send(orders);
})


/**
 * @openapi
 * /api/orders/{orderID}:
 *   delete:
 *     summary: Delete Me order (User).
 *     description: Delete my order by id (User).
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
 ordersRouter.delete('/:orderID', Auth.token, Auth.role('user', 'administrator'), (req: any, res) => {
    try {
        const data = ordersService.deleteOrderUser(req.params.orderID, req.order.id, req.user.id)
        res.send(data)
    } catch (error) {
        if (error instanceof UnknownOrderError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})


/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Retrieve a list of orders (Admin).
 *     description: Retrieve a list of orders (Admin).
 *     tags: ['Orders']
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
ordersRouter.get('/', Auth.token, Auth.role('administrator'), (req, res) => {
    const orders = ordersService.getAllOrders({});
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
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 */
ordersRouter.post('/', Auth.token, Auth.role('administrator'), (req, res) => {
    try {
        const data = ordersService.createOrder(req.body)
        res.send(data)
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
        const data = ordersService.updateOrder(req.body);
        res.send(data)
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
        const data = ordersService.deleteOrder(req.params.orderID)
        res.send(data)
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