const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // o ruta correcta a tu config de Sequelize

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: "users", // tu tabla en PostgreSQL
  timestamps: false,
});

module.exports = User;
