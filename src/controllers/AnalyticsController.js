const SalesDAO = require('../dao/SalesDAO');
const ProductDAO = require('../dao/ProductDAO'); 
const ForecastService = require('../services/ForecastService');
const { connectDB } = require('../config/dbConfig'); // ĐÃ BỔ SUNG IMPORT
const { successResponse } = require('../utils/apiResponse'); // SỬ DỤNG UTILS

class AnalyticsController {
    // 1. API Chạy thuật toán Dự báo nhu cầu
    static async runDemandForecast(req, res, next) {
        try {
            const { sku } = req.params;
            const alpha = parseFloat(req.query.alpha) || 0.3; 

            // Lấy dữ liệu sản phẩm
            const productRes = await ProductDAO.findByBarcode(sku); 
            if (!productRes || productRes.length === 0) {
                return res.status(404).json({ status: 'error', message: 'Không tìm thấy sản phẩm' });
            }
            const productData = productRes; // Trích xuất bản ghi đầu tiên từ mảng

            // Lấy lịch sử xuất kho trong 6 tháng
            const historicalDemands = await SalesDAO.getHistoricalData(sku);
            
            if (historicalDemands.length === 0) {
                return successResponse(res, 200, 'Chưa có đủ dữ liệu lịch sử để chạy dự báo.', { forecastedDemand: 0 });
            }

            // Chạy thuật toán San bằng số mũ (Exponential Smoothing) [3, 4]
            const forecastedDemand = ForecastService.calculateExponentialSmoothing(historicalDemands, alpha);

            // Tính toán Điểm đặt hàng lại (ROP) [5]
            const leadTimeDays = 7; 
            const dailyDemand = forecastedDemand / 30; 
            const safetyStock = productData.safety_stock || 10;
            
            const rop = Math.round((dailyDemand * leadTimeDays) + safetyStock);

            return successResponse(res, 200, 'Dự báo hoàn tất', {
                sku: sku,
                historicalDemands: historicalDemands, 
                forecastedDemandNextMonth: forecastedDemand,
                suggestedROP: rop,
                alphaUsed: alpha
            });

        } catch (error) {
            next(error);
        }
    }

    // 2. API Lấy thông tin tổng quát Dashboard (MIS Summary) [5]
    static async getDashboardSummary(req, res, next) {
        try {
            const pool = await connectDB();
            const stats = await pool.request().query(`
                SELECT 
                    (SELECT COUNT(*) FROM Products) as TotalSKUs,
                    (SELECT COUNT(*) FROM Inventories WHERE quantity <= (SELECT rop FROM Products WHERE id = product_id)) as LowStockItems,
                    (SELECT SUM(quantity) FROM Inventories) as TotalUnitsInStock
            `);
            
            // Trả về bản ghi duy nhất chứa các con số tổng hợp
            return successResponse(res, 200, 'Tải báo cáo thành công', stats.recordset);
        } catch (error) { 
            next(error); 
        }
    }
}

module.exports = AnalyticsController;