import React from "react";
import { useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./EmployeeDetails.module.scss";
import { format } from 'date-fns';

const cx = classNames.bind(styles);

function EmployeeDetails() {
  const location = useLocation();
  const { state } = location; 
  const { employee } = state || {}; 
  if (!employee) {
    return <p>Employee details not found.</p>;
  }

  return (
    <div className={cx("container")}>
      <div className={cx("card")}>
        <div className={cx("profile")}>
          <img
            src={
              employee.avatar ||
              "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/252397505_197007939245865_5889774168621917087_n.png?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=XAM0kfbPjJQQ7kNvgFG8RAB&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYAIEyXfIv5mbu2aGMIrC6MGf9N-rMoSQ2r4LtZKb5YW7w&oe=665F6755"
            }
            alt={employee.fullName}
            className={cx("avatar")}
          />
          <p className={cx("id")}>
            <i className="fas fa-phone-alt"></i>id: {employee._id}
          </p>
          <h2 className={cx("name")}>{employee.fullName}</h2>
          <p className={cx("contact")}>
            <i className="fas fa-phone-alt"></i> {employee.phoneNumber}
          </p>
          <p className={cx("contact")}>
            <i className="fas fa-envelope"></i> {employee.email}
          </p>
        </div>
        <div className={cx("info-container")}>
          <h3>Information</h3>
          <div className={cx("info")}><p><strong>Date of Birth:</strong> {format(new Date(employee.dob), 'dd/MM/yyyy')}</p>
          <p>
            <strong>Gender:</strong> {employee.gender}
          </p>
          <p>
            <strong>Address:</strong> {employee.address}
          </p>
          <p><strong>position:</strong> {employee.position}</p></div>
          
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
