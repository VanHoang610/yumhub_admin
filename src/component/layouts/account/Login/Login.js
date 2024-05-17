import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import logo from "../../../../assets/images/logoYumhub.png"
import username from "../../../../assets/images/iconUsername.png"
import password from "../../../../assets/images/iconPassword.png"
import cricle from "../../../../assets/images/icon_circle.png"
import eye from "../../../../assets/images/icon_eye.png"
const cx = classNames.bind(styles);
function Login() {
  return (
    <div className={cx("container")}>
      <div className={cx('leftBackground')}>
        <div className={cx('logoContainer')}>
            <div className={cx('logo')}>
              <img src={logo} alt="Logo YumHub" width={95} height={98}/>
              <p className={cx('textLogo')}>YumHub</p>
            </div>
          <div>
            <p className={cx('slogen')}>Opportunities don't happen, you create them</p>
          </div>
        </div>
        <div className={cx('title')}>
          <p className={cx('textTitle')}>Get Your Food Delivered Home</p>
        </div>
      </div>
      <div className={cx('rightBackground')}>
        <div>
          <p className={cx('titleLogin')}>TIME TO CONNERT</p>
        </div>
        <div className={cx('enterInfo')}>
          <img src={username} alt="Username" className={cx('iconStart')} />
          <input placeholder="lv.hoang610@gmail.com"/>
          <img src={cricle} alt="Cricle" className={cx('iconEnd')} />
        </div>
        <div className={cx('enterInfo')}>
          <img src={password} alt="Password" className={cx('iconStart')} />
          <input placeholder="lv.hoang0610"/>
          <img src={eye} alt="Cricle" className={cx('iconEnd')} />
        </div>
        <div className={cx('btnLogin')}>
          <p className={cx('textLogin')}>LOGIN</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
