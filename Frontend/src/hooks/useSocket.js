import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  // 1. Sửa lỗi khai báo: Thêm [socket, setSocket]
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Kết nối tới cổng 5000 của Backend
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Dọn dẹp: Ngắt kết nối khi component unmount
    return () => newSocket.disconnect();
  }, []);
  return socket;
};
