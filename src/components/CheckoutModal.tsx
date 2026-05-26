/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, QrCode, CreditCard, ShieldCheck, HeartHandshake, RefreshCw, Sparkles, Copy, Trash2 } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ck_nganhang' | 'cod'>('ck_nganhang');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes timer
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  // Custom Transaction Code
  const txId = `BST-${Date.now().toString().slice(-6)}`;
  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Timer loop for QR payment validation
  useEffect(() => {
    if (paymentMethod !== 'ck_nganhang') return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentMethod]);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = 'Vui lòng điền họ và tên người nhận.';
    if (!phone.trim()) {
      tempErrors.phone = 'Vui lòng điền số điện thoại liên hệ.';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone.trim())) {
      tempErrors.phone = 'Số điện thoại Việt Nam không hợp lệ (ví dụ: 0912345678).';
    }
    if (!address.trim()) tempErrors.address = 'Vui lòng cung cấp địa chỉ giao Bonsai chi tiết.';
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Địa chỉ email không chính xác.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép: "${text}" vào bộ nhớ tạm!`);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    if (paymentMethod === 'ck_nganhang') {
      setIsVerifyingPayment(true);
      // Simulate fast bank gateway processing
      setTimeout(async () => {
        await executeBackendOrderPost();
      }, 3000);
    } else {
      await executeBackendOrderPost();
    }
  };

  const executeBackendOrderPost = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          shippingAddress: address,
          paymentMethod,
          items: cartItems,
          notes
        })
      });

      const data = await response.json();
      if (data.success) {
        onOrderSuccess(data.order);
      } else {
        alert(data.message || 'Có lỗi khi tiếp nhận đơn hàng. Hãy thử lại nhé!');
      }
    } catch (err) {
      console.error(err);
      alert('Không kết nối được tổng đài Bonsai. Thử lại sau ít phút!');
    } finally {
      setLoading(false);
      setIsVerifyingPayment(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" id="checkout-modal-overlay">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl relative flex flex-col" id="checkout-container">
        
        {/* Header toolbar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-serif">Đặt Hàng & Thanh Toán Trực Tuyến</h2>
            <p className="text-xs text-slate-500 font-medium">Bảo mật giao dịch tuyệt đối, hỗ trợ tư vấn dăm cành trọn đời</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Đóng bảng đặt hàng"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {isVerifyingPayment ? (
          /* Payment gateway verification overlay */
          <div className="p-12 text-center flex-1 flex flex-col items-center justify-center space-y-5" id="checkout-verifying-payment">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />
              <ShieldCheck className="w-8 h-8 text-emerald-600 absolute top-4 left-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Cổng Thanh Toán Trực Tuyến Đang Liên Kết...</h3>
              <p className="text-sm text-slate-550 max-w-sm mx-auto mt-1 leading-relaxed">
                Chúng tôi đang mã hóa kết nối bảo mật với tài khoản thụ hưởng <span className="font-semibold text-emerald-800">Vietcombank</span> của Vườn Tùng Bonsai Việt.
              </p>
            </div>
            <div className="bg-slate-50 px-4 py-2 text-xs font-mono font-bold text-slate-650 rounded-lg border border-slate-150">
              Mã đối soát: {txId} | Trạng thái: Chờ duyệt...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto">
            
            {/* Left side: Information entry */}
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                1. Thông tin giao nhận Bonsai
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fullname */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Họ và tên người nhận *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn Hải"
                    className={`block w-full px-3.5 py-2.5 bg-slate-50 text-slate-850 border rounded-xl text-sm outline-none transition-all ${
                      errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.name}</p>}
                </div>

                {/* Telephone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className={`block w-full px-3.5 py-2.5 bg-slate-50 text-slate-850 border rounded-xl text-sm outline-none transition-all ${
                      errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Địa chỉ Email (Để nhận hóa đơn PDF)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ví dụ: hai.nguyen@gmail.com (Không bắt buộc)"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 text-slate-850 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.email}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Địa chỉ giao Bonsai chi tiết *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  className="block w-full px-3.5 py-2 bg-slate-50 text-slate-850 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                {errors.address && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.address}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ghi chú vận chuyển (Ví dụ: giao xe tải, xếp vỉ đá...)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Hẹn giờ giao, dặn dò đóng khung gỗ bảo vệ..."
                  className="block w-full px-3.5 py-2.5 bg-slate-50 text-slate-850 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              {/* Payment Selectors */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                  2. Chọn hình thức thanh toán trực tuyến bảo mật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Bank transfer item */}
                  <label 
                    onClick={() => setPaymentMethod('ck_nganhang')}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'ck_nganhang'
                        ? 'bg-emerald-50/50 border-emerald-700 ring-2 ring-emerald-500/10'
                        : 'bg-white border-slate-150 hover:border-slate-350'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payMethod" 
                      checked={paymentMethod === 'ck_nganhang'} 
                      readOnly
                      className="mt-1 h-4 w-4 accent-emerald-800" 
                    />
                    <div>
                      <span className="flex items-center gap-1.5 font-bold text-slate-850 text-sm">
                        <QrCode className="w-4.5 h-4.5 text-emerald-800" />
                        Chuyển khoản VietQR Siêu Tốc
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Khuyên dùng. Nhận QR chứa sẵn số tiền và mã chuyển khoản tự động. Phê duyệt giao dịch ngay lập tức.
                      </p>
                    </div>
                  </label>

                  {/* COD item */}
                  <label 
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-amber-50/50 border-amber-600 ring-2 ring-amber-500/10'
                        : 'bg-white border-slate-150 hover:border-slate-350'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payMethod" 
                      checked={paymentMethod === 'cod'} 
                      readOnly
                      className="mt-1 h-4 w-4 accent-amber-600" 
                    />
                    <div>
                      <span className="flex items-center gap-1.5 font-bold text-slate-850 text-sm">
                        <CreditCard className="w-4.5 h-4.5 text-amber-700" />
                        Giao hàng trả tiền mặt (COD)
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Nhận hàng, kiểm tra chất lượng tàn dăm, uốn kẽm của bonsai rồi thanh toán trực tiếp cho nhân viên vận chuyển.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right side: Receipt details and QR codes if ck_nganhang */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider pb-1.5 border-b border-slate-200">
                3. Đơn hàng tóm tắt
              </h3>

              {/* Order item summarized list */}
              <div className="space-y-3 max-h-[140px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-11 h-11 rounded-lg object-cover border border-slate-100 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{item.product.typeName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-xs font-extrabold text-slate-800">x{item.quantity}</span>
                      <span className="block text-[10px] text-slate-500 font-semibold">{formatVND(item.product.price)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secure calculation block */}
              <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-2.5 shadow-xs">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Trọng lượng giao tùng biệt lữ:</span>
                  <span className="font-bold text-slate-700">Giao hành bảo mật riêng biệt</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Phí lưu hóa đơn mộc đỏ:</span>
                  <span className="font-bold text-emerald-800">Miễn phí trọn vẹn</span>
                </div>
                <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">Tổng phí thanh toán:</span>
                  <span className="text-lg font-black text-rose-600">{formatVND(totalAmount)}</span>
                </div>
              </div>

              {/* Real Bank QR billing component if Chuyển khoản */}
              {paymentMethod === 'ck_nganhang' ? (
                <div className="bg-emerald-850 text-white rounded-2xl p-4 border border-emerald-900 relative space-y-3 shadow-md" id="checkout-qr-box">
                  <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">VietQR Napas 24/7 Giao Dịch Siêu Tốc</span>
                    <span className="text-xs font-mono font-bold bg-emerald-900/60 text-emerald-100 px-2 py-0.5 rounded-md">
                      {formatTime(secondsLeft)}
                    </span>
                  </div>

                  {/* QR Image holder container */}
                  <div className="bg-white p-3 rounded-xl max-w-[200px] mx-auto text-center border-2 border-emerald-200">
                    {/* Generates standard Napas simulation with user name & bank values */}
                    <div className="relative">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`247-VCB-0987654321-VUONTUNGBONSAI-VND-${totalAmount}-${txId}`)}`}
                        alt="Napas QR Chuyển khoản"
                        className="mx-auto"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md shadow-md border border-slate-100">
                        <img 
                          src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=64" 
                          alt="VietQR logo mini" 
                          className="w-6 h-6 object-cover rounded-md" 
                        />
                      </div>
                    </div>
                    <span className="block text-[8px] font-black text-emerald-800 tracking-wider uppercase mt-1">Quét bằng app ngân hàng của bạn</span>
                  </div>

                  {/* Account Text Data */}
                  <div className="space-y-1 text-xs border-t border-emerald-800/80 pt-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-250">Ngân hàng:</span>
                      <span className="font-bold flex items-center gap-1 text-white">
                        Vietcombank (VCB)
                        <Copy className="w-3 h-3 text-emerald-300 cursor-pointer" onClick={() => handleCopyText('Vietcombank (VCB)')} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-250">Số tài khoản:</span>
                      <span className="font-bold flex items-center gap-1 text-white text-base">
                        0955666777
                        <Copy className="w-3.5 h-3.5 text-emerald-300 cursor-pointer" onClick={() => handleCopyText('0955666777')} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-250">Chủ tài khoản:</span>
                      <span className="font-bold text-white">VUON TUNG BONSAI VIET</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-250">Số tiền chuyển:</span>
                      <span className="font-extrabold text-amber-300 text-sm flex items-center gap-1 justify-end">
                        {formatVND(totalAmount)}
                        <Copy className="w-3.5 h-3.5 text-emerald-300 cursor-pointer" onClick={() => handleCopyText(totalAmount.toString())} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-250 font-bold text-amber-100">Nội dung ghi (bắt buộc):</span>
                      <span className="font-mono font-bold bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-sm flex items-center gap-1 text-[11px]">
                        {txId}
                        <Copy className="w-3.5 h-3.5 text-emerald-950 cursor-pointer" onClick={() => handleCopyText(txId)} />
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-emerald-200/85">
                    Hệ thống sẽ đối soát giao dịch và duyệt đơn ngay khi có biến động tiền gửi phát sinh trực tiếp.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-150 rounded-2xl p-4 space-y-2.5">
                  <div className="flex gap-2 items-start text-amber-900 text-xs">
                    <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-bold">Chính sách đồng kiểm đặc biệt của Vườn Tùng Việt:</span>
                      <p className="text-amber-800 leading-relaxed mt-0.5">
                        Quý khách được quyền cùng tài xế mở thùng gỗ, trực tiếp kiểm tra tàn tán, dăm lá, độ ẩm bệ rễ Bonsai chính hãng trước khi thanh toán tiền mặt. An tâm tuyệt đối.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-850 hover:border-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all uppercase tracking-wide"
                id="btn-complete-checkout"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang duyệt đơn...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4.5 h-4.5" />
                    <span>{paymentMethod === 'ck_nganhang' ? 'Xác nhận Đã Chuyển Khoản' : 'Hoàn Tất Đăng Ký Đơn Hàng'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
