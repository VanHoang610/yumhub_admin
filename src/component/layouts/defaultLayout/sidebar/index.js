import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import {
  faStore,
  faChartSimple,
  faTicket,
  faAngleRight,
  faTruckFast,
  faPerson,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../../contexts/UserContext";
import { useTranslation } from "react-i18next";
import logo from "../../../../assets/images/logoYumhub-removebg.png";
import "react-dropdown/style.css";

import { useTheme } from "../../defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../defaultLayout/header/Settings/Context/FontSizeContext";

const cx = classNames.bind(styles);

function Sidebar() {
  const { t } = useTranslation();
  const { fontSize } = useFontSize();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { logoutUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const [showVoucherMenu, setShowVoucherMenu] = useState(false);
  const [showMerchantMenu, setShowMerchantMenu] = useState(false);
  const [showShipperMenu, setShowShipperMenu] = useState(false);

  const [activeLink, setActiveLink] = useState("");
  
  // nhấn menu-main
  const toggleVoucherMenu = () => {
    setShowVoucherMenu(!showVoucherMenu);
    console.log(showVoucherMenu);
  };
  const toggleMerchantMenu = () => {
    setShowMerchantMenu(!showMerchantMenu);
  };
  const toggleShipperMenu = () => {
    setShowShipperMenu(!showShipperMenu);
  };
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  // nhấn menu cha
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  //nhấn menu con
  const handleLinkClick = (link, event) => {
    event.stopPropagation();
    setActiveMenuItem("");
    setActiveLink(link);
  };
  return (
    <div className={cx("container", fontSize, { dark: theme === "dark" })}>
      <div className={cx("logo_yumhub", { dark: theme === "dark" })}>
        <img className={cx("logo")} src={logo} />
        <p className={cx("text-logo", fontSize, { dark: theme === "dark" })}>
          YumHub
        </p>
      </div>
      <div className={cx("menu-container")}>
        <p className={cx("title", fontSize, { dark: theme === "dark" })}>
          {t("sidebar.reportsStatistics")}
        </p>
        <Link
          to="/home"
          className={cx("wrapper-item", fontSize, { dark: theme === "dark" })}
          onClick={() => handleMenuItemClick("home")}
        >
          <FontAwesomeIcon
            className={cx("icon-menu", { dark: theme === "dark" })}
            icon={faChartSimple}
            style={{ marginRight: 26 }}
          />
          <p
            className={cx(
              "text-menu",
              { dark: theme === "dark" },
              { rotate: activeMenuItem === "home" }
            )}
          >
            {t("sidebar.charts")}
          </p>
        </Link>

        <p className={cx("title", fontSize, { dark: theme === "dark" })}>
          {t("sidebar.managerment")}
        </p>
        <div
          className={cx("wrapper-item", fontSize, { dark: theme === "dark" })}
        >
          <ul>
            {/** voucher */}
            <li onClick={toggleVoucherMenu}>
              <div
                className={cx("text-menu-container", {
                  active: showVoucherMenu,
                })}
              >
                <FontAwesomeIcon
                  icon={faTicket}
                  className={cx("icon-menu", fontSize, {
                    dark: theme === "dark",
                  })}
                />
                <div className={cx("wrapper-title-menu")}>
                  <p
                    className={cx("title-manager", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {t("sidebar.voucherManager")}
                  </p>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className={cx("angle-icon", { rotate: showVoucherMenu })}
                  />
                </div>
              </div>
              {showVoucherMenu && (
                <ul
                  className={cx("sub-menu", fontSize, {
                    dark: theme === "dark",
                  })}
                >
                  <li
                    onClick={(e) => {
                      handleLinkClick("/all-vouchers", e);
                    }}
                  >
                    <Link
                      to="/all-vouchers"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/all-vouchers",
                      })}
                    >
                      All Vouchers
                    </Link>
                  </li>
                  <li onClick={(e) => handleLinkClick("/add-voucher", e)}>
                    <Link
                      to="/add-voucher"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/add-voucher",
                      })}
                    >
                      Add Voucher
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/** merchant */}
            <li onClick={toggleMerchantMenu}>
              <div
                className={cx("text-menu-container", {
                  active: showMerchantMenu,
                })}
              >
                <FontAwesomeIcon
                  icon={faStore}
                  className={cx("icon-menu", fontSize, {
                    dark: theme === "dark",
                  })}
                />
                <div className={cx("wrapper-title-menu")}>
                  <p
                    className={cx("title-manager", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {t("sidebar.merchantManager")}
                  </p>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className={cx("angle-icon", { rotate: showMerchantMenu })}
                  />
                </div>
              </div>
              {showMerchantMenu && (
                <ul className={cx("sub-menu")}>
                  <li onClick={(e) => handleLinkClick("/new-merchant", e)}>
                    <Link
                      to="/new-merchant"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/new-merchant",
                      })}
                    >
                      {t("sidebar.newMerchant")}
                    </Link>
                  </li>
                  <li onClick={(e) => handleLinkClick("/all-merchants", e)}>
                    <Link
                      to="/all-merchants"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/all-merchants",
                      })}
                    >
                      {t("sidebar.allMerchants")}
                    </Link>
                  </li>
                  <li onClick={(e) => handleLinkClick("/food-request", e)}>
                    <Link
                      to="/food-request"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/food-request",
                      })}
                    >
                      {t("sidebar.foodRequests")}
                    </Link>
                  </li>
                  <li onClick={(e) => handleLinkClick("/deleted-merchants", e)}>
                    <Link
                      to="/deleted-merchants"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/deleted-merchants",
                      })}
                    >
                      {t("sidebar.deletedMerchants")}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/** shipper */}
            <li onClick={toggleShipperMenu}>
              <div
                className={cx("text-menu-container", {
                  active: showShipperMenu,
                })}
              >
                <FontAwesomeIcon
                  icon={faTruckFast}
                  className={cx("icon-menu", fontSize, {
                    dark: theme === "dark",
                  })}
                />
                <div className={cx("wrapper-title-menu")}>
                  <p
                    className={cx("title-manager", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {t("sidebar.shipperManager")}
                  </p>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className={cx("angle-icon", { rotate: showShipperMenu })}
                  />
                </div>
              </div>
              {showShipperMenu && (
                <ul className={cx("sub-menu")}>
                  <li onClick={(e) => handleLinkClick("/new-shipper", e)}>
                    <Link
                      to="/new-shipper"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/new-shipper",
                      })}
                    >
                      {t("sidebar.newShipper")}
                    </Link>
                  </li>
                  <li onClick={(e) => handleLinkClick("/all-shippers", e)}>
                    <Link
                      to="/all-shippers"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/all-shippers",
                      })}
                    >
                      {t("sidebar.allShippers")}
                    </Link>
                  </li>
                  <li onClick={(e) => handleLinkClick("/deleted-shippers", e)}>
                    <Link
                      to="/deleted-shippers"
                      className={cx({
                        [fontSize]: true,
                        dark: "theme" === "dark",
                        "active-link": activeLink === "/deleted-shippers",
                      })}
                    >
                      {t("sidebar.deletedShippers")}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/** customer */}
            <li>
              <Link
                to="/all-customers"
                className={cx("text-menu")}
                onClick={() => handleMenuItemClick("customer")}
              >
                <FontAwesomeIcon
                  icon={faPerson}
                  className={cx("icon-menu", fontSize, {
                    dark: theme === "dark",
                  })}
                />
                <p
                  className={cx(
                    "title-manager",
                    fontSize,
                    {
                      dark: theme === "dark",
                    },
                    {
                      rotate: activeMenuItem === "customer",
                    }
                  )}
                >
                  {t("sidebar.customer")}
                </p>
              </Link>
            </li>
            {/** order */}
            <li>
              <Link
                to="/order"
                className={cx("text-menu")}
                onClick={() => handleMenuItemClick("order")}
              >
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className={cx("icon-menu", fontSize, {
                    dark: theme === "dark",
                  })}
                />
                <p
                  className={cx(
                    "title-manager",
                    fontSize,
                    {
                      dark: theme === "dark",
                    },
                    {
                      rotate: activeMenuItem === "order",
                    }
                  )}
                >
                  {t("sidebar.order")}
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
