const db = require('../db');

module.exports = class ProductModel {
    /**
     * List products
     * @param {Object} options [Query options]
     * @return {Array} [Array of products]
     */
    async find(options = {}) {
        try {
            const sql = `SELECT *
                    FROM products`;
            const values = [];

            const result = await db.query(sql, values)

            if (result.rows?.length) {
                return result.rows;
            }

            return [];

        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieve product by ID
     * @param {Object}  id [Product ID]
     * @return {Object|null}    [Product record]
     */
    async findOne(id) {
        try {

            const sql = `SELECT *
                    FROM products
                    WHERE id = $1`;
            const values = [id];

            const result = await db.query(sql, values);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw err;
        }
    }
}