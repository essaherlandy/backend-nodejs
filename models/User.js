const { DataTypes } = require('sequelize');
const bycript = require('bcryptjs');
const sequelize = require('../database/db');

const User = sequelize.define('user', {
    username:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    //hooks untuk hashing password yang belum disimpan
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                const salt = await bycript.genSalt(10);
                user.password = await bycript.hash(user.password, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function (candidatePassword) {
    return bycript.compare(candidatePassword, this.password);
};

module.exports = User;