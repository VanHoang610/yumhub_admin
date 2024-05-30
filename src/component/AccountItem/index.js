import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const AccountItem = ({ customer, handleView }) => {
  return (
    <div className={cx("wrapper")} onClick={() => handleView(customer._id)}>
      <img
        src={customer.avatar || "default-avatar-url.jpg"}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <h4 className={cx("name")}>
          <span>{customer.fullName}</span>
        </h4>
        <span className={cx("user-name")}>{customer.phoneNumber}</span>
      </div>
    </div>
  );
};

export default AccountItem;
