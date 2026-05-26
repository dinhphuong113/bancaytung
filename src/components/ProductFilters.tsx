/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, XCircle } from 'lucide-react';
import { TreeType } from '../types';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  priceRange: number;
  setPriceRange: (price: number) => void;
  difficultyFilter: string;
  setDifficultyFilter: (diff: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  priceRange,
  setPriceRange,
  difficultyFilter,
  setDifficultyFilter,
  sortBy,
  setSortBy
}: ProductFiltersProps) {
  
  const treeTypes = [
    { value: 'all', label: 'Tất cả họ Tùng' },
    { value: 'tung-la-han', label: 'Tùng La Hán' },
    { value: 'duyen-tung', label: 'Duyên Tùng (Shimpaku)' },
    { value: 'tung-kim-cuong', label: 'Tùng Kim Cương' },
    { value: 'tung-bong-lai', label: 'Tùng Bồng Lai' },
    { value: 'tung-xuong-ca', label: 'Tùng Xương Cá' },
    { value: 'tung-thap', label: 'Tùng Tháp' }
  ];

  const pricePresets = [
    { value: 30000000, label: 'Tất cả mức giá' },
    { value: 500000, label: 'Dưới 500.000đ' },
    { value: 2000000, label: 'Dưới 2.000.000đ' },
    { value: 5000000, label: 'Dưới 5.000.000đ' },
    { value: 15000000, label: 'Dưới 15.000.000đ' }
  ];

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setPriceRange(30000000);
    setDifficultyFilter('all');
    setSortBy('relevance');
  };

  const isFiltered = searchQuery !== '' || selectedType !== 'all' || priceRange < 30000000 || difficultyFilter !== 'all' || sortBy !== 'relevance';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 mb-8" id="search-filter-panel">
      {/* Search Input Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Advanced search text input */}
        <div className="relative lg:col-span-5">
          <label className="sr-only">Tìm kiếm cây tùng</label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên Việt, tên khoa học hoặc mô tả (Ví dụ: Thác Đổ, Kim Cương, Bonsai)..."
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Tree Type select */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Loại cây tùng</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 outline-none transition-all cursor-pointer"
          >
            {treeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Select */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Độ khó chăm sóc</label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 outline-none transition-all cursor-pointer"
          >
            <option value="all">Tất cả độ khó</option>
            <option value="Dễ">Dễ (Cho người bắt đầu)</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Khó">Khó (Đòi hỏi chuyên sâu)</option>
          </select>
        </div>

        {/* Sorting options */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Sắp xếp theo</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 outline-none transition-all cursor-pointer"
            >
              <option value="relevance">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="age-desc">Tuổi thọ Bonsai lâu năm</option>
              <option value="stock-asc">Số lượng còn ít nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Pricing Line with Sliders */}
      <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Range slider indicator */}
        <div className="flex-1 max-w-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Lọc theo giá tối đa:
            </span>
            <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              {priceRange === 30000000 ? 'Không giới hạn' : formatVND(priceRange)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="200000"
              max="30000000"
              step="100000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-none"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5">
            <span>200.000đ</span>
            <span>5.000.000đ</span>
            <span>15.000.050đ</span>
            <span>30.000.000đ+</span>
          </div>
        </div>

        {/* Price Presets tag row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Chọn nhanh:</span>
          {pricePresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setPriceRange(preset.value)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                priceRange === preset.value
                  ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-xl cursor-pointer transition-all shrink-0 md:self-end"
          >
            <XCircle className="w-4 h-4" />
            Làm mới bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
