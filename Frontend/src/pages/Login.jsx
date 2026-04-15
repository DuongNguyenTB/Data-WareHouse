import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang web bị load lại
    setLoading(true);
    try {
      // Gửi yêu cầu tới API Backend Node.js của bạn
      const res = await apiClient.post('/auth/login', form);
      
      // Nếu thành công, lưu Token vào Context và LocalStorage
      if (res.data.status === 'success') {
        login(res.data.data.user, res.data.data.token);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể kết nối tới máy chủ Backend!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Đăng nhập WMS</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({...form, username: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({...form, password: e.target.value})} 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
          >
            {loading? 'ĐANG XỬ LÝ...' : 'VÀO HỆ THỐNG'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;