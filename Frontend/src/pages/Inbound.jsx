import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Truck, ArrowLeftRight, CheckCircle } from 'lucide-react';

const Inbound = () => {
  const [inboundForm, setInboundForm] = useState({ barcode: '', binCode: '', quantity: 0, batchNo: '', expiryDate: '' });
  const [transferForm, setTransferForm] = useState({ sku: '', sourceBin: '', destBin: '', quantity: 0 });

  const handleInbound = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/inventory/inbound', inboundForm);
      alert("Nhập kho thành công! Giao dịch ACID đã được ghi nhận.");
      setInboundForm({ barcode: '', binCode: '', quantity: 0, batchNo: '', expiryDate: '' });
    } catch (err) { alert(err.response?.data?.message); }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/inventory/transfer', transferForm);
      alert("Điều chuyển thành công!");
      setTransferForm({ sku: '', sourceBin: '', destBin: '', quantity: 0 });
    } catch (err) { alert(err.response?.data?.message); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Khối Nhập Kho */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Truck className="text-blue-600"/> Nhập kho thông minh</h2>
        <form onSubmit={handleInbound} className="space-y-4">
          <input type="text" placeholder="Quét mã vạch sản phẩm" className="w-full p-2 border rounded" value={inboundForm.barcode} onChange={e => setInboundForm({...inboundForm, barcode: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Mã ô kệ (VD: A-01-01)" className="p-2 border rounded" value={inboundForm.binCode} onChange={e => setInboundForm({...inboundForm, binCode: e.target.value})} required />
            <input type="number" placeholder="Số lượng" className="p-2 border rounded" value={inboundForm.quantity} onChange={e => setInboundForm({...inboundForm, quantity: e.target.value})} required />
          </div>
          <input type="date" className="w-full p-2 border rounded" value={inboundForm.expiryDate} onChange={e => setInboundForm({...inboundForm, expiryDate: e.target.value})} />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">XÁC NHẬN NHẬP</button>
        </form>
      </div>

      {/* Khối Điều Chuyển */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ArrowLeftRight className="text-indigo-600"/> Điều chuyển nội bộ</h2>
        <form onSubmit={handleTransfer} className="space-y-4">
          <input type="text" placeholder="Mã SKU sản phẩm" className="w-full p-2 border rounded" value={transferForm.sku} onChange={e => setTransferForm({...transferForm, sku: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Từ kệ" className="p-2 border rounded" value={transferForm.sourceBin} onChange={e => setTransferForm({...transferForm, sourceBin: e.target.value})} required />
            <input type="text" placeholder="Đến kệ" className="p-2 border rounded" value={transferForm.destBin} onChange={e => setTransferForm({...transferForm, destBin: e.target.value})} required />
          </div>
          <input type="number" placeholder="Số lượng chuyển" className="w-full p-2 border rounded" value={transferForm.quantity} onChange={e => setTransferForm({...transferForm, quantity: e.target.value})} required />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">XÁC NHẬN CHUYỂN</button>
        </form>
      </div>
    </div>
  );
};
export default Inbound;