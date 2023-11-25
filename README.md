# FoodApp Delivery

## Document

I. GIỚI THIỆU

    - FoodYum là 1 ứng dụng mua đồ ăn nhanh online, cho phép người dùng đặt đồ ăn trực tuyến từ cửa nhà hàng.
        Người dùng có thể duyệt menu, chọn món, thêm vào giỏ hàng và thanh toán qua ứng dụng.

    - FoodYum được xây dựng trên Visual Studio Code sử dụng framework React Native 
        với ngôn ngữ Javascript và Typescript, dữ liệu của app được lưu trên FireBase(Realtime Database)
   
    - Các chức năng của người dùng :
        + Bao gồm các chức năng như đăng nhập, đăng ký, quản lý thông tin cá nhân (Firebase Authentication)
          
        + Mua, đặt hàng, thanh toán, quản lí hoá đơn, chat bot để biết thêm chi tiết sản phẩm.
          
        + Thông tin chi tiết sản phẩm, chương trình ưu đãi, blog giới thiệu các sản phẩm.
        
    - Các chức năng của quản trị viên :
        + Bao gồm các chức năng như đăng nhập, 
        
        +  Quản lý tài khoản và phân quyền sử dụng.
        
        +  Quản lý sản phẩm và các danh mục sản phẩm.
        
        +  Quản lý đơn hàng
        
        +  Báo cáo thống kê doanh thu, doanh số theo thời gian.
    


II. CHI TIẾT CÁC CHỨC NĂNG CHÍNH 

    1. Đăng nhập: Người dùng và người quản trị đều cần có chức năng đăng nhập để truy cập vào ứng dụng.   
    
    2. Đăng ký: Người dùng có thể đăng ký tài khoản mới để sử dụng ứng dụng.
    
    3. Quản lý thông tin cá nhân: Người dùng có thể thay đổi thông tin cá nhân của mình
       (tên, địa chỉ, số điện thoại, email, hình ảnh đại diện, mật khẩu, v.v.).
    
    4. Mua hàng: Người dùng có thể xem danh sách sản phẩm, chọn mua và thêm vào giỏ hàng.
    
    5. Đặt hàng: Người dùng có thể xem giỏ hàng, chỉnh sửa số lượng và đặt hàng.
    
    6. Thanh toán: Người dùng có thể chọn phương thức thanh toán và thực hiện thanh toán cho đơn hàng.
    
    7. Chat bot: Người dùng có thể trò chuyện với chat bot để biết thêm chi tiết về sản phẩm.
    
    8. Xem thông tin chi tiết sản phẩm: Người dùng có thể xem thông tin chi tiết về từng sản phẩm
       (mô tả, giá, ảnh, v.v.).
    
    9. Xem chương trình ưu đãi: Người dùng có thể xem các chương trình ưu đãi đang diễn ra
       và áp dụng cho đơn hàng của mình.
    
    10. Xem blog giới thiệu sản phẩm: Người dùng có thể xem các bài viết blog giới thiệu về các sản phẩm.
    
    11. Quản lý tài khoản: Người quản trị có thể quản lý tài khoản người dùng (thêm, sửa, xóa).
    
    12. Phân quyền sử dụng: Người quản trị có thể phân quyền sử dụng cho các tài khoản người dùng.
    
    13. Quản lý sản phẩm: Người quản trị có thể quản lý danh sách sản phẩm (thêm, sửa, xóa).
    
    14. Quản lý danh mục sản phẩm: Người quản trị có thể quản lý danh mục sản phẩm (thêm, sửa, xóa).
    
    15. Quản lý đơn hàng: Người quản trị có thể xem danh sách đơn hàng, xem chi tiết từng đơn hàng,
        cập nhật trạng thái đơn hàng.
    
    16. Báo cáo thống kê doanh thu: Người quản trị có thể xem báo cáo thống kê doanh thu theo thời gian
        (ngày, tháng).

III. CẤU TRÚC DỮ LIỆU
   
         1. Bảng "Users" (Người dùng):
           - id
           - username
           - password
           - name
           - address
           - phone
           - email
           - avatar

         2. Bảng "Categories" (Danh mục sản phẩm):
           - id
           - name
           - img
        
         3. Bảng "Products" (Sản phẩm):
           - id 
           - idCategory
           - idSeller
           - name
           - description
           - img
           - price
           - sold
           - discount
           - status

         4. Bảng "Carts" (Giỏ hàng):
           - id
           - idUser
           - idSeller
           - quantity
           - datetime
           - status
     
         5. Bảng "Orders" (Đơn hàng):
           - id
           - idUser
           - idSeller
           - quantity
           - datetime
           - status

          6. Bảng "Messages" (Tin nhắn):
           - id
           - idSender
           - idReceiver
           - message
           - datetime
           - status

## Preview

### Signup, Login Screen
<img src='/ImagePreview/signup.png' width='300' height='600'> <img src='/ImagePreview/Login.png' width='300' height='600'>

### Home Screen
<img src='/ImagePreview/Home1.png' width='300' height='600'> <img src='/ImagePreview/Home3.png' width='300' height='600'> <img src='/ImagePreview/Home2.png' width='300' height='600'> 

### Cart Screen
<img src='/ImagePreview/Cart1.png' width='300' height='600'> <img src='/ImagePreview/Cart2.png' width='300' height='600'>

### ListProduct Screen
<img src='/ImagePreview/ListProduct1.png' width='300' height='600'> <img src='/ImagePreview/ListProduct2.png' width='300' height='600'>

### Payment Screen
<img src='/ImagePreview/Payment.png' width='300' height='600'>

### Manage Order Screen
<img src='/ImagePreview/WaitingOrder.png' width='300' height='600'> <img src='/ImagePreview/SuccessOrder.png' width='300' height='600'> <img src='/ImagePreview/CancelOrder.png' width='300' height='600'>

### Statistics Screen
<img src='/ImagePreview/Statistics1.jpg' width='300' height='600'> <img src='/ImagePreview/Statistics2.jpg' width='300' height='600'> <img src='/ImagePreview/Statistics3.jpg' width='300' height='600'>

### Map Screen
<img src='/ImagePreview/Map.png' width='300' height='600'>

### Add, Edit Category
<img src='/ImagePreview/AddCategory.png' width='300' height='600'> <img src='/ImagePreview/EditCategory.png' width='300' height='600'>

### Add, Edit Product
<img src='/ImagePreview/AddProduct.png' width='300' height='600'> <img src='/ImagePreview/EditProduct.png' width='300' height='600'>

# Getting Started

## First
```base
git clone https://github.com/vungnv10103/ReactNative_Internship_FoodApp.git
cd .\ReactNative_Internship_FoodApp\

```

## Step 1: Install node module

```bash
# using npm
npm i

# OR using Yarn
yarn
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 4: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

