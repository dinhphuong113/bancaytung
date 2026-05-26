/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TreeType = 
  | 'tung-la-han' 
  | 'tung-kim-cuong' 
  | 'tung-bong-lai' 
  | 'tung-xuong-ca' 
  | 'duyen-tung' 
  | 'tung-thap';

export interface Product {
  id: string;
  name: string;
  scientificName: string;
  type: TreeType;
  typeName: string;
  price: number; // in VND
  description: string;
  image: string;
  size: string; // dimensions (height x width)
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  age: number; // in years
  stock: number;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
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
  paymentDetails?: {
    transactionId?: string;
    paidAt?: string;
    cardHolder?: string;
  };
}

export interface BlogArticle {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown / Text content
  category: 'cắt-tỉa' | 'dinh-dưỡng' | 'phòng-bệnh' | 'tạo-dáng';
  categoryName: string;
  image: string;
  author: string;
  readTime: string;
  createdAt: string;
}

export interface ConsultationMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

export interface RevenueStats {
  totalSales: number;
  totalOrders: number;
  completedOrdersCount: number;
  averageOrderValue: number;
  byCategory: { name: string; value: number }[];
  byMonth: { month: string; revenue: number; orders: number }[];
  popularProducts: { name: string; salesCount: number; revenue: number }[];
}
