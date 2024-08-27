import { useLocation, useNavigate } from "react-router-dom";

import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./EmployeeDetails.module.scss";

import { UserContext } from "../../../contexts/UserContext";

const cx = classNames.bind(styles);

function EmployeeDetails() {
  
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { state } = location;
  const { employee } = state || {};

  console.log(employee);
  const [selectedPosition, setSelectedPosition] = useState(
    employee?.position || "Position 1"
  );

  const handleEdit = async () => {
    try {

      
      const response = await AxiosInstance.post(
        `admin/updateEmployee?id=${employee._id}`,
        {
          position: selectedPosition,
        }
      );
      if (response.data.result) {
        if(user._id === employee._id ) {
          console.log(response.data.data);
          setUser(response.data.data);
        }
        Swal.fire({
          icon: "success",
          title: "Update employee success",
          text: "User has been successfully repaired ",
        });
        setTimeout(() => {
          navigate(`/employee`);
        }, 1000);
      }
    } catch (error) {
      Swal.fire({
        icon: "fail",
        title: "Update employee fail",
        text: "User has been failed repaired ",
      });
    }
  };

  const handleDelete = async () => {    
    try {
      Swal.fire({
        title: "Xóa Nhân viên",
        text: "Bạn có chắc là xóa nhân viên không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "CÓ",
        cancelButtonText: "Không",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await AxiosInstance.post(
            `admin/deleteAdmin?id=${employee._id}`
          );
          if (response.data.result === false) {
            Swal.fire({
              icon: "info",
              title: "Xóa thất bại",
              text: "Bạn xóa Nhân viên không thành công",
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "Xóa thành công",
              text: "Bạn xóa Nhân viên thành công",
            })
            setTimeout(() => {
              navigate(`/employee`);
            }, 1000);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.close();
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "fail",
        title: "Deleted employee fail",
        text: "User has been failed repaired ",
      });
    }
  };

  const handlePositionChange = (event) => {
    if (event.target.value) {
      setSelectedPosition(event.target.value);
    }
  };

  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const [avatar, setAvatar] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(URL.createObjectURL(file));
    console.log(file);
  };

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <p className={cx("title", fontSize, { dark: theme === "dark" })}>
      {t('detailEmployee.title')}
      </p>
      <p className={cx("sub-title", fontSize, { dark: theme === "dark" })}>
      {t('detailEmployee.subTitle')}
      </p>
      <div className={cx("line")} />

      <div className={cx("wrapper-info")}>
        <div className={cx("info-container")}>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
               {t('detailEmployee.userName')}
            </p>
            <div className={cx("text-info")}>
              <p className={cx("info", fontSize, { dark: theme === "dark" })}>
                {employee.userName}
              </p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
               {t('detailEmployee.fullName')}
            </p>
            <div className={cx("text-info")}>
              <p className={cx("info", fontSize, { dark: theme === "dark" })}>
                {employee.fullName}
              </p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('detailEmployee.gender')}
            </p>
            <div className={cx("text-info")}>
              <p className={cx("info", fontSize, { dark: theme === "dark" })}>
                {employee.gender}
              </p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
               {t('detailEmployee.email')}
            </p>
            <div className={cx("text-info")}>
              <p className={cx("info", fontSize, { dark: theme === "dark" })}>
                {employee.email}
              </p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
              {t('detailEmployee.phoneNumber')}
            </p>
            <div className={cx("text-info")}>
              <p className={cx("info", fontSize, { dark: theme === "dark" })}>
                {employee.phoneNumber}
              </p>
            </div>
          </div>
          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
               {t('detailEmployee.address')}
            </p>
            <div className={cx("text-info")}>
              <p className={cx("info", fontSize, { dark: theme === "dark" })}>
                {employee.address}
              </p>
            </div>
          </div>

          <div className={cx("box-info")}>
            <p
              className={cx("title-info", fontSize, { dark: theme === "dark" })}
            >
               {t('detailEmployee.position')}
            </p>
            <div className={cx("text-info")}>
              <select
                defaultValue={employee.position}
                onChange={handlePositionChange}
                className={cx("input")}
              >
                <option value="employee"> {t('detailEmployee.employee')}</option>
                <option value="manager"> {t('detailEmployee.manager')}</option>
              </select>
            </div>
          </div>

          <div className={cx("wrapper-btn")}>
          <div className={cx("btn-update")} onClick={handleEdit}>
            <span> {t('detailEmployee.save')}</span>
          </div>
          <div className={cx("btn-deleted")} onClick={handleDelete}>
            <span> {t('detailEmployee.delete')}</span>
          </div>
          </div>
          <span style={{ marginTop: 500 }}></span>
        </div>
        <div className={cx("line-info")}></div>
        <div className={cx("image-info")}>
          <p className={cx("role", fontSize, { dark: theme === "dark" })}></p>
          <img
            className={cx("avatar")}
            src={employee.avatar}
            alt="Avatar"
          ></img>
          <div
            className={cx("box-text-select", { dark: theme === "dark" })}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <span>{t("profile.selectImage")}</span>
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
            {t("profile.fileSize")}
          </p>
          <p className={cx("note-image", fontSize, { dark: theme === "dark" })}>
            {t("profile.fileExtension")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
