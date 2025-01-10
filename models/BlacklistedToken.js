const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const BlacklistedToken = sequelize.define('blacklisted_token', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }, 
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

module.exports = BlacklistedToken;