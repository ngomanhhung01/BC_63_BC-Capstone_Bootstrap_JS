import { getEle } from "./controller.js";

export default class Validation {
  // check rỗng
  checkEmpty = (value, errorID, mess) => {
    if (value === "") {
      getEle(errorID).innerHTML = mess;
      return false;
    }
    getEle(errorID).innerHTML = "";
    return true;
  };

  // check dữ liệu số
  checkNumber = (id, errorID, mess) => {
    const re = /^[0-9]+$/;
    const value = getEle(id).value;
    if (value.match(re)) {
      getEle(errorID).innerHTML = "";
      return true;
    }
    getEle(errorID).innerHTML = mess;
    return false;
  };

  // check selected
  checkSelected = (idSelected, errorID, mess) => {
    if (getEle(idSelected).selectedIndex > 0) {
      getEle(errorID).innerHTML = "";
      return true;
    }
    getEle(errorID).innerHTML = mess;
    return false;
  };
}
