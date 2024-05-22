import React from "react";

import AxiosInstance from "../../../../utils/AxiosInstance";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./AllVoucher.module.scss";
import { format } from "date-fns";
import Modal from "react-modal"; // Import thư viện Modal

const cx = classNames.bind(styles);

Modal.setAppElement("#root");
function AllVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý việc hiển thị hộp thoại

  useEffect(() => {
    // Hàm gọi API
    const fetchVouchers = async () => {
      try {
        const response = await AxiosInstance.get("vouchers/allVoucher"); // Thay đổi endpoint này theo API của bạn
        setVouchers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleEditClick = (e, voucher) => {
    e.stopPropagation();
    // Logic cho việc edit voucher (ví dụ: điều hướng tới trang edit)
    console.log("Edit voucher:", voucher);
  };
  const handleRowClick = (voucher) => {
    // Khi một trường được click, set thông tin của trường đó vào state selectedVoucher
    setSelectedVoucher(voucher);
    setIsModalOpen(true); // Mở hộp thoại khi một trường được click
  };
  const closeModal = () => {
    setIsModalOpen(false); // Đóng hộp thoại
  };
  const getStatus = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    return end >= now ? "Valid" : "Not-valid";
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>All Voucher</div>
      <div className={cx("table-container")}>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher._id} onClick={() => handleRowClick(voucher)}>
                <td>{voucher._id}</td>
                <td>{voucher.nameVoucher}</td>
                <td>{voucher.code}</td>
                <td>{format(new Date(voucher.startDate), "dd/MM/yyyy")}</td>
                <td>{format(new Date(voucher.endDate), "dd/MM/yyyy")}</td>
                <td>
                  <span
                    className={cx("status", {
                      Valid: getStatus(voucher.endDate) === "Valid",
                      "Not-valid": getStatus(voucher.endDate) === "Not-valid",
                    })}
                  >
                    {getStatus(voucher.endDate)}
                  </span>
                </td>
                <td className={cx("actions")}>
                  <FaEdit
                    className={cx("action-icon")}
                    title="Edit"
                    onClick={(e) => handleEditClick(e, voucher)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Voucher Details"
          className={cx("modal")}
          overlayClassName={cx("overlay")}
        >
          {selectedVoucher && (
            <div>
              <h2>Voucher Details</h2>
              <p>ID: {selectedVoucher._id}</p>
              <p>Name: {selectedVoucher.nameVoucher}</p>
              <p>Code: {selectedVoucher.code}</p>
              <p>
                Start Date:{" "}
                {format(new Date(selectedVoucher.startDate), "dd/MM/yyyy")}
              </p>
              <p>
                End Date:{" "}
                {format(new Date(selectedVoucher.endDate), "dd/MM/yyyy")}
              </p>
              <p>Status: {getStatus(selectedVoucher.endDate)}</p>
              <p>Discount: {selectedVoucher.discountAmount}</p>
              <p>Discount Type: {selectedVoucher.typeOfVoucherID}</p>
              <button onClick={closeModal}>Close</button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default AllVoucher;
