/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, ShoppingBag, CheckCircle, Percent, Loader2, Download, CalendarCheck, Check, Ban, Eye, Layers } from 'lucide-react';
import { Order, RevenueStats } from '../types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Fetch orders list
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      
      // Fetch analytics stats
      const statsRes = await fetch('/api/analytics-stats');
      const statsData = await statsRes.json();

      if (ordersData.success) {
        setOrders(ordersData.orders);
      }
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Error fetching admin control data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update orders or refetch
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        // Refetch to recalculate stats in real-time
        const statsRes = await fetch('/api/analytics-stats');
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }
      } else {
        alert(data.message || 'Thay đổi trạng thái thất bại.');
      }
    } catch (err) {
      console.error(err);
      alert('Không kết nối được cổng kiểm duyệt.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadReport = () => {
    // Prompt download location link directly
    window.open('/api/reports/export', '_blank');
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3" id="admin-dashboard-loading">
        <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
        <span className="text-sm font-semibold text-slate-500 animate-pulse">Đang thu nạp báo cáo tài chính và sổ cái...</span>
      </div>
    );
  }

  // Find colors for order tags
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'Chờ xác nhận': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Đã thanh toán': return 'bg-blue-100 text-blue-850 border-blue-200';
      case 'Đang giao hàng': return 'bg-indigo-100 text-indigo-805 border-indigo-200';
      case 'Đã hoàn thành': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Đã hủy': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Safe variables for SVG math
  const maxRevenueInMonth = stats ? Math.max(...stats.byMonth.map(m => m.revenue), 1) : 1;

  return (
    <div className="space-y-8" id="admin-dashboard-panel">
      
      {/* Top Banner Control */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5.5 h-5.5 text-emerald-400" />
            <span className="bg-emerald-800 text-emerald-200 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-lg border border-emerald-700/50">
              Quản Trị Tối Cao
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight mt-2.5 text-white">
            Bảng Điều Khiển Tài Chính & Đơn Hàng
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-snug">
            Cập nhật kết quả phân tích doanh số, duyệt hóa đơn VietQR chuyển khoản, xuất báo cáo kết toán tự động gửi ban giám đốc.
          </p>
        </div>

        {/* Download Monthly Report Button Trigger */}
        <button
          onClick={handleDownloadReport}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm shrink-0"
        >
          <Download className="w-4.5 h-4.5" />
          <span>Xuất Báo Cáo Tài Chính Tháng 5/2026 (TXT)</span>
        </button>
      </div>

      {stats && (
        /* Executive Metrics Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-kpi-row">
          {/* KPI 1: Sales */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doanh thu hoàn tất</span>
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100">
                <TrendingUp className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight">
                {formatVND(stats.totalSales)}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Tổng cộng hóa đơn đã chốt sổ</p>
            </div>
          </div>

          {/* KPI 2: Total Orders */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số đơn hàng</span>
              <div className="bg-blue-50 text-blue-800 p-2.5 rounded-xl border border-blue-100">
                <ShoppingBag className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight">
                {stats.totalOrders} đơn hàng
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Bao gồm cả COD và chuyển khoản nháp</p>
            </div>
          </div>

          {/* KPI 3: Fulfillment success rate */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tỷ lệ hoàn thành</span>
              <div className="bg-indigo-50 text-indigo-800 p-2.5 rounded-xl border border-indigo-100">
                <Percent className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight">
                {stats.totalOrders > 0 
                  ? Math.round((stats.completedOrdersCount / stats.totalOrders) * 100) 
                  : 0}%
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                {stats.completedOrdersCount} đơn được kết toán thành công
              </p>
            </div>
          </div>

          {/* KPI 4: Avg Ticket */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giá trị trung bình đơn</span>
              <div className="bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-100">
                <CalendarCheck className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight">
                {formatVND(stats.averageOrderValue)}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Mỗi đơn hàng Bonsai đã kết toán</p>
            </div>
          </div>
        </div>
      )}

      {stats && (
        /* Visual Analytics Diagrams Grid (Premium Interactive Custom Responsive SVGs) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="financial-svg-diagrams">
          
          {/* Revenue by Month bar chart SVG */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              Cát Đồ Doanh Số Thống Kê 5 Tháng Đầu Năm 2026
            </h3>
            
            <div className="w-full flex items-end justify-between h-[180px] pt-4 px-2 bg-slate-50 border border-slate-100 rounded-xl relative">
              {/* Background horizontal dashed guides */}
              <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
                <div className="border-t border-dashed border-slate-200/60" />
                <div className="border-t border-dashed border-slate-200/60" />
                <div className="border-t border-dashed border-slate-200/60" />
              </div>

              {stats.byMonth.map((m) => {
                const heightPercent = Math.max(Math.round((m.revenue / maxRevenueInMonth) * 140), 10);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center group relative z-10" title={`${m.month}: ${formatVND(m.revenue)}`}>
                    
                    {/* Tooltip on hover */}
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                      {formatVND(m.revenue)} ({m.orders} đơn)
                    </span>

                    {/* Bar graphic with elegant shade gradients */}
                    <div 
                      style={{ height: `${heightPercent}px` }}
                      className="w-8 sm:w-12 bg-gradient-to-t from-emerald-800 to-emerald-500 rounded-t-md hover:from-emerald-700 hover:to-emerald-400 transition-all shadow-xs cursor-pointer"
                    />

                    {/* Label */}
                    <span className="text-[9px] font-bold text-slate-500 mt-2.5 rotate-[-5deg] sm:rotate-0 truncate block w-full text-center">
                      {m.month.replace('Tháng ', 'T')}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold text-center mt-3">
              (*) Doanh số hiển thị bao gồm giá trị chuyển khoản ngân hàng hoàn tất và nợ COD chờ thanh toán.
            </div>
          </div>

          {/* Product Category allocation chart */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              Doanh Số Chia Theo Họ Tùng (VND)
            </h3>

            <div className="space-y-3.5">
              {stats.byCategory.map((cat, idx) => {
                const totalIncome = stats.byCategory.reduce((sum, c) => sum + c.value, 0);
                const percent = Math.round((cat.value / totalIncome) * 100);
                
                // Color variations
                const colorMap = [
                  'bg-emerald-600',
                  'bg-blue-600',
                  'bg-indigo-600',
                  'bg-amber-600',
                  'bg-rose-600',
                  'bg-teal-600'
                ];
                const bgClass = colorMap[idx % colorMap.length];

                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded-full ${bgClass} inline-block`} />
                        {cat.name}
                      </span>
                      <span className="font-semibold text-slate-500">
                        {formatVND(cat.value)} <span className="font-black text-slate-850">({percent}%)</span>
                      </span>
                    </div>

                    {/* Horizontal progression bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${bgClass} rounded-full transition-all`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Order List administration table */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs" id="admin-orders-table-wrapper">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-805 font-serif">Danh Sách Quản Lý Đơn Hàng Độc Bản</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sử dụng thanh công cụ lọc trạng thái để kết toán thủ công COD/VietQR</p>
          </div>

          {/* Quick Filter tabs toolbar status */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'Chờ xác nhận', label: 'Chờ xác nhận' },
              { value: 'Đã thanh toán', label: 'Đã thanh toán' },
              { value: 'Đang giao hàng', label: 'Đang giao' },
              { value: 'Đã hoàn thành', label: 'Hoàn thành' },
              { value: 'Đã hủy', label: 'Đã hủy' }
            ].map((tag) => (
              <button
                key={tag.value}
                onClick={() => setFilterStatus(tag.value)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                  filterStatus === tag.value
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white text-slate-650 border-slate-205 hover:bg-slate-100'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            Không tìm thấy thông tin đơn hàng nào thuộc bộ lọc này.
          </div>
        ) : (
          /* Responsive Table System containing order logs */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Mã Đơn</th>
                  <th className="py-4 px-6">Khách Hàng / Ghi Chú</th>
                  <th className="py-4 px-6">Bonsai Đặt mua</th>
                  <th className="py-4 px-6">Giá trị đặt</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Hành động duyệt nhanh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Code ID */}
                    <td className="py-4 px-6">
                      <span className="font-mono font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {order.id}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-2.5 font-semibold">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-slate-800">{order.customerName}</div>
                      <div className="text-slate-500 font-medium text-xs mt-0.5">{order.customerPhone}</div>
                      <div className="text-[11px] text-slate-450 line-clamp-1 mt-1 font-medium">{order.shippingAddress}</div>
                      {order.notes && (
                        <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50 inline-block mt-2">
                          💡 Ghi chú: {order.notes}
                        </div>
                      )}
                    </td>

                    {/* Items miniature */}
                    <td className="py-4 px-6">
                      <div className="space-y-1.5 max-w-sm">
                        {order.items.map((itm, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs">
                            <span className="font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                              x{itm.quantity}
                            </span>
                            <span className="font-bold text-slate-705 truncate" title={itm.productName}>
                              {itm.productName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Code price */}
                    <td className="py-4 px-6">
                      <div className="font-black text-rose-600 font-sans">{formatVND(order.totalAmount)}</div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-1">
                        Cổng: {order.paymentMethod === 'ck_nganhang' ? 'VietQR 24/7' : 'COD Tại Nhà'}
                      </div>
                    </td>

                    {/* Progress tag */}
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-lg border shadow-xs ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Interactive dropdown/status patchers */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 px-2.5 text-xs text-slate-550 border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1 font-semibold cursor-pointer"
                          title="Xem Chi Tiết Sổ Cái"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
                        </button>

                        {order.status === 'Chờ xác nhận' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateOrderStatus(order.id, 'Đã thanh toán')}
                            className="bg-emerald-700 hover:bg-emerald-850 text-white text-xs font-bold p-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Duyệt QR</span>
                          </button>
                        )}

                        {order.status === 'Đã thanh toán' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateOrderStatus(order.id, 'Đang giao hàng')}
                            className="bg-indigo-650 hover:bg-indigo-850 text-white text-xs font-bold p-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <span>Giao hàng</span>
                          </button>
                        )}

                        {order.status === 'Đang giao hàng' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateOrderStatus(order.id, 'Đã hoàn thành')}
                            className="bg-emerald-600 hover:bg-emerald-800 text-white text-xs font-bold p-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <span>Hoàn thành</span>
                          </button>
                        )}

                        {order.status !== 'Đã hoàn thành' && order.status !== 'Đã hủy' && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateOrderStatus(order.id, 'Đã hủy')}
                            className="text-rose-600 hover:bg-rose-50 border border-rose-100 text-xs font-bold p-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Hủy</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill detailed modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" id="ledger-detail-modal">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5.5 h-5.5" />
            </button>
            
            <div className="text-center font-serif pb-3 border-b border-rose-100">
              <h2 className="text-lg font-black text-rose-950 uppercase tracking-wide">HÓA ĐƠN ĐỐI SOÁT CHI TIẾT</h2>
              <span className="text-xs text-slate-450 font-sans">VƯỜN TÙNG BONSAI VIỆT CO., LTD</span>
            </div>

            <div className="space-y-2 text-xs text-slate-650">
              <div className="flex justify-between">
                <span>Số tham chiếu đơn:</span>
                <span className="font-mono font-bold text-slate-800">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày kết toán nháp:</span>
                <span className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tên khách hàng:</span>
                <span className="font-bold text-slate-800">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Số điện thoại:</span>
                <span className="font-bold">{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Địa chỉ chuyển phát:</span>
                <span className="font-semibold text-right max-w-[320px]">{selectedOrder.shippingAddress}</span>
              </div>
              <div className="flex justify-between">
                <span>Hình thức thanh toán:</span>
                <span className="font-bold text-emerald-800">
                  {selectedOrder.paymentMethod === 'ck_nganhang' ? 'Chuyển Khoản Trực Tuyến' : 'Giao hàng Thu hộ COD'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái đơn:</span>
                <span className={`font-black uppercase px-2 py-0.5 rounded-sm text-[10px] border ${getStatusStyle(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-3 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Chi tiết tác phẩm:</span>
              <div className="space-y-1 bg-slate-55/60 p-3 rounded-lg border border-slate-100">
                {selectedOrder.items.map((itm, i) => (
                  <div key={i} className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{itm.productName} (x{itm.quantity})</span>
                    <span>{formatVND(itm.price * itm.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-800">Cộng tổng thanh toán:</span>
                <span className="text-base font-black text-rose-600 font-sans">
                  {formatVND(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-medium">
              Văn bản gốc lưu trữ kẹp hồ sơ vườn tùng.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
