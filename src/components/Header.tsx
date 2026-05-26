/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, ShoppingCart, BookOpen, MessageSquare, ShieldAlert, UserCheck, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  isAdmin,
  setIsAdmin
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs = [
    { id: 'products', name: 'Sản Phẩm Tùng Bonsai', icon: Leaf },
    { id: 'blog', name: 'Cẩm Nang Cắt Tỉa', icon: BookOpen },
    { id: 'consultation', name: 'Trợ Lý Carey AI', icon: MessageSquare },
    { id: 'admin', name: 'Hệ Thống Quản Trị', icon: ShieldAlert }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('products')}>
            <div className="bg-emerald-800 text-emerald-100 p-2.5 rounded-xl border border-emerald-700 shadow-sm transition-transform hover:scale-105">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-850 tracking-tight flex items-center gap-1.5 font-serif">
                Vườn Tùng <span className="text-emerald-750">Bonsai Việt</span>
              </h1>
              <p className="hidden sm:block text-xs text-slate-500 font-medium tracking-wide">Giá trị trường tồn • Phú quý dài lâu</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1.5" id="nav-desktop">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-100/50'
                      : 'text-slate-600 hover:text-emerald-850 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>

          {/* Cart & Quick Settings actions container */}
          <div className="flex items-center gap-3">
            {/* Quick Admin Toggle Helper */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isAdmin 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Chuyển đổi giao diện Người mua / Quản lý admin"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Chế độ Admin' : 'Đăng nhập Admin'}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              id="header-cart-button"
              className="relative p-3 text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl border border-slate-100 cursor-pointer transition-all shadow-xs"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-600 border-2 border-white text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-3 px-4 space-y-2 shadow-inner" id="nav-mobile">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-850 border-l-4 border-emerald-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-750' : 'text-slate-405'}`} />
                {tab.name}
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsAdmin(!isAdmin);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                isAdmin 
                  ? 'bg-amber-500 text-white border-amber-600' 
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{isAdmin ? 'Quay lại làm Khách Mua Hàng' : 'Đăng nhập vào Hệ Thống Admin'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
