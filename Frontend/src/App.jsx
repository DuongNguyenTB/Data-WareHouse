import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Analytics from './pages/Analytics';
import Inbound from './pages/Inbound';
import Outbound from './pages/Outbound';
import Audit from './pages/Audit';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Tuyến đường công khai: Ai cũng vào được */}
          <Route path="/login" element={<Login />} />

          {/* Tuyến đường bảo mật: Phải đăng nhập mới thấy, và dùng chung 1 Layout */}
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* Các trang con bên trong Layout (Render thông qua <Outlet /> trong component Layout) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Thêm dòng này để khớp với menu Sidebar */}
            <Route path="/products" element={<Products />} />
            <Route path="/inbound" element={<Inbound />} />
            <Route path="/outbound" element={<Outbound />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          {/* Fallback: Bắt lỗi truy cập đường dẫn không tồn tại (404) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;