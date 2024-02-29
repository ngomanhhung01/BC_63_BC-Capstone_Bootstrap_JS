import Api from "../servies/Api.js";
import { getEle,renderUI,getInfo,clearErr,clearForm } from "./controller.js";

/* Tạo đối tượng api từ lớp đối tượng Api */
const api = new Api();

/* Tạo hàm lấy danh sách sản phẩm từ api để hiển thị ra UI */
const getPhoneList = () => {
  api
    .callApi("Products", "GET", null)
    .then((res) => {
      renderUI(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
getPhoneList();

/* Tạo sự kiện khi click AddPhone */
getEle("addPhoneForm").onclick = function () {
  clearForm(); //clear dữ liệu trong form
  clearErr(); //claer thông báo lỗi
  getEle("btnAddPhone").style.display = "block"; //hiện nút Add
  getEle("btnUpdate").style.display = "none"; //ẩn nút Update
};

/* Thêm sản phẩm */
getEle("btnAddPhone").addEventListener("click", function () {
  const phone = getInfo(""); //lấy dữ liệu từ user
  if (phone) {
    api
      .callApi("Products", "POST", phone)
      .then(() => {
        getPhoneList(); //render giao diện
        getEle("btnClose").click(); //close modal
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

/* Xóa sản phẩm */
const deletePhone = (id) => {
  api
    .callApi(`Products/${id}`, "DELETE", null)
    .then(() => {
      getPhoneList();
    })
    .catch((err) => {
      console.log(err);
    });
};
window.deletePhone = deletePhone;

/* Sửa sản phẩm */
const editPhone = (id) => {
  clearErr(); //clear thông báo lỗi
  getEle("btnAddPhone").style.display = "none"; //ẩn nút Add
  getEle("btnUpdate").style.display = "block"; //hiện nút Update
  getEle("btnUpdate").setAttribute("onclick", `updatePhone(${id})`); //lấy id cho tính năng update

  api
    .callApi(`Products/${id}`, "GET", null)
    .then((res) => {
      //lấy dữ liệu từ server gán lên form
      getEle("name").value = res.data.name;
      getEle("price").value = res.data.price;
      getEle("screen").value = res.data.screen;
      getEle("backCam").value = res.data.backCamera;
      getEle("frontCam").value = res.data.frontCamera;
      getEle("img").value = res.data.img;
      getEle("desc").value = res.data.desc;
      getEle("type").value = res.data.type;
    })
    .catch((err) => {
      console.log(err);
    });
};
window.editPhone = editPhone;

/* Cập nhật sản phẩm */
const updatePhone = (id) => {
  // lấy dữ liệu từ form
  const phone = getInfo(id);
  if (phone) {
    api
      .callApi(`Products/${id}`, "PUT", phone)
      .then(() => {
        getPhoneList(); // hiện thị giao diện
        getEle("btnClose").click(); //close modal
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

window.updatePhone = updatePhone;

/* Tìm sản phẩm theo tên */
getEle("searchName").addEventListener("keyup", async () => {
  // lấy từ khóa tìm kiếm, chuyển sang chữ thường
  const keyword = getEle("searchName").value.toLowerCase();

  // mảng tìm kiếm
  let searchArr = [];

  const res = await api.callApi("Products", "GET", null);
  if (res.status === 200 && res.statusText === "OK") {
    for (let i = 0; i < res.data.length; i++) {
      // chuyển tên sản phẩm sang chữ thường
      let phone = res.data[i].name.toLowerCase();

      // kiểm tra keyword theo tên sản phẩm
      if (phone.indexOf(keyword) !== -1) {
        searchArr.push(res.data[i]); // đưa vào mảng tìm kiếm
      }
    }

    // hiển thị ra giao diện
    renderUI(searchArr);
  }
});

/* Sort sản phẩm theo giá */

// Từ thấp đến cao
getEle("sortUp").addEventListener("click", async () => {
  // đợi callApi trả về giá trị, gán kết quả cho res(result)
  const res = await api.callApi("Products", "GET", null);
  // nếu API đã trả về dữ liệu thành công
  if (res.status === 200 && res.statusText === "OK") {
    const sortArr = res.data.sort((phone1, phone2) => {
      return phone1.price - phone2.price;
    });
    renderUI(sortArr); //render mảng sort
  }
});

// Từ cao xuống thấp
getEle("sortDown").addEventListener("click", async () => {
  // đợi callApi trả về giá trị, gán kết quả cho res(result)
  const res = await api.callApi("Products", "GET", null);
  // nếu API đã trả về dữ liệu thành công
  if (res.status === 200 && res.statusText === "OK") {
    const sortArr = res.data.sort((phone1, phone2) => {
      return phone2.price - phone1.price;
    });
    renderUI(sortArr); //render mảng sort
  }
});
