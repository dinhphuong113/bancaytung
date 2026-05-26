/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, BlogArticle } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'tung-1',
    name: 'Tùng La Hán Bonsai Đại Cổ Thụ (Moyogi)',
    scientificName: 'Podocarpus macrophyllus',
    type: 'tung-la-han',
    typeName: 'Tùng La Hán',
    price: 15500000,
    description: 'Tác phẩm tùng La Hán Bonsai uốn dáng Trực Quân Tử (Moyogi) kinh điển với bệ rễ nổi (Nebari) cực đẹp, vỏ cây đã nứt nẻ sần sùi thể hiện năm tháng phong trần dài lâu. Cây thích hợp bày trí ở sân vườn biệt thự, sảnh lớn cơ quan mang ý nghĩa thịnh vượng, mang tài lộc dày lâu.',
    image: 'https://images.unsplash.com/photo-1512428813824-f7258df4e622?auto=format&fit=crop&q=80&w=600',
    size: 'Cao 120cm, Rộng 95cm, Hoành thân 35cm',
    difficulty: 'Trung bình',
    age: 28,
    stock: 2,
    isPopular: true
  },
  {
    id: 'tung-2',
    name: 'Duyên Tùng Shimpaku Thác Đổ (Kengai)',
    scientificName: 'Juniperus chinensis sargentii',
    type: 'duyen-tung',
    typeName: 'Duyên Tùng (Shimpaku)',
    price: 9800000,
    description: 'Siêu phẩm Duyên Tùng nhập bản được tạo dáng Thác Đổ mềm mại, đổ xuống thành chậu uốn lượn ngoạn mục. Phần lũa nghệ thuật (Shari dọc thân và Jin cành) màu tuyết trắng tương phản hoàn hảo với màu đỏ tía của vỏ thông và màu xanh thẫm mượt mà của tán lá kim.',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600',
    size: 'Dài đổ 85cm, Rộng tán 45cm, Đk thân 15cm',
    difficulty: 'Khó',
    age: 18,
    stock: 3,
    isPopular: true
  },
  {
    id: 'tung-3',
    name: 'Tùng Kim Cương Dáng Văn Nhân (Bunjingi)',
    scientificName: 'Podocarpus macrophyllus var. gem',
    type: 'tung-kim-cuong',
    typeName: 'Tùng Kim Cương',
    price: 4200000,
    description: 'Lá tùng Kim Cương ngắn, dày dặn xếp dày khít như những đóa hoa cúc mang màu xanh biếc lấp lánh dưới nắng. Dáng cây Văn Nhân thanh lịch, siêu thoát với thân uốn cong mềm mại gợi vẻ đẹp cô độc, trường tồn của bậc nho sĩ ẩn dật chốn sơn thâm.',
    image: 'https://images.unsplash.com/photo-1613143748259-7caad25ec228?auto=format&fit=crop&q=80&w=600',
    size: 'Cao 75cm, Rộng 40cm, Hoành thân 12cm',
    difficulty: 'Trung bình',
    age: 12,
    stock: 5,
    isPopular: false
  },
  {
    id: 'tung-4',
    name: 'Tùng Bồng Lai Bonsai Mini Để Bàn',
    scientificName: 'Podocarpus brevifolius',
    type: 'tung-bong-lai',
    typeName: 'Tùng Bồng Lai',
    price: 280000,
    description: 'Chậu tùng mẫu mini nhỏ xinh, lá mềm mịn như nhung rủ bóng mây bồng bềnh. Đây là loài cây phong thủy tượng trưng cho sự may mắn, bình an cho gia chủ, rất hợp để bàn làm việc, kệ sách hoặc không gian quán cà phê tối giản. Cây cực khỏe, dễ chăm sóc lọc không khí tốt.',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
    size: 'Cao 22cm, Rộng 18cm, kèm chậu gốm bát tràng',
    difficulty: 'Dễ',
    age: 3,
    stock: 45,
    isPopular: true
  },
  {
    id: 'tung-5',
    name: 'Tùng Xương Cá Phong Cách Bắc Âu',
    scientificName: 'Taxus chinensis',
    type: 'tung-xuong-ca',
    typeName: 'Tùng Xương Cá',
    price: 450000,
    description: 'Một giống tùng lá nhỏ xếp đối xứng như đốt xương cá thanh mảnh, rất được ưa chuộng trong phong cách kiến trúc hiện đại tối giản hoặc Terrarium. Cây ưa ánh sáng tán xạ, hút bụi và thải oxy mạnh mẽ tạo cảm giác thư thái tươi mát cho căn phòng.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
    size: 'Cao 35cm, Rộng 25cm, Chậu xi măng mài hiện đại',
    difficulty: 'Dễ',
    age: 4,
    stock: 25,
    isPopular: false
  },
  {
    id: 'tung-6',
    name: 'Tùng Tháp Cảnh Quan Tiểu Cảnh',
    scientificName: 'Juniperus chinensis stricta',
    type: 'tung-thap',
    typeName: 'Tùng Tháp',
    price: 950000,
    description: 'Cây dòng dáng tháp lá kim màu xanh ánh bạc cực kỳ sang trọng. Phù hợp trồng sân vườn hai bên lối đi, tiểu cảnh đồi dốc Nhật Bản. Thể chất chịu sương gió, lạnh giá tốt và lớn dần theo vóc tháp oai nghiêm bản lĩnh anh hào không chịu khuất phục trước gian nguy.',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=600',
    size: 'Cao 90cm, Rộng tán đáy 35cm',
    difficulty: 'Dễ',
    age: 6,
    stock: 15,
    isPopular: false
  },
  {
    id: 'tung-7',
    name: 'Tùng La Hán Bonsai Dáng Bay (Semi-Cascade)',
    scientificName: 'Podocarpus macrophyllus',
    type: 'tung-la-han',
    typeName: 'Tùng La Hán',
    price: 3800000,
    description: 'Dáng Bonsai bay lượn (Semi-cascade) tinh tế với nhánh chủ vươn dài nhô hẳn ra ngoài mép chậu gốm vẽ tay Nhật Bản. Cây được nghệ nhân quấn dây kẽm chỉnh hình từng dăm nhánh nhỏ để tạo các tản vân tròn rải đều cân đối thách thức mọi góc nhìn.',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600',
    size: 'Cao 50cm, Tán rộng vươn dài 70cm, Tuổi chậu 5 năm',
    difficulty: 'Trung bình',
    age: 10,
    stock: 4,
    isPopular: true
  },
  {
    id: 'tung-8',
    name: 'Cổ Thụ Tùng Kim Cương Lồng Đèn Độc Bản',
    scientificName: 'Podocarpus macrophyllus var. gem',
    type: 'tung-kim-cuong',
    typeName: 'Tùng Kim Cương',
    price: 22000000,
    description: 'Tuyệt đỉnh Bonsai tùng kim cương có thâm niên trồng chậu gần nửa thế kỷ. Đầu cành dăm dày đặc được bấm tỉa gạt lớp mượt như nhung gấm như một khối lồng đèn tỏa lục bích chói sáng. Thân cây lũa tự nhiên phong hóa xám nến mang đậm cái hồn Wabi-Sabi tinh tế vượt thời gian.',
    image: 'https://images.unsplash.com/photo-1512428813824-f7258df4e622?auto=format&fit=crop&q=80&w=600',
    size: 'Cao 110cm, Trải rộng tán 90cm, Hoành gốc 42cm',
    difficulty: 'Khó',
    age: 45,
    stock: 1,
    isPopular: true
  }
];

export const INITIAL_BLOGS: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Kỹ Thuật Bấm Đọt và Tỉa Lá Tùng La Hán Chuẩn Nghệ Nhân',
    summary: 'Hướng dẫn chi tiết từng bước bấm ngọn non, lọc cành thừa để thu nhỏ lá, giữ tệp tán dăm luôn tròn đầy đẹp mắt.',
    category: 'cắt-tỉa',
    categoryName: 'Kỹ thuật cắt tỉa',
    author: 'Nghệ nhân Nguyễn Bảo Long',
    readTime: '8 phút đọc',
    createdAt: '2026-05-10',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600',
    content: `## Tại sao phải bấm đọt Tùng La Hán?

Tùng La Hán (Podocarpus macrophyllus) có tốc độ sinh trưởng mạnh mẽ vào mùa xuân và mùa thu. Nếu không kiểm soát các chồi ngọn, cây sẽ bị mất dáng (mất form Bonsai), các chi cành phía trong thiếu ánh sáng sẽ yếu dần và rụng lá (hiện tượng bỏ chi). 

Bên cạnh đó, việc bấm đọt đúng định kỳ giúp kích thích chồi ngủ nách mọc ra nhiều hơn, từ đó làm cho tán lá trở nên dày đặc, mịn màng và lá có kích thước nhỏ lại rất nhiều, giúp cây có tỉ lệ cân đối tuyệt vời của một cây Bonsai cổ thụ thu nhỏ.

---

## Các bước bấm đọt chi tiết

### 1. Thời điểm thích hợp
*   **Mùa xuân (Tháng 2 - Tháng 4):** Thời điểm cây bung đọt mạnh nhất sau mùa đông nghỉ ngơi.
*   **Mùa thu (Tháng 8 - Tháng 10):** Đợt bấm tạo dáng lần hai trước khi bước vào kỳ dưỡng đông.
*   *Lưu ý:* Tránh bấm đọt vào những ngày mưa ẩm ướt để tránh nhiễm nấm bệnh ở vết sẹo cắt tỉa.

### 2. Dụng cụ cần chuẩn bị
*   **Kéo tỉa dăm chuyên dụng:** Loại kéo mỏ dài và mảnh bằng thép carbon Nhật Bản sắc bén.
*   **Kéo bấm đọt gỗ:** Hoặc bạn có thể dùng móng tay để bấm trực tiếp ở vùng cuống mềm non của ngọn.
*   **Keo liền da cây:** Loại keo Nhật hoặc keo Mỹ (kèm màng chống thấm nước) để bôi lên các vết cắt cành lớn hơn đầu đũa.

### 3. Kỹ thuật thực hiện bấm ngọn
*   Vạch nhẹ tán dăm để tìm các đọt ngọn vượt trội (các đọt mọc cao hơn bề mặt độ dày chung của tản vân).
*   Dùng hai đầu ngón tay cái và trỏ để ngắt đi phần đỉnh sinh trưởng của chồi non (khoảng 1/2 đến 2/3 chiều dài chồi non mới nhú).
*   *Vì sao dùng tay bấm tốt hơn kéo?* Việc dùng tay ngắt đọt khi cuống còn non mềm giúp vết tổn thương khô nhanh tự nhiên, búp lá không bị cháy thâm đen ở đầu sẹo như khi dùng kéo kim loại chưa được sát trùng cắt cắt sát búp.
*   Đối với các cành đã hóa gỗ hoặc dăm già, dùng kéo tỉa dăm sắc bén cắt chéo góc 45 độ ngay phía trên nách búp lá khoảng 2mm để chồi mới mọc ra hướng theo ý muốn.

---

## Chế độ chăm sóc sau khi cắt tỉa

*   **Tưới nước:** Giảm lượng nước tưới khoảng 20% trong tuần đầu sau khi bấm tỉa hàng loạt vì diện tích thoát hơi nước ở lá đã bị thu hẹp đáng kể.
*   **Ánh sáng:** Giữ cây ở vị trí đủ nắng nhẹ hoặc có lưới che 30% trong 5-7 ngày đầu tiên để bảo vệ vết tỉa non khỏi bị cháy nắng.
*   **Phân bón:** Chỉ bón thúc phân hữu cơ hoai mục như bánh dầu, phân dơi hữu cơ sủi bọt nhẹ sau khi bắt đầu phát hiện đầu dăm nứt chồi non mới (thường sau 15-20 ngày kể từ lúc tỉa bấm). Không bón phân vô cơ (đạm cao) ngay lập tức khiến sẹo dễ nấm mốc và rễ bị xót cây.`
  },
  {
    id: 'blog-2',
    title: 'Nghệ Thuật Tạo Lũa Jin và Shari cho Duyên Tùng Bonsai',
    summary: 'Khám phá kỹ thuật lột vỏ sinh ra các phần lũa giả cổ tựa phong ba bão táp trên đỉnh núi đá của thiên nhiên Nhật Bản.',
    category: 'tạo-dáng',
    categoryName: 'Tạo dáng lũa',
    author: 'Nghệ nhân Trần Thanh Sơn',
    readTime: '12 phút đọc',
    createdAt: '2026-05-18',
    image: 'https://images.unsplash.com/photo-1512428813824-f7258df4e622?auto=format&fit=crop&q=80&w=600',
    content: `## Khái niệm về Jin và Shari trong nghệ thuật Bonsai

Trong tự nhiên hoang dã, những cây tùng, thông cổ thụ ngàn năm sinh trưởng trên vách đá treo leo thường phải chịu sự tàn phá khủng khiếp của bão tuyết, sét đánh, lũ quét. Kết quả là một số cành bị gãy rụng lột vỏ trơ phần lõi gỗ cứng cỏi chọi lại với trời đất, hoặc vỏ dọc thân cây bị bóc sạch tạo thành mảng lũa hoang hoải kỳ vĩ. 
*   **Jin (Lũa đầu cành):** Là phần đầu cành bị chết khô, vỏ bị bóc hết để lộ lõi gỗ sần sùi.
*   **Shari (Lũa trên thân):** Là dải gỗ chết dọc theo thân chính của cây, song song với dòng mạch sinh mệnh sống nuôi dưỡng dăm lá khác của cây.

Dưới đây là cách mà giới nghệ nhân Bonsai mô phỏng lại kỳ quan khắc nghiệt ấy thông qua kỹ thuật tạo tác hiện đại.

---

## Quy trình 3 bước thực hiện làm lũa nghệ thuật

### Bước 1: Xác định mạch sống của cây
Đây là bước **quan trọng bậc nhất**! Duyên Tùng quyết định dòng mạch dẫn nuôi dưỡng mạch lá bằng các dải vỏ nối liền từ rễ lên đến tán lá tương ứng.
*   Quan sát kỹ dòng chảy của nhánh dăm nào bạn muốn giữ lại sống, phác thảo bằng phấn vẽ các đường dải mạch vỏ tối thiểu 1.5 - 2 cm rải đều từ gốc lên hướng ấy.
*   Phần vỏ nằm ngoài sơ đồ mạch dẫn đó chính là nơi có thể bóc vỏ làm **Shari**. Tránh cắt đứt mạch dẫn rễ-lá chính nếu không cây sẽ chết cành hoặc chết toàn bộ.

### Bước 2: Bóc vỏ và điêu khắc gỗ cũ
*   Dùng dao gọt lũa sắc cắt hai đường song song rạch xuống tận thấu lõi gỗ sồi, sau đó sử dụng kềm bổ lũa để kẹp bóc lớp vỏ tươi rách ra.
*   Dùng bộ rùi đục Bonsai hoặc máy mài cầm tay lắp đầu khắc phá để mài theo vân thớ thớ gỗ tự nhiên của cây. Bạn nên tạo các vết nứt sần, lồi lõm hoang xơ chân thực chứ không mài nhẵn thín giống đồ gỗ gia dụng.

### Bước 3: Quét bảo quản lũa với Sun-phua vôi (Lime Sulfur)
Gỗ duyên tùng chứa dầu tự nhiên tốt nhưng nếu tiếp xúc với mưa nắng ấm lâu ngày vẫn sẽ bị mục rỗng ăn sâu phá hỏng bệ thân.
*   Lau sạch mùn cưa và phơi lũa khô ráo trong 2 ngày dăm.
*   Dùng cọ quét dung dịch **Lime Sulfur** (Lưu huỳnh vôi cốt) nguyên chất đẫm lên phần lũa trắng. Lưu huỳnh vôi vừa có tác dụng khử trùng ngừa nấm hại, bảo vệ gỗ cứng chắc mộc mạc, vừa tẩy uế cho thớ gỗ biến đổi thành màu trắng nến cực kỳ đẹp mắt mắt sau vài ngày đón nắng.`
  },
  {
    id: 'blog-3',
    title: 'Phác đồ chẩn trị 3 bệnh thường gặp trên cây Tùng cảnh',
    summary: 'Hướng dẫn phát hiện kịp thời các triệu chứng cháy đầu lá kim, rệp bám sáp búp non và bệnh nấm gỉ sắt làm khô cành.',
    category: 'phòng-bệnh',
    categoryName: 'Dịch bệnh & Dinh dưỡng',
    author: 'Kỹ sư nông nghiệp Lê Hữu Hải',
    readTime: '6 phút đọc',
    createdAt: '2026-05-22',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
    content: `## 1. Bệnh cháy đầu lá (đốm xám lá kiệt)

*   **Triệu chứng:** Xuất hiện các vệt chấm xám đen nhỏ từ mép đầu lá sau đó khô rụi thành vệt vàng cháy xém, ranh giới giữa mô bệnh và mô khỏe sẫm màu tía đen rực. Lá rụng nhanh từ dưới gốc chân lên đến đầu tán.
*   **Nguyên nhân:** Do nấm *Cercospora podocarpi* tấn công khi môi trường quá nóng ẩm, mật độ cây xếp quá khít rịt không có nắng xuyên thấu thông thoáng gió.
*   **Cách khắc phục:**
    *   Cắt bỏ toàn bộ các lá bệnh gom đi tiêu hủy xa vườn tùng.
    *   Phun lập tức dung dịch thuốc chứa hoạt chất gốc đồng như Coc85, Anvil 5SC hoặc Ridomil Gold định kỳ 2 lần cách nhau 7 ngày liên tiếp.
    *   Kê chân chậu thoáng, tăng nắng cho cây ít nhất từ 4-6 tiếng/ngày.

---

## 2. Rệp sáp, rệp dính muội đen

*   **Triệu chứng:** Xuất hiện các đốm bông mịn dạng trắng xốp hoặc vỏ vảy cứng màu nâu óng bám dẹt lỳ ở cuống cành non và mặt dưới dăm lá. Đọt non bị rệp hút nhựa co rúm lại không giãn nứt, dịch thải của rệp bám tạo lớp màng mụi đen sền sệt cản quang.
*   **Nguyên nhân:** Do thời tiết khô hanh kéo dài kết hợp kiến mang trứng rệp gieo rắc lây lan khắp nơi.
*   **Cách khắc phục:**
    *   Dùng vòi phun nước áp lực cao phun liên tiếp xịt trôi trực tiếp rệp sáp bám ở dăm lá.
    *   Phun các loại chế phẩm sinh học trị rệp hoặc thuốc đặc trị rệp sáp như Movento, Yamida sấy bọt xịt ướt sũng thân cành lúc chiều tối muộn.`
  }
];
