const db = require('../db');
const moment = require('moment');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class OrderItemModel {

    constructor(data = {}) {
        this.created = data.created || moment.utc().toISOString();
        this.description = data.description;
        this.modified = moment.utc().toISOString;
        this.name = data.price || 0;
        this.productId = data.id;
        this.qty = data.qty || 1;
        this.orderId = data.orderId || null;
    }

    /**
     * Creates a new order item
     * @param {Object}  data [Order item data]
     * @return {Object|null}    [Created order item]
     */
    static async create(data) {
        try {

            // Generate SQL
            const sql = pgp.helpers.insert(data, null, 'orderItems') + 'RETURNING *';

            // Execute SQL
            const result = await db.query(sql);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Retrieve order items for an order
     * @param {Object} orderId [Order ID]
     * @return {Array}  [Created cart item]
     */
    static async find(orderId) {
        try {
            
            // Generate SQL
            const sql = `SELECT
                    oi.qty,
                    oi.id AS "cartItemId".
                    p.*
                FROM "orderItems" oi
                INNER JOIN products p ON p.id = oi."productId"
                WHERE "orderId" = $1`;
            const values = [orderId];

            // Execute SQL
            const result = await db.query(sql, values);

            if (result.rows?.length) {
                return result.rows;
            }

            return [];

        } catch (err) {
            throw new Error(err);
        }
    }

}