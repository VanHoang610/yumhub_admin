import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";
import { useTheme } from "../../../layouts/defaultLayout/header/Settings/Context/ThemeContext";

const cx = classNames.bind(styles);

const AccountItemShipper = ({ shipper, handleView }) => {
  const { theme } = useTheme();
  return (
    <div className={cx("wrapper", { dark: theme === "dark" })} onClick={() => handleView(shipper._id)}>
      <img
        src={shipper.avatar || "default-avatar-url.jpg"}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <h4 className={cx("name", { dark: theme === "dark" })}>
          <span>{shipper.fullName}</span>
        </h4>
        <span className={cx("user-name", { dark: theme === "dark" })}>{shipper.address}</span>
      </div>
    </div>
  );
};

export default AccountItemShipper;
