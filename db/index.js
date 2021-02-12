"use strict";

const { Pool } = require('pg');
const { DB } = require('../config');
require("dotenv").config();

const devConfig = `postgresql://${DB.PG_USER}:${DB.PG_PASSWORD}@${DB.PG_HOST}:${DB.PG_PORT}/${DB.PG_DATABASE}`;

const proConfig = process.env.DATABASE_URL; //heroku addons

const pool = new Pool({
    connectionString:
      process.env.NODE_ENV === "production" ? proConfig : devConfig,
});

module.exports = {
  query: (text, params) => pool.query(text, params)
}