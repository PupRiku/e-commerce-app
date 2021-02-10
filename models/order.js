const db = require('../db');
const moment = require('moment');
const pgp = require('pg-promise')({ capSQL: true });
const OrderItem = require('./orderItem');

module.exports = class OrderModel {

    constructor(data = {}) {
        this.created = data.created || moment.utc().toISOString();
        this.items = data.items || [];
        this.modified = moment.utc().toISOString();
        this.status = data.status || 'PENDING';
        this.total = data.total || 0;
        this.userId = data.userId || null;
    }

    addItems(items)  {
        this.items = items.map(item => new OrderItem(item));
    }

    /**
     * Creates a new order for a user
     * @return  {Object|null}   [Created order record]
     */
    async create() {
        try {

            const { items, ...order} = this;

            // Generate SQL
            const sql = pgp.helpers.insert(order, null, 'orders') + 'RETURNING *';

            // Execute SQL
            const result = await db.query(sql);

            if (result.rows?.length) {

                // Add new info generated in the DB to Order instance
                Object.assign(this, result.rows[0]);

                return result.rows[0];
            }

            return null;

        }catch (err) {
            throw new Error(err)
        }
    }

    /**
     * Updates an order for a user
     * @param   {Object}  id    [Order ID]
     * @param   {Object}  data  [Order data to update]
     * @return  {Object|null}   [Updated order record]
     */
    async update(data) {
        try {

            // Generate SQL
            const condition = pgp.as.format('WHERE id = ${id} RETURNING *', { id: this.id });
            const sql = pgp.helpers.update(data, null, 'orders') + condition;

            // Execute SQL
            const result = await db.query(sql);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err)
        }
    }

    /**
     * Load orders for a user
     * @param   {number}    userId  [User ID]
     * @return  {Array}             [Order records]
     */
    static async findByUser(userId) {
        try {

            // Generate SQL
            const SQL = `SELECT *
                    FROM orders
                    WHERE "userId" = $1`;
            const values = [userId];

            // Execute SQL
            const result = await db.query(sql, values);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;
            
        } catch (err) {
            throw new Error(err)
        }
    }

    /**
     * Retrieve order by ID
     * @param   {number}    orderId [Order ID]
     * @return  {Object|null}       [Order record]
     */
    static async findById(orderId) {
        try {

            // Generate SQL
            const sql = `SELECT *
                    FROM orders
                    WHERE id = $1`;
            const values = [orderId];

            // Execute SQL
            const result = await db.query(sql, values);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }
}