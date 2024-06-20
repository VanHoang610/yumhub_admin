import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";

const cx = classNames.bind(styles);

const AccountItemShipper = ({ shipper, handleView }) => {
  return (
    <div className={cx("wrapper")} onClick={() => handleView(shipper._id)}>
      <img
        src={shipper.avatar || "default-avatar-url.jpg"}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <h4 className={cx("name")}>
          <span>{shipper.fullName}</span>
        </h4>
        <span className={cx("user-name")}>{shipper.address}</span>
      </div>
    </div>
  );
};

export default AccountItemShipper;
