import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const Scanner = ({ onScanSuccess }) => {
  useEffect(() => {
    // Khởi tạo máy quét với khung quét 250px
    const scanner = new Html5QrcodeScanner("reader", { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    });

    scanner.render(
        // Tham số 1: Hàm xử lý khi quét thành công
        (decodedText) => {
          onScanSuccess(decodedText); 
        },
        // Tham số 2: Hàm xử lý khi quét lỗi
        // Sửa lỗi gạch đỏ: Để trống () hoặc dùng (_err) để ESLint không báo lỗi "chưa sử dụng"
        () => {
          // Logic xử lý lỗi nếu cần (hiện tại để trống để tránh rác console)
        }
      );

    // Dọn dẹp bộ nhớ khi tắt component
    return () => {
      scanner.clear().catch(error => console.error("Lỗi đóng camera:", error));
    };
  // Sửa lỗi cú pháp: Thêm mảng rỗng [] để camera chỉ khởi tạo đúng 1 lần
  }, []); 

  return (
    <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
      <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
      <p className="text-sm text-gray-500 mt-3 text-center italic">
        Vui lòng đưa mã vạch của sản phẩm vào tâm khung hình
      </p>
    </div>
  );
};

export default Scanner;