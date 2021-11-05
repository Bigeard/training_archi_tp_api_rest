import { OrderModel } from '../models/order.model'
import { DatabaseConnection } from './database-connection'
import { JsonDB } from 'node-json-db';

export class OrderDao {

    private databaseConnection: JsonDB

    constructor() {
        // initialize database connection
        this.databaseConnection = DatabaseConnection.getConnection();
    }

    public list(): OrderModel[] {
        return this.databaseConnection.getData('/orders');
    }

    public create(order: OrderModel): OrderModel {
        this.databaseConnection.push('/orders[]', order);
        return order;
    }

    public delete(orderID: string): string {
        const index = this.getOrderIndexByID(orderID);
        if (index > -1) {
            this.databaseConnection.delete(`/orders[${index}]`)
            return orderID;
        }
    }

    public getByID(orderID: string): OrderModel {
        const index = this.getOrderIndexByID(orderID);
        if (index > -1) {
            return this.databaseConnection.getData(`/orders[${index}]`)
        }
    }

    public update(order: OrderModel): OrderModel {
        const index = this.getOrderIndexByID(order.id);
        if (index > -1) {
            this.databaseConnection.push(`/orders[${index}]`, order, true)
            return order
        }
    }

    private getOrderIndexByID(orderID: string): number {
        return this.databaseConnection.getIndex('/orders', orderID, 'id');
    }
}