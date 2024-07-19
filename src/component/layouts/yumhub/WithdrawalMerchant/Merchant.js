import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import {
  faBuildingColumns,
  faMagnifyingGlass,
  faMagnifyingGlassDollar,
  faPerson,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import { useTheme } from "../../defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../defaultLayout/header/Settings/Context/FontSizeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";
import Button from "../../../buttons/index";
import classNames from "classnames/bind";
import styles from "./Merchant.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";

const cx = classNames.bind(styles);

function WithdrawalShipper() {
  const formatMoney = (number) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    });
    return formatter.format(number);
  }

  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  //list withdrawal merchant
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(
        "/merchants/listWithdrawalApproval"
      );
      setData(response.data.walletMerchant);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
          `merchants/findWithdrawalMerchant`,
          {
            keyword,
          }
        );
        if (response.data.result && response.data.walletMerchant.length > 0) {
          setData(response.data.walletMerchant);
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

  // xác nhận rút tiền merchant
  const handleWithdrawal = async (id) => {
    setLoading(true);
    try {
      Swal.fire({
        title: t("withdrawalMerchant.withdrawalMerchant"),
        text: t("withdrawalMerchant.subWithdrawalMerchant"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: t("withdrawalMerchant.yes"),
        cancelButtonText: t("withdrawalMerchant.no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await AxiosInstance.get(
            `merchants/withdrawalApproval?id=${id}`
          );
          if (response.data.result === false) {
            Swal.fire({
              icon: "info",
              title: t("withdrawalMerchant.swalTitleFail"),
              text: t("withdrawalMerchant.swalTextFail"),
            });
          } else {
            Swal.fire({
              icon: "success",
              title: t("withdrawalMerchant.swalTitleSuccess"),
              text: t("withdrawalMerchant.swalTextSuccess"),
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
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className={cx("container", { dark: theme === "dark" })}>
        <div className={cx("container-loading")}>
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      </div>
    );

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <div className={cx("content")}>
        <p className={cx("title", fontSize, { dark: theme === "dark" })}>
          {t("withdrawalMerchant.title")}
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
                    {item.merchantID ? item.merchantID.name : "N/A"}
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
                    {item.amountTransantion ? formatMoney(item.amountTransantion) : "N/A"}
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
                      {t("withdrawalMerchant.approval")}
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
                      {t("withdrawalMerchant.approval")}
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
