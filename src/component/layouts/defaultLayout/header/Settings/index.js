import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleHalfStroke,
  faEarthAmerica,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import Switch from "react-switch";

import { useTheme } from "./Context/ThemeContext";
import { useLanguage } from "./Context/LanguageContext";
import { useFontSize } from "./Context/FontSizeContext";
import classNames from "classnames/bind";
import styles from "./Setting.module.scss";
import i18next from "../../../../../i18n";

const cx = classNames.bind(styles);

function Settings() {
  const { language ,switchLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { fontSize, changeFontSize } = useFontSize();
  const [checked, setChecked] = useState(true);
  const { t } = useTranslation();

  // nhấn thay đổi language
  const handleLanguageChange = (checked) => {
    console.log(checked);
    switchLanguage(checked);
    i18next.changeLanguage(checked);
  };

  // Nhấn thay đổi kích thước font
  const handleFontSizeChange = (size) => {
    changeFontSize(size);
  };

  // nhấn sáng tối
  const handleChecked = () => {
    setChecked(!checked);
    toggleTheme();
  };

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <p className={cx("title", fontSize, { dark: theme === "dark" })}>
       {t('settings.title')}
      </p>
      <p className={cx("sub-title", fontSize, { dark: theme === "dark" })}>
       {t('settings.subTitle')}
      </p>
      <div className={cx("line")} />
      <div className={cx("wrapper-item")}>
        <div className={cx("wrapper-title")}>
          <FontAwesomeIcon icon={faCircleHalfStroke} className={cx("icon")} />
          <p className={cx("text-title", fontSize, { dark: theme === "dark" })}>
       {t('settings.theme')}</p>
        </div>
        <div className={cx("wrapper-subTitle")}>
          <p className={cx("text-subTitle", fontSize, { dark: theme === "dark" })}>
           
       {t('settings.subTheme')}
          </p>
          <Switch
            onChange={handleChecked}
            checked={checked}
            offColor="#b5fefe"
            onColor="#2daab8"
            onHandleColor="#b5fefe"
            offHandleColor="#2daab8"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
        <div className={cx("line-item")}></div>
      </div>
      <div className={cx("wrapper-item")}>
        <div className={cx("wrapper-title")}>
          <FontAwesomeIcon icon={faEarthAmerica} className={cx("icon")} />
          <p className={cx("text-title", fontSize, { dark: theme === "dark" })}>
       {t('settings.language')}</p>
        </div>
        <div className={cx("wrapper-subTitle")}>
          <p className={cx("text-subTitle", fontSize, { dark: theme === "dark" })}>
            
       {t('settings.subLanguage')}
          </p>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={cx("select")}
          >
          <option className={cx("option")} value="en">
       {t('settings.english')}</option>
          <option className={cx("option")} value="vi">
       {t('settings.vietnamese')}</option>
          </select>
        </div>
        <div className={cx("line-item")}></div>
      </div>
      <div className={cx("wrapper-item")}>
        <div className={cx("wrapper-title")}>
          <FontAwesomeIcon icon={faFont} className={cx("icon")} />
          <p className={cx("text-title", fontSize, { dark: theme === "dark" })}>
       {t('settings.fontSize')}</p>
        </div>
        <div className={cx("wrapper-subTitle")}>
          <p className={cx("text-subTitle", fontSize, { dark: theme === "dark" })}>
          
       {t('settings.subFontSize')}
          </p>
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className={cx("select")}
          >
          <option className={cx("option", fontSize, { dark: theme === "dark" })} value="small">
       {t('settings.small')}</option>
          <option className={cx("option", fontSize, { dark: theme === "dark" })} value="medium">
       {t('settings.medium')}</option>
          <option className={cx("option", fontSize, { dark: theme === "dark" })} value="large">
       {t('settings.large')}</option>
          </select>
        </div>
        <div className={cx("line-item")}></div>
      </div>
    </div>
  );
}

export default Settings;
