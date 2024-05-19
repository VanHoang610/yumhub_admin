import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.scss";
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
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cx = classNames.bind(styles);

function Sidebar() {
  return (
    <div className={cx("sidebar")}>
      
      <nav className={cx("nav")}>
      <p className={cx("title")}>Reports and statistics</p>
        <NavLink to="/dashboard" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faChartBar} />
          <span>Dashboards</span>
        </NavLink>
        <p className={cx("title")}>Voucher manager</p>
        <NavLink to="/add-voucher" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faGift} />
          <span className={cx("text")}>Add Voucher</span>
        </NavLink>
        <NavLink to="/all-vouchers" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faGift} />
          <span className={cx("text")}>All Vouchers</span>
        </NavLink>
        <p className={cx("title")}>Merchant manager</p>
        <NavLink to="/new-merchant" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faPlus} />
          <span className={cx("text")}>New Merchant</span>
        </NavLink>
        <NavLink to="/all-merchants" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faStore} />
          <span className={cx("text")}>All Merchants</span>
        </NavLink>
        <NavLink to="/food-requests" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faUtensils} />
          <span className={cx("text")}>Food Requests</span>
        </NavLink>
        <p className={cx("title")}>Shipper manager</p>
        <NavLink to="/new-shipper" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faPlus} />
          <span className={cx("text")}>New Shipper</span>
        </NavLink>
        <NavLink to="/all-shippers" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faTruck} />
          <span className={cx("text")}>All Shippers</span>
        </NavLink>
        <NavLink to="/deleted-shippers" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faTrash} />
          <span className={cx("text")}>Deleted Shippers</span>
        </NavLink>
        <p className={cx("title")}>User manager</p>
        <NavLink to="/customer" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faUser} />
          <span className={cx("text")}>Customer</span>
        </NavLink>
        <p className={cx("title")}>Order manager</p>
        <NavLink to="/order" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faShoppingCart} />
          <span className={cx("text")}>Order</span>
        </NavLink>
        <p className={cx("title")}>My account</p>
        <NavLink to="/change-password" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faUser} />
          <span className={cx("text")}>Change Password</span>
        </NavLink>
        <NavLink to="/logout" activeClassName={cx("active")} className={cx("nav-link")}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span className={cx("text")}>Logout</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
