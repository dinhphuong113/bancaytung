/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Leaf, Sparkles, User, MessageSquareHeart } from 'lucide-react';
import { ConsultationMessage } from '../types';

export default function CareyAI() {
  const [messages, setMessages] = useState<ConsultationMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Xin chào! Tôi là **Carey AI**, cố vấn chăm sóc dăm cây mượt mà từ **Vườn Tùng Bonsai Việt**. Tôi có thể trợ giúp bạn làm vườn, tư vấn xử lý sâu bệnh hại, pha trộn công thức đất mặt, hoặc hướng dẫn bấm đọt kẽm uốn Bonsai nghệ thuật. Bạn đang nuôi loài Tùng nào thế?',
      createdAt: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll down to newest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    'Cách tỉa đọt tùng La Hán?',
    'Tùng bị vàng, rụng lá là bệnh gì?',
    'Đất trồng Duyên Tùng Shimpaku tỉ lệ thế nào?',
    'Kỹ thuật uốn Bonsai dáng Thác Đổ?'
  ];

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: ConsultationMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userText,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(({ role, text }) => ({ role, text }));
      
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: history })
      });

      const data = await response.json();
      
      const modelMsg: ConsultationMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.text || 'Rất tiếc quá, tôi gặp gián đoạn kết nối một lát. Hãy nhắn lại cho tôi nhé!',
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ConsultationMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'Có lỗi trong quá trình kết nối với chuyên gia. Bạn có thể kiểm tra kết nối mạng hoặc thử lại nhé!',
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Safe renderer for simple markdown text
  const formatMarkdown = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      // Bold rendering
      let processed = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      // Look for custom lists
      const isList = line.trim().startsWith('*') || line.trim().startsWith('-');
      const cleanLine = isList ? line.replace(/^[\s*-]+/, '').trim() : line;

      // Handle simple headers
      const isHeader3 = line.startsWith('###');
      const isHeader2 = line.startsWith('##');
      const isHeader1 = line.startsWith('#');
      
      let headerText = line;
      if (isHeader3) headerText = line.replace(/^###\s*/, '');
      else if (isHeader2) headerText = line.replace(/^##\s*/, '');
      else if (isHeader1) headerText = line.replace(/^#\s*/, '');

      const renderedText = () => {
        // Simple replace for **bold** text
        const parts = [];
        let lastIndex = 0;
        let match;
        
        while ((match = boldRegex.exec(cleanLine)) !== null) {
          if (match.index > lastIndex) {
            parts.push(cleanLine.substring(lastIndex, match.index));
          }
          parts.push(<strong key={match.index} className="font-semibold text-emerald-850 dark:text-emerald-400">{match[1]}</strong>);
          lastIndex = boldRegex.lastIndex;
        }
        
        if (lastIndex < cleanLine.length) {
          parts.push(cleanLine.substring(lastIndex));
        }

        return parts.length > 0 ? parts : cleanLine;
      };

      if (isHeader1) {
        return <h1 key={lineIdx} className="text-xl font-bold text-slate-800 my-3">{headerText}</h1>;
      }
      if (isHeader2) {
        return <h2 key={lineIdx} className="text-lg font-bold text-emerald-800 my-2.5">{headerText}</h2>;
      }
      if (isHeader3) {
        return <h3 key={lineIdx} className="text-md font-bold text-slate-700 my-2">{headerText}</h3>;
      }
      if (isList) {
        return (
          <ul key={lineIdx} className="list-disc pl-5 my-1 text-slate-700">
            <li>{renderedText()}</li>
          </ul>
        );
      }
      return <p key={lineIdx} className="my-1.5 leading-relaxed text-slate-650">{renderedText()}</p>;
    });
  };

  return (
    <div className="flex flex-col bg-slate-50 border border-slate-100 rounded-2xl shadow-xl overflow-hidden h-[600px] max-w-4xl mx-auto" id="carey-ai-box">
      {/* Carey Header */}
      <div className="bg-emerald-850 text-white p-4.5 flex items-center justify-between border-b border-emerald-900" id="carey-header">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20 relative">
            <Leaf className="w-5.5 h-5.5 text-emerald-300" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-850 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white">Chuyên Gia Tư Vấn Carey AI</span>
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-xs text-emerald-150">Độ phản hồi siêu tốc • Tư vấn chăm sóc tùng chuyên nghiệp</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-250 border border-emerald-700/50">
          <MessageSquareHeart className="w-4 h-4" />
          <span>Vườn Tùng Việt AI</span>
        </div>
      </div>

      {/* Messages Sandbox */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50" id="chat-messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-emerald-850 text-emerald-300 border border-emerald-800'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
            </div>

            {/* Content box */}
            <div className={`p-4 rounded-2xl border text-sm shadow-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-none border-emerald-700'
                : 'bg-white text-slate-800 rounded-tl-none border-slate-200'
            }`}>
              {msg.role === 'user' ? (
                <p className="whitespace-pre-line">{msg.text}</p>
              ) : (
                <div className="space-y-1">{formatMarkdown(msg.text)}</div>
              )}
              <span className={`block text-[10px] mt-1.5 text-right ${
                msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
              }`}>
                {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[80%] items-center text-slate-400 text-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center animate-spin">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="animate-pulse">Carey AI đang suy luận phác thảo, tìm hướng dẫn chăm sóc tốt nhất...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Quick Selects */}
      {messages.length === 1 && (
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200" id="quick-questions-box">
          <p className="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Câu hỏi gợi ý nhanh:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="text-xs bg-white text-slate-700 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 shadow-xs cursor-pointer transition-all hover:bg-emerald-50/55"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inputs tray */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-150 flex items-center gap-2"
        id="care-chat-form"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi chăm sóc tùng (Ví dụ: Tại sao lá tùng héo?, Cách thay đất tùng La Hán)..."
          disabled={loading}
          className="flex-1 bg-slate-100 text-slate-800 border-0 focus:ring-2 focus:ring-emerald-500/50 rounded-xl px-4 py-2.5 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white p-2.5 cursor-pointer rounded-xl transition-colors shrink-0 shadow-sm"
          id="btn-send"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
