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
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logoutUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className={cx("sidebar")}>
      <nav className={cx("nav")}>
        <p className={cx("title")}>{t('sidebar.reportsStatistics')}</p>
        <NavLink
          to="/home"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faChartBar} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.dashboards')}</span>
        </NavLink>
        <p className={cx("title")}>{t('sidebar.voucherManager')}</p>
        <NavLink
          to="/add-voucher"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faGift} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.addVoucher')}</span>
        </NavLink>
        <NavLink
          to="/all-vouchers"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faGift} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.allVouchers')}</span>
        </NavLink>
        <p className={cx("title")}>{t('sidebar.merchantManager')}</p>
        <NavLink
          to="/new-merchant"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faPlus} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.newMerchant')}</span>
        </NavLink>
        <NavLink
          to="/all-merchants"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faStore} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.allMerchants')}</span>
        </NavLink>
        <NavLink
          to="/food-request"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUtensils} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.foodRequests')}</span>
        </NavLink>
        <NavLink
          to="/deleted-merchants"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUtensils} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.deletedMerchants')}</span>
        </NavLink>
        <p className={cx("title")}>{t('sidebar.shipperManager')}</p>
        <NavLink
          to="/new-shipper"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faPlus} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.newShipper')}</span>
        </NavLink>
        <NavLink
          to="/all-shippers"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faTruck} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.allShippers')}</span>
        </NavLink>
        <NavLink
          to="/deleted-shippers"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faTrash} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.deletedShippers')}</span>
        </NavLink>
        <p className={cx("title")}>{t('sidebar.userManager')}</p>
        <NavLink
          to="/all-customers"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUser} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.customer')}</span>
        </NavLink>
        <p className={cx("title")}>{t('sidebar.orderManager')}</p>
        <NavLink
          to="/order"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faShoppingCart} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.order')}</span>
        </NavLink>
        <p className={cx("title")}>{t('sidebar.myAccount')}</p>
        <NavLink
          to="/infomation"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUser} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.infomation')}</span>
        </NavLink>
        <NavLink
          to="/change-password"
          className={({ isActive }) => cx("nav-link", { active: isActive })}
        >
          <FontAwesomeIcon icon={faUser} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.changePassword')}</span>
        </NavLink>

        <button
          className={cx("nav-link", "logout-button")}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className={cx("icon")} />
          <span className={cx("text")}>{t('sidebar.logout')}</span>
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
