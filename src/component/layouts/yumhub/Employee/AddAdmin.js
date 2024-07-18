import React, { useState } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./AddAdmin.module.scss";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import { useTranslation } from "react-i18next";

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

function AddAdmin() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN");
  };

  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar] = useState("");
  const [fileAvatar, setFileAvatar] = useState("");
  const [showAvatar, setShowAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [position, setPosition] = useState("");
  const [address, setAddress] = useState("");
  const [selectGender, setSelectGender] = useState("");
  const [errors, setErrors] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDayInput, setBirthDayInput] = useState("");
  const [itemGender] = useState(GENDER);

  //thêm manager
  const handleAddNew = async () => {
    const newErrors = {};

    if (!userName) {
      newErrors.userName = "User Name is required";
    }
    if (!fullName) {
      newErrors.fullName = "Full Name is required";
    }

    if (!address) {
      newErrors.address = "Address is required";
    }

    if (!gender) {
      newErrors.gender = "Gender is required";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    }

    if (!birthDay) {
      newErrors.birthDay = "Date of birth is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      let avatarUrl = avatar;
      if (fileAvatar) {
        const formData = new FormData();
        formData.append("file", fileAvatar);
        const response = await axios.post(
          "https://duantotnghiep-api-a32664265dc1.herokuapp.com/files/upload",
          formData
        );
        const url = response.data.url;
        avatarUrl = url;
      }
      const response = await AxiosInstance.post("admin/createAdmin", {
        userName,
        fullName,
        avatar: avatarUrl,
        address,
        gender,
        email,
        phoneNumber,
        dob: Date.parse(birthDayInput),
        position,
      });
      if (response.data.result) {
        Swal.fire("Success", "Add New Manager Success", "success");
        setTimeout(() => {
          window.location.href = "/employee";
        }, 3000);
      } else {
        Swal.fire("Fail", response.data.data + "", "error");
      }
    }
  };

  const handleGenderChange = (e) => {
    setSelectGender(e.target.value);
    setGender(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFileAvatar(file);
    setShowAvatar(URL.createObjectURL(file));
  };

  const handleInputDate = () => {
    setShowDatePicker(true);
  };

  const handleBirthDayChange = (date) => {
    setBirthDay(formatDate(date));
    setBirthDayInput(new Date(date));
    setShowDatePicker(false);
  };

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <p className={cx("title", fontSize, { dark: theme === "dark" })}>Add manager or employee</p>
      <p className={cx("sub-title", fontSize, { dark: theme === "dark" })}>
        Add a new manager or employee to your team.
      </p>
      <div className={cx("line")} />
      <div className={cx("wrapper-info")}>
        <div className={cx("info-container")}>
          <div className={cx("box-info")}>
            <p className={cx("title-info", fontSize, { dark: theme === "dark" })}>User Name</p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
              className={cx("input", fontSize, { dark: theme === "dark" }, { errors: errors.userName })}
            />
          </div>
          {errors.userName && <p className={cx("error")}>{errors.userName}</p>}
          <div className={cx("box-info")}>
            <p className={cx("title-info", fontSize, { dark: theme === "dark" })}>Full Name</p>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
              className={cx("input", fontSize, { dark: theme === "dark" }, { errors: errors.fullName })}
            />
          </div>
          {errors.fullName && <p className={cx("error")}>{errors.fullName}</p>}
          <div className={cx("box-info")}>
            <p className={cx("title-info", fontSize, { dark: theme === "dark" })}>Phone Number</p>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoFocus
              className={cx("input", fontSize, { dark: theme === "dark" }, { errors: errors.phoneNumber })}
            />
          </div>
          {errors.phoneNumber && (
            <p className={cx("error")}>{errors.phoneNumber}</p>
          )}
          <div className={cx("box-info")}>
            <p className={cx("title-info", fontSize, { dark: theme === "dark" })}>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className={cx("input", fontSize, { dark: theme === "dark" }, { errors: errors.email })}
            />
          </div>
          {errors.email && <p className={cx("error")}>{errors.email}</p>}

          <div className={cx("box-info")}>
            <p className={cx("title-info", fontSize, { dark: theme === "dark" })}>Address</p>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoFocus
              className={cx("input", fontSize, { dark: theme === "dark" }, { errors: errors.address })}
            />
          </div>
          {errors.address && <p className={cx("error")}>{errors.address}</p>}
          <div className={cx("box-info")}>
            <p className={cx("title-info", fontSize, { dark: theme === "dark" })}>Date of birth</p>
            <div className={cx("text-info")}>
              <input
                type="text"
                value={birthDay}
                onChange={(e) => setBirthDay(e)}
                onClick={handleInputDate}
                readOnly
                className={cx("input", fontSize, { dark: theme === "dark" }, { errors: errors.startDate })}
              />
              {showDatePicker && (
                <DatePicker
                  onChange={handleBirthDayChange}
                  dateFormat="dd/mm/yyyy"
                  inline
                />
              )}
            </div>
          </div>
          {errors.startDate && (
            <p className={cx("error")}>{errors.startDate}</p>
          )}
          <div className={cx("box-info")}>
            <p className={cx("title-info", fontSize, { dark: theme === "dark" })}>Gender</p>
            <div className={cx("radio-group", fontSize, { dark: theme === "dark" })}>
              {itemGender.map((gender) => (
                <label key={gender.value}>
                  <input
                    type="radio"
                    value={gender.value}
                    checked={selectGender === gender.value}
                    onChange={handleGenderChange}
                    className={cx("input-radio", { errors: errors.gender })}
                  />
                  {gender.lable}
                </label>
              ))}
            </div>
          </div>
          {errors.gender && <p className={cx("error")}>{errors.gender}</p>}
          <div className={cx("box-info")}>
            <p className={cx("title-info", fontSize, { dark: theme === "dark" })}>Role</p>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={cx("select", fontSize, { dark: theme === "dark" })}
            >
              <option className={cx("option", fontSize, { dark: theme === "dark" })} value={"employee"}>Employee</option>
              <option className={cx("option", fontSize, { dark: theme === "dark" })} value={"manager"}>Manager</option>
            </select>
          </div>
          <div className={cx("btn-update")} onClick={handleAddNew}>
            <span>Add New</span>
          </div>
        </div>
        <div className={cx("line-info")}></div>
        <div className={cx("image-info")}>
          <img className={cx("avatar")} src={showAvatar}></img>
          <div
            className={cx("box-text-select", { dark: theme === "dark" })}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <span>Select Image</span>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <p style={{ marginTop: 16 }} className={cx("note-image", fontSize, { dark: theme === "dark" })}>File size: maximum 1 MB</p>
          <p className={cx("note-image", fontSize, { dark: theme === "dark" })}>File extension: .JPEG, .PNG</p>
        </div>
      </div>
    </div>
  );
}

export default AddAdmin;
