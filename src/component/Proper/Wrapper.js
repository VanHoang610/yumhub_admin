import classNames from "classnames/bind";
import styles from "./Proper.module.scss";

import { useTheme } from "../layouts/defaultLayout/header/Settings/Context/ThemeContext";

const cx = classNames.bind(styles);
function Wrapper({ children }) {
  const { theme } = useTheme();
  return (
    <div className={cx("wrapper", { dark: theme === "dark" })}>{children}</div>
  );
}

export default Wrapper;
