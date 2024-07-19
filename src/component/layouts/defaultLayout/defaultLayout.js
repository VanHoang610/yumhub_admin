import React, { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import styles from "./DefaultLayout.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const [showMenuProfile, setShowMenuProfile] = useState(false);

  const hideMenuProfile = () => {
    setShowMenuProfile(false);
  };

  return (
    <div className={cx("wrapper")}>
      <Header 
        showMenuProfile={showMenuProfile}
        setShowMenuProfile={setShowMenuProfile}
      />
      <div className={cx("container")} onClick={hideMenuProfile}>
        <Sidebar />
        <div className={cx("line-menu")}></div>
        <div className={cx("content")} onClick={hideMenuProfile}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
