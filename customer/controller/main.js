import Products from "../../admin/model/Products.js";
import Api from "../../admin/servies/Api.js";
import { getEle } from "../../admin/controller/controller.js";


// Thêm class black đổi màu cho header khi scroll
window.addEventListener("scroll", function () {
  const header = document.querySelector("nav");
  if (window.scrollY > 20) {
    header.classList.add("black");
  } else {
    header.classList.remove("black");
  }
});

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
    <div class="content-overlay"></div>
      <img src=${product.img} class="card-img" alt="Phone Image" />
      <div class="content-details fadeIn-top">
      <h3 class ='pb-5'>Thông số kỹ thuật</h3>
            <div class="d-flex justify-content-start py-1">
          <span class='text-light'><b>Screen:</b></span>
          <span class='text-light'>&nbsp ${product.screen}</span>
        </div>
        <div class="d-flex justify-content-start py-1">
          <span class='text-light'><b>Back Camera:</b> ${
            product.backCamera
          }</span>
        </div>
        <div class="d-flex justify-content-start py-1">
          <span class='text-light'><b>Front Camera:</b> ${
            product.frontCamera
          }</span>
        </div>

        <p class = 'pt-5'><u>click here for more details</u></p>
      </div>
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
        <div class="d-flex justify-content-between pt-3">
          <div class="text-warning">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
          </div>
          <span class = 'text-success'><b>In Stock</b></span>
        </div>
        <button type="button" class="btn btn-block w-50" onclick ="btnAddToCart('${
          product.id
        }')">Add to cart</button>
      </div>
    </div>
  </div>`;
  });
  getEle("phoneList").innerHTML = content;
};


/* Hàm render cart ra giao diện */
const renderCart = (cart) => {
  let content = "";
  cart.forEach((item) => {
    content += `
  <div class="product">
    <div class="product__1">
      <div class="product__thumbnail">
        <img src=${item.product.img} 
          alt="Italian Trulli">
      </div>
      <div class="product__details">
        <div style="margin-bottom: 8px;"><b>${item.product.name}</b></div>
        <div style="font-size: 90%;">Screen: <span class="tertiary">${
          item.product.screen
        }</span></div>
        <div style="font-size: 90%;">Back Camera: <span class="tertiary">${
          item.product.backCamera
        }</span></div>
        <div style="font-size: 90%;">Front Camera: <span class="tertiary">${
          item.product.frontCamera
        }</span></div>
        <div style="margin-top: 8px;"><a href="#!" onclick ="btnRemove('${
          item.product.id
        }')">Remove</a></div>
      </div>
    </div>
    <div class="product__2">
      <div class="qty">
        <span><b>Quantity:</b> </span> &nbsp &nbsp
        <span class="minus bg-dark" onclick ="btnMinus('${
          item.product.id
        }')">-</span>
        <span class="quantityResult mx-2">${item.quantity}</span>
        <span class="plus bg-dark" onclick ="btnAdd('${
          item.product.id
        }')">+</span>
      </div>
      <div class="product__price"><b>$${
        item.quantity * item.product.price
      }</b></div>
    </div>
  </div>
`;
  });
  getEle("cartList").innerHTML = content;
 
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
  // áp dụng toán tử ba ngôi để gán giá trị cho cart, nếu đã có dữ liệu cart trong local Storage thì dùng JSON.parse để gán dữ liệu bình thường, nếu không thì card = []
  cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  renderCart(cart); // render ra giao diện
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
