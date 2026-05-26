/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, User, Clock, ArrowLeft, Share2, Printer, Sparkles, BookMarked, Search, Filter } from 'lucide-react';
import { BlogArticle } from '../types';
import { INITIAL_BLOGS } from '../data';

export default function BlogSection() {
  const [blogs] = useState<BlogArticle[]>(INITIAL_BLOGS);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('all');
  const [blogSearch, setBlogSearch] = useState<string>('');

  const currentArticle = blogs.find(b => b.id === selectedBlogId);

  const categories = [
    { value: 'all', label: 'Tất cả chủ đề' },
    { value: 'cắt-tỉa', label: 'Kỹ thuật cắt tỉa' },
    { value: 'tạo-dáng', label: 'Nghệ thuật tạo dáng' },
    { value: 'phòng-bệnh', label: 'Phòng ngừa sâu bệnh' }
  ];

  const filteredBlogs = blogs.filter(article => {
    const matchesCategory = blogCategoryFilter === 'all' || article.category === blogCategoryFilter;
    const matchesSearch = article.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                          article.summary.toLowerCase().includes(blogSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render basic markdown tags for clean layout
  const parseManualMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-bold text-slate-850 font-serif mt-7 mb-4 border-b border-slate-100 pb-1 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-emerald-700" />
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-md font-bold text-emerald-800 mt-5 mb-2.5">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('*   **') || trimmed.startsWith('-   **')) {
        // Simple list replacement
        const rawContent = trimmed.replace(/^[*-\s\d.]+\s*\*\*/, '').replace(/\*\*$/, '');
        const splitIndex = rawContent.indexOf('**');
        if (splitIndex !== -1) {
          const title = rawContent.substring(0, splitIndex);
          const desc = rawContent.substring(splitIndex + 2);
          return (
            <div key={idx} className="pl-6 py-1 text-sm text-slate-750 flex items-start gap-1">
              <span className="text-emerald-700 mr-2">•</span>
              <div>
                <strong className="text-slate-800 font-semibold">{title}</strong>
                {desc}
              </div>
            </div>
          );
        }
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-6 list-disc py-1 text-sm text-slate-700 leading-relaxed">
            {trimmed.replace(/^[*-\s]+/, '')}
          </li>
        );
      }
      if (trimmed === '---') {
        return <hr key={idx} className="my-6 border-slate-100" />;
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-slate-650 text-sm leading-relaxed mb-4 whitespace-pre-line">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8" id="blog-section-wrapper">
      
      {currentArticle ? (
        /* Detailed Article Reader Grid Layout */
        <article className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm" id="article-view-inner">
          
          {/* Cover Hero Banner */}
          <div className="relative h-[250px] sm:h-[350px] bg-slate-150">
            <img 
              src={currentArticle.image} 
              alt={currentArticle.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
            
            {/* Header toolbar over cover */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <button 
                onClick={() => setSelectedBlogId(null)}
                className="flex items-center gap-2 bg-white/95 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs hover:bg-white shadow-md cursor-pointer transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>Trở lại cẩm nang</span>
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => alert('Đã tạo liên kết chia sẻ của cẩm nang!')}
                  className="p-2.5 bg-white/90 rounded-xl hover:bg-white text-slate-705 shadow-md cursor-pointer"
                  title="Chia sẻ sách"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title floating overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-emerald-500 text-white text-[9px] uppercase font-black px-2.5 py-1 rounded-md border border-emerald-400/30 shadow-sm">
                {currentArticle.categoryName}
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-white font-serif mt-2.5 leading-tight drop-shadow-sm">
                {currentArticle.title}
              </h1>
            </div>
          </div>

          {/* Metadata banner */}
          <div className="px-6 sm:px-10 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                {currentArticle.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {currentArticle.readTime}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Đăng tải ngày: {new Date(currentArticle.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>

          {/* Main text container */}
          <div className="px-6 sm:px-10 py-8 prose max-w-none">
            
            {/* Quick summary box */}
            <div className="bg-emerald-50/50 border-l-4 border-emerald-700 p-4.5 rounded-r-xl text-slate-700 italic text-sm font-medium mb-6">
              {currentArticle.summary}
            </div>

            {/* Generated rich markdown parsing */}
            <div className="space-y-2">{parseManualMarkdown(currentArticle.content)}</div>
          </div>

          {/* Quick guide rating action */}
          <div className="p-6 bg-slate-50 border-t border-slate-100/80 text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              Bạn thấy cẩm nang kỹ thuật này hữu ích chứ?
            </div>
            <div className="flex justify-center gap-2.5">
              <button 
                onClick={() => alert('Cảm ơn ý kiến đóng góp của bạn!')} 
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-4.5 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
              >
                👍 Hữu ích
              </button>
              <button 
                onClick={() => alert('Cảm ơn ý kiến đóng góp của bạn!')} 
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-4.5 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
              >
                👎 Cần bổ sung
              </button>
            </div>
          </div>

        </article>
      ) : (
        /* Sách cẩm nang index list page */
        <div className="space-y-8" id="blog-search-listing">
          
          {/* Header block with search filter inline */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-serif flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                Cẩm Nang Mỹ Thuật & Kỹ Thuật Bonsai
              </h2>
              <p className="text-xs text-slate-550">Tổng hợp kiến thức gạt lớp, bấm đọt kẽm và phục hồi rễ úng từ nghệ nhân</p>
            </div>

            {/* Inline search bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Category selector pill items */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setBlogCategoryFilter(cat.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                      blogCategoryFilter === cat.value
                        ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                        : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List layout */}
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl">
              <p className="text-sm font-bold text-slate-550">Không tìm thấy bài viết cẩm nang trùng khớp của truy vấn.</p>
              <button 
                onClick={() => { setBlogCategoryFilter('all'); setBlogSearch(''); }} 
                className="text-xs text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-xl mt-3 font-semibold"
              >
                Xem tất cả cẩm nang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="blog-grid-system">
              {filteredBlogs.map((article) => (
                <div 
                  key={article.id} 
                  className="flex flex-col bg-white border border-slate-100 hover:border-slate-200/85 hover:shadow-xl rounded-2xl overflow-hidden transition-all group"
                  id={`article-card-${article.id}`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[9px] uppercase font-black px-2 py-0.5 rounded-md border border-white/10">
                      {article.categoryName}
                    </span>
                  </div>

                  {/* Descriptions */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => setSelectedBlogId(article.id)}
                        className="text-md font-bold text-slate-800 hover:text-emerald-700 font-serif leading-snug line-clamp-2 cursor-pointer transition-colors"
                      >
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-550 line-clamp-3 mt-2 mb-4 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-450">
                      <span className="flex items-center gap-1 font-bold text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {article.author.split(' ').slice(-2).join(' ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
