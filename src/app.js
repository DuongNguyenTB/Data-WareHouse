const express = require('express');
const cors = require('cors');

// Khởi tạo ứng dụng Express
const app = express();

// 1. Khai báo Middlewares rào chắn cơ bản
app.use(cors()); // Cho phép Frontend (React) gọi API
app.use(express.json()); // Phân tích payload JSON từ Client
app.use(express.urlencoded({ extended: true }));

// 2. Route kiểm tra sức khỏe hệ thống (Health Check)
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Hệ thống Backend Quản trị Kho đang hoạt động mượt mà!' 
    });
});

const errorHandler = require('./middlewares/errorMiddleware');
module.exports = app;

// Import và gắn các luồng API
const productRoutes = require('./routes/productRoutes');
app.use('/api/v1/products', productRoutes);

const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/api/v1/inventory', inventoryRoutes);

const outboundRoutes = require('./routes/outboundRoutes');
app.use('/api/v1/outbound', outboundRoutes);

const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/v1/analytics', analyticsRoutes);

const auditRoutes = require('./routes/auditRoutes');
app.use('/api/v1/audit', auditRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/v1/auth', authRoutes);

const inventoryRoutes = require('./routes/inventoryRoutes');
router.post('/transfer', authenticateUser, InventoryController.handleTransfer); 

const analyticsRoutes = require('./routes/analyticsRoutes');
router.get('/summary', authenticateUser, AnalyticsController.getDashboardSummary);

const supplierRoutes = require('./routes/supplierRoutes');
app.use('/api/v1/suppliers', supplierRoutes);

app.use(errorHandler);