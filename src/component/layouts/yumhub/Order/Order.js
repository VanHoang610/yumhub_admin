import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./Order.module.scss";
import Modal from "react-modal";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isShipperModalOpen, setIsShipperModalOpen] = useState(false);
  const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await AxiosInstance.get("orders/getAllOrder");
        console.log(response.data.order);
        if (response.data.order && Array.isArray(response.data.order)) {
          setOrders(response.data.order);
        } else {
          setError("Invalid data format from API");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleEditClick = (e, order) => {
    e.stopPropagation();
    console.log("Edit order:", order);
  };

  const handleDeleteClick = (e, order) => {
    e.stopPropagation();
    console.log("Delete order:", order);
  };

  const handleViewClick = (e, order) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCustomerClick = (e, customerID) => {
    e.stopPropagation();
    const customer = orders.find(order => order.customerID._id === customerID).customerID;
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleShipperClick = (e, shipperID) => {
    e.stopPropagation();
    const shipper = orders.find(order => order.shipperID._id === shipperID).shipperID;
    setSelectedShipper(shipper);
    setIsShipperModalOpen(true);
  };

  const handleMerchantClick = (e, merchantID) => {
    e.stopPropagation();
    const merchant = orders.find(order => order.merchantID._id === merchantID).merchantID;
    setSelectedMerchant(merchant);
    setIsMerchantModalOpen(true);
  };

  const closeModal = () => {
    setIsOrderModalOpen(false);
    setIsCustomerModalOpen(false);
    setIsShipperModalOpen(false);
    setIsMerchantModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>All Orders</div>
      <div className={cx("table-container")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Shipper</th>
              <th>Merchant</th>
              <th>Time Book</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) &&
              orders.map((order) => (
                <tr key={order._id} onClick={(e) => handleViewClick(e, order)}>
                  <td>{order._id}</td>
                  <td onClick={(e) => handleCustomerClick(e, order.customerID._id)}>
                    {order.customerID.fullName}
                  </td>
                  <td onClick={(e) => handleShipperClick(e, order.shipperID._id)}>
                    {order.shipperID.fullName}
                  </td>
                  <td onClick={(e) => handleMerchantClick(e, order.merchantID._id)}>
                    {order.merchantID.name}
                  </td>
                  <td>{new Date(order.timeBook).toLocaleDateString()}</td>
                  <td>{new Date(order.timeGiveFood).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.totalPaid} VND</td>
                  <td className={cx("actions")}>
                    <FaEye
                      className={cx("action-icon")}
                      title="View"
                      onClick={(e) => handleViewClick(e, order)}
                    />
                    <FaEdit
                      className={cx("action-icon")}
                      title="Edit"
                      onClick={(e) => handleEditClick(e, order)}
                    />
                    <FaTrashAlt
                      className={cx("action-icon")}
                      title="Delete"
                      onClick={(e) => handleDeleteClick(e, order)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Order Details Modal */}
        <Modal
          isOpen={isOrderModalOpen}
          onRequestClose={closeModal}
          contentLabel="Order Details"
          className={cx("modal")}
          overlayClassName={cx("overlay")}
        >
          {selectedOrder && (
            <div className={cx("modal-content")}>
              <div className={cx("modal-header")}>
                <h2>Order Details</h2>
              </div>
              <div className={cx("modal-body")}>
                <p><strong>Order Number:</strong> {selectedOrder._id}</p>
                <p><strong>Customer Name:</strong> {selectedOrder.customerID.fullName}</p>
                <p><strong>Shipper Name:</strong> {selectedOrder.shipperID.fullName}</p>
                <p><strong>Merchant Name:</strong> {selectedOrder.merchantID.name}</p>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.timeBook).toLocaleDateString()}</p>
                <p><strong>Delivery Date:</strong> {new Date(selectedOrder.timeGiveFood).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total Amount:</strong> {selectedOrder.totalPaid} VND</p>
              </div>
              <div className={cx("modal-actions")}>
                <button className={cx("cancel-btn")} onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Customer Details Modal */}
        <Modal
          isOpen={isCustomerModalOpen}
          onRequestClose={closeModal}
          contentLabel="Customer Details"
          className={cx("modal")}
          overlayClassName={cx("overlay")}
        >
          {selectedCustomer && (
            <div className={cx("modal-content")}>
              <div className={cx("modal-header")}>
                <h2>Customer Details</h2>
              </div>
              <div className={cx("modal-body")}>
                <p><strong>Customer Name:</strong> {selectedCustomer.fullName}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
                <p><strong>Address:</strong> {selectedCustomer.address}</p>
              </div>
              <div className={cx("modal-actions")}>
                <button className={cx("cancel-btn")} onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Shipper Details Modal */}
        <Modal
          isOpen={isShipperModalOpen}
          onRequestClose={closeModal}
          contentLabel="Shipper Details"
          className={cx("modal")}
          overlayClassName={cx("overlay")}
        >
          {selectedShipper && (
            <div className={cx("modal-content")}>
              <div className={cx("modal-header")}>
                <h2>Shipper Details</h2>
              </div>
              <div className={cx("modal-body")}>
                <p><strong>Shipper Name:</strong> {selectedShipper.fullName}</p>
                <p><strong>Email:</strong> {selectedShipper.email}</p>
                <p><strong>Phone:</strong> {selectedShipper.phone}</p>
                <p><strong>Address:</strong> {selectedShipper.address}</p>
              </div>
              <div className={cx("modal-actions")}>
                <button className={cx("cancel-btn")} onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Merchant Details Modal */}
        <Modal
          isOpen={isMerchantModalOpen}
          onRequestClose={closeModal}
          contentLabel="Merchant Details"
          className={cx("modal")}
          overlayClassName={cx("overlay")}
        >
          {selectedMerchant && (
            <div className={cx("modal-content")}>
              <div className={cx("modal-header")}>
                <h2>Merchant Details</h2>
              </div>
              <div className={cx("modal-body")}>
                <p><strong>Merchant Name:</strong> {selectedMerchant.name}</p>
                <p><strong>Email:</strong> {selectedMerchant.email}</p>
                <p><strong>Phone:</strong> {selectedMerchant.phone}</p>
                <p><strong>Address:</strong> {selectedMerchant.address}</p>
              </div>
              <div className={cx("modal-actions")}>
                <button className={cx("cancel-btn")} onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Orders;
