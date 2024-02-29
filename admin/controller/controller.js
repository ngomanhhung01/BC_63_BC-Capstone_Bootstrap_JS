import Products from "../model/Products.js";
import Validation from "./Validation.js";

/* Tạo hàm để DOM ID */
const getEle = (id) => document.getElementById(id);

/* Tạo đối tượng validation từ lớp đối tượng Validation */
const validation = new Validation();

/* Tạo hàm để hiện thị danh sách sản phẩm */
const renderUI = (data) => {
  let content = "";
  data.forEach((phone) => {
    content += `
        <tr>
            <td>${phone.id}</td>
            <td><strong>${phone.name}</strong></td>
            <td>${phone.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            })}</td>
            <td style="text-align: center"><img src="${
              phone.img
            }" alt="phone" width="80" height="80"/></td>
            <td>${phone.desc}</td>
          
            <td style="text-align: center">
                <button class="btn my-3 mr-1" data-toggle="modal" data-target="#exampleModal" onclick="editPhone(${
                  phone.id
                })" id="btnEdit">
                    Edit<i class="fa fa-pencil-square ml-2"></i>
                </button>
                <button id="btnDelete" class="btn" onclick ="deletePhone(${
                  phone.id
                })">
                    Delete <i class="fa fa-trash ml-2"></i>
                </button></td>
        </tr>
        `;
    getEle("tablePhone").innerHTML = content;
  });
};

/* Tạo hàm để lấy thông tin sản phẩm */
const getInfo = (id) => {
  const name = getEle("name").value;
  const price = Number(getEle("price").value);
  const screen = getEle("screen").value;
  const backCam = getEle("backCam").value;
  const frontCam = getEle("frontCam").value;
  const img = getEle("img").value;
  const desc = getEle("desc").value;
  const type = getEle("type").value;

  // Validation
  let isValid = true;

  // Validate name
  isValid &= validation.checkEmpty(
    name,
    "tbname",
    `(*)This field can't be empty`,
  );

  // Validate price
  isValid &= validation.checkNumber(
    "price",
    "tbprice",
    "(*)Price must be a number",
  );

  // Validate screen
  isValid &= validation.checkEmpty(
    screen,
    "tbscreen",
    `(*)This field can't be empty`,
  );

  // Validate backCam
  isValid &= validation.checkEmpty(
    backCam,
    "tbbackCam",
    `(*)This field can't be empty`,
  );

  // Validate frontCam
  isValid &= validation.checkEmpty(
    frontCam,
    "tbfrontCam",
    `(*)This field can't be empty`,
  );

  // Validate img
  isValid &= validation.checkEmpty(
    img,
    "tbimg",
    `(*)This field can't be empty`,
  );

  // Validate desc
  isValid &= validation.checkEmpty(
    desc,
    "tbdesc",
    `(*)This field can't be empty`,
  );

  // Validate type
  isValid &= validation.checkSelected(
    "type",
    "tbtype",
    "(*)Please select one option",
  );

  // nếu isValid là false thì dừng lại
  if (!isValid) return null;

  // Tạo đối tượng phone từ lớp đối tượng Products
  const product = new Products(
    id,
    name,
    price,
    screen,
    backCam,
    frontCam,
    img,
    desc,
    type,
  );
  return product;
};

/* Tạo hàm clear thông tin form */
const clearForm = () => {
  getEle("name").value = "";
  getEle("price").value = "";
  getEle("screen").value = "";
  getEle("backCam").value = "";
  getEle("frontCam").value = "";
  getEle("img").value = "";
  getEle("desc").value = "";
  getEle("type").value = "";
};

/* Tạo hàm clear thông báo lỗi */
const clearErr = () => {
  getEle("tbname").innerHTML = "";
  getEle("tbprice").innerHTML = "";
  getEle("tbscreen").innerHTML = "";
  getEle("tbbackCam").innerHTML = "";
  getEle("tbfrontCam").innerHTML = "";
  getEle("tbimg").innerHTML = "";
  getEle("tbdesc").innerHTML = "";
  getEle("tbtype").innerHTML = "";
};

export { getEle, renderUI, getInfo, clearForm, clearErr };
