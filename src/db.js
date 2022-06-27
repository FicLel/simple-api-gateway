import mysql from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createPool({
  host            : process.env.DB_HOST,
  port            : process.env.DB_PORT,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_DATABASE,
  connectionLimit: 5
});


export default connection;
