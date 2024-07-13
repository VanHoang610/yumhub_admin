import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";

import { useTheme } from "../../../layouts/defaultLayout/header/Settings/Context/ThemeContext";

const cx = classNames.bind(styles);

const AccountItemMerchant = ({ merchant, handleView }) => {
  const { theme } = useTheme();
  return (
    <div
      className={cx("wrapper", { dark: theme === "dark" })}
      onClick={() => handleView(merchant._id)}
    >
      <img
        src={merchant.imageBackground || "default-avatar-url.jpg"}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <h4 className={cx("name", { dark: theme === "dark" })}>
          <span>{merchant.name}</span>
        </h4>
        <span className={cx("user-name", { dark: theme === "dark" })}>{merchant.address}</span>
      </div>
    </div>
  );
};

export default AccountItemMerchant;
