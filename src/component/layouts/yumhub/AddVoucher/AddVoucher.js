import React, { useState } from "react";
import styles from "./AddVoucher.module.scss";
import classNames from "classnames/bind";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { FaRandom } from "react-icons/fa"; // Import icon mới

const cx = classNames.bind(styles);

function AddVoucher() {
  const [voucher, setVoucher] = useState({
    nameVoucher: "",
    code: "",
    discountAmount: "",
    startDate: "",
    endDate: "",
    conditionsApply: "",
    typeOfVoucherID: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher((prevVoucher) => ({
      ...prevVoucher,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateDates = () => {
    const today = new Date().toISOString().split("T")[0];
    let valid = true;
    const newErrors = {};

    if (voucher.startDate < today) {
      newErrors.startDate = "Start date must be today or later.";
      valid = false;
    }

    if (voucher.endDate < voucher.startDate) {
      newErrors.endDate = "End date must be the same or later than the start date.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleReset = () => {
    setVoucher({
      nameVoucher: "",
      code: "",
      discountAmount: "",
      startDate: "",
      endDate: "",
      conditionsApply: "",
      typeOfVoucherID: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()) {
      return;
    }
    try {
      const response = await AxiosInstance.post("/vouchers/createVoucher", voucher);
      console.log("Voucher Added:", response.data);
      setSuccessMessage("Voucher Added Successfully!");
      handleReset();
    } catch (error) {
      console.error("Error adding voucher: ", error);
    }
  };

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = Math.floor(Math.random() * 4) + 3; // Random length between 3 and 6
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleRandomCodeClick = () => {
    const randomCode = generateRandomCode();
    setVoucher((prevVoucher) => ({
      ...prevVoucher,
      code: randomCode,
    }));
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
          <div className={cx("form-group", "code-group")}>
            <label>Code Voucher</label>
            <div className={cx("code-input-group")}>
              <input
                type="text"
                name="code"
                placeholder="Placeholder"
                value={voucher.code}
                onChange={handleChange}
              />
              <FaRandom
                className={cx("random-code-icon")}
                title="Generate Random Code"
                onClick={handleRandomCodeClick}
              />
            </div>
            <span className={cx("error-message")}>{errors.code}</span>
          </div>
          <div className={cx("date-group")}>
            <div className={cx("form-group")}>
              <label>Start Date</label>
              <input
                className={cx("date-input")}
                type="date"
                name="startDate"
                value={voucher.startDate}
                onChange={handleChange}
              />
              <span className={cx("error-message")}>{errors.startDate}</span>
            </div>
            <div className={cx("form-group")}>
              <label>End Date</label>
              <input
                className={cx("date-input")}
                type="date"
                name="endDate"
                value={voucher.endDate}
                onChange={handleChange}
              />
              <span className={cx("error-message")}>{errors.endDate}</span>
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
              name="typeOfVoucherID"
              value={voucher.typeOfVoucherID}
              onChange={handleChange}
            >
              <option value="">Please Select</option>
              <option value="6656cfad8913d56206f64e06">Giảm giá trên đơn hàng</option>
              <option value="6656cfad8913d56206f64e05">Giảm giá trên phí ship</option>
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
          {successMessage && (
            <div className={cx("success-message")}>{successMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddVoucher;
