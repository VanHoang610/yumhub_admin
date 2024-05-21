import React, { useState } from "react";
import styles from "./AddVoucher.module.scss";
import classNames from "classnames/bind";
import AxiosInstance from "../../../../utils/AxiosInstance";
const cx = classNames.bind(styles);

function AddVoucher() {
  const [voucher, setVoucher] = useState({
    nameVoucher: "",
    code: "",
    discountAmount: "",
    startDate: "",
    endDate: "",
    conditionsApply: "",
    typeOfVoucher: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher((prevVoucher) => ({
      ...prevVoucher,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setVoucher({
      nameVoucher: "",
      code: "",
      discountAmount: "",
      startDate: "",
      endDate: "",
      conditionsApply: "",
      typeOfVoucher: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post("vouchers/createVoucher", voucher); // Thay đổi đường dẫn của API thêm voucher
      console.log("Voucher Added:", response.data); // In ra dữ liệu voucher đã được thêm
      // Xử lý logic sau khi thêm voucher thành công 
    } catch (error) {
      console.error("Error adding voucher: ", error);
      // Xử lý lỗi 
    }
  };

  return (
    <div className={cx("container")}>
      <h1 className={cx("title")}>Add Voucher</h1>
      <div className={cx("form-container")}>
        <form onSubmit={handleSubmit}>
          <div className={cx("form-group")}>
            <label>Name Voucher</label>
            <input
              type="text"
              name="nameVoucher"
              placeholder="Placeholder"
              value={voucher.nameVoucher}
              onChange={handleChange}
            />
          </div>
          <div className={cx("form-group")}>
            <label>Discount Amount</label>
            <input
              type="number"
              name="discountAmount"
              placeholder="Placeholder"
              value={voucher.discountAmount}
              onChange={handleChange}
            />
          </div>
          <div className={cx("form-group")}>
            <label>Code Voucher</label>
            <input
              type="text"
              name="code"
              placeholder="Placeholder"
              value={voucher.code}
              onChange={handleChange}
            />
            <span className={cx("error-message")}>
              Error Message. Learn more.
            </span>
          </div>
          <div className={cx("date-group")}>
            <div className={cx("form-group")}>
              <label>Start Date</label>
              <input  className={cx("date-input")}
                type="date"
                name="startDate"
                value={voucher.startDate}
                onChange={handleChange}
              />
            </div>
            <div className={cx("form-group")}>
              <label>End Date</label>
              <input className={cx("date-input")}
                type="date"
                name="endDate"
                value={voucher.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={cx("form-group")}>
            <label>Conditions Apply</label>
            <select
              name="conditionsApply"
              value={voucher.conditionsApply}
              onChange={handleChange}
            >
              <option value="">Please Select</option>
              <option value="30000">Đơn hàng trên 30.000 vnđ</option>
              <option value="50000">Đơn hàng trên 50.000 vnđ</option>
              <option value="75000">Đơn hàng trên 75.000 vnđ</option>
              <option value="100000">Đơn hàng trên 100.000 vnđ</option>
              <option value="120000">Đơn hàng trên 120.000 vnđ</option>
              <option value="150000">Đơn hàng trên 150.000 vnđ</option>
            </select>
          </div>
          <div className={cx("form-group")}>
            <label>Voucher Type</label>
            <select
              name="typeOfVoucher"
              value={voucher.typeOfVoucher}
              onChange={handleChange}
            >
              <option value="">Please Select</option>
              <option value="Giảm giá trên đơn hàng">Giảm giá trên đơn hàng</option>
              <option value="Giảm giá trên phí ship">Giảm giá trên phí ship</option>
            </select>
          </div>
          <div className={cx("form-actions")}>
            <button
              type="button"
              onClick={handleReset}
              className={cx("reset-button")}
            >
              Reset
            </button>
            <button type="submit" className={cx("add-button")}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVoucher;
