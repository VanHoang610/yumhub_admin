import React, { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

import classNames from "classnames/bind";
import styles from "./Info.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faLocationDot,
  faPersonHalfDress,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const cx = classNames.bind(styles);
function Infomation() {
  const { user } = useContext(UserContext);
  return (
    <div className={cx("container")}>
      <div className={cx("contact")}>
        <div>
          <img src={user ? user.avatar : ""} alt="Avatar" className={cx("avatar")} />
        </div>
        <div className={cx("wrapper-name")}>
          <p className={cx("name-info")}>{user ? user.fullName : ""}</p>
          <p className={cx("age-info")}>{user ? user.age : ""}</p>
        </div>
        <div>
          <p className={cx("position")}>Admin YumHub</p>
        </div>
        <div className={cx("wrapper-phone")}>
          <FontAwesomeIcon icon={faPhone} className={cx("icon-phone")} />
          <p className={cx("text-phone")}>{user.phoneNumber}</p>
        </div>
        <div className={cx("wrapper-email")}>
          <FontAwesomeIcon icon={faEnvelope} className={cx("icon-email")} />
          <p className={cx("title-email")}>
            Email:
            <span className={cx("text-email")}>{user ? user.email : ""}</span>
          </p>
        </div>
      </div>
      <div className={cx("info-container")}>
        <p className={cx("text-info")}>Infomation</p>
        <div className={cx("info")}>
          <div className={cx("wrapper-birth-day")}>
            <FontAwesomeIcon icon={faCakeCandles} />
            <p className={cx("title-birth-day")}>
              Date of birth:{" "}
              <span className={cx("text-birth-day")}>06/10/2001</span>
            </p>
          </div>
          <div className={cx("wrapper-gender")}>
            <FontAwesomeIcon icon={faPersonHalfDress} />
            <p className={cx("title-gender")}>
              Gender: <span className={cx("text-gender")}>{user ? user.sex : ""}</span>
            </p>
          </div>

          <div className={cx("wrapper-address")}>
            <FontAwesomeIcon icon={faLocationDot} />
            <p className={cx("title-address")}>
              Address:
              <span className={cx("text-address")}>
                20 Trần Đình Trọng, phường 15, quận Bình Thạnh, TP HCM
              </span>
            </p>
          </div>

          <div className={cx("wrapper-note")}>
            <p className={cx("title-note")}>
              Note:
              <span className={cx("text-note")}>
                I am avaliable everyday from 9:00 AM to 5:00 PM
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Infomation;
