const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    // Lấy token từ Header của HTTP Request
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        // Xác thực token
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
            if (err) {
                return res.status(403).json({ status: 'error', message: 'Token không hợp lệ hoặc đã hết hạn!' });
            }
            
            // Gắn thông tin user vào request để Controller dùng
            req.user = decodedUser; 
            next(); // Cho phép đi tiếp vào Controller
        });
    } else {
        res.status(401).json({ status: 'error', message: 'Không tìm thấy Token xác thực!' });
    }
};

module.exports = authenticateUser;