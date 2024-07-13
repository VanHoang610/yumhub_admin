import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "react-dropdown/style.css";
import Modal from "react-modal";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faEarListen,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../contexts/UserContext";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { useTheme } from "../header/Settings/Context/ThemeContext";
import { useFontSize } from "../header/Settings/Context/FontSizeContext";

const cx = classNames.bind(styles);

function Header({ showMenuProfile, setShowMenuProfile }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  //nhấn logout
  const handleLogout = async () => {
    await logoutUser();
    navigate("/yumhub_admin");
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
            navigate("/");
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
    setShowMenuProfile(false);
    navigate("settings");
  };

  // nhấn profile
  const selectProfile = () => {
    setShowMenuProfile(!showMenuProfile);
  };

  //nhấn vào từng menu-item
  const selectItemMenu = (item) => {
    setShowMenuProfile(false);
    navigate("/infomation");
    if (item === "Information") {
    } else if (item === "Logout") {
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
    } else if (item === "ChangePassword") {
      setShowModalChangePassword(true);
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className={cx("container", fontSize, { dark: theme === "dark" })}>
      <img className={cx("logo")} src={logo} alt="Logo YumHub" />
      <div className={cx("nav-item")}>
        <Link
          className={cx("item-menu", fontSize)}
          to="/settings"
          onClick={handleSettings}
        >
          {t('header.settings')}
        </Link>
        <Link className={cx("item-menu", fontSize)} to="/employee" onClick={() => setShowMenuProfile(false)}>
        {t('header.employee')}
        </Link>
        <ul>
          <li className={cx("item-profile", fontSize)} onClick={selectProfile}>
          {t('header.profile')}
          </li>
          {showMenuProfile && (
            <ul className={cx("sub-item", { dark: theme === "dark"})}>
              <li className={cx(fontSize)} onClick={() => selectItemMenu("Information")}> {t('header.information')}</li>
              <li className={cx(fontSize)} onClick={() => selectItemMenu("ChangePassword")}>
              {t('header.changePassword')}
              </li>
              <li className={cx(fontSize)} onClick={() => selectItemMenu("Logout")}> {t('header.logout')}</li>
            </ul>
          )}
        </ul>
      </div>

      {/* Show modal change password */}
      <Modal
        className={cx("modal")}
        isOpen={showModalChangePassword}
        onRequestClose={handleModalClose}
      >
        <div className={cx("wrapper-box-change-password")}>
          <p className={cx("title-change-password")}>
            {t("header.changePassword")}
          </p>
          <div className={cx("line")} />
          <div className={cx("wrapper-password")}>
            <p className={cx("text-password")}>{t("header.password")}</p>
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder={t("header.placeholderPassword")}
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
            <p className={cx("text-password")}>{t("header.newPassword")}</p>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder={t("header.placeholderNewPassword")}
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
            <p className={cx("text-password")}>{t("header.confirmPassword")}</p>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("header.placeholderConfirmPassword")}
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
            <button className={cx("btn")}>{t("header.setPassword")}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Header;
