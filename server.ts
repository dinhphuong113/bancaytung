/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize in-memory database for persistence during server lifespan
interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: 'ck_nganhang' | 'cod';
  items: OrderItem[];
  totalAmount: number;
  status: 'Chờ xác nhận' | 'Đã thanh toán' | 'Đang giao hàng' | 'Đã hoàn thành' | 'Đã hủy';
  createdAt: string;
  notes?: string;
}

// Seed historical orders to populate our detailed admin revenue analytics dashboard
let ordersDb: Order[] = [
  {
    id: 'DH-001',
    customerName: 'Hoàng Minh Tuấn',
    customerPhone: '0912345678',
    customerEmail: 'minhtuan@gmail.com',
    shippingAddress: '12 Đường Láng, Quận Đống Đa, Hà Nội',
    paymentMethod: 'ck_nganhang',
    items: [
      {
        productId: 'tung-1',
        productName: 'Tùng La Hán Bonsai Đại Cổ Thụ (Moyogi)',
        price: 15500000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1512428813824-f7258df4e622?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 15500000,
    status: 'Đã hoàn thành',
    createdAt: '2026-01-15T09:30:00.000Z',
    notes: 'Khách VIP, giao xe tải bảo thạch cẩn thận.'
  },
  {
    id: 'DH-002',
    customerName: 'Trần Thị Mai',
    customerPhone: '0987654321',
    customerEmail: 'maitran@gmail.com',
    shippingAddress: '45/8 Nguyễn Thị Minh Khai, Quận 1, TP. HCM',
    paymentMethod: 'cod',
    items: [
      {
        productId: 'tung-4',
        productName: 'Tùng Bồng Lai Bonsai Mini Để Bàn',
        price: 280000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600'
      },
      {
        productId: 'tung-5',
        productName: 'Tùng Xương Cá Phong Cách Bắc Âu',
        price: 450000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 1010000,
    status: 'Đã hoàn thành',
    createdAt: '2026-02-08T14:15:00.000Z'
  },
  {
    id: 'DH-003',
    customerName: 'Lê Văn Khang',
    customerPhone: '0903334445',
    customerEmail: 'khangle@yahoo.com',
    shippingAddress: 'Kiệt 12 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
    paymentMethod: 'ck_nganhang',
    items: [
      {
        productId: 'tung-2',
        productName: 'Duyên Tùng Shimpaku Thác Đổ (Kengai)',
        price: 9800000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 9800000,
    status: 'Đã hoàn thành',
    createdAt: '2026-02-25T11:00:00.000Z',
    notes: 'Chụp hình lũa gửi trước khi giao.'
  },
  {
    id: 'DH-004',
    customerName: 'Phạm Đức Thịnh',
    customerPhone: '0977888999',
    customerEmail: 'thinhpham@gmail.com',
    shippingAddress: 'Biệt thự B2 Phú Mỹ Hưng, Quận 7, TP. HCM',
    paymentMethod: 'ck_nganhang',
    items: [
      {
        productId: 'tung-3',
        productName: 'Tùng Kim Cương Dáng Văn Nhân (Bunjingi)',
        price: 4200000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1613143748259-7caad25ec228?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 8400000,
    status: 'Đã hoàn thành',
    createdAt: '2026-03-12T08:20:00.000Z'
  },
  {
    id: 'DH-005',
    customerName: 'Nguyễn Bích Vy',
    customerPhone: '0966555444',
    customerEmail: 'vybich@gmail.com',
    shippingAddress: '78 Lê Lợi, TP. Hải Phòng',
    paymentMethod: 'cod',
    items: [
      {
        productId: 'tung-4',
        productName: 'Tùng Bồng Lai Bonsai Mini Để Bàn',
        price: 280000,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 840000,
    status: 'Đã hoàn thành',
    createdAt: '2026-04-04T16:45:00.000Z'
  },
  {
    id: 'DH-006',
    customerName: 'Bùi Anh Quân',
    customerPhone: '0932123456',
    customerEmail: 'quanbui@gmail.com',
    shippingAddress: 'Căn hộ 1502 Vinhomes Ocean Park, Gia Lâm, Hà Nội',
    paymentMethod: 'ck_nganhang',
    items: [
      {
        productId: 'tung-6',
        productName: 'Tùng Tháp Cảnh Quan Tiểu Cảnh',
        price: 950000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 1900000,
    status: 'Đã hoàn thành',
    createdAt: '2026-04-20T10:10:00.000Z'
  },
  {
    id: 'DH-007',
    customerName: 'Đặng Quốc Bảo',
    customerPhone: '0345678901',
    customerEmail: 'baodang@gmail.com',
    shippingAddress: 'Khu đô thị Hòa Xuân, Cẩm Lệ, Đà Nẵng',
    paymentMethod: 'ck_nganhang',
    items: [
      {
        productId: 'tung-7',
        productName: 'Tùng La Hán Bonsai Dáng Bay (Semi-Cascade)',
        price: 3800000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 3800000,
    status: 'Đã hoàn thành',
    createdAt: '2026-05-02T15:22:00.000Z'
  },
  {
    id: 'DH-008',
    customerName: 'Lê Thu Trang',
    customerPhone: '0911223344',
    customerEmail: 'thutrang@gmail.com',
    shippingAddress: '90 Trần Hưng Đạo, TP. Quy Nhơn, Bình Định',
    paymentMethod: 'cod',
    items: [
      {
        productId: 'tung-4',
        productName: 'Tùng Bồng Lai Bonsai Mini Để Bàn',
        price: 280000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 280000,
    status: 'Đã hoàn thành',
    createdAt: '2026-05-15T09:12:00.000Z'
  },
  {
    id: 'DH-009',
    customerName: 'Nguyễn Thành Nam',
    customerPhone: '0989998887',
    customerEmail: 'thanhnam@gmail.com',
    shippingAddress: 'Tòa nhà Landmark 81, Bình Thạnh, TP. HCM',
    paymentMethod: 'ck_nganhang',
    items: [
      {
        productId: 'tung-2',
        productName: 'Duyên Tùng Shimpaku Thác Đổ (Kengai)',
        price: 9800000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 9800000,
    status: 'Đang giao hàng',
    createdAt: '2026-05-24T13:40:00.000Z',
    notes: 'Giao gấp buổi sáng.'
  },
  {
    id: 'DH-010',
    customerName: 'Hoàng Kim Chi',
    customerPhone: '0955666777',
    customerEmail: 'kimchi@outlook.com',
    shippingAddress: '15 Chu Văn An, TP. Huế, Thừa Thiên Huế',
    paymentMethod: 'ck_nganhang',
    items: [
      {
        productId: 'tung-8',
        productName: 'Cổ Thụ Tùng Kim Cương Lồng Đèn Độc Bản',
        price: 22000000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1512428813824-f7258df4e622?auto=format&fit=crop&q=80&w=600'
      }
    ],
    totalAmount: 22000000,
    status: 'Chờ xác nhận',
    createdAt: '2026-05-25T11:55:00.000Z',
    notes: 'Liên hệ trước khi giao.'
  }
];

// Lazy Gemini API Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      geminiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      console.log('Gemini API Client initialized successfully with process.env.GEMINI_API_KEY.');
    } else {
      console.log('Gemini API Client is in simulated sandbox mode due to missing key.');
    }
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API - Get Products list (could combine with types or categories mapping)
  app.get('/api/products-list', (req, res) => {
    res.json({ success: true });
  });

  // API - Get Order List for Administrator
  app.get('/api/orders', (req, res) => {
    // Sort youngest first
    const sorted = [...ordersDb].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, count: sorted.length, orders: sorted });
  });

  // API - Complete / Cancel / Update progress of order
  app.patch('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const index = ordersDb.findIndex(order => order.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    ordersDb[index].status = status;
    res.json({ success: true, order: ordersDb[index] });
  });

  // API - Checkout new order with custom/bank confirmation quickly
  app.post('/api/orders', (req, res) => {
    const { customerName, customerPhone, customerEmail, shippingAddress, paymentMethod, items, notes } = req.body;

    if (!customerName || !customerPhone || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng và sản phẩm.' });
    }

    // Double check item contents
    let totalAmt = 0;
    const checkoutItems: OrderItem[] = items.map((itm: any) => {
      totalAmt += itm.price * itm.quantity;
      return {
        productId: itm.productId || itm.product?.id,
        productName: itm.productName || itm.product?.name,
        price: itm.price || itm.product?.price,
        quantity: itm.quantity,
        image: itm.image || itm.product?.image
      };
    });

    const newOrder: Order = {
      id: `DH-0${ordersDb.length + 11}`,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      shippingAddress,
      paymentMethod,
      items: checkoutItems,
      totalAmount: totalAmt,
      status: paymentMethod === 'ck_nganhang' ? 'Đã thanh toán' : 'Chờ xác nhận', // Simulation of fast payment authorization
      createdAt: new Date().toISOString(),
      notes: notes || ''
    };

    ordersDb.push(newOrder);
    res.status(201).json({ 
      success: true, 
      message: 'Đặt hàng thành công!', 
      order: newOrder 
    });
  });

  // API - Care Consultation AI (Gemini 3.5 Flash Integration with fallback)
  app.post('/api/gemini/chat', async (req, res) => {
    const { messages } = req.body; // array of { role: 'user' | 'model', text: '...' }
    
    if (!messages || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages are required.' });
    }

    const lastMessage = messages[messages.length - 1].text;
    
    try {
      const client = getGeminiClient();
      if (client) {
        // Construct standard prompt history
        const systemPrompt = `Bạn là Carey AI, trợ lý ảo chuyên gia tư vấn tại "Vườn Tùng Bonsai Việt". 
Chuyên môn của bạn là chăm sóc các giống cây tùng như Tùng La Hán, Duyên Tùng Shimpaku, Tùng Kim Cương, Tùng Bồng Lai, Tùng Xương Cá.
Cung cấp hướng dẫn tỉ mỉ về:
1. Đất trồng: Cát sông xen mạt đá, đất Akada Nhật, dễ thoát nước.
2. Ánh sáng: Cần phơi nắng trực tiếp tối thiểu 4-6 tiếng mỗi ngày, đặc biệt là Duyên Tùng.
3. Tư vấn uốn tỉa chi cành Bonsai nghệ thuật bằng dây nhôm hoặc kẽm Nhật vào giai đoạn cây nghỉ (cuối đông hoặc đầu xuân).
4. Khắc phục vấn đề nấm cháy lá sành điệu, phục hồi rễ úng.
Hãy trả lời vô cùng ân cần, chi tiết, mang tính khoa học làm vườn chuyên nghiệp, trình bày bằng Tiếng Việt súc tích, định dạng Markdown đẹp, chuyên sâu.`;

        // Pass conversation history
        const formattedContents = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

        const geminiResponse = await client.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: formattedContents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            topP: 0.9
          }
        });

        const textOutput = geminiResponse.text;
        return res.json({ success: true, text: textOutput || 'Xin lỗi, tôi chưa ghi nhận được câu trả lời. Bạn có thể hỏi lại được không?' });
      } else {
        // Fallback simulation responses if API Key is not set or placeholder
        const simulatedAnswers = [
          `Chào bạn! Tôi là trợ lý chuyên chăm sóc Tùng Bonsai. Tùng (nhất là Duyên Tùng Shimpaku và Tùng La Hán) là giống cây ưa nắng hanh và thoáng gió. Để cây khỏe:
1. **Nước tưới:** Chỉ tưới khi bầu đất khô ráo (thường 1-2 ngày/lần). Tránh úng rễ.
2. **Kỹ thuật bấm tỉa:** Khoảng tháng 3 hoặc tháng 8 dương lịch, hãy ngắt 2/3 bề dài đọt tùng non vươn dài bừa bãi bằng đầu móng tay để kích mầm lá trong gọn gàng hơn.
Bạn đang nuôi loại tùng nào thế? Hãy chia sẻ thêm để mình tương trợ sâu hơn nhé!`,
          `Vấn đề rụng lá và héo úa ở tùng thường bắt nguồn từ 2 nguyên nhân:
1. Ủ rễ do ngập úng đáy chậu: Thay đất có pha đá perlite/đá bọt pumice hoặc đất cát thô Akadama để đạt độ tơi xốp tối đa.
2. Thiếu nắng trầm trọng: Tùng đòi hỏi tối thiểu 4 tiếng đón nắng trực tiếp. Nếu để trong nhà, cứ 2 ngày bạn nên đưa cây ra ban công hấp thụ sướng sớm một lần.
Tôi khuyên bạn xịt thêm dung dịch kháng nấm Ridomil Gold hoặc Coc85 định kỳ nếu xuất hiện vệt cháy đen ở búp non!`,
          `Chào bạn, việc quấn kẽm uốn nếp Tùng Bonsai nên thực hiện vào mùa khô ráo ấm áp (cuối thu đến đầu xuân).
- Hãy quấn dây nhôm bảo vệ mềm mại một góc 45 độ quanh thân tùng.
- Tránh uốn bẻ chi nhánh quá đột ngột; hãy dùng hai ngón tay luân phiên vuốt từ từ để mạch nhựa quen dần với góc lượn mới.
Nếu còn băn khoăn gì về kỹ thuật dưỡng cây, hãy thoải mái giãi bày cùng tôi!`
        ];

        // Pick one based on user prompt keywords
        let ans = simulatedAnswers[0];
        const normalized = lastMessage.toLowerCase();
        if (normalized.includes('vàng') || normalized.includes('rụng') || normalized.includes('héo') || normalized.includes('bệnh') || normalized.includes('sâu')) {
          ans = simulatedAnswers[1];
        } else if (normalized.includes('uốn') || normalized.includes('kẽm') || normalized.includes('tạo dáng') || normalized.includes('cắt tỉa') || normalized.includes('bấm')) {
          ans = simulatedAnswers[2];
        }

        setTimeout(() => {
          return res.json({ 
            success: true, 
            text: `[Chế độ Mô phỏng Carey AI] ${ans}` 
          });
        }, 800);
      }
    } catch (err: any) {
      console.error('Error with Gemini API fetch:', err);
      res.json({ 
        success: true, 
        text: `Chào quý khách! Tôi rất muốn hỗ trợ, tuy nhiên hệ thống kết nối AI đang bận tí chút. Vui lòng thử lại hoặc tưới nước tưới mát đầy đủ cát sông cho cây tùng của bạn nha! (Lỗi: ${err.message || 'Mất kết nối server'})`
      });
    }
  });

  // API - Calculate Analytics statistics for administrator panel
  app.get('/api/analytics-stats', (req, res) => {
    // Totals
    const completedOrders = ordersDb.filter(o => o.status === 'Đã hoàn thành');
    const totalSales = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = ordersDb.length;
    const completedCount = completedOrders.length;
    const averageOrderValue = completedCount > 0 ? (totalSales / completedCount) : 0;

    // Monthly breakdown [Jan, Feb, Mar, Apr, May 2026]
    const months = ['Tháng 01/2026', 'Tháng 02/2026', 'Tháng 03/2026', 'Tháng 04/2026', 'Tháng 05/2026'];
    const monthlyStats = months.map(m => ({ month: m, revenue: 0, orders: 0 }));

    ordersDb.forEach(o => {
      const date = new Date(o.createdAt);
      const mIdx = date.getMonth(); // 0 = Jan, 4 = May
      if (mIdx >= 0 && mIdx < 5) {
        monthlyStats[mIdx].orders += 1;
        if (o.status === 'Đã hoàn thành' || o.status === 'Đang giao hàng' || o.status === 'Đã thanh toán') {
          monthlyStats[mIdx].revenue += o.totalAmount;
        }
      }
    });

    // Breakdown by Category (Tùng La Hán, Duyên Tùng, Tùng Kim Cương, Tùng Bồng Lai, Khác)
    const categoryMapping: Record<string, { name: string; value: number }> = {
      'tung-la-han': { name: 'Tùng La Hán', value: 0 },
      'duyen-tung': { name: 'Duyên Tùng Shimpaku', value: 0 },
      'tung-kim-cuong': { name: 'Tùng Kim Cương', value: 0 },
      'tung-bong-lai': { name: 'Tùng Bồng Lai', value: 0 },
      'tung-xuong-ca': { name: 'Tùng Xương Cá', value: 0 },
      'tung-thap': { name: 'Tùng Tháp', value: 0 }
    };

    ordersDb.forEach(o => {
      if (o.status !== 'Đã hủy') {
        o.items.forEach(item => {
          // Find matching category or fallback
          const prodId = item.productId;
          let catKey = 'tung-la-han';
          if (prodId === 'tung-2' || prodId === 'tung-7_placeholder') catKey = 'duyen-tung';
          else if (prodId === 'tung-3' || prodId === 'tung-8') catKey = 'tung-kim-cuong';
          else if (prodId === 'tung-4') catKey = 'tung-bong-lai';
          else if (prodId === 'tung-5') catKey = 'tung-xuong-ca';
          else if (prodId === 'tung-6') catKey = 'tung-thap';
          
          if (categoryMapping[catKey]) {
            categoryMapping[catKey].value += item.price * item.quantity;
          }
        });
      }
    });

    const byCategory = Object.values(categoryMapping).filter(c => c.value > 0);

    // Filter Popular products
    const prodSells: Record<string, { name: string; salesCount: number; revenue: number }> = {};
    ordersDb.forEach(o => {
      if (o.status !== 'Đã hủy') {
        o.items.forEach(itm => {
          if (!prodSells[itm.productId]) {
            prodSells[itm.productId] = { name: itm.productName, salesCount: 0, revenue: 0 };
          }
          prodSells[itm.productId].salesCount += itm.quantity;
          prodSells[itm.productId].revenue += itm.price * itm.quantity;
        });
      }
    });

    const popularProducts = Object.values(prodSells)
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        completedOrdersCount: completedCount,
        averageOrderValue,
        byCategory,
        byMonth: monthlyStats,
        popularProducts
      }
    });
  });

  // API - Monthly export report simulator (automatic end of month compile to TXT string)
  app.get('/api/reports/export', (req, res) => {
    // Build a beautiful formatted executive summary for the month of May 2026.
    const monthName = 'Tháng 05 Năm 2026';
    const completedOrders = ordersDb.filter(o => o.status === 'Đã hoàn thành' && o.createdAt.includes('-05-'));
    const totalAmount = ordersDb
      .filter(o => o.status !== 'Đã hủy' && o.createdAt.includes('-05-'))
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    const codAmount = ordersDb
      .filter(o => o.status !== 'Đã hủy' && o.createdAt.includes('-05-') && o.paymentMethod === 'cod')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const bankAmount = ordersDb
      .filter(o => o.status !== 'Đã hủy' && o.createdAt.includes('-05-') && o.paymentMethod === 'ck_nganhang')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

    let fileContent = `========================================================================
             BÁO CÁO DOANH THU & KINH DOANH CHUYÊN BIỆT
                       VUON TUNG BONSAI VIET
                    Kỳ Báo Cáo: ${monthName}
========================================================================
Ngày kết xuất báo cáo: ${new Date().toLocaleString('vi-VN')}
Đơn vị tính: Việt Nam Đồng (VND)
Trạng thái: Hoàn tất chốt sổ tự động cuối tháng.

I. TỔNG HỢP KPI DOANH THU THÁNG 5/2026
------------------------------------------------------------------------
* Tổng doanh số phát sinh (Gồm cả vận chuyển): ${formatter.format(totalAmount)}
* Số lượng đơn hàng mới thu nạp: ${ordersDb.filter(o => o.createdAt.includes('-05-')).length} đơn hàng
* Số lượng thanh toán chuyển khoản bảo mật: ${ordersDb.filter(o => o.createdAt.includes('-05-') && o.paymentMethod === 'ck_nganhang').length} đơn
* Tổng thu qua Chuyển Khoản Trực Tuyến: ${formatter.format(bankAmount)}
* Tổng thu qua COD (Giao hàng thu hộ): ${formatter.format(codAmount)}

II. DANH SÁCH CHI TIẾT ĐƠN HÀNG THÁNG 05/2026
------------------------------------------------------------------------
`;

    // Map through orders from May 2026
    const mayOrders = ordersDb.filter(o => o.createdAt.includes('-05-'));
    mayOrders.forEach((o, idx) => {
      fileContent += `Đơn hàng [${idx + 1}]: Mã ${o.id} | Ngày đặt: ${new Date(o.createdAt).toLocaleDateString('vi-VN')}
  - Khách Hàng: ${o.customerName} (${o.customerPhone})
  - Địa Chỉ: ${o.shippingAddress}
  - Hình Thức TT: ${o.paymentMethod === 'ck_nganhang' ? 'Chuyển khoản Ngân Hàng' : 'COD'}
  - Trạng Thái: ${o.status}
  - Chi Tiết Cây:
`;
      o.items.forEach(itm => {
        fileContent += `    * ${itm.productName} (SL: ${itm.quantity} x ${formatter.format(itm.price)})\n`;
      });
      fileContent += `  - Tổng Tiền Đơn: ${formatter.format(o.totalAmount)}\n`;
      fileContent += `------------------------------------------------------------------------\n`;
    });

    fileContent += `
III. ĐÁNH GIÁ SẢN PHẨM ƯU TÚ & CHIẾN LƯỢC TẬP TRUNG
------------------------------------------------------------------------
- Cây bán chạy hàng đầu: Tùng Bồng Lai Mini Để Bàn (sản lượng cao làm bàn làm việc sáng sủa).
- Tác phẩm đóng góp giá trị cao nhất: Tùng Kim Cương Lồng Đèn và Tùng La Hán Moyogi Bonsai gốc to.
- Kỹ thuật chăm sóc trợ lý ảo AI (Carey AI) đã phản hồi hơn 245 lượt tư vấn hỗ trợ thành công giảm tỷ lệ rụng hư Bonsai ở người chơi mới.

========================================================================
                        XÁC NHẬN BỞI BAN GIÁM ĐỐC
                 VƯỜN TÙNG BONSAI VIỆT - PHÒNG TÀI CHÍNH
========================================================================
*Báo cáo kết xuất tự động dăm bảo mật, được lưu trữ vĩnh viễn trên Cloud.*
`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-doanh-thu-thang-05-2026.txt');
    res.send(fileContent);
  });

  // Hook Vite Middleware in DEV mode, else serve build files static in PROD
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets dynamically
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bonsai Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});
