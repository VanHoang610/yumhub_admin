import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./Info.module.scss";
import noAvatar from "../../../../assets/images/noAvatar.png"

const cx = classNames.bind(styles);

const GENDER = [
  {
    value: "male",
    lable: "Male",
  },
  {
    value: "female",
    lable: "Female",
  },
  {
    value: "other",
    lable: "Other",
  },
];
function Infomation() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const { user, setUser } = useContext(UserContext);

  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN"); // Định dạng theo kiểu Việt Nam ngày/tháng/năm
  };

  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPositon] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const [itemGender] = useState(GENDER);

  useEffect(() => {
    if (user) {
      setId(user._id || "N/A");
      setUserName(user.userName || "N/A");
      setFullName(user.fullName || "N/A");
      setAvatar(user.avatar || noAvatar);
      setGender(user.gender || "N/A");
      setEmail(user.email || "N/A");
      setPositon(user.position || "N/A");
      setAddress(user.address || "N/A");
      setPhoneNumber(user.phoneNumber || "N/A");
      setBirthDay(formatDate(user.dob) || "N/A");
    }
  }, [user]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectGender, setSelectGender] = useState("");

  const handleGenderChange = (e) => {
    setSelectGender(e.target.value);
    setGender(e.target.value);
  };

  const handleChangeDate = () => {
    setShowDatePicker(true);
  };
  const handleDateChange = (date) => {
    const day = formatDate(date);
    setBirthDay(day);
    setShowDatePicker(false);
  };

  //updateUser
  const handleUpdateUser = async () => {
    try {
      const response = await AxiosInstance.post(`admin/updateAdmin/?id=${id}`, {
        fullName,
        address,
        gender,
        dob: birthDay,
      });
      console.log(response);
      if (response.data.result) {
        Swal.fire({
          icon: "success",
          title: "Update user success",
          text: "User has been successfully repaired ",
        });

        setUser({
          ...user,
          fullName,
          avatar,
          address,
          gender,
          dob: birthDay,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "warning",
        title: "Update user failed",
        text: "User has been failed repaired ",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(URL.createObjectURL(file));
    console.log(file);
  };

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <p className={cx("title", fontSize, { dark: theme === "dark" })}>
        {t('profile.myProfile')}
      </p>
      <p className={cx("sub-title", fontSize, { dark: theme === "dark" })}>
      {t('profile.subTitle')}
      </p>
      <div className={cx("line")} />

      <div className={cx("wrapper-info")}>
        <div className={cx("info-container")}>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('profile.userName')}
            </p>
            <input
              type="text"
              defaultValue={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
              className={cx("input", fontSize, { dark: theme === "dark" })}
            />
          </div>
          <span
            className={cx("note-user", fontSize, { dark: theme === "dark" })}
          >
              {t('profile.subUserName')}
          </span>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('profile.name')}
            </p>
            <input
              type="text"
              defaultValue={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
              className={cx("input", fontSize, { dark: theme === "dark" })}
            />
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('profile.address')}
            </p>
            <input
              type="text"
              defaultValue={address}
              onChange={(e) => setAddress(e.target.value)}
              autoFocus
              className={cx("input", fontSize, { dark: theme === "dark" })}
            />
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('profile.email')}
            </p>
            <div className={cx("text-info")}>
              <p className={cx("info", fontSize, { dark: theme === "dark" })}>
                {email}
              </p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('profile.phoneNumber')}
            </p>
            <div className={cx("text-info")}>
              <p className={cx("info", fontSize, { dark: theme === "dark" })}>
                {phoneNumber}
              </p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('profile.gender')}
            </p>
            <div
              className={cx("radio-group", fontSize, {
                dark: theme === "dark",
              })}
            >
              {itemGender.map((gender) => (
                <label key={gender.value}>
                  <input
                    type="radio"
                    value={gender.value}
                    checked={selectGender === gender.value}
                    onChange={handleGenderChange}
                    className={cx("input-radio")}
                  />
                  {gender.lable}
                </label>
              ))}
            </div>
          </div>

          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('profile.dateOfBirth')}
            </p>
            <div className={cx("text-info")}>
              <input
                type="text"
                defaultValue={birthDay}
                onChange={(e) => setBirthDay(e)}
                onClick={handleChangeDate}
                readOnly
                className={cx("input", fontSize, { dark: theme === "dark" })}
              />
              {showDatePicker && (
                <DatePicker
                  onChange={handleDateChange}
                  dateFormat="dd/mm/yyyy"
                  inline
                />
              )}
            </div>
          </div>

          <div className={cx("btn-update")} onClick={handleUpdateUser}>
            <span>{t('profile.save')}</span>
          </div>
          <span style={{ marginTop: 500 }}></span>
        </div>
        <div className={cx("line-info")}></div>
        <div className={cx("image-info")}>
          <p
            className={cx("role", fontSize, { dark: theme === "dark" })}
          >
            {position}
          </p>
          <img className={cx("avatar")} src={avatar} alt="Avatar"></img>
          <div
            className={cx("box-text-select", { dark: theme === "dark" })}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <span>{t('profile.selectImage')}</span>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <p
            style={{ marginTop: 16 }}
            className={cx("note-image", fontSize, { dark: theme === "dark" })}
          >
           {t('profile.fileSize')}
          </p>
          <p className={cx("note-image", fontSize, { dark: theme === "dark" })}>
            F{t('profile.fileExtension')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Infomation;
