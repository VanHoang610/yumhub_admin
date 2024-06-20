import Tippy from "@tippyjs/react/headless";
import { Wrapper as ProperWrapper } from "../index";

import classNames from "classnames/bind";
import styles from "./Menu.module.scss";

const cx = classNames.bind(styles);

function MenuInfo({ children, items = [], onItemSelected }) {
  const renderItems = () => {
    return items.map((item) => (
      <div
        key={item.title} 
        className={cx("wrapper-item")}
        onClick={() => onItemSelected(item.title)}
      >
        <span className={cx("icon-item")}>{item.icon}</span>
        <p className={cx("title-item")}>{item.title}</p>
      </div>
    ));
  };
  return (
    <Tippy
      interactive={true}
      placement="bottom-end"
      render={(attrs) => (
        <div className={cx("wrapper-menu")} tabIndex="-1" {...attrs}>
          {renderItems()}
        </div>
      )}
    >
      {children}
    </Tippy>
  );
}

export default MenuInfo;
