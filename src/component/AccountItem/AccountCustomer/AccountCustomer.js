import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";
import { useTheme } from "../../layouts/defaultLayout/header/Settings/Context/ThemeContext";

const cx = classNames.bind(styles);

const AccountItemCustomer = ({ customer, handleView }) => {
  const { theme } = useTheme();
  return (
    <div className={cx("wrapper", { dark: theme === "dark" })} onClick={() => handleView(customer._id)}>
      <img
        src={customer.avatar || "default-avatar-url.jpg"}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <h4 className={cx("name", { dark: theme === "dark" })}>
          <span>{customer.fullName}</span>
        </h4>
        <span className={cx("user-name", { dark: theme === "dark" })}>{customer.phoneNumber}</span>
      </div>
    </div>
  );
};

export default AccountItemCustomer;
