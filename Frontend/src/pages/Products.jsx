import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { user } = useAuth();
  
  // 1. Đã sửa: Khai báo đầy đủ [barcode, setBarcode]
  const [barcode, setBarcode] = useState("");
  
  const [product, setProduct] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.get(`/products/barcode/${barcode}`);
      setProduct(res.data.data);
    // 2. Tối ưu: Xóa (err) để tránh lỗi ESLint
    } catch { 
      alert("Không tìm thấy sản phẩm!"); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Danh Mục Sản Phẩm</h1>
        {/* Phân quyền rất chuẩn: Chỉ ADMIN và MANAGER mới thấy nút Thêm */}
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus size={20} /> Thêm sản phẩm
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-md">
          <input 
            type="text" 
            placeholder="Quét hoặc nhập mã vạch..." 
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="flex-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button className="bg-gray-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2">
            <Search size={18} /> Tìm
          </button>
        </form>

        {product && (
          <div className="mt-8 border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">Thông tin sản phẩm</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Giá trị</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="px-6 py-4 font-medium text-gray-600">SKU</td><td className="px-6 py-4 font-mono">{product.sku}</td></tr>
                <tr><td className="px-6 py-4 font-medium text-gray-600">Tên Sản Phẩm</td><td className="px-6 py-4">{product.name}</td></tr>
                <tr><td className="px-6 py-4 font-medium text-gray-600">Ngưỡng ROP</td><td className="px-6 py-4 text-red-600 font-bold">{product.rop}</td></tr>
                <tr><td className="px-6 py-4 font-medium text-gray-600">Tồn kho an toàn</td><td className="px-6 py-4">{product.safety_stock}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;