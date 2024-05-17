import classNames from "classnames/bind";
import styles from "./ForgetPassword.module.scss";

import logo from "../../../assets/images/logoYumhub.png"
const cx = classNames.bind(styles);
function ForgetPassword() {
  return (
    <div className={cx("container")}>
      <div className={cx("leftBackground")}>
        <div className={cx("logo")}>
          <img src={logo} alt="Logo YumHub" width={95} height={98} />
          <p className={cx("textLogo")}>YumHub</p>
        </div>
        <div className={cx('title')}>
            <p className="textTitle">FORGOT YOUR PASSWORD ?</p>
        </div>
        <div className={cx('note')}>
            <p className="textNote">Don’t worry, happens to all of us. Enter your email below to recover your password</p>
        </div>
      </div>
      <div className={cx("rightBackground")}></div>
    </div>
  );
}

export default ForgetPassword;
