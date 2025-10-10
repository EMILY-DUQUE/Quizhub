const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Quizhub", "postgres", "Hk1143985102", {
  host: "localhost",
  port: 5433,
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
