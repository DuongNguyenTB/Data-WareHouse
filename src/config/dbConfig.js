const sql = require('mssql');
require('dotenv').config();

// Cấu hình thông số kết nối lấy từ tệp.env
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    
    pool: {
        max: 10, // Số lượng kết nối tối đa
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // Đặt true nếu bạn dùng Azure SQL
        trustServerCertificate: true // Cần thiết khi chạy localhost
    }
};

// Hàm khởi tạo kết nối Database
const connectDB = async () => {
    try {
        const pool = await sql.connect(sqlConfig);
        console.log(' Kết nối SQL Server thành công!');
        return pool;
    } catch (error) {
        console.error(' Lỗi kết nối SQL Server:', error.message);
        process.exit(1); // Dừng server nếu không kết nối được DB
    }
};

module.exports = { sql, connectDB };