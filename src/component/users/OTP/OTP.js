
import classNames from "classnames/bind";
import styles from "./OTP.module.scss";

import logo from "../../../assets/images/logoYumhub.png"
const cx = classNames.bind(styles);

function OTP() {
    return ( 
        <div className={cx("container")}>
        <div className={cx("leftBackground")}>
          <div className={cx("logo")}>
            <img src={logo} alt="Logo YumHub" width={95} height={98} />
            <p className={cx("textLogo")}>YumHub</p>
          </div>
        </div>
        <div className={cx("rightBackground")}></div>
      </div>
     );
}

export default OTP;