import classNames from "classnames/bind";
import styles from "./DiscountVoucher.module.scss";
import { useTheme } from "../../layouts/defaultLayout/header/Settings/Context/ThemeContext";
import logo_yumhub from "../../../assets/images/logoYumhub-removebg.png"

const cx = classNames.bind(styles);

const DiscountVoucher = ({ voucher, handleView }) => {
  const { theme } = useTheme();
  return (
    <div className={cx("wrapper", { dark: theme === "dark" })} onClick={() => handleView(voucher)}>
      <img
        src={logo_yumhub}
        alt="voucher"
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <h4 className={cx("name", { dark: theme === "dark" })}>
          <span>{voucher.nameVoucher}</span>
        </h4>
        <span className={cx("user-name", { dark: theme === "dark" })}>{voucher.code}</span>
      </div>
    </div>
  );
};

export default DiscountVoucher;
