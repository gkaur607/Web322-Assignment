const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
const postgresUri = process.env.POSTGRES_URI;

const connectMongo = async () => {
  while (true) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB connected');
      break;
    } catch (err) {
      console.log('MongoDB failed, retrying in 3s...');
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};

const sequelize = new Sequelize(postgresUri, {
  dialect: 'postgres',
  dialectModule: require("pg"),
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  retry: {
    match: [/ECONNREFUSED/, /SequelizeConnectionError/],
    max: Infinity
  }
});

const connectPostgres = async () => {
  while (true) {
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL connected');
      await sequelize.sync({ alter: true });
      break;
    } catch (err) {
      console.log('PostgreSQL failed, retrying in 3s...');
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};

module.exports = { connectMongo, connectPostgres, sequelize };