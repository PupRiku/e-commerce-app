const db = require('../db');
const moment = require('moment');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class CartModel {

    constructor(data = {}) {
        this.created = data.created || moment.utc().toISOString();
        this.modified = moment.utc().toISOString();
        this.converted = data.converted || null;
        this.isActive = data.isActive || true;
    }

    /**
     * Creates a new cart for a user
     * @param   {Object}    data    [User data]
     * @return  {Object|null}       [Created user record]
     */

    async create(userId) {
        try {

            const data = { userId, ...this };

            // Generate SQL
            const sql = pgp.helpers.insert(data, null, 'carts') + 'RETURNING *';

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
     * Loads a cart by User ID
     * @param  {number}      id [User ID]
     * @return {Object|null}    [Cart record]
     */
    static async findOneByUser(userId) {
        try {

            // Generate SQL
            const sql = `SELECT *
                    FROM carts
                    WHERE "userId" = $1`;
            const values = [userId];

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

    /**
    * Loads a cart by ID
    * @param  {number}      id [Cart ID]
    * @return {Object|null}    [Cart record]
    */
    static async findOneById(id) {
        try {

            // Generate SQL
            const sql = `SELECT *
                    FROM carts
                    WHERE "id" = $1`;
            const values = [id];

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