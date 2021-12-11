Bước 1: npm install để install packages\
        bật service mysql chạy trên localhost (có thể dùng xampp để bật server)\
Bước 2: set các giá trị thích hợp để kết nối tới db trong file db/config/config.json\
file config.json có nội dung như sau
```
{
  "development": {
    "username": "root",
    "password": "",
    "database": "VietnamTourism",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql"
  }
}

```
Bước 3: bật terminal trong folder db, chạy lệnh npx sequelize-cli db:create để tạo db \
Bước 4: Chạy npx sequelize-cli db:migrate để tự động tạo table trên db \
Bước 5: npm run start để chaỵ server backend \

-------------------------------------------------------------------------
API List ở trang tính 2, trong link: https://docs.google.com/spreadsheets/d/1-BpJRDU9scDHdHh0tBP_XKAQOEdh0PXZIJIPg6DMBt0/edit#gid=331166045