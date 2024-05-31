import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./Employee.module.scss";

const cx = classNames.bind(styles);

function Employee() {
    const navigate = useNavigate();
  const [Admins, setAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchAdmins = async () => {
      try {
        const response = await AxiosInstance.get("admin/showAll");
        console.log(response);
        setAdmin(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleClick = (admin) => {
    navigate(`/employee/${admin._id}`, { state: { employee: admin } });
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Shipper Awaiting Approval</div>
      <div className={cx("search-bar")}>
        <input type="text" placeholder="Nombre, Unidad, Status" />
      </div>
      <div className={cx("card-container")}>
        {Admins.map((admin) => (
          <div
            key={admin._id}
            className={cx("card")}
            onClick={() => handleClick(admin)}
          >
            <div className={cx("card-header")}>
              <img
                src={admin.avatar || "https://th.bing.com/th/id/OIP.bbvSNRBEMEPuujn-OZ-aVgHaHa?rs=1&pid=ImgDetMain"}
                alt={admin.fullName}
                className={cx("avatar")}
              />
              <div className={cx("info")}>
                <div className={cx("name")}>{admin.fullName}</div>
                <div className={cx("email")}>Email: {admin.email}</div>
                <div className={cx("phone")}>PhoneNumber: {admin.phoneNumber}</div>
                <div className={cx("position")}>Position: {admin.position}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Employee;
