import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import Modal from "react-modal";
import Swal from "sweetalert2";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classNames from "classnames/bind";
import styles from "./Info.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faBirthdayCake,
  faCakeCandles,
  faChevronDown,
  faGenderless,
  faLocationDot,
  faPersonHalfDress,
  faPhone,
  faSignature,
  faUser,
  faUserGroup,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import AxiosInstance from "../../../../utils/AxiosInstance";

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
  const [createBy, setCreateBy] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [age, setAge] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [itemGender] = useState(GENDER);

  const [isOpenDay, setIsOpenDay] = useState(false);
  const [isOpenMonth, setIsOpenMonth] = useState(false);
  const [isOpenYear, setIsOpenYear] = useState(false);

  const toggleDay = () => setIsOpenDay(!isOpenDay);
  const toggleMonth = () => setIsOpenMonth(!isOpenMonth);
  const toggleYear = () => setIsOpenYear(!isOpenYear);

  const selectBtnUpdate = () => {
    try {
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setId(user._id || "N/A");
      setUserName(user.userName || "N/A");
      setFullName(user.fullName || "N/A");
      setAvatar(user.avatar || "N/A");
      setGender(user.gender || "N/A");
      setEmail(user.email || "N/A");
      setPositon(user.position || "N/A");
      setAddress(user.address || "N/A");
      setCreateBy(user.createBy || "N/A");
      setPhoneNumber(user.phoneNumber || "N/A");
      setBirthDay(formatDate(user.dob) || "N/A");
      const dob = new Date(user.dob);
      const currentDate = new Date();
      let age = currentDate.getFullYear() - dob.getFullYear();
      if (
        currentDate.getMonth() < dob.getMonth() ||
        (currentDate.getMonth() === dob.getMonth() &&
          currentDate.getDate() < dob.getDate())
      ) {
        age--;
      }
      setAge(age);
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

        setShowModal(false);
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
    <div className={cx("container")}>
      <p className={cx("title")}>My Profile</p>
      <p className={cx("sub-title")}>Manage and protect your account</p>
      <div className={cx("line")} />

      <div className={cx("wrapper-info")}>
        <div className={cx("info-container")}>
          <div className={cx("box-info")}>
            <p className={cx("title-info")}>Username</p>
            <input
              type="text"
              defaultValue={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
              className={cx("input")}
            />
          </div>
          <span className={cx("note-user")}>Username cannot be changed.</span>
          <div className={cx("box-info")}>
            <p className={cx("title-info")}>Name</p>
            <input
              type="text"
              defaultValue={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
              className={cx("input")}
            />
          </div>
          <div className={cx("box-info")}>
            <p className={cx("title-info")}>Address</p>
            <input
              type="text"
              defaultValue={address}
              onChange={(e) => setAddress(e.target.value)}
              autoFocus
              className={cx("input")}
            />
          </div>
          <div className={cx("box-info")}>
            <p className={cx("title-info")}>Email</p>
            <div className={cx("text-info")}>
              <p className={cx("info")}>{email}</p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p className={cx("title-info")}>Phone Number</p>
            <div className={cx("text-info")}>
              <p className={cx("info")}>{phoneNumber}</p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p className={cx("title-info")}>Gender</p>
            <div className={cx("radio-group")}>
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
            <p className={cx("title-info")}>Date of birth</p>
            <div className={cx("text-info")}>
              <input
                type="text"
                defaultValue={birthDay}
                onChange={(e) => setBirthDay(e)}
                onClick={handleChangeDate}
                readOnly
                className={cx("input")}
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
            <span>Save</span>
          </div>
        </div>
        <div className={cx("line-info")}></div>
        <div className={cx("image-info")}>
          <p style={{ marginTop: 50, marginBottom: 20 }}>{position}</p>
          <img className={cx("avatar")} src={avatar}></img>
          <div
            className={cx("box-text-select")}
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
          <p style={{ marginTop: 16 }}>File size: maximum 1 MB</p>
          <p>File extension: .JPEG, .PNG</p>
        </div>
      </div>
    </div>

    // <div className={cx("container")}>
    //   <div className={cx("contact")}>
    //     <div>
    //       <img src={avatar} alt="Avatar" className={cx("avatar")} />
    //     </div>
    //     <div className={cx("wrapper-name")}>
    //       <p className={cx("name-info")}>{fullName}, </p>
    //       <p className={cx("age-info")}>{age}</p>
    //     </div>
    //     <div>
    //       <p className={cx("position")}>Admin YumHub</p>
    //     </div>
    //     <div className={cx("wrapper-phone")}>
    //       <FontAwesomeIcon icon={faPhone} className={cx("icon-phone")} />
    //       <p className={cx("text-phone")}>SDT: {phoneNumber}</p>
    //     </div>
    //     <div className={cx("wrapper-email")}>
    //       <FontAwesomeIcon icon={faEnvelope} className={cx("icon-email")} />
    //       <p className={cx("title-email")}>
    //         Email:
    //         <span className={cx("text-email")}>{email}</span>
    //       </p>
    //     </div>
    //   </div>
    //   <div className={cx("info-container")}>
    //     <p className={cx("text-info-container")}>Infomation</p>
    //     <div className={cx("info")}>
    //       <div className={cx("wrapper-birth-day")}>
    //         <FontAwesomeIcon icon={faUser} />
    //         <p className={cx("title-info")}>
    //           Username:
    //           <span className={cx("text-info")}>{userName}</span>
    //         </p>
    //       </div>
    //       <div className={cx("wrapper-birth-day")}>
    //         <FontAwesomeIcon icon={faUserGroup} />
    //         <p className={cx("title-info")}>
    //           Role:
    //           <span className={cx("text-info")}>{position}</span>
    //         </p>
    //       </div>
    //       <div className={cx("wrapper-birth-day")}>
    //         <FontAwesomeIcon icon={faUserTie} />
    //         <p className={cx("title-info")}>
    //           Create By:
    //           <span className={cx("text-info")}>{createBy}</span>
    //         </p>
    //       </div>
    //       <div className={cx("wrapper-birth-day")}>
    //         <FontAwesomeIcon icon={faCakeCandles} />
    //         <p className={cx("title-info")}>
    //           Date of birth: <span className={cx("text-info")}>{birthDay}</span>
    //         </p>
    //       </div>
    //       <div className={cx("wrapper-gender")}>
    //         <FontAwesomeIcon icon={faPersonHalfDress} />
    //         <p className={cx("title-info")}>
    //           Gender:
    //           <span className={cx("text-info")}>{gender}</span>
    //         </p>
    //       </div>

    //       <div className={cx("wrapper-address")}>
    //         <FontAwesomeIcon icon={faLocationDot} />
    //         <p className={cx("title-info")}>
    //           Address:
    //           <span className={cx("text-info")}>{address}</span>
    //         </p>
    //       </div>
    //       <div className={cx("wrapper-note")}>
    //         <p className={cx("title-info")}>
    //           Note:
    //           <span className={cx("text-info")}>
    //             I am avaliable everyday from 9:00 AM to 5:00 PM
    //           </span>
    //         </p>
    //       </div>
    //       <div className={cx("btn-update")}>
    //         <button className={cx("text-btn")} onClick={selectBtnUpdate}>
    //           Update
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   <Modal
    //     isOpen={showModal}
    //     onRequestClose={() => setShowModal(false)}
    //     contentLabel="Update User"
    //     className={cx("modal")}
    //   >
    //     <div className={cx("modal-container")}>
    //       <h2 className={cx("title-modal")}>Update User</h2>
    //       <div className={cx("input-modal")}>
    //         <FontAwesomeIcon
    //           icon={faSignature}
    //           className={cx("icon-modal")}
    //         ></FontAwesomeIcon>
    //         <input
    //           className={cx("input")}
    //           defaultValue={fullName}
    //           onChange={(e) => setFullName(e.target.value)}
    //         />
    //       </div>
    //       <div className={cx("input-modal")}>
    //         <FontAwesomeIcon
    //           icon={faAddressCard}
    //           className={cx("icon-modal")}
    //         ></FontAwesomeIcon>
    //         <input
    //           className={cx("input")}
    //           defaultValue={address}
    //           onChange={(e) => setAddress(e.target.value)}
    //         />
    //       </div>
    //       <div className={cx("input-modal")}>
    //         <FontAwesomeIcon
    //           icon={faGenderless}
    //           className={cx("icon-modal")}
    //         ></FontAwesomeIcon>
    //         <select
    //           className={cx("select-gender")}
    //           value={gender}
    //           onChange={(e) => setGender(e.target.value)}
    //         >
    //           <option value="Nam">Nam</option>
    //           <option value="Nữ">Nữ</option>
    //         </select>
    //       </div>
    //       <div className={cx("input-modal")}>
    //         <FontAwesomeIcon
    //           icon={faBirthdayCake}
    //           className={cx("icon-modal")}
    //         ></FontAwesomeIcon>
    //         <input
    //           type="date"
    //           className={cx("input")}
    //           defaultValue={birthDay}
    //           onChange={(e) => setBirthDay(e.target.value)}
    //         />
    //       </div>
    //       <div className={cx("btn-update-modal")}>
    //         <button className={cx("btn-text-modal")} onClick={handleUpdateUser}>
    //           Update
    //         </button>
    //       </div>
    //     </div>
    //   </Modal>
    // </div>
  );
}

export default Infomation;
