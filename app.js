const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const sequelize = require('./database/db');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json()); //middleware untuk parsing json

app.use('/api/auth', authRoutes);

sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
