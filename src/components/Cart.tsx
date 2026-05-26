/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartProps) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-drawer">
      {/* Background slide layer */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header slider */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5.5 h-5.5 text-emerald-800" />
              <h2 className="text-lg font-bold text-slate-800">Giỏ Hàng Bonsai</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                {cartItems.length} loại
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item Scrolling Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 text-slate-350" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Giỏ hàng của bạn đang trống</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Hãy dạo quanh vườn tùng bonsai tuyển lựa của chúng tôi để tìm tác phẩm độc bản phù hợp vận mệnh gia chủ nhé!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs text-white bg-emerald-700 px-4.5 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-emerald-800 transition-colors"
                >
                  Tiếp tục tham quan vườn
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.product.id} 
                  className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-xl hover:shadow-xs transition-shadow"
                >
                  {/* Miniature Image Frame */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-1 w0 bg-slate-50 shrink-0"
                  />

                  {/* Pricing Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-emerald-800 block mb-0.5">
                      {item.product.typeName}
                    </span>
                    <h4 className="text-sm font-bold text-slate-850 truncate leading-snug">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-black text-rose-500 mt-1">
                      {formatVND(item.product.price)}
                    </p>

                    {/* Quantity Selector Panel */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg overflow-hidden shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                          aria-label="Giảm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800 bg-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                          aria-label="Tăng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Decouple Trash Button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer Total */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-500">Tạm tính:</span>
                <span className="font-extrabold text-slate-700">{formatVND(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-500">Vận Chuyển Bonsai Đặc Biệt:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-xs border border-emerald-100">
                  Miễn phí giao toàn quốc
                </span>
              </div>
              <div className="pt-3 border-t border-slate-150 flex items-center justify-between">
                <span className="text-base font-bold text-slate-800">Tổng cộng chuyển khoản:</span>
                <span className="text-xl font-black text-rose-600 tracking-tight">
                  {formatVND(totalAmount)}
                </span>
              </div>

              {/* Secure Checkout trigger */}
              <button
                onClick={onCheckout}
                className="w-full bg-emerald-700 hover:bg-emerald-850 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors group"
                id="cart-checkout-button"
              >
                <span>Tiến hành Đặt hàng Trực tuyến</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <p className="text-[10px] text-center text-slate-400 font-medium">
                Tích hợp thanh toán QR VietQR và ngân hàng bảo mật, mã hóa SSL 256-bit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
