import classNames from "classnames/bind";
import styles from "./ItemOrder.module.scss";
import { useTheme } from "../../layouts/defaultLayout/header/Settings/Context/ThemeContext";
import logo from "../../../assets/images/logoYumhub-removebg.png"
const cx = classNames.bind(styles);

const ItemOrder = ({ order, handleView }) => {
    const formatDate = (date) => {
      const now = new Date();
      return now.toLocaleDateString("vi-VN");
    }
  const { theme } = useTheme();
  console.log(order);
  return (
    <div className={cx("wrapper", { dark: theme === "dark" })} onClick={() => handleView(order._id)}>
      <img
        src={logo}
        alt="avatar"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <div className={cx("name-info")}>
          <h4 className={cx("name-food", { dark: theme === "dark" })}>
            <span>Customer: {order.customerID ? order.customerID.fullName : ""}</span>
          </h4>
          <div className={cx("line")} />
          <h4 className={cx("name-merchant")}>
            <span>{formatDate(order.timeBook)}</span>
          </h4>
        </div>
        <span className={cx("user-name", { dark: theme === "dark" })}>{order.deliveryAddress}</span>
      </div>
    </div>
  );
};

export default ItemOrder;
