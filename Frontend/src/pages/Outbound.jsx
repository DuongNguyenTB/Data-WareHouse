import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { ShoppingCart, ListChecks } from 'lucide-react';

const Outbound = () => {
  // 1. Sửa lỗi khai báo: Đã thêm [sku, setSku]
  const [sku, setSku] = useState("");
  
  // 2. Sửa lỗi sập trang: Thêm [suggestions, setSuggestions] và MẢNG RỖNG []
  const [suggestions, setSuggestions] = useState([]);

  const getFEFOSuggestion = async () => {
    try {
      const res = await apiClient.get(`/outbound/suggest/${sku}`);
      setSuggestions(res.data.data);
    // 3. Tối ưu: Xóa (err) để tránh lỗi ESLint
    } catch { 
      alert("Sản phẩm không có sẵn trong kho!"); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-600">
          <ShoppingCart /> Gợi ý nhặt hàng tối ưu (FEFO)
        </h2>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Nhập mã SKU cần xuất..." 
            className="flex-1 p-2.5 border rounded-lg" 
            value={sku} 
            onChange={e => setSku(e.target.value)} 
          />
          <button 
            onClick={getFEFOSuggestion} 
            className="bg-gray-800 text-white px-6 rounded-lg font-medium hover:bg-black transition"
          >
            TÌM HÀNG
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">Vị trí Kệ</th>
                <th className="px-6 py-4 text-left">Số lượng tồn</th>
                <th className="px-6 py-4 text-left">Ngày hết hạn</th>
                <th className="px-6 py-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {suggestions.map((item, idx) => (
                // Đổi màu nền xanh cho item đầu tiên (gợi ý nhặt trước)
                <tr key={idx} className={idx === 0 ? "bg-green-50 font-bold" : ""}>
                  <td className="px-6 py-4 font-mono text-blue-700">{item.bin_code}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{new Date(item.expiry_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    {idx === 0 ? <span className="text-green-600 uppercase text-xs">Gợi ý nhặt trước</span> : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Outbound;
