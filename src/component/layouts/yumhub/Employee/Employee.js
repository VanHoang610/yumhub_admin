import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./Employee.module.scss";
import debounce from "lodash/debounce";

import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react/headless";
import AccountItemMerchant from "../../../AccountItem/AccountMerchant/AccountCustomer/AccountMerchant";
import { Wrapper as ProperWrapper } from "../../../Proper/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faClock,
  faEnvelope,
  faLocationDot,
  faMagnifyingGlass,
  faMap,
  faPerson,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import avatar from "../../../../assets/images/logoYumhub.png";
import Button from "../../../buttons";
import { format } from "date-fns";
import Swal from "sweetalert2";

const cx = classNames.bind(styles);

function Employee() {
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN");
  };
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const [data, setData] = useState([]);

  // list manager
  const fetchAdmins = async () => {
    try {
      const response = await AxiosInstance.get("admin/showAll");
      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await AxiosInstance.get("admin/checkRole");
        if (response.data.result) {
          console.log(response.data.role);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Swal.fire("Info", "Access Denied Employee", "warning");
          navigate("/all-vouchers");
        } else {
          console.log(error);
        }
      }
    };
    fetchRole();
  }, []);

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.get(
          `admin/search?search=${keyword}`
        );
        if (response.data.result && response.data.data.length > 0) {
          setData(response.data.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      fetchAdmins();
    }
  };

  // nhấn vào từng item
  const handleAddNew = () => {
    try {
      navigate("/add-admin");
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <div className={cx("wrapper-title")}>
        <p className={cx("title", fontSize, { dark: theme === "dark" })}>
          YumHub Management List
        </p>
        <div className={cx("btn-add")} onClick={() => handleAddNew()}>
          Add New
        </div>
      </div>
      <div>
        <div className={cx("search-result", { dark: theme === "dark" })}>
          <div className={cx("inputSearch", { dark: theme === "dark" })}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={cx("icon-search")}
            />
            <input
              className={cx("input", fontSize, { dark: theme === "dark" })}
              placeholder={t("merchant.searchByName")}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className={cx("line-background")} />
        <div className={cx("grid-container")}>
          {data.map((item) => (
            <div
              className={cx("box", { dark: theme === "dark" })}
              key={item._id}
            >
              <div className={cx("titleBox")}>
                <img
                  src={item.avatar}
                  alt="logoMerchant"
                  className={cx("logo")}
                />
                <div className={cx("line", { dark: theme === "dark" })} />
                <div className={cx("textTitle")}>
                  <p
                    className={cx("nameMerchant", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {item.fullName}
                  </p>
                  <p className={cx("type", fontSize)}>{item.gender}</p>
                </div>
              </div>
              <div className={cx("line-bottom", { dark: theme === "dark" })} />
              <div className={cx("contentBox")}>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faUser}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.userName}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faPerson}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.position}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.address}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faPhone}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.phoneNumber}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.email}
                  </p>
                </div>

                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faCakeCandles}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {formatDate(item.dob)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Employee;
