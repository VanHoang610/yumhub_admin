import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";

import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import { useTranslation } from "react-i18next";
import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AxiosInstance from "../../../../utils/AxiosInstance";
import DiscountVoucher from "../../../AccountItem/DiscountVoucher/DiscountVoucher";
import Button from "../../../buttons/index";
import classNames from "classnames/bind";
import styles from "./AllVoucher.module.scss";
import ellipse from "../../../../assets/images/ellipse.png";
import voucherImage from "../../../../assets/images/voucheImage.png";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function AllVoucher() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN");
  };

  const formatMoney = (number) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND', 
    });
    return formatter.format(number);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const [isEditModal, setIsEditModal] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);

  const [data, setData] = useState([{}]);
  const [selectVoucherById, setSelectVouhcerById] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nameVoucher, setNameVoucher] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [typeOfVoucher, setTypeOfVoucher] = useState("");
  const [code, setCode] = useState("");
  const [conditionsApply, setConditionsApply] = useState("");
  const [showEditStartDate, setShowEditStartDate] = useState(false);
  const [showEditEndDate, setShowEditEndDate] = useState(false);

  //setVoucher
  useEffect(() => {
    if (selectVoucherById) {
        setStartDate(formatDate(selectVoucherById.startDate));
        setEndDate(formatDate(selectVoucherById.endDate));
        setNameVoucher(selectVoucherById.nameVoucher);
        setDiscountAmount(selectVoucherById.discountAmount);
        setTypeOfVoucher(
          selectVoucherById.typeOfVoucherID
            ? selectVoucherById.typeOfVoucherID.name
            : ""
        );
        setCode(selectVoucherById.code);
        setConditionsApply(selectVoucherById.conditionsApply);
    }
  }, [selectVoucherById]);

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post("/vouchers/findVoucher", {
          keyword,
        });
        if (response.data.result && response.data.vouchers.length > 0) {
          setSearchResult(response.data.vouchers);
          setData(response.data.vouchers);
          setTippyVisible(true);
        } else {
          setData([]);
          setSearchResult([]);
          setTippyVisible(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResult([]);
        setTippyVisible(false);
      } finally {
        setLoading(false);
      }
    } else {
      fetchVouchers();
      setSearchResult([]);
      setTippyVisible(false);
    }
  };

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
    setTippyVisible(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditModal(false);
  };

  //all voucher
  useEffect(() => {
    fetchVouchers();
  }, []);
  const fetchVouchers = async () => {
    try {
      const response = await AxiosInstance.get("vouchers/allVoucher");
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const start = new Date(startDate);
    if (now <= start || now >= end) {
      return "notValid";
    } else return "valid";
  };

  //update voucher
  const handleUpdateVoucher = async () => {
    setLoading(true);
    try {
      if (startDate> endDate) {
        Swal.fire("Fail", "The end date must be after the start date", "error");
        return;
      } else {
        const response = await AxiosInstance.patch(
          `vouchers/updateVoucher?id=${selectVoucherById._id}`,
          {
            startDate: startDate,
            endDate: endDate,
            conditionsApply,
          }
        );
        if (response.data.result === true) {
          const voucherUpdate = response.data.voucher;
          setData((prevData) =>
            prevData.map((voucher) =>
              voucher._id === voucherUpdate._id ? voucherUpdate : voucher
            )
          );
          Swal.fire("Success", "Merchant updated successfully.", "success");
          setLoading(false);
          setShowModal(false);
        } else {
          Swal.fire("Fail", "Merchant updated Fail.", "error");
          setLoading(false);
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error("Failed to update voucher", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVouchers = data.filter((voucher) => {
    if (statusFilter === "all") return true;
    return getStatus(voucher.startDate, voucher.endDate) === statusFilter;
  });

  const handleView = async (voucher) => {
    setLoading(true);
    setSearchResult([]);
    try {
      if (voucher) {
        setSelectVouhcerById(voucher);
        setShowModal(true);
        setIsEditModal(false);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(
        `vouchers/getVoucherById?id=${id}`
      );
      const detailVoucher = response.data.voucher;
      if (detailVoucher) {
        setSelectVouhcerById(detailVoucher);
        setIsEditModal(true);
        setShowModal(true);
      } else {
        Swal.fire({
          icon: "info",
          title: "Infomation",
          text: "No infomation found!",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // show datepicker
  const handleChangeInputStartDate = () => {
    setShowEditStartDate(true);
  };

  const handleChangeInputEndDate = () => {
    setShowEditEndDate(true);
  };

  const handleStartDateChange = (date) => {
    const day = formatDate(date);
    setStartDate(day);
   
    setShowEditStartDate(false);
  };

  const handleEndDateChange = (date) => {
    const day = formatDate(date);
    setEndDate(day);

    setShowEditEndDate(false);
  };

  if (loading)
    return (
      <div className={cx("container", { dark: theme === "dark" })}>
        <div className={cx("container-loading")}>
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      </div>
    );

  if (error) return <p>Error: {error}</p>;

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <div className={cx("wrapper-title")}>
        <p className={cx("title", fontSize, { dark: theme === "dark" })}>
          {t("allVoucher.allVoucher")}
        </p>
        <div className={cx("filter-container")}>
          <label
            htmlFor="statusFilter"
            className={cx("statusFilter", fontSize, { dark: theme === "dark" })}
          >
            {t("allVoucher.filter")}:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cx("select", fontSize, { dark: theme === "dark" })}
          >
            <option className={cx("option", fontSize)} value="all">
              {t("allVoucher.all")}
            </option>
            <option className={cx("option", fontSize)} value="valid">
              {t("allVoucher.valid")}
            </option>
            <option className={cx("option", fontSize)} value="notValid">
              {t("allVoucher.notValid")}
            </option>
          </select>
        </div>
      </div>
      <div>
        <Tippy
          animation="fade"
          interactive
          placement="bottom"
          onClickOutside={handleClickOutSide}
          visible={tippyVisible}
          render={(attrs) => (
            <div
              tabIndex="-1"
              {...attrs}
              className={cx("search-result", { dark: theme === "dark" })}
            >
              {searchResult.length > 0 && (
                <ProperWrapper>
                  <h4 className={cx("search-title", fontSize)}>
                    {t("allVoucher.discountVoucher")}
                  </h4>
                  {searchResult.length > 0
                    ? searchResult.map((voucher) => (
                        <DiscountVoucher
                          key={voucher._id}
                          voucher={voucher}
                          handleView={() => handleView(voucher)}
                        />
                      ))
                    : setTippyVisible(false)}
                </ProperWrapper>
              )}
            </div>
          )}
        >
          <div className={cx("inputSearch", { dark: theme === "dark" })}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={cx("icon-search")}
            />
            <input
              className={cx("input", fontSize, { dark: theme === "dark" })}
              placeholder={t("merchant.searchByName")}
              onChange={handleSearch}
            />
          </div>
        </Tippy>
      </div>
      <div className={cx("line-background")} />
      <div className={cx("box-container", { dark: theme === "dark" })}>
        <table className={cx("table", fontSize, { dark: theme === "dark" })}>
          <thead>
            <tr>
              <th>#</th>
              <th>{t("allVoucher.nameVoucher")}</th>
              <th>{t("allVoucher.code")}</th>
              <th>{t("allVoucher.startDate")}</th>
              <th>{t("allVoucher.endDate")}</th>
              <th>{t("allVoucher.status")}</th>
              <th>{t("allVoucher.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredVouchers.map((item, index) => (
              <tr
                key={index}
                className={cx("table-row", { dark: theme === "dark" })}
                onClick={() => handleView(item)}
              >
                <td>{index + 1}</td>
                <td>{item.nameVoucher}</td>
                <td>{item.code}</td>
                <td>{formatDate(item.startDate)}</td>

                <td>{formatDate(item.endDate)}</td>
                <td>
                  <span
                    className={cx("status", {
                      notValid:
                        getStatus(item.startDate, item.endDate) === "notValid",
                    })}
                  >
                    {getStatus(item.startDate, item.endDate)}
                  </span>
                </td>
                <td>
                  <button
                    className={cx("action-button")}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  <button
                    className={cx("action-button")}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(item);
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={showModal}
          onRequestClose={handleModalClose}
          contentLabel="Modal Voucher"
          className={cx("modal")}
        >
          {selectVoucherById && (
            <div className={cx("modal-container", { dark: theme === "dark" })}>
              <div className={cx("logo-merchant", { dark: theme === "dark" })}>
                <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                <img
                  src={voucherImage}
                  alt="Voucher"
                  className={cx("img-merchant")}
                />
              </div>
              <div className={cx("content-modal")}>
                {getStatus(
                  selectVoucherById.startDate,
                  selectVoucherById.endDate
                ) === "Valid" ? (
                  <Button reviewed>{t("allVoucher.valid")}</Button>
                ) : (
                  <Button awaiting>{t("allVoucher.notValid")}</Button>
                )}
                <div className={cx("container-content")}>
                  <p className={cx("name-merchant", fontSize)}>{nameVoucher}</p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant", fontSize)}>
                    {t("allVoucher.code")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>{code}</p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant", fontSize)}>
                    {t("allVoucher.startDate")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e)}
                        onClick={handleChangeInputStartDate}
                        readOnly
                        className={cx("content-merchant")}
                      />
                    ) : (
                      startDate
                    )}
                  </p>
                  {showEditStartDate === true && (
                    <DatePicker
                      onChange={handleStartDateChange}
                      dateFormat="dd/mm/yyyy"
                      inline
                      value={startDate}
                      minDate={new Date()}
                    />
                  )}
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant", fontSize)}>
                    {t("allVoucher.endDate")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e)}
                        onClick={handleChangeInputEndDate}
                        readOnly
                        className={cx("content-merchant")}
                      />
                    ) : (
                      endDate
                    )}
                  </p>
                  {showEditEndDate === true && (
                    <DatePicker
                      onChange={handleEndDateChange}
                      dateFormat="dd/mm/yyyy"
                      inline
                      value={endDate ? endDate : null}
                      minDate={Date.parse(startDate)}
                    />
                  )}
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant", fontSize)}>
                    {t("allVoucher.discountVoucher")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {discountAmount}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant", fontSize)}>
                    {t("allVoucher.typeOfVoucher")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {typeOfVoucher}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant", fontSize)}>
                    {t("allVoucher.conditionsApply")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant", fontSize)}
                        type="number"
                        defaultValue={conditionsApply}
                        onChange={(e) => setConditionsApply(e.target.value)}
                      />
                    ) : (
                      formatMoney(conditionsApply)
                    )}
                  </p>
                </div>
                <div className={cx("btn-delete")}>
                  {isEditModal ? (
                    <Button approve_btn onClick={handleUpdateVoucher}>
                      {t("allVoucher.update")}
                    </Button>
                  ) : (
                    " "
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default AllVoucher;
