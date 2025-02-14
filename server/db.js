const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '157.230.188.42',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin_password',
  database: process.env.DB_NAME || 'coursecritic',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  debug: true // Temporarily enable debug
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL Connection Error Details:', {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      host: pool.config.connectionConfig.host,
      user: pool.config.connectionConfig.user,
      database: pool.config.connectionConfig.database
    });
    return;
  }
  console.log('Successfully connected to MySQL at', pool.config.connectionConfig.host);
  connection.release();
});

const promisePool = pool.promise();
module.exports = promisePool;
