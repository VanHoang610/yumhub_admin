import React, { useEffect, useState } from "react";
import styles from "./AddVoucher.module.scss";
import classNames from "classnames/bind";
import AxiosInstance from "../../../../utils/AxiosInstance";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import voucher from "../../../../assets/images/voucheImage.png";
import Swal from "sweetalert2";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

Modal.setAppElement("#root"); // Set the root element for accessibility

function AddVoucher() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN");
  };

  const [imageVoucher, setImageVoucher] = useState("");
  const [nameVoucher, setNameVoucher] = useState("");
  const [code, setCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [typeOfVoucher, setTypeOfVoucher] = useState("");
  const [conditionsApply, setConditionsApply] = useState("");
  const [typeVoucher, setTypeVoucher] = useState([]);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [errors, setErrors] = useState("");

  const handleChangeStartDate = () => {
    setShowStartDatePicker(true);
  };

  const handleChangeEndDate = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (date) => {
    setStartDate(formatDate(date));
    setStartDateInput(new Date(date));
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (date) => {
    setEndDate(formatDate(date));
    setEndDateInput(new Date(date));
    setShowEndDatePicker(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageVoucher(URL.createObjectURL(file));
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await AxiosInstance.get("vouchers/getTypeOfVoucher");
      console.log(response.data.result);
      if (response.data.result) {
        setTypeVoucher(response.data.typeVoucher);
      } else {
        console.error("Error");
      }
    };
    fetchData();
  }, [typeOfVoucher]);

  console.log(typeOfVoucher);

  //lỗi
  const handleAddVoucher = async () => {
    const newErrors = {};

    if (!nameVoucher) {
      newErrors.nameVoucher = "Name Voucher is required";
    }
    if (!code) {
      newErrors.code = "Code is required";
    }
    if (!startDate) {
      newErrors.startDate = "Invalid format date";
    }
    if (!endDate) {
      newErrors.endDate = "Invalid format date";
    }

    if (!discountAmount || discountAmount < 10000) {
      newErrors.discountAmount =
        "Discount Amount is required and must be greater than 10000";
    }

    if (!conditionsApply) {
      newErrors.conditionsApply = "Conditions Apply is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (startDateInput > endDateInput) {
        Swal.fire("info", "The end date must be after the start date", "error");
      } else {
        const response = await AxiosInstance.post("vouchers/createVoucher", {
          nameVoucher,
          startDate: Date.parse(startDateInput),
          endDate: Date.parse(endDateInput),
          code,
          discountAmount,
          typeOfVoucherID: typeOfVoucher,
          conditionsApply,
        });
        console.log(response.data.result);
        if (response.data.result) {
          Swal.fire("Success", "Add Voucher success", "success");
          setNameVoucher("");
          setCode("");
          setStartDate("");
          setEndDate("");
          setTypeOfVoucher("");
          setDiscountAmount("");
          setConditionsApply("");
        } else {
          Swal.fire("Fail", "Add Voucher fail", "error");
        }
      }
    }
  };

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <p className={cx("title", fontSize, { dark: theme === "dark" })}>
        {t("newVoucher.addVoucher")}
      </p>
      <p className={cx("sub-title", fontSize, { dark: theme === "dark" })}>
        {t("newVoucher.subTitle")}
      </p>
      <div className={cx("line")} />
      <div className={cx("wrapper-info")}>
        <div className={cx("info-container")}>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('newVoucher.nameVoucher')}
            </p>
            <input
              type="text"
              value={nameVoucher}
              onChange={(e) => setNameVoucher(e.target.value)}
              autoFocus
              className={cx(
                "input",
                { dark: theme === "dark" },
                { errors: errors.nameVoucher }
              )}
            />
          </div>
          {errors.nameVoucher && (
            <p className={cx("error")}>{errors.nameVoucher}</p>
          )}
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              Code
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              className={cx(
                "input",
                fontSize,
                { dark: theme === "dark" },
                { errors: errors.code }
              )}
            />
          </div>{" "}
          {errors.code && <p className={cx("error")}>{errors.code}</p>}
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('newVoucher.startDate')}
            </p>
            <div className={cx("text-info")}>
              <input
                type="text"
                value={startDate ? startDate : "dd/mm/yyyy"}
                onChange={(e) => setStartDate(e)}
                onClick={handleChangeStartDate}
                readOnly
                className={cx(
                  "input",
                  fontSize,
                  { dark: theme === "dark" },
                  { errors: errors.startDate }
                )}
              />
              {showStartDatePicker && (
                <DatePicker
                  onChange={handleStartDateChange}
                  dateFormat="dd/mm/yyyy"
                  inline
                  minDate={new Date()}
                />
              )}
            </div>
          </div>
          {errors.startDate && (
            <p className={cx("error")}>{errors.startDate}</p>
          )}
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('newVoucher.endDate')}
            </p>
            <div className={cx("text-info")}>
              <input
                type="text"
                value={endDate ? endDate : "dd/mm/yyyy"}
                onChange={(e) => setEndDate(e)}
                onClick={handleChangeEndDate}
                readOnly
                className={cx(
                  "input",
                  fontSize,
                  { dark: theme === "dark" },
                  { errors: errors.endDate }
                )}
              />
              {showEndDatePicker && (
                <DatePicker
                  onChange={handleEndDateChange}
                  dateFormat="dd/mm/yyyy"
                  inline
                  value={endDate ? endDate : ""}
                  minDate={Date.parse(startDateInput)}
                />
              )}
            </div>
          </div>{" "}
          {errors.endDate && <p className={cx("error")}>{errors.endDate}</p>}
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('newVoucher.discountVoucher')}
            </p>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              autoFocus
              className={cx(
                "input",
                { dark: theme === "dark" },
                { errors: errors.discountAmount }
              )}
              min={1}
            />
          </div>
          {errors.discountAmount && (
            <p className={cx("error")}>{errors.discountAmount}</p>
          )}
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('newVoucher.typeOfVoucher')}
            </p>
            <select
              value={typeOfVoucher}
              onChange={(e) => setTypeOfVoucher(e.target.value)}
              className={cx("input", fontSize, { dark: theme === "dark" })}
            >
              {typeVoucher.map((voucher) => (
                <option key={voucher._id} value={voucher._id}>
                  {voucher.name}
                </option>
              ))}
            </select>
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('newVoucher.conditionsApply')}
            </p>
            <input
              type="number"
              value={conditionsApply}
              onChange={(e) => setConditionsApply(e.target.value)}
              autoFocus
              className={cx(
                "input",
                fontSize,
                { dark: theme === "dark" },
                { errors: errors.conditionsApply }
              )}
              min={1}
            />
          </div>
          {errors.conditionsApply && (
            <p className={cx("error")}>{errors.conditionsApply}</p>
          )}
          <div className={cx("btn-update")} onClick={handleAddVoucher}>
            <span>{t('newVoucher.add')}</span>
          </div>
        </div>
        <div className={cx("line-info")}></div>
        <div className={cx("image-info")}>
          <img className={cx("avatar")} src={voucher}></img>
          <div
            className={cx("box-text-select", { dark: theme === "dark" })}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <span>{t('newVoucher.selectImage')}</span>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <p
            style={{ marginTop: 16 }}
            className={cx("note-image", fontSize, { dark: theme === "dark" })}
          >
           {t('newVoucher.fileSize')}
          </p>
          <p className={cx("note-image", fontSize, { dark: theme === "dark" })}>
          {t('newVoucher.fileExtension')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddVoucher;
