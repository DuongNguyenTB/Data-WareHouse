import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Truck, ClipboardCheck, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { 
      name: 'Tổng quan', 
      path: '/dashboard', // Hoặc '/' tùy vào routing của bạn
      icon: <LayoutDashboard size={20} />, 
      roles: ['admin', 'manager', 'staff'] // Thêm các role được phép truy cập
    },
    { 
      name: 'Sản phẩm', 
      path: '/products', 
      icon: <Package size={20} />, 
      roles: ['admin', 'manager', 'staff'] 
    },
    { 
      name: 'Nhập kho', 
      path: '/inbound', 
      icon: <Truck size={20} />, 
      roles: ['admin', 'manager', 'staff'] 
    },
    { 
      name: 'Kiểm kê', 
      path: '/audit', 
      icon: <ClipboardCheck size={20} />, 
      roles: ['admin', 'manager'] // Ví dụ: Chỉ admin/manager mới được kiểm kê
    },
    { 
      name: 'Dự báo (MIS)', 
      path: '/analytics', 
      icon: <BarChart3 size={20} />, 
      roles: ['admin'] // Ví dụ: Chỉ admin mới xem được báo cáo MIS
    },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-500 text-center">Smart WMS</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems
         // Đảm bảo user.role tồn tại trong mảng roles của item đó
         .filter(item => item.roles.includes(user?.role))
         .map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({isActive}) => 
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
                }`
              }
            >
              {item.icon} <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="mb-4 px-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Người dùng</p>
          {/* Đã sửa: Nối liền toán tử || (trước đó bị ngắt dòng hoặc thừa dấu cách) */}
          <p className="text-sm font-semibold truncate">{user?.fullName || user?.username}</p>
        </div>
        <button 
          onClick={logout} 
          className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg w-full transition"
        >
          <LogOut size={20} /> <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;