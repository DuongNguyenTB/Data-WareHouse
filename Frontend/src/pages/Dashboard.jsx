import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { io } from 'socket.io-client';
import { Package, AlertTriangle, Database, Bell } from 'lucide-react';

const Dashboard = () => {
  // 1. Sửa lỗi khai báo state: Thêm [stats, setStats]
  const [stats, setStats] = useState({ TotalSKUs: 0, LowStockItems: 0, TotalUnitsInStock: 0 });
  
  // 2. Sửa lỗi mảng rỗng: Để mặc định là [] tránh lỗi crash khi gọi alerts.length
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Tải dữ liệu báo cáo tổng hợp từ Backend
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/analytics/summary');
        // SỬA TẠI ĐÂY: Lấy phần tử đầu tiên của mảng recordset
        setStats(res.data.data || { TotalSKUs: 0, LowStockItems: 0, TotalUnitsInStock: 0 });
      } catch (err) { 
        console.error("Lỗi tải Dashboard:", err); 
      }
    };
    fetchStats();

    // Lắng nghe cảnh báo tồn kho (ROP) thời gian thực
    const socket = io('http://localhost:5000');
    socket.on('stock_alert', (data) => {
      setAlerts(prev => [data, ...prev].slice(0, 10)); // Lưu tối đa 10 cảnh báo mới nhất
    });

    // Dọn dẹp kết nối
    return () => socket.disconnect();
    
  // 4. Sửa lỗi useEffect: Thêm mảng rỗng []
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Bảng Điều Khiển Tổng Quan</h1>
      
      {/* Khối thống kê KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tổng sản phẩm (SKU)" value={stats.TotalSKUs} icon={<Package />} color="blue" />
        <StatCard title="Hàng sắp hết (ROP)" value={stats.LowStockItems} icon={<AlertTriangle />} color="red" />
        <StatCard title="Tổng số lượng tồn" value={stats.TotalUnitsInStock} icon={<Database />} color="green" />
      </div>

      {/* Trung tâm thông báo Real-time */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="text-orange-500" />
          <h2 className="text-lg font-semibold">Thông báo hiện trường tức thời</h2>
        </div>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic border-2 border-dashed rounded-lg">
              Đang theo dõi biến động kho...
            </div>
          ) : (
            alerts.map((alert, idx) => (
              <div key={idx} className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg animate-pulse">
                <p className="text-orange-800 font-medium">{alert.message}</p>
                <p className="text-xs text-orange-600 mt-1">{new Date().toLocaleTimeString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Tối ưu hiển thị Tailwind: Dùng Object để quy định màu tĩnh
const StatCard = ({ title, value, icon, color }) => {
  const colorStyles = {
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    red: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600' },
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' }
  }[color] || { border: 'border-gray-500', bg: 'bg-gray-50', text: 'text-gray-600' };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-b-4 ${colorStyles.border}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-extrabold mt-2 text-gray-800">{value?.toLocaleString() || 0}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorStyles.bg} ${colorStyles.text}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;