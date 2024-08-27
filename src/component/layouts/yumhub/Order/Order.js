import React, { useState, useEffect, useCallback } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Tippy from "@tippyjs/react/headless";
import "react-datepicker/dist/react-datepicker.css";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../utils/AxiosInstance";
import Button from "../../../buttons";
import ItemOrder from "../../../AccountItem/ItemOrder/ItemOrder";
import classNames from "classnames/bind";
import styles from "./Order.module.scss";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";


const cx = classNames.bind(styles);

function Orders() {
  const formatMoney = (number) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(number);
  };

  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN");
  };

  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});

  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState([]);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get("orders/getAllOrderStatus");
      setOrderStatuses(response.data.orderStatus);
      
    } catch (error) {
      console.log(error);
    }
  }
  
  // gọi api lấy orderStatus
  // useEffect(() => {
  //   fetchData()
  //   return () => {
  //     console.log('Component is unmounted or route is left');
  //   };
  // }, [orderStatuses]);
  
  // lấy ra tên của status trong order
  function getOrderStatusName(statusId) {
    const matchingStatus = orderStatuses.find(
      (status) => status._id === statusId._id
    );
    
    console.log("matching", matchingStatus)
    return matchingStatus ? matchingStatus.name : "Loading...";
  }

  //gọi api all order
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("orders/getAllOrder");
        const updatedOrder = response.data.order.map((item) => ({
          ...item,
          timeBook: formatDate(item.timeBook),
          nameStatus: item.status,
        }));
        setData(updatedOrder);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
    setTippyVisible(false);
  };

  // nhấn xem chi tiết
  const handleView = async (id) => {
    setLoading(true);
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(`orders/getOrderById/?id=${id}`);
      if (response.data.result === true) {
        const updatedOrder = {
          ...response.data.order,
          nameStatus: getOrderStatusName(response.data.order.status),
          timeBook: formatDate(response.data.order.timeBook)
        }
        setSelectedOrder(updatedOrder);
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

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.get(
          `/orders/searchOrder?key=${keyword}`
        );
        if (response.data.result && response.data.orders.length > 0) {
          setSearchResult(response.data.orders);
          setTippyVisible(true);
          setData(response.data.orders);
        } else {
          setSearchResult([]);
          setTippyVisible(false);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResult([]);
        setTippyVisible(false);
      }
    } else {
      fetchData();
      setSearchResult([]);
      setTippyVisible(false);
    }
  };

  // nhấn tắt modal
  const handleModalClose = () => {
    setShowModal(false);
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
          {t("order.allOrder")}
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
                      {t("order.accounts")}
                    </h4>
                    {searchResult.length > 0
                      ? searchResult.map((order) => (
                          <ItemOrder
                            key={order._id}
                            order={order}
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
                placeholder={t("order.searchByName")}
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
                <th>{t("order.id")}</th>
                <th>{t("order.merchant")}</th>
                <th>{t("order.shipper")}</th>
                <th>{t("order.customer")}</th>
                <th>{t("order.voucher")}</th>
                <th>{t("order.timeBook")}</th>
                <th>{t("order.status")}</th>
                <th>{t("order.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cx("table-row")}
                  onClick={() => handleView(item._id)}
                >
                  <td>{item._id}</td>
                  <td>{item.merchantID ? item.merchantID.name : "N/A"}</td>
                  <td>{item.shipperID ? item.shipperID.fullName : "N/A"}</td>
                  <td>{item.customerID ? item.customerID.fullName : "N/A"}</td>
                  <td>{item.voucherID ? item.voucherID.nameVoucher : "N/A"}</td>
                  <td>{item.timeBook ? item.timeBook : "N/A"}</td>
                  <td>
                    <p
                      className={cx("status", {
                        "status-cancel": item.status.name === "cancel",
                         "status-fakeOrder": item.status.name === "fakeOrder",
                         "status-processing": item.status.name === "processing"
                      })}
                    >
                      {item.status.name?item.status.name:"N/A"}
                    </p>
                  </td>
                  <td>
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
        <Modal
          isOpen={showModal}
          onRequestClose={handleModalClose}
          contentLabel="Table Order"
          className={cx("modal")}
        >
          {showModal && (
            <div className={cx("modal-container", { dark: theme === "dark" })}>
              <div className={cx("logo-order", { dark: theme === "dark" })}>
                <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                <img
                  src={image_merchant}
                  alt="Merchant"
                  className={cx("img-order")}
                />
              </div>
              <div className={cx("content-modal")}>
                {selectedOrder.status.name === "cancel" ? (
                  <Button awaiting>{selectedOrder.status.name}</Button>
                  
                ) : (
                  <Button reviewed>{selectedOrder.status.name}</Button>
                )}

                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.id")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder._id}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.nameCustomer")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder.customerID
                      ? selectedOrder.customerID.fullName
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.phoneCustomer")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder.customerID
                      ? selectedOrder.customerID.phoneNumber
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.nameMerchant")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder.merchantID
                      ? selectedOrder.merchantID.name
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.nameShipper")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder.shipperID
                      ? selectedOrder.shipperID.fullName
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.phoneShipper")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder.shipperID
                      ? selectedOrder.shipperID.phoneNumber
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.voucher")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder.voucherID
                      ? selectedOrder.voucherID.nameVoucher
                      : "N/A"}
                  </p>
                </div>

                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.timeBook")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder.timeBook}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.deliveryAddress")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.deliveryCost")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {formatMoney(selectedOrder.deliveryCost)}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.priceFood")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {formatMoney(selectedOrder.priceFood)}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.totalPrice")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {formatMoney(selectedOrder.totalPaid)}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-order", fontSize)}>
                    {t("order.paymentMethod")}:
                  </p>
                  <p className={cx("content-order", fontSize)}>
                    {(() => {
                      switch (selectedOrder.paymentMethod) {
                        case 1:
                          return "Bank Transfer";
                        case 2:
                          return "Cash";
                        case 3:
                          return "Zalo Pay";
                        default:
                          return "N/A";
                      }
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Orders;
