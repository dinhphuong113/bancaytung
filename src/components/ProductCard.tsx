/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Heart, Info, TreeDeciduous, Star, ChevronRight, X } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const getDifficultyColor = (diff: Product['difficulty']) => {
    switch (diff) {
      case 'Dễ': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Trung bình': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Khó': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <>
      {/* Product Card Body Grid Item */}
      <div 
        className="group flex flex-col bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-xl hover:border-slate-200/80 transition-all overflow-hidden relative"
        id={`product-card-${product.id}`}
      >
        {/* Popular / Best Seller tag overlay */}
        {product.isPopular && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] uppercase font-extrabold tracking-wider px-3 py-1.5 rounded-lg z-10 shadow-xs flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            Bonsai Độc Bản
          </span>
        )}

        {/* Favorite Heart trigger */}
        <button
          onClick={() => setFavorite(!favorite)}
          className={`absolute top-3 right-3 p-2 rounded-full border bg-white/70 backdrop-blur-xs shadow-xs hover:bg-white z-10 transition-colors cursor-pointer ${
            favorite ? 'text-red-500 border-red-200 bg-red-50/70' : 'text-slate-400 border-slate-100'
          }`}
          aria-label="Thêm vào danh sách yêu thích"
        >
          <Heart className={`w-4.5 h-4.5 ${favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image Frame */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
            loading="lazy"
          />
          {/* Subtle bottom gradient tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Information text fields */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          {/* Scientific taxonomy tag */}
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
            <TreeDeciduous className="w-3.5 h-3.5 text-emerald-600" />
            {product.typeName}
          </span>
          
          <h3 
            className="text-base font-bold text-slate-800 hover:text-emerald-850 line-clamp-1 cursor-pointer transition-colors"
            onClick={() => setShowDetailModal(true)}
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 italic font-medium mt-0.5 mb-3">{product.scientificName}</p>

          <p className="text-xs text-slate-550 line-clamp-2 mb-4 leading-relaxed flex-1">
            {product.description}
          </p>

          {/* Sizing & parameters tags row */}
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-center">
              <span className="block text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">Tuổi cây</span>
              <span className="text-xs font-bold text-slate-700">{product.age} tuổi</span>
            </div>
            <div className={`border rounded-lg p-1.5 text-center ${getDifficultyColor(product.difficulty)}`}>
              <span className="block text-[8.5px] uppercase font-bold opacity-60 tracking-wider">Độ khó</span>
              <span className="text-xs font-bold">{product.difficulty}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-center">
              <span className="block text-[8.5px] uppercase font-bold text-slate-400 tracking-wider text-ellipsis overflow-hidden">Kích thước</span>
              <span className="text-[10px] font-extrabold text-slate-700 truncate block">
                {product.size.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Pricing & shopping tray */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100/75">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Giá niêm yết</span>
              <span className="text-base sm:text-lg font-black text-rose-600 tracking-tight">
                {formatVND(product.price)}
              </span>
            </div>

            {/* Shopping action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowDetailModal(true)}
                className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-150 rounded-xl cursor-pointer transition-colors"
                title="Chi tiết tác phẩm"
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className="bg-emerald-700 hover:bg-emerald-850 disabled:bg-slate-200 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm</span>
              </button>
            </div>
          </div>

          {/* Low stock notice banner */}
          {product.stock > 0 && product.stock <= 3 && (
            <div className="text-[10px] text-center font-bold text-amber-700 bg-amber-50 rounded-lg py-1 mt-3 border border-amber-100/50">
              Chỉ còn {product.stock} tác phẩm có sẵn!
            </div>
          )}
          {product.stock === 0 && (
            <div className="text-[10px] text-center font-bold text-slate-500 bg-slate-100 rounded-lg py-1 mt-3">
              Hiện đã hết hàng hàng
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id={`detail-modal-${product.id}`}>
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row">
            
            {/* Close button modal overlay */}
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-800 bg-white/80 backdrop-blur-xs hover:bg-white border border-slate-200 rounded-full transition-colors cursor-pointer shadow-sm"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Frame: Image with information labels */}
            <div className="w-full md:w-1/2 bg-slate-100 relative max-h-[350px] md:max-h-full aspect-video md:aspect-auto">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/45 backdrop-blur-md text-white rounded-xl p-3 border border-white/10">
                <span className="block text-[8px] uppercase font-bold text-emerald-300 tracking-wider">Mã sản phẩm</span>
                <span className="text-xs font-black tracking-widest uppercase">{product.id}</span>
              </div>
            </div>

            {/* Right Frame: Specifications */}
            <div className="w-full md:w-1/2 p-5 sm:p-7 flex flex-col overflow-y-auto">
              <div>
                <span className="inline-block bg-emerald-50 text-emerald-800 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md border border-emerald-100/50 mb-2">
                  {product.typeName}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-850 font-serif leading-tight">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-400 italic mt-1 font-medium">{product.scientificName}</p>
              </div>

              {/* Price display row */}
              <div className="my-4.5 bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Giá bán chuyển khoản bảo mật</span>
                  <span className="text-xl font-black text-rose-600">{formatVND(product.price)}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Tình trạng</span>
                  <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-700' : 'text-slate-550'}`}>
                    {product.stock > 0 ? `Còn hàng (${product.stock} chậu)` : 'Hết hàng'}
                  </span>
                </div>
              </div>

              {/* Extended specification grid */}
              <div className="space-y-3 flex-1 text-sm bg-slate-50/40 p-3.5 rounded-xl border border-slate-100/50 mb-5">
                <div className="flex justify-between border-b border-slate-100 pb-2 text-slate-650">
                  <span className="font-semibold text-slate-450">Kích Thước Thân Lá</span>
                  <span className="font-bold text-slate-800">{product.size}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 text-slate-650">
                  <span className="font-semibold text-slate-450">Tuổi Đời Bonsai</span>
                  <span className="font-bold text-slate-800">{product.age} tuổi trên chậu</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 text-slate-650">
                  <span className="font-semibold text-slate-450">Độ Khó Chăm Sóc</span>
                  <span className={`font-bold ${product.difficulty === 'Khó' ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {product.difficulty} - Thích hợp môi trường tự nhiên
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-slate-650">
                  <span className="font-semibold text-slate-450">Thông tin Bonsai học vật lý</span>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Modal footer buy button */}
              <div className="flex items-center gap-3 mt-auto">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    setShowDetailModal(false);
                  }}
                  disabled={product.stock === 0}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-850 disabled:bg-slate-200 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  <span>Xác nhận mua & Thêm vào giỏ</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
