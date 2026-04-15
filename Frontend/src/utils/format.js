// Định dạng ngày tháng (VD: 31/12/2026)
export const formatDate = (dateString) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };
  
  // Định dạng số lượng (VD: 1.000)
  export const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };