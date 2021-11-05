import { UnknownOrderError } from '../errors/unknown-order.error';
import { OrderDao } from '../dao/orders.dao';
import { OrderModel } from '../models/order.model';

const uuid = require('uuid')

export class OrdersService {
    private orderDAO: OrderDao = new OrderDao()

    public getAllOrders(params: any): OrderModel[] {
        return this.orderDAO.list(params)
    }

    public createOrder(order: OrderModel) {
        if (!this.checkOrderToCreateIsValid(order)) {
            throw new Error('invalid order');
        }

        const orderToCreate = {
            ...order,
            id: uuid.v4()
        }
        return this.orderDAO.create(orderToCreate);
    }

    public deleteOrderUser(orderID: string, currentOrderID: string, userId: string) {
        // @Todo
        if (orderID === currentOrderID) {
            throw new Error('order cannot remove himself !')
        }
        const order = this.orderDAO.getByID(orderID);
        if (!order) {
            throw new UnknownOrderError('unknown order')
        }
        return this.orderDAO.delete(orderID);
    }

    public deleteOrder(orderID: string) {
        const order = this.orderDAO.getByID(orderID);
        if (!order) {
            throw new UnknownOrderError('unknown order')
        }
        return this.orderDAO.delete(orderID);
    }

    public updateOrder(order: OrderModel): OrderModel {
        const existingOrder = this.orderDAO.getByID(order.id);
        if (!existingOrder) {
            throw new UnknownOrderError('unknown order')
        }
        const orderToUpdate = {
            ...existingOrder,
            ...order
        }

        return this.orderDAO.update(orderToUpdate)
    }

    private checkOrderToCreateIsValid(order: OrderModel) {
        return order && order.userId && order.books
    }

}