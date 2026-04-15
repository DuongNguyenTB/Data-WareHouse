import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { ClipboardCheck, ShieldAlert } from 'lucide-react';

const Audit = () => {
  // 1. Đã sửa: Xóa bỏ dòng `const Audit = () => {` bị lặp thừa

  // 2. Đã sửa: Khai báo state binCode để ô input hoạt động được
  const [binCode, setBinCode] = useState("");
  
  // (Mình vẫn giữ lại scanCode phòng trường hợp sau này bạn tích hợp máy quét mã vạch nhé)
  const [items, setItems] = useState([]);
  const [adjustment, setAdjustment] = useState({ actualQty: 0, reason: "" });

  const fetchStock = async () => {
    try {
      const res = await apiClient.get(`/audit/bin/${binCode}`);
      setItems(res.data.data);
    // 3. Tối ưu: Xóa (err) để tránh lỗi ESLint
    } catch { 
      alert("Kệ trống hoặc không tồn tại!"); 
    }
  };

  const confirmAdjustment = async (item) => {
    try {
      await apiClient.post('/audit/adjust', {
        binCode: binCode,
        sku: item.sku,
        expectedQty: item.expectedQty,
        // Tối ưu: Ép kiểu dữ liệu về dạng số (Number) để backend dễ xử lý hơn
        actualQty: Number(adjustment.actualQty), 
        reason: adjustment.reason
      });
      alert("Đã phê duyệt điều chỉnh số dư!");
      fetchStock();
    } catch { 
      alert("Lỗi phê duyệt!"); 
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardCheck /> Kiểm kê & Cân đối tồn kho</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border flex gap-4 max-w-md">
        <input 
          type="text" 
          placeholder="Nhập mã kệ (VD: A-01-01)" 
          className="flex-1 p-2 border rounded" 
          value={binCode} 
          onChange={e => setBinCode(e.target.value)} 
        />
        <button onClick={fetchStock} className="bg-blue-600 text-white px-5 rounded font-bold hover:bg-blue-700">
          KIỂM TRA
        </button>
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="col-span-1">
            <p className="text-xs text-gray-400 font-bold uppercase">Sản phẩm</p>
            <p className="font-bold">{item.name} ({item.sku})</p>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <p className="text-xs text-gray-500">Sổ sách</p>
            <p className="text-xl font-bold">{item.expectedQty}</p>
          </div>
          <div className="space-y-2">
            <input 
              type="number" 
              placeholder="Thực tế đếm" 
              className="w-full p-2 border rounded" 
              onChange={e => setAdjustment({...adjustment, actualQty: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="Lý do sai lệch" 
              className="w-full p-2 border rounded text-xs" 
              onChange={e => setAdjustment({...adjustment, reason: e.target.value})} 
            />
          </div>
          <button onClick={() => confirmAdjustment(item)} className="bg-yellow-500 text-white py-3 rounded font-bold hover:bg-yellow-600 transition flex items-center justify-center gap-2">
            <ShieldAlert size={18}/> PHÊ DUYỆT SỬA
          </button>
        </div>
      ))}
    </div>
  );
};

export default Audit;