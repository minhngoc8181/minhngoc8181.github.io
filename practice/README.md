# Python Practice Lab

Một hệ thống học tập Python hoàn chỉnh chạy trên trình duyệt web, cho phép học sinh làm bài tập Python với testcases tự động.

## Tính năng

- ✅ **Biên dịch và thực thi Python** hoàn toàn trong trình duyệt (sử dụng Pyodide)
- ✅ **Editor code chuyên nghiệp** với syntax highlighting (CodeMirror)
- ✅ **Hệ thống bài tập** được định nghĩa bằng file JSON
- ✅ **Testcases tự động** với báo cáo chi tiết
- ✅ **Giao diện thân thiện** với Bootstrap
- ✅ **Báo lỗi đầy đủ** khi code có vấn đề
- ✅ **Phân loại độ khó** bài tập (Dễ, Trung bình, Khó)

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt web
2. Chọn một bài tập từ danh sách bên trái
3. Viết code Python trong editor
4. Nhấn "Chạy code" hoặc Ctrl+Enter để thực thi
5. Xem kết quả testcases và sửa code nếu cần

## Cấu trúc file

```
practice/
├── index.html          # Trang web chính
├── app.js             # Logic JavaScript
├── problems.json      # Định nghĩa bài tập và testcases
└── README.md          # Tài liệu này
```

## Định nghĩa bài tập

Bài tập được định nghĩa trong file `problems.json` với cấu trúc:

```json
{
  "problems": [
    {
      "id": 1,
      "title": "Tên bài tập",
      "description": "Mô tả bài tập",
      "difficulty": "Dễ|Trung bình|Khó",
      "starter_code": "Code mẫu ban đầu",
      "test_cases": [
        {
          "description": "Mô tả test case",
          "input": "Lệnh Python để test (hoặc rỗng nếu test print)",
          "expected_output": "Kết quả mong đợi"
        }
      ]
    }
  ]
}
```

## Ví dụ testcase

### Test hàm số:
```json
{
  "description": "add(2, 3) = 5",
  "input": "add(2, 3)",
  "expected_output": "5"
}
```

### Test output print:
```json
{
  "description": "In ra 'Hello, World!'",
  "input": "",
  "expected_output": "Hello, World!"
}
```

## Tính năng nâng cao

- **Tự động tải Pyodide**: Python runtime được tải và khởi tạo tự động
- **Error handling**: Hiển thị lỗi Python chi tiết và dễ hiểu
- **Responsive design**: Giao diện tương thích với mọi thiết bị
- **Keyboard shortcuts**: Ctrl+Enter để chạy code nhanh
- **Code persistence**: Code được giữ nguyên khi chuyển đổi bài tập

## Thêm bài tập mới

1. Mở file `problems.json`
2. Thêm object bài tập mới vào mảng "problems"
3. Định nghĩa đầy đủ các trường bắt buộc
4. Tạo testcases phù hợp
5. Lưu file và refresh trang web

## Lưu ý kỹ thuật

- Pyodide cần kết nối internet để tải lần đầu
- Code Python chạy trong sandbox an toàn
- Hỗ trợ hầu hết các tính năng Python cơ bản
- Không hỗ trợ các thư viện yêu cầu native code

## Browser support

- Chrome/Chromium 90+
- Firefox 90+
- Safari 14+
- Edge 90+
