/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Sparkles, 
  Trash2, 
  PhoneCall, 
  ShieldCheck, 
  HeartHandshake, 
  Award, 
  X,
  Compass,
  ArrowRight,
  ChevronRight,
  BookMarked
} from 'lucide-react';

import Header from './components/Header';
import ProductFilters from './components/ProductFilters';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import BlogSection from './components/BlogSection';
import CareyAI from './components/CareyAI';
import AdminDashboard from './components/AdminDashboard';

import { Product, CartItem, Order } from './types';
import { INITIAL_PRODUCTS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('products');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Products catalogs state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  
  // Shopping cart state local persistence
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Filter conditions states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(30000000);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Add Item to shopping list
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx !== -1) {
        // If exceeds available stock limits, notify
        if (prev[idx].quantity >= product.stock) {
          alert(`Sản phẩm độc bản: Chỉ còn tối đa ${product.stock} chậu có sẵn ở vườn.`);
          return prev;
        }
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Triggers notification in browser
    setIsCartOpen(true);
  };

  // Alter quantities
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    
    // Check stock bounds
    const item = cartItems.find(itm => itm.product.id === productId);
    if (item && quantity > item.product.stock) {
      alert(`Xin lỗi bạn, vườn chỉ có sẵn ${item.product.stock} tác phẩm này.`);
      return;
    }

    setCartItems(prev =>
      prev.map(itm => (itm.product.id === productId ? { ...itm, quantity } : itm))
    );
  };

  // Delete Cart Item
  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(itm => itm.product.id !== productId));
  };

  // After checkout completions
  const handleOrderSuccess = (order: Order) => {
    setSuccessOrder(order);
    setCartItems([]); // Clear cart items
    setIsCheckoutOpen(false);
  };

  // Compute total numbers
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, current) => acc + current.quantity, 0);
  }, [cartItems]);

  // Filter logic calculated cache
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesQuery = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.typeName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || p.type === selectedType;
        const matchesPrice = p.price <= priceRange;
        const matchesDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
        return matchesQuery && matchesType && matchesPrice && matchesDiff;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'age-desc') return b.age - a.age;
        if (sortBy === 'stock-asc') return a.stock - b.stock;
        return 0; // relevance
      });
  }, [products, searchQuery, selectedType, priceRange, difficultyFilter, sortBy]);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800" id="vue-app-root">
      
      {/* Decorative top small header */}
      <div className="bg-emerald-950 text-white py-2 px-4 text-center text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 relative">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Mừng Tết Đến Xuân Về - Nhận ngay mã chăm sóc Bonsai miễn phí và bảo dưỡng kẽm trọn đời.
        </span>
        <button
          onClick={() => setActiveTab('consultation')}
          className="underline text-emerald-250 hover:text-emerald-100 font-bold ml-1.5 focus:outline-none"
        >
          Hỏi Carey AI Ngay &rarr;
        </button>
      </div>

      {/* Main Header Component */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cartCount} 
        openCart={() => setIsCartOpen(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* Primary Layout Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" id="root-viewport-grid">
        
        {activeTab === 'products' && (
          <div className="space-y-10" id="products-tab-panel">
            {/* Elegant Hero Welcome Slogan Graphic */}
            <div className="bg-gradient-to-br from-emerald-850 via-emerald-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Absolutes decorative leaves background shapes */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="p-8 sm:p-12 md:p-16 max-w-2xl text-white relative z-10 space-y-5">
                <span className="bg-emerald-800/80 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-700/50 inline-block">
                  Cung điện Bonsai Thượng Uyển
                </span>
                <h2 className="text-3xl sm:text-5xl font-black font-serif leading-tight text-white drop-shadow-sm">
                  Đỉnh cao nghệ thuật kiến tạo <span className="text-emerald-300">Không Gian Xanh</span>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                  Tuyển chọn hàng trăm loại tùng kim cương, tùng La Hán Moyogi, Duyên tùng Shimpaku lũa trắng nến giả cổ vượt thời gian. Mỗi chậu cây chứa đựng tinh thần bất khuất can trường kiên cường.
                </p>
                
                {/* Visual statistics metric items inside Hero banner */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-amber-400">100%</span>
                    <span className="text-[10px] sm:text-xs text-slate-300 font-medium tracking-wide block mt-0.5">Nghệ nhân tạo tác</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-amber-400">50+ Năm</span>
                    <span className="text-[10px] sm:text-xs text-slate-300 font-medium tracking-wide block mt-0.5">Thâm niên gieo gốc</span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-amber-400">0đ</span>
                    <span className="text-[10px] sm:text-xs text-slate-300 font-medium tracking-wide block mt-0.5">Vận chuyển toàn quốc</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      // Scroll to filter page slowly
                      document.getElementById('search-filter-panel')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all group"
                  >
                    <span>Xem bộ sưu tập tùng</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => setActiveTab('consultation')}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    Hỏi cố vấn chăm sóc AI
                  </button>
                </div>
              </div>

              {/* absolute picture of beautiful bonsai right panel for desktop viewpoint */}
              <div className="hidden lg:block absolute right-12 bottom-0 top-0 w-1/3 py-8">
                <div className="w-full h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600"
                    alt="Bonsai Hero Showcase"
                    className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/10 relative z-10"
                  />
                  <div className="absolute inset-0 bg-emerald-900/10 rounded-2xl z-20 mix-blend-multiply" />
                  {/* Floating badge */}
                  <div className="absolute -left-6 top-1/3 bg-white text-slate-800 rounded-xl p-3 shadow-lg border border-slate-100 z-30 animate-bounce">
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-rose-600">Độc quyền</span>
                    <p className="text-xs font-black text-slate-800">Duyên Tùng Shimpaku cổ thụ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Filters Tray */}
            <ProductFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              difficultyFilter={difficultyFilter}
              setDifficultyFilter={setDifficultyFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* List Results Grid view */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-slate-800 font-serif flex items-center gap-2">
                <Sprout className="w-5.5 h-5.5 text-emerald-700" />
                Các tác phẩm Tùng Bonsai Độc Bản ({filteredProducts.length})
              </h3>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-150/50 rounded-2xl">
                  <p className="text-sm font-bold text-slate-500">
                    Không tìm thấy sản phẩm tùng nào tương thích với bộ lọc của bạn.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                      setPriceRange(30000000);
                      setDifficultyFilter('all');
                    }}
                    className="text-xs text-emerald-800 font-bold underline mt-2 block mx-auto focus:outline-none"
                  >
                    Xóa tất cả bộ lọc để xem lại danh sách
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard 
                      key={prod.id} 
                      product={prod} 
                      onAddToCart={handleAddToCart} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Client feedback reassurance tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-150/75">
              <div className="flex gap-3.5 items-start p-5 bg-white border border-slate-100/80 rounded-2xl">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Tuyệt Đối Độc Bản</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Mỗi tác phẩm là độc nhất vô nhị do tự nghệ nhân bấm uốn uốn nếp dây kẽm. Chúng tôi giao đúng chậu cây hình ảnh quý khách chọn.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start p-5 bg-white border border-slate-100/80 rounded-2xl">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100">
                  <HeartHandshake className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Giao Hàng Gỗ Kẹp An Toàn</h4>
                  <p className="text-xs text-slate-550 mt-1 leading-relaxed">
                    Sản phẩm được gia cố cố định trong khung giá đỡ bằng gỗ tự nhiên sấy khô, đảm bảo quá trình di chuyển không lung gốc hỏng rễ hoặc gãy nhánh tàn.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start p-5 bg-white border border-slate-100/80 rounded-2xl">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100">
                  <Award className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Tư Vấn Chăm Sóc Trọn Đời</h4>
                  <p className="text-xs text-slate-550 mt-1 leading-relaxed">
                    Đồng hành cùng gia chủ uốn chi dốt lá, bón phân vi lượng theo từng mùa giải sinh trưởng của cây tùng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Article technical section */}
        {activeTab === 'blog' && (
          <div className="space-y-4" id="blog-tab-panel">
            <BlogSection />
          </div>
        )}

        {/* AI smart Carey caretaker assistant */}
        {activeTab === 'consultation' && (
          <div className="space-y-5 max-w-4xl mx-auto" id="carey-ai-tab-panel">
            <div className="text-center space-y-2 mb-4">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-black px-2.5 py-1 rounded-md">Công nghệ AI đột phá</span>
              <h2 className="text-2xl font-black font-serif text-slate-850">Cố Vấn Chăm Sóc Sức Khỏe Tùng Bonsai</h2>
              <p className="text-xs text-slate-550 max-w-md mx-auto">
                Tích hợp mô hình AI siêu cấp chuyên đọc hiểu phác đồ nông lâm học, uốn kẽm, bón phân Akada và khử nấm lá tùng.
              </p>
            </div>
            <CareyAI />
          </div>
        )}

        {/* Administrator dashboard */}
        {activeTab === 'admin' && (
          <div className="space-y-4 animate-fade-in" id="admin-tab-panel">
            <AdminDashboard />
          </div>
        )}

      </main>

      {/* Slide-over interactive shopping cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Complete Success Overlay Receipt popup */}
      {successOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs" id="success-recepit-overlay">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 text-center space-y-5 relative shadow-2xl border border-emerald-50">
            <button
              onClick={() => setSuccessOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5.5 h-5.5" />
            </button>

            <div className="bg-emerald-50 border border-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-emerald-700 animate-bounce">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-850 font-serif">ĐẶT HÀNG THÀNH CÔNG!</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Vườn Tùng Việt đã ghi chép đầy đủ chi tiết sổ sách giao nhận của bạn.
              </p>
            </div>

            {/* Quick summary ticket details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs text-slate-650">
              <div className="flex justify-between">
                <span>Mã xác minh đơn:</span>
                <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded-sm">{successOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Khách hàng nhận:</span>
                <span className="font-bold text-slate-850">{successOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Điện thoại:</span>
                <span className="font-semibold">{successOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Địa chỉ vận chuyển:</span>
                <span className="font-semibold text-right max-w-[200px] truncate" title={successOrder.shippingAddress}>
                  {successOrder.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tổng giá trị đơn:</span>
                <span className="font-black text-rose-500 block text-sm">{formatVND(successOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phương thức thanh toán:</span>
                <span className="font-bold text-slate-800">
                  {successOrder.paymentMethod === 'ck_nganhang' ? 'Chuyển khoản VietQR' : 'COD thanh toán mặt'}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2 text-[10px] text-amber-800 font-bold">
                <span>Trạng thái giao dịch:</span>
                <span>
                  {successOrder.paymentMethod === 'ck_nganhang' ? 'Đã Thanh Toán Thành Công' : 'Đang xử lý dăm thùng gỗ'}
                </span>
              </div>
            </div>

            {successOrder.paymentMethod === 'ck_nganhang' && (
              <div className="bg-emerald-50 text-emerald-850 border border-emerald-150 p-3.5 rounded-2xl text-xs flex gap-2">
                <Compass className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-left leading-relaxed">
                  Đã ghi nhận chuyển khoản thành công của mã <span className="font-bold text-emerald-950">{successOrder.id}</span>. Nhân viên soạn đóng khung gỗ Bonsai sẽ gọi điện trực tiếp xác nhận lịch trình xe giao tùng trong vòng 15-30 phút!
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSuccessOrder(null)}
                className="w-full bg-emerald-750 hover:bg-emerald-850 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider cursor-pointer"
              >
                Tiếp tục tham tuyển lựa Bonsai kì ảo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative clean footer */}
      <footer className="bg-white border-t border-slate-100 py-10 mt-16" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center items-center gap-1.5 font-serif text-slate-800 font-bold">
            <Sprout className="w-5 h-5 text-emerald-700 hover:rotate-12 transition-transform" />
            <span>Vườn Tùng Bonsai Việt</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Địa chỉ: 18C Nguyễn Cơ Thạch, Mỹ Đình, Nam Từ Liêm, Hà Nội.<br />
            Phục vụ người chơi Bonsai đích thực từ tâm huyết và giá trị trường tồn.
          </p>
          <div className="text-[10px] text-slate-350">
            &copy; 2026 Vườn Tùng Việt. Bảo lưu tất cả quyền nghệ thuật Bonsai sành điệu.
          </div>
        </div>
      </footer>

    </div>
  );
}
