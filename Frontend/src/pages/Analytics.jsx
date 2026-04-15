import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BrainCircuit, TrendingUp } from 'lucide-react';

const Analytics = () => {
  const [sku, setSku] = useState("");
  const [alpha, setAlpha] = useState(0.3);
  const [forecastData, setForecastData] = useState(null);

  const runForecast = async () => {
    try {
      const res = await apiClient.get(`/analytics/forecast/${sku}?alpha=${alpha}`);
      const rawHistory = res.data.data.historicalDemands;
      // Chuẩn hóa dữ liệu cho biểu đồ Recharts
      const chartData = rawHistory.map((val, idx) => ({ month: `Tháng ${idx + 1}`, quantity: val }));
      setForecastData({...res.data.data, chartData });
    } catch { alert("Thiếu dữ liệu lịch sử để dự báo!"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <BrainCircuit className="text-purple-600" /> Dự báo Nhu cầu Thông minh
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4 border-r pr-6">
        <p className="text-sm text-gray-500 italic">
          {"Thuật toán sử dụng công thức: $F_{t+1} = \\alpha D_t + (1 - \\alpha) F_t$"}
          </p>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Mã SKU</label>
            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full p-2 border rounded" placeholder="VD: SKU-001" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Hệ số Alpha ($\alpha$): {alpha}</label>
            <input type="range" min="0.1" max="0.9" step="0.1" value={alpha} onChange={(e) => setAlpha(e.target.value)} className="w-full" />
          </div>
          <button onClick={runForecast} className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition">CHẠY PHÂN TÍCH</button>
        </div>

        <div className="lg:col-span-3 h-[400px]">
          {forecastData? (
            <div className="h-full flex flex-col">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-purple-600 font-bold uppercase">Dự báo tháng tới</p>
                  <p className="text-2xl font-bold">{forecastData.forecastedDemandNextMonth} đơn vị</p>
                </div>
                <div className="flex-1 bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-blue-600 font-bold uppercase">Điểm ROP gợi ý</p>
                  <p className="text-2xl font-bold">{forecastData.suggestedROP} đơn vị</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="quantity" stroke="#9333ea" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic bg-gray-50 rounded-lg">
              Nhập mã SKU và Alpha để xem biểu đồ xu hướng...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;