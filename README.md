# THE GRADUATION MIXTAPE — LTDee

Thiệp mời tốt nghiệp React + Vite + Framer Motion, phong cách hip-hop/R&B với palette kem, mocha và dusty rose.

## Chạy local

Cần Node.js 18+.

```bash
npm install
npm run dev
```

Mở URL mà Vite hiển thị trong terminal. Kiểm tra bản build production:

```bash
npm run build
npm run preview
```

## Tuỳ chỉnh thông tin

Sửa `src/config.js`. Ngày giờ, địa điểm, trường và tên nghệ sĩ đã được nhập theo thông tin người dùng cung cấp.

## Ảnh chân dung đã được thêm

Ảnh bạn gửi đã được đặt tại `public/images/ltdee-portrait.jpg` và cấu hình sẵn trong `src/config.js`.

## Nhạc SoundCloud đã được cấu hình

Website dùng trình nhúng chính thức cho track `Dừng Nên Nhớ — LTDee`: https://soundcloud.com/ltdee269/dung-nen-nho-ltdee. Nhấn `PLAY TRACK` để hiện trình phát, sau đó nhấn Play bên trong SoundCloud. Trình duyệt thường chặn tự phát âm thanh.

### Nếu muốn dùng file âm thanh trực tiếp

Trong `src/config.js`, đặt `musicUrl` thành URL trực tiếp tới MP3/WAV/M4A. URL phải cho phép trình duyệt tải/phát âm thanh, ví dụ URL tới file `.mp3`, không chỉ là trang xem bài nhạc.

### Cách 2 — file local
1. Chép file vào `public/audio/`, ví dụ `graduation-beat.mp3`.
2. Đặt `musicUrl: "/audio/graduation-beat.mp3"`.

Lưu ý: file nhạc lớn sẽ làm website tải chậm hơn. Chỉ sử dụng beat mà bạn có quyền phát/chia sẻ.

### Nếu nhạc ở SoundCloud / YouTube
Link trang thông thường không dùng được làm `musicUrl` vì đây không phải direct audio URL. Cần dùng embed chính thức của nền tảng (có thể triển khai riêng) hoặc host file âm thanh mà bạn có quyền sử dụng.

## Kéo đĩa vinyl
Kéo đĩa than sang phải để mở phần thiệp mời. Có thể dùng chuột, cảm ứng hoặc phím Enter/Space khi phần đĩa đang được focus. Nút Play sẽ phát nhạc sau khi đã cấu hình URL.

## Xuất bản
Có thể đẩy project lên GitHub rồi import repository vào Vercel. Dùng lệnh build `npm run build`, thư mục output `dist`.

## Cần hoàn thiện trước khi gửi khách mời
- Thay ảnh placeholder bằng ảnh chân dung thật.
- Cấu hình URL nhạc.
- Xác nhận lại cách hiển thị giờ buổi lễ nếu cần (đang giữ nguyên `10:00 – 12:00` theo thông tin đã cung cấp).
- RSVP chưa tích hợp; có thể bổ sung form hoặc link liên hệ sau nếu muốn.


### Các tùy chỉnh mới
- Khi kéo đĩa than sang phải để mở album, website sẽ tự hiển thị SoundCloud player với tùy chọn tự phát (`auto_play=true`) và cuộn mượt xuống thiệp mời. Trình duyệt có thể vẫn chặn tự phát trong một số trường hợp; nếu vậy, nhấn Play bên trong SoundCloud.
- Tên khách mời hiện là `$TREET POETS`, có thể sửa tại `src/config.js` ở thuộc tính `guestName`.
- Hướng dẫn kéo đĩa đã được làm nổi bật hơn để dễ nhận biết.
- Nếu muốn phát nhạc ổn định hơn, có thể cung cấp file MP3 có quyền sử dụng; khi có file, có thể chuyển sang trình phát âm thanh HTML5.


## Template thiệp cá nhân theo đường dẫn

- Template để trống tên khách mời khi truy cập trang chủ.
- Khi mở URL dạng `/ten-khach-moi`, website lấy slug trên URL và hiển thị tên khách mời (chữ in hoa). Ví dụ `/street-poets` hiển thị `STREET POETS`.
- Không cần tạo/deploy website riêng cho từng khách. Mỗi khách chỉ cần một URL khác nhau.
- `vercel.json` đã cấu hình rewrite để các đường dẫn khách mời vẫn mở được ứng dụng React.

### Tạo link cho nhiều khách mời (giữ nguyên tên có ký hiệu đặc biệt)

Tên hiển thị được lưu riêng trong `src/guests.json`, còn URL dùng slug sạch. Ví dụ `$TREET POETS` sẽ có slug `street-poets` nhưng vẫn hiển thị nguyên văn `$TREET POETS` trên thiệp.

Mở Terminal tại thư mục gốc project. Trong **PowerShell**, dùng nháy đơn để bảo toàn ký tự `$`:

```powershell
node scripts/generate-links.mjs '$TREET POETS' 'Nguyễn Văn An' 'Trần Minh Anh'
```

Đặt domain thật trước khi tạo link:

```powershell
$env:SITE_URL="https://ten-project.vercel.app"
node scripts/generate-links.mjs '$TREET POETS' 'Nguyễn Văn An'
```

Trên Windows CMD, ký tự `$` không được xử lý như biến shell, nên có thể chạy:

```bat
set SITE_URL=https://ten-project.vercel.app
node scripts/generate-links.mjs "$TREET POETS" "Nguyen Van An"
```

Script sẽ:
- Tự tạo slug không dấu, viết thường, ngăn cách bằng dấu gạch ngang.
- Lưu tên gốc chính xác vào `src/guests.json` (giữ `$`, dấu tiếng Việt và cách viết hoa/thường).
- Giữ danh sách khách đã có khi thêm khách mới.
- Báo lỗi nếu hai tên khác nhau tạo ra cùng slug, thay vì âm thầm ghi đè.
- In URL riêng cho từng khách.

**Quan trọng:** sau khi thêm khách mới, cần commit/push thay đổi `src/guests.json` lên GitHub và deploy lại Vercel để đường dẫn mới hoạt động trên website công khai. Các link đã có vẫn giữ nguyên miễn là không đổi slug. Nếu chỉ chạy script trên máy nhưng không deploy lại, Vercel chưa có dữ liệu khách mới.

### File nhạc MP3

File `Dung Nen Nho - LTDee.mp3` được đặt tại `public/audio/dung-nen-nho-ltdee.mp3`. Khi kéo đĩa mở album, website gọi phát MP3 trực tiếp. Trình duyệt vẫn có thể chặn autoplay; nếu vậy, khách nhấn `PLAY TRACK`.

### Liên hệ trên thiệp

Đã thêm Phone, Zalo, Facebook và Instagram theo thông tin được cung cấp.

## Deploy lên Vercel

1. Đẩy thư mục project lên một repository GitHub.
2. Trên Vercel chọn **Add New → Project**, import repository.
3. Framework preset: **Vite**; Build command: `npm run build`; Output directory: `dist`.
4. Deploy. Sau khi có domain thật, đặt `SITE_URL` khi tạo link bằng script bên trên.
5. Kiểm tra cả trang chủ và một đường dẫn con như `/street-poets` sau deploy.
