import Products from "../../admin/model/Products.js";
import Api from "../../admin/servies/Api.js";
import {CartItem} from "../model/cartItem.js";
import { getEle } from "../../admin/controller/controller.js";

/* Tạo đối tượng api từ lớp đối tượng Api */
const api = new Api();

/* Đặt biến cart - global */
let cart = [];

/* Tạo hàm hiển thị danh sách sản phẩm lên giao diện */
const renderProductList = (phoneList) => {
  let content = "";
  phoneList.forEach((product) => {
    content += ` 
    <div class="col-lg-3 col-md-6 pt-4">
    <div class="card text-black h-100">
      <img src=${product.img} class="card-img" alt="Phone Image" />
     
      <div class="card-body">
        <div class="text-center">
          <h5 class="card-title pt-3">${product.name}</h5>
          <span class="text-muted mb-2">$${product.price}</span>
          <span class="text-danger"><s>$${
            Number(product.price) + 300
          }</s></span>
        </div>
        <div class="mt-3 brand-box text-center">
          <span>${product.type}</span>
        </div>
        <div class="d-flex justify-content-start pt-3">
          <span><b>Description:</b> ${product.desc}</span>
        </div>
        <div class="product-cart d-flex justify-content-between pt-3">
          <div class="text-warning">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="lni lni-star"></i>
          </div>
          <span class = 'text-success'><b>In Stock</b></span>
        </div>
        <button type="button" class="btn-cart btn btn-block w-50" onclick ="btnAddToCart('${
          product.id
        }')">Add to cart</button>
      </div>
    </div>
  </div>`;
  });
  getEle("phoneList").innerHTML = content;
};

const renderCart = (cart) => {
  let content = '';
  cart.forEach((ele) => {
    content += `<div class="product">
  <div class="product__1">
    <div class="product__thumbnail">
      <img src=${ele.product.img} 
        alt="Italian Trulli">
    </div>
    <div class="product__details">
      <div style="margin-bottom: 8px;"><b>${ele.product.name}</b></div>
      <div style="margin-top: 8px;"><a href="#!" onclick ="btnRemove('${ele.product.id
      }')">Remove</a></div>
    </div>
  </div>
  <div class="product__2">
    <div class="qty">
      <span><b>Quantity:</b> </span> &nbsp &nbsp
      <span class="minus bg-dark" onclick ="btnMinus('${ele.product.id}')">-</span>
      <span class="quantityResult mx-2">${ele.quantity}</span>
      <span class="plus bg-dark" onclick ="btnAdd('${ele.product.id}')">+</span>
    </div>
    <div class="product__price"><b>$${ele.quantity * ele.product.price}</b></div>
  </div>
</div>`;
  });
  getEle('cartList').innerHTML = content;

  let cartCount = 0;
  cart.forEach((ele) => {
    cartCount += ele.quantity;
  });
  const subTotal = calculateSubTotal(cart);
  const shipping = subTotal > 0 ? 10 : 0;
  getEle('cartCount').innerHTML = cartCount;
  getEle('shipping').innerHTML = '$' + shipping;
  getEle('subTotal').innerHTML = '$' + subTotal;
  getEle('tax').innerHTML = '$' + Math.floor(subTotal * 0.1);
  getEle('priceTotal').innerHTML = '$' + Math.floor(subTotal * 1.1 + shipping);
};



/* Sự kiện window.onload để khi toàn bộ trang web tải xong, các hàm Js sẽ được thực thi */
window.onload = async () => {
  // đợi callApi trả về giá trị, gán kết quả cho res(result)
  const res = await api.callApi("Products", "GET", null);
  // nếu API đã trả về dữ liệu thành công
  if (res.status === 200 && res.statusText === "OK") {
    // hiển thị danh sách sản phẩm trên giao diện
    renderProductList(res.data);
  }
  cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  renderCart(cart);
};

/* Lọc hiển thị sản phẩm theo loại */
getEle("selectList").onchange = async () => {
  // lấy loại sản phẩm user chọn
  const value = getEle("selectList").value;
  // đợi api trả dữ liệu về gán vào biến res
  const res = await api.callApi("Products", "GET", null);
  // nếu dữ liệu trả về thành công
  if ((res.status === 200) & (res.statusText === "OK")) {
    // khai báo biến 'mảng tìm kiếm' và gán data từ server vào
    let searchArr = res.data;
    // nếu loại sản phẩm user chọn là all, render tất cả data, nếu không thì render theo loại sản phẩm
    if (value !== "all") {
      searchArr = res.data.filter((product) => product.type === value);
    }
    renderProductList(searchArr);
  }
};


window.btnAddToCart = async (productId) => {
  const phoneData = await service.getPhoneById(productId);
  const { id, name, price, screen, backCamera, frontCamera, img, desc, type } = phoneData;
  const product = new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  const newCartItem = new CartItem(product, 1);
  let cartItem = findItemById(cart, newCartItem.product.id);
  !cartItem ? cart.push(newCartItem) : cartItem.quantity++;
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};
// dấu cộng trong giỏ hàng
window.btnAdd = (id) => {
  let cartItem = findItemById(cart, id);
  if (cartItem) cartItem.quantity++;
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// dấu trừ trong giỏ hàng
window.btnMinus = (id) => {
  let cartItem = findItemById(cart, id);
  if (cartItem) cartItem.quantity--;
  cart = cart.filter((ele) => ele.quantity != 0);
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// xóa sản phẩm khỏi giỏ hàng
window.btnRemove = (id) => {
  cart = cart.filter((ele) => ele.product.id != id);
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// clear giỏ hàng
window.emptyCart = () => {
  cart = [];
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};

//Nút thanh toán
window.payNow = () => {
  if (cart.length > 0) {
    Swal.fire({
      icon: 'success',
      title: 'Your order is completed',
      showConfirmButton: false,
      timer: 1500,
    });
    emptyCart();
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Your cart is empty',
    });
  }
};
