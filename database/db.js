const { Sequelize, Model } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
   dialect: 'postgres',
   logging: false, 
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has ben estabihished successfully.');
    } catch (error) {
        console.error('Unable to connect to the database', error);
    }
}

testConnection();

module.exports = sequelize;