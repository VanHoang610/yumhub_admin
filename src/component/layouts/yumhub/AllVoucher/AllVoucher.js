// component/yumhub/AllVoucher/AllVoucher.js
import React from "react";
import axios from "../../../../api/axiosConfig";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./AllVoucher.module.scss";
import { format } from 'date-fns';
const cx = classNames.bind(styles);

function AllVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hàm gọi API
    const fetchVouchers = async () => {
      try {
        const response = await axios.get("/vouchers/allVoucher"); // Thay đổi endpoint này theo API của bạn
        setVouchers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const getStatus = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    return end >= now ? "valid" : "not-valid";
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>All voucher</div>
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
              <tr key={voucher._id}>
                <td>{voucher._id}</td>
                <td>{voucher.nameVoucher}</td>
                <td>{voucher.code}</td>
                <td>{format(new Date(voucher.startDate),'dd/MM/yyyy')}</td>
                <td>{format(new Date(voucher.endDate),'dd/MM/yyyy') }</td>
                <td>
                  <span
                    className={cx("status", {
                        "valid": getStatus(voucher.endDate) === "valid",
                        "not-valid": getStatus(voucher.endDate) === "not-valid",
                    })}
                >
                    {getStatus(voucher.endDate)}
                  </span>
                </td>
                <td className={cx("actions")}>
                  <FaEdit className={cx("action-icon")} title="Edit" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllVoucher;
