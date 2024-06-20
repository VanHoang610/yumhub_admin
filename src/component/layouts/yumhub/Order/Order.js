import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react/headless";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./Order.module.scss";
import AccountItemShipper from "../../../AccountItem/AccountShipper/AccountCustomer/AccountShipper";

import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";
import Button from "../../../buttons";
const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function Orders() {
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN"); // Định dạng theo kiểu Việt Nam ngày/tháng/năm
  };

  const [data, setData] = useState([{}]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);

  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [showModalHistory, setShowModalHistory] = useState(false);

  //gọi api all shipper
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("orders/getAllOrder");
        const updatedOrder = response.data.order.map((item) => ({
          ...item,
          timeBook: formatDate(item.timeBook),
          nameStatus: getOrderStatusName(item.status),
        }));
        setData(updatedOrder);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
  };

  // nhấn xem chi tiết
  const handleView = async (order) => {
    setSearchResult([]);
    setShowModal(true);
    setSelectedOrder(order);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.get(
          `/orders/searchOrder?search=${keyword}`
        );
        console.log(response);
        if (response.data.result && response.data.shippers.length > 0) {
          setSearchResult(response.data.shippers);
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

  // nhấn tắt modal
  const handleModalClose = () => {
    setShowModal(false);
    setIsEditModal(false);
    setShowModalHistory(false);
  };

  // gọi api lấy orderStatus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("orders/getAllOrderStatus");
        setOrderStatuses(response.data.orderStatus);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // lấy ra tên của status trong order
  function getOrderStatusName(statusId) {
    const matchingStatus = orderStatuses.find(
      (status) => status._id === statusId._id
    );
    return matchingStatus ? matchingStatus.name : "N/A";
  }

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Orders</p>
        <div>
          <Tippy
            animation="fade"
            interactive
            placement="bottom"
            onClickOutside={handleClickOutSide}
            visible
            render={(attrs) => (
              <div tabIndex="-1" {...attrs} className={cx("search-result")}>
                {searchResult.length > 0 && (
                  <ProperWrapper>
                    <h4 className={cx("search-title")}>Accounts</h4>
                    {searchResult.length > 0
                      ? searchResult.map((shipper) => (
                          <AccountItemShipper
                            key={shipper._id}
                            shipper={shipper}
                            handleView={handleView}
                          />
                        ))
                      : setTippyVisible(false)}
                  </ProperWrapper>
                )}
              </div>
            )}
          >
            <div className={cx("inputSearch")}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={cx("icon-search")}
              />
              <input
                className={cx("input")}
                placeholder="Search by name"
                onChange={handleSearch}
              />
            </div>
          </Tippy>
        </div>
        <div className={cx("line-background")} />
        <div className={cx("box-container")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Merchant</th>
                <th>Shipper</th>
                <th>Customer</th>
                <th>Voucher</th>
                <th>Time Book</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cx("table-row")}
                  onClick={() => handleView(item)}
                >
                  <td>{item._id}</td>
                  <td>{item.merchantID ? item.merchantID.name : "N/A"}</td>
                  <td>{item.shipperID ? item.shipperID.fullName : "N/A"}</td>
                  <td>{item.customerID ? item.customerID.fullName : "N/A"}</td>
                  <td>{item.voucherID ? item.voucherID.nameVoucher : "N/A"}</td>
                  <td>{item.customerID ? item.timeBook : "N/A"}</td>
                  <td>
                    <p
                      className={cx(
                        "status", // Base class for all status elements
                        item.nameStatus === "cancel"
                          ? "status-cancel"
                          : "status-work"
                      )}
                    >
                      {item.nameStatus}
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
          {selectedOrder && (
            <div className={cx("modal-container")}>
              <div className={cx("logo-shipper")}>
                <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                <img
                  src={image_merchant}
                  alt="Merchant"
                  className={cx("img-shipper")}
                />
              </div>
              <div className={cx("content-modal")}>
                {selectedOrder.nameStatus === "cancel" ? (
                  <Button awaiting>{selectedOrder.nameStatus}</Button>
                ) : (
                  <Button reviewed>{selectedOrder.nameStatus}</Button>
                )}

                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>ID:</p>
                  <p className={cx("content-merchant")}>{selectedOrder._id}</p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Name Customer:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.customerID
                      ? selectedOrder.customerID.fullName
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Phone Customer:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.customerID
                      ? selectedOrder.customerID.phoneNumber
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Name Merchant:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.merchantID
                      ? selectedOrder.merchantID.name
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Name Shipper:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.shipperID
                      ? selectedOrder.shipperID.fullName
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Phone Shipper:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.shipperID
                      ? selectedOrder.shipperID.phoneNumber
                      : "N/A"}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Voucher:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.voucherID
                      ? selectedOrder.voucherID.nameVoucher
                      : "N/A"}
                  </p>
                </div>

                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Date Book:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.timeBook}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Delivery Address:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Delivery Cost:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.deliveryCost} đ
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Price Food:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.priceFood} đ
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Total:</p>
                  <p className={cx("content-merchant")}>
                    {selectedOrder.totalPaid} đ
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Payment Method:</p>
                  <p className={cx("content-merchant")}>
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
