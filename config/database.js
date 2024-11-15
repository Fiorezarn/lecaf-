require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEVELOPMENT,
    password:
      process.env.DB_PASSWORD_DEVELOPMENT === "null"
        ? null
        : process.env.DB_PASSWORD_DEVELOPMENT,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST_DEVELOPMENT,
    port: process.env.DB_PORT_DEVELOPMENT,
    dialect: process.env.DB_DIALECT_DEVELOPMENT,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME_PRODUCTION,
    password: process.env.DB_PASSWORD_PRODUCTION,
    database: process.env.DB_NAME_PRODUCTION,
    host: process.env.DB_HOST_PRODUCTION,
    port: process.env.DB_PORT_PRODUCTION,
    dialect: process.env.DB_DIALECT_PRODUCTION,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
