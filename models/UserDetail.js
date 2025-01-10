const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User');

const UserDetail = sequelize.define('user_detail', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    postal_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subdistrict: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    job: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});

UserDetail.belongsTo(User, { foreignKey: 'user_id'});
User.hasOne(UserDetail, {foreignKey: 'user_id'});

module.exports = UserDetail;