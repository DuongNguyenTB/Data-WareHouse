import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Dùng callback và try...catch để khởi tạo User an toàn
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('wh_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu User từ localStorage:", error);
      localStorage.removeItem('wh_user'); // Xóa dữ liệu rác nếu bị lỗi
      return null;
    }
  });

  // 2. Đồng bộ dùng callback (Lazy init) cho Token để tối ưu hiệu suất
  const [token, setToken] = useState(() => {
    return localStorage.getItem('wh_token') || null;
  });

  // Hàm xử lý đăng nhập
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('wh_user', JSON.stringify(userData));
    localStorage.setItem('wh_token', userToken);
  };

  // Hàm xử lý đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wh_user');
    localStorage.removeItem('wh_token');
    
    // Nếu bạn muốn giữ nguyên việc reload trang thì dùng dòng này:
    window.location.href = '/login'; 
    
    // Gợi ý: Nếu muốn chuyển trang mượt mà bằng React Router, 
    // hãy xóa dòng window.location.href đi và xử lý điều hướng ở nơi gọi hàm logout().
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);