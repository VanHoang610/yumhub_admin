import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import logo from "../../../../assets/images/logoYumhub.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell as faBellRegular, faUser} from '@fortawesome/free-regular-svg-icons'; // Import regular bell icon
import { faMagnifyingGlass, faCog, faBars } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function Header() {
  return (
    <header className={cx("wrapper")}>
      <div className={cx("inner")}>
        <div className={cx("logo")}>
          <img src={logo} alt="Logo YumHub"  />
          <p className={cx("textLogo")}>YumHub</p>
        </div>
        <button className={cx("search-btn")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("icon")}/>
        </button>
        <nav className={cx("menu")}>
          <Link to="/menu" className={cx("menu-btn")}>
            <FontAwesomeIcon icon={faBars} className={cx("icon")}/>
            <p className={cx("textHeader")}>Menu</p>
          </Link>
          <Link to="/settings" className={cx("setting-btn")}>
            <FontAwesomeIcon icon={faCog} className={cx("icon")}/>
            <p className={cx("textHeader")}>Settings</p>
          </Link>
          <Link to="/employee" className={cx("employee-btn")}>
            <FontAwesomeIcon icon={faUser} className={cx("icon")}/>
            <p className={cx("textHeader")}>Employee</p>
          </Link>
        </nav>
        <div className={cx("right")}>
          <button className={cx("notification-btn")}>
            <FontAwesomeIcon icon={faBellRegular} className={cx("icon")}/>
          </button>
          <div className={cx("profile")}>
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              className={cx("profile-img")}
            />
            <div className={cx("profile-info")}>
              <p className={cx("profile-name")}>Name test</p>
              <p className={cx("profile-position")}>position test</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

