import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AxiosInstance from "../../../../utils/AxiosInstance";
import Button from "../../../buttons/index";

import {
  faBuildingColumns,
  faMagnifyingGlass,
  faMagnifyingGlassDollar,
  faPerson,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./Shipper.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import { useTheme } from "../../defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../defaultLayout/header/Settings/Context/FontSizeContext";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

function WithdrawalShipper() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const [data, setData] = useState([]);

  //list withdrawal shipper
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(
        "/shippers/listWithdrawalApproval"
      );
      setData(response.data.walletShipper);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post(
          `shippers/findWithdrawalShipper`,
          {
            keyword,
          }
        );
        if (response.data.result && response.data.walletShipper.length > 0) {
          setData(response.data.walletShipper);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      fetchData();
    }
  };

  // xác nhận rút tiền shipper
  const handleWithdrawal = async (id) => {
    try {
      Swal.fire({
        title: t('withdrawalShipper.withdrawalShipper'),
        text: t('withdrawalShipper.subWithdrawalShipper'),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t('withdrawalShipper.yes'),
        cancelButtonText: t('withdrawalShipper.no'),
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await AxiosInstance.get(
            `merchants/withdrawalApproval?id=${id}`
          );
          if (response.data.result === false) {
            Swal.fire({
              icon: "info",
              title: t('withdrawalShipper.swalTitleFail'),
              text: t('withdrawalShipper.swalTextFail'),
            });
          } else {
            Swal.fire({
              icon: "success",
              title: t('withdrawalShipper.swalTitleSuccess'),
              text: t('withdrawalShipper.swalTextSuccess'),
            }).then(() => {
              setData(data.filter((merchant) => merchant._id !== id));
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.close();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <div className={cx("content")}>
        <p className={cx("title", fontSize, { dark: theme === "dark" })}>
          {t("withdrawalShipper.title")}
        </p>
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
        </div>
        <div className={cx("line-background")} />
        <div className={cx("grid-container")}>
          {data.map((item) => (
            <div
              className={cx("box", { dark: theme === "dark" })}
              key={item._id}
            >
              <div className={cx("titleBox")}>
                <img src={logo} alt="logoMerchant" className={cx("logo")} />
                <div className={cx("line", { dark: theme === "dark" })} />
                <div className={cx("textTitle")}>
                  <p
                    className={cx("nameMerchant", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {item.shipperID ? item.shipperID.fullName : "N/A"}
                  </p>
                  <p className={cx("type", fontSize)}>
                    {item.description ? item.description : "N/A"}
                  </p>
                </div>
              </div>
              <div className={cx("line-bottom", { dark: theme === "dark" })} />
              <div className={cx("contentBox")}>
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
                    {item.accountHolder ? item.accountHolder : "N/A"}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faBuildingColumns}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.nameBank ? item.nameBank : "N/A"}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faWallet}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.numberBank ? item.numberBank : "N/A"}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlassDollar}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.amountTransantion ? item.amountTransantion : "N/A"}
                  </p>
                </div>
                {theme === "dark" ? (
                  <div className={cx("btn-detail", { dark: theme === "dark" })}>
                    <Button
                      detail_dark
                      onClick={() => {
                        handleWithdrawal(item._id);
                      }}
                    >
                           {t("withdrawalShipper.approval")}
                    </Button>
                  </div>
                ) : (
                  <div className={cx("btn-detail", { dark: theme === "dark" })}>
                    <Button
                      detail
                      onClick={() => {
                        handleWithdrawal(item._id);
                      }}
                    >
                           {t("withdrawalShipper.approval")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WithdrawalShipper;
