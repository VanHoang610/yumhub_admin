import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import {
  faChartBar,
  faGift,
  faStore,
  faTruck,
  faUser,
  faShoppingCart,
  faSignOutAlt,
  faUtensils,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../../contexts/UserContext";

const cx = classNames.bind(styles);

function Sidebar() {
  const navigate = useNavigate();
  const { logoutUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <div className={cx("sidebar")}>
      <nav className={cx("nav")}>
        <p className={cx("title")}>Reports and statistics</p>
        <NavLink
          to="/home"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faChartBar} className={cx("icon")} />
          <span className={cx("text")}>Dashboards</span>
        </NavLink>
        <p className={cx("title")}>Voucher manager</p>
        <NavLink
          to="/add-voucher"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faGift} className={cx("icon")} />
          <span className={cx("text")}>Add Voucher</span>
        </NavLink>
        <NavLink
          to="/all-vouchers"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faGift} className={cx("icon")} />
          <span className={cx("text")}>All Vouchers</span>
        </NavLink>
        <p className={cx("title")}>Merchant manager</p>
        <NavLink
          to="/new-merchant"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faPlus} className={cx("icon")} />
          <span className={cx("text")}>New Merchant</span>
        </NavLink>
        <NavLink
          to="/all-merchants"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faStore} className={cx("icon")} />
          <span className={cx("text")}>All Merchants</span>
        </NavLink>
        <NavLink
          to="/food-requests"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUtensils} className={cx("icon")} />
          <span className={cx("text")}>Food Requests</span>
        </NavLink>
        <p className={cx("title")}>Shipper manager</p>
        <NavLink
          to="/new-shipper"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faPlus} className={cx("icon")} />
          <span className={cx("text")}>New Shipper</span>
        </NavLink>
        <NavLink
          to="/all-shippers"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faTruck} className={cx("icon")} />
          <span className={cx("text")}>All Shippers</span>
        </NavLink>
        <NavLink
          to="/deleted-shippers"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faTrash} className={cx("icon")} />
          <span className={cx("text")}>Deleted Shippers</span>
        </NavLink>
        <p className={cx("title")}>User manager</p>
        <NavLink
          to="/all-customers"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUser} className={cx("icon")} />
          <span className={cx("text")}>Customer</span>
        </NavLink>
        <p className={cx("title")}>Order manager</p>
        <NavLink
          to="/order"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faShoppingCart} className={cx("icon")} />
          <span className={cx("text")}>Order</span>
        </NavLink>
        <p className={cx("title")}>My account</p>
        <NavLink
          to="/infomation"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUser} className={cx("icon")} />
          <span className={cx("text")}>Infomation</span>
        </NavLink>
        <NavLink
          to="/change-password"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUser} className={cx("icon")} />
          <span className={cx("text")}>Change Password</span>
        </NavLink>

        <button className={cx("nav-link", "logout-button")} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className={cx("icon")} />
          <span className={cx("text")}>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
