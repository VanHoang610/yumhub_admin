import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import logo from "../../../../assets/images/logoYumhub.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell as faBellRegular,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faMagnifyingGlass,
  faCog,
  faBars,
  faPerson,
  faRightFromBracket,
  faKey,
  faEarListen,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../contexts/UserContext";
import Dialog from "../Dialog";

import Tippy from "@tippyjs/react/headless";
import MenuInfo from "../../../Proper/Menu/index";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { result } from "lodash";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

const MENU_ITEMS = [
  {
    icon: <FontAwesomeIcon icon={faPerson} />,
    title: "Information",
  },
  {
    icon: <FontAwesomeIcon icon={faKey} />,
    title: "Change Password",
  },
  {
    icon: <FontAwesomeIcon icon={faRightFromBracket} />,
    title: "Logout",
  },
];

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModalChangePassword, setShowModalChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = (setShowPassword, showPassword) => {
    setShowPassword(!showPassword);
  };
  //tắt modal
  const handleModalClose = () => {
    setShowModalChangePassword(false);
  };

  const handleEmployeeClick = (e) => {
    if (user.position !== "manager") {
      e.preventDefault();
      setShowDialog(true);
    }
  };

  //nhấn logout
  const handleLogout = async () => {
    await logoutUser();
    navigate("/yumhub_admin");
  };

  // chọn vào từng item-menu
  const handleItemSelected = (title) => {
    if (title === "Information") {
      setShowModalInfo(true);
    } else if (title === "Logout") {
      Swal.fire({
        icon: "info",
        title: "Do you are want to logout?",
        showCancelButton: true,
        confirmButtonText: "Yes, logout",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          handleLogout();
        }
      });
    } else {
      setShowModalChangePassword(true);
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // nhấn change-password
  const handleChangePassword = async () => {
    try {
      if (!password || !newPassword || !confirmPassword) {
        Swal.fire({
          icon: "info",
          title: "Enter complete infomation!",
          text: "Please enter password",
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: "info",
          title: "Password do not match",
          text: "Please enter the correct password",
        });
        return;
      }
      const idUser = user._id;

      const response = await AxiosInstance.post(
        `admin/changePass/?id=${idUser}`,
        {
          passOld: password,
          passNew: newPassword,
        }
      );
      if (response.data.result) {
          Swal.fire({
            icon: "success",
            title: "Change password success!",
            text: "Your password has been change",
          }).then((result) => {
            if (result.isConfirmed) {
              
          setShowModalChangePassword(false);
          navigate('/')
            }
          });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Change password fail!",
          text: "Your password not has been update",
        });
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // nhấn settings
  const handleSettings = () => {
    navigate('settings');
  }
  return (
    <header className={cx("wrapper")}>
      <div className={cx("inner")}>
        <div className={cx("logo")}>
          <img src={logo} alt="Logo YumHub" />
          <p className={cx("textLogo")}>YumHub</p>
        </div>
        <button className={cx("search-btn")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("icon")} />
        </button>
        <nav className={cx("menu")}>
          <Link to="/menu" className={cx("menu-btn")}>
            <FontAwesomeIcon icon={faBars} className={cx("icon")} />
            <p className={cx("textHeader")}>Menu</p>
          </Link>
          <Link to="/settings" className={cx("setting-btn")}>
            <FontAwesomeIcon icon={faCog} className={cx("icon")} onClick={handleSettings} />
            <p className={cx("textHeader")}>{t('header.settings')}</p>
          </Link>
          <Link
            to="/employee"
            className={cx("employee-btn")}
            onClick={handleEmployeeClick}
          >
            <FontAwesomeIcon icon={faUser} className={cx("icon")} />
            <p className={cx("textHeader")}>{t('header.employee')}</p>
          </Link>
        </nav>
        <div className={cx("right")}>
          <button className={cx("notification-btn")}>
            <FontAwesomeIcon icon={faBellRegular} className={cx("icon")} />
          </button>
          <MenuInfo items={MENU_ITEMS} onItemSelected={handleItemSelected}>
            <div className={cx("profile")}>
              <img
                src={
                  user
                    ? user.avatar
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj30rv2Vdg9loKSSeT0j7S5ga-ZevdBRDp9Q&s"
                }
                alt="Profile"
                className={cx("profile-img")}
              />
              <div className={cx("profile-info")}>
                <p className={cx("profile-name")}>
                  {user ? user.fullName : ""}
                </p>
                <p className={cx("profile-position")}>
                  {user ? user.position : ""}
                </p>
              </div>
            </div>
          </MenuInfo>
        </div>
      </div>
      {showDialog && (
        <Dialog
          title="Warning"
          message="You do not have permission to access this item. Contact admin for more details"
          onClose={() => setShowDialog(false)}
        />
      )}

      {/* Show modal change password */}
      <Modal
        className={cx("modal")}
        isOpen={showModalChangePassword}
        onRequestClose={handleModalClose}
      >
        <div className={cx("wrapper-box-change-password")}>
          <p className={cx("title-change-password")}>{t('header.changePassword')}</p>
          <div className={cx("line")} />
          <div className={cx("wrapper-password")}>
            <p className={cx("text-password")}>{t('header.password')}</p>
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder={t('header.placeholderPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cx("input")}
            />
            <FontAwesomeIcon
              icon={showCurrentPassword ? faEyeSlash : faEarListen}
              className={cx("icon")}
              onClick={() =>
                toggleShowPassword(setShowCurrentPassword, showCurrentPassword)
              }
            />
          </div>
          <div className={cx("wrapper-password")}>
            <p className={cx("text-password")}>{t('header.newPassword')}</p>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder={t('header.placeholderNewPassword')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={cx("input")}
            />
            <FontAwesomeIcon
              icon={showNewPassword ? faEyeSlash : faEye}
              className={cx("icon")}
              onClick={() =>
                toggleShowPassword(setShowNewPassword, showNewPassword)
              }
            />
          </div>
          <div className={cx("wrapper-password")}>
            <p className={cx("text-password")}>{t('header.confirmPassword')}</p>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t('header.placeholderConfirmPassword')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cx("input")}
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              className={cx("icon")}
              onClick={() =>
                toggleShowPassword(setShowConfirmPassword, showConfirmPassword)
              }
            />
          </div>
          <div
            className={cx("btn-set-password")}
            onClick={() => handleChangePassword()}
          >
            <button className={cx("btn")}>{t('header.setPassword')}</button>
          </div>
        </div>
      </Modal>
    </header>
  );
}

export default Header;
