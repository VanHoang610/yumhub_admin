import React from "react";
import classNames from "classnames/bind";
import styles from "./Setting.module.scss";


import { useTheme } from './Context/ThemeContext';
import { useLanguage } from './Context/LanguageContext';
import { useFontSize } from './Context/FontSizeContext';
import { useTranslation } from "react-i18next";
import  i18next  from "../../../../../i18n";

const cx = classNames.bind(styles);

function Settings() {

  const { switchLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  // nhấn thay đổi language
  const handleLanguageChange = (checked) => {
    console.log(checked);
    switchLanguage(checked);
    i18next.changeLanguage(checked);
  };



  return (
    <div className={cx("container")}>
      <h1>{t("settings.title")}</h1>
      <div className={cx("wrapper-language")}>
        <h3 className={cx("title-language")}>{t("settings.language")}:</h3>
        <div className={cx("wrapper-button-language")}>
          <button
            className={cx("button")}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </button>
          <button
            className={cx("button")}
            onClick={() => handleLanguageChange("vi")}
          >
            Tiếng Việt
          </button>
        </div>
      </div>
      <div className={cx("wrapper-dark-mode")}>
        <h3 className={cx("title-dark-mode")}>{t("settings.theme")}:</h3>
        <button className={cx("button")} onClick={toggleTheme}>
          {theme === "light" ? t("settings.lightMode") : t("settings.darkMode")}
        </button>
      </div>
    </div>
  );
}

export default Settings;
