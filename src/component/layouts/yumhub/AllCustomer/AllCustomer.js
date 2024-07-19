import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faClockRotateLeft,
  faEye,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react/headless";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";
import AccountItem from "../../../AccountItem/AccountCustomer/AccountCustomer";
import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./AllCustomer.module.scss";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import noAvatar from "../../../../assets/images/noAvatar.png";
import ellipse from "../../../../assets/images/ellipse.png";

const cx = classNames.bind(styles);

function AllCustomer() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN"); // Định dạng theo kiểu Việt Nam ngày/tháng/năm
  };

  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState({});
  const [detailAddress, setDetailAddress] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [data, setData] = useState([]);

  //lấy danh sách customer
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("customers/getAllCustomer");
        const customers = response.data.customer;
        setData(customers);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleView = async (id) => {
    setLoading(true);
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(`customers/?id=${id}`);
      const detailCustomer = response.data;
      if (detailCustomer.result === true) {
        setDetailCustomer({
          ...detailCustomer.customer,
          joinDay: formatDate(detailCustomer.customer.joinDay),
        });
        setDetailAddress(detailCustomer.address || []);
        setShowModal(true);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // show history customer
  const handleHistory = async (id) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(
        `customers/getHistoryCustomer/?id=${id}`
      );
      if (
        Array.isArray(response.data.history) &&
        response.data.history.length === 0
      ) {
        // Nếu history là một mảng rỗng, tức là không có đơn hàng
        Swal.fire({
          icon: "info",
          title: "No orders placed",
          text: "No orders have been placed!",
        });
      } else {
        if (Array.isArray(response.data.history)) {
          const updatedHistory = response.data.history.map((item) => ({
            ...item,
            timeBook: formatDate(item.timeBook),
          }));
          setDataHistory(updatedHistory);
          setShowModalHistory(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);}
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      customClass: {
        popup: cx("swal2-popup"),
        title: cx("swal2-title"),
        confirmButton: cx("swal2-confirm"),
        cancelButton: cx("swal2-cancel"),
      },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await AxiosInstance.get(
            `customers/deleteCustomer/?id=${id}`
          );
          console.log(response);
          setData(data.filter((customer) => customer._id !== id));
          Swal.fire("Deleted!", "Your merchant has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete customer:", error);
          Swal.fire("Error!", "Failed to delete customer.", "error");
        }
      }
    });
  };

  //đóng mở modal
  const handleModalClose = () => {
    setShowModal(false);
    setShowModalHistory(false);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post("/customers/findCustomer", {
          keyword,
        });
        if (response.data.result && response.data.customers.length > 0) {
          setSearchResult(response.data.customers);
          setTippyVisible(true);
        } else {
          setSearchResult([]);
          setTippyVisible(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResult([]);
        setTippyVisible(false);
      }
    } else {
      setSearchResult([]);
      setTippyVisible(false);
    }
  };

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
  };

  if (loading)
    return (
      <div className={cx("container", { dark: theme === "dark" })}>
        <div className={cx("container-loading")}>
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      </div>
    );

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <div className={cx("content")}>
        <p className={cx("title", fontSize, { dark: theme === "dark" })}>
          {t("customer.allCustomer")}
        </p>
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
                      {t("customer.accounts")}
                    </h4>
                    {searchResult.length > 0
                      ? searchResult.map((customer) => (
                          <AccountItem
                            key={customer._id}
                            customer={customer}
                            handleView={handleView}
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
                className={cx("input", { dark: theme === "dark" })}
                placeholder={t("customer.searchByName")}
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
                <th>{t("customer.name")}</th>
                <th>{t("customer.phone")}</th>
                <th>{t("customer.birthDay")}</th>
                <th>{t("customer.avatar")}</th>
                <th>{t("customer.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cx("table-row", { dark: theme === "dark" })}
                  onClick={() => handleView(item._id)}
                >
                  <td>{index + 1}</td>
                  <td>{item.fullName}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.birthDay}</td>
                  <td>
                    <img
                      src={item.avatar || noAvatar}
                      alt={`avatar`}
                      className={cx("logo")}
                    />
                  </td>
                  <td>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHistory(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faClockRotateLeft} />
                    </button>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Modal show customer*/}
        <Modal
          isOpen={showModal}
          onRequestClose={handleModalClose}
          contentLabel="Customer"
          className={cx("modal-wrapper")}
        >
          {detailCustomer && (
            <div className={cx("modal-container", { dark: theme === "dark" })}>
              <div className={cx("logo-customer", { dark: theme === "dark" })}>
                <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                <img
                  src={
                    detailCustomer.avatar
                      ? detailCustomer.avatar
                      : image_merchant
                  }
                  alt="customer"
                  className={cx("img-customer")}
                />
              </div>
              <div className={cx("content-modal")}>
                <div className={cx("container-content")}>
                  <p className={cx("name-customer", fontSize)}>
                    {detailCustomer.fullName}
                  </p>
                  <div className={cx("line", { dark: theme === "dark" })}></div>
                  <p className={cx("type-customer", fontSize)}>
                    {detailCustomer.sex}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-customer", fontSize)}>
                    {t("customer.address")}:
                  </p>
                  {detailAddress.map((address, index) => (
                    <p key={index} className={cx("content-customer", fontSize)}>
                      {[
                        address.houseNumber,
                        address.street,
                        address.ward,
                        address.district,
                        address.city,
                      ].join(", ") || "N/A"}
                    </p>
                  ))}
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-customer", fontSize)}>
                    {t("customer.email")}:
                  </p>
                  <p className={cx("content-customer", fontSize)}>
                    {detailCustomer.email}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-customer", fontSize)}>
                    {t("customer.birthDay")}:
                  </p>
                  <p className={cx("content-customer", fontSize)}>
                    {detailCustomer.birthDay}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-customer", fontSize)}>
                    {t("customer.phone")}:
                  </p>
                  <p className={cx("content-customer", fontSize)}>
                    {detailCustomer.phoneNumber}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-customer", fontSize)}>
                    {t("customer.joinDay")}:
                  </p>
                  <p className={cx("content-customer", fontSize)}>
                    {detailCustomer.joinDay}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-customer", fontSize)}>
                    {t("customer.rating")}:
                  </p>
                  <p className={cx("content-customer", fontSize)}>
                    {detailCustomer.rating}
                  </p>
                </div>
                <div className={cx("btn-delete")}>
                  <Button
                    approve_btn
                    onClick={() => {
                      handleHistory(detailCustomer._id);
                    }}
                  >
                    {t("customer.history")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/*Modal show history customer */}
        <Modal
          isOpen={showModalHistory}
          onRequestClose={handleModalClose}
          contentLabel="HistoryCustomer"
          className={cx("modal-history", { dark: theme === "dark" })}
        >
          <div className={cx("box-history")}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                onClick={() => setShowModalHistory(false)}
                icon={faChevronLeft}
                className={cx("iconLeft", fontSize)}
              />
              <h2
                className={cx("title-history", fontSize, {
                  dark: theme === "dark",
                })}
              >
                {t("customer.historyCustomer")}
              </h2>
            </div>
            <table className={cx("table")}>
              <thead
                className={cx("table-row-history", fontSize, {
                  dark: theme === "dark",
                })}
              >
                <tr>
                  <th>#</th>
                  <th>{t("customer.nameMerchant")}</th>
                  <th>{t("customer.nameShipper")} </th>
                  <th>{t("customer.deliveryAddress")}</th>
                  <th>{t("customer.timeBook")}</th>
                  <th>{t("customer.totalPrice")}</th>
                  <th>{t("customer.status")}</th>
                </tr>
              </thead>
              <tbody
                className={cx("table-row-history", fontSize, {
                  dark: theme === "dark",
                })}
              >
                {dataHistory.map((item, index) => (
                  <tr key={index} onClick={() => handleView(item._id)}>
                    <td>{index + 1}</td>
                    <td>{item.merchantID ? item.merchantID.name : "N/A"}</td>
                    <td>{item.shipperID ? item.shipperID.fullName : "N/A"}</td>
                    <td>{item ? item.deliveryAddress : "N/A"}</td>
                    <td>{item ? item.timeBook : "N/A"}</td>
                    <td>{item ? item.totalPaid + " đ" : "N/A"}</td>
                    <td>
                      <p
                        className={cx(
                          "status", // Base class for all status elements
                          item.status.name === "cancel"
                            ? "status-cancel"
                            : "status-work"
                        )}
                      >
                        {item.status ? item.status.name : "N/A"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AllCustomer;
