import React, { useState, useEffect } from "react";
import { faEye, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";
import AccountItemMerchant from "../../../AccountItem/AccountMerchant/AccountCustomer/AccountMerchant";
import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./DeletedMerchant.module.scss";
import noAvatar from "../../../../assets/images/noAvatar.png";
import ellipse from "../../../../assets/images/ellipse.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";

const cx = classNames.bind(styles);

function DeletedMerchant() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);
  const [selectMerchantById, setSelectMerchantId] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [idCardDocuments, setIdCardDocuments] = useState([]);
  const [licenseDriverDocuments, setLicenseDriverDocuments] = useState([]);

  //gọi api allMerchant đã xóa
  useEffect(() => {
    
    fetchData();
  }, []);
  setLoading(true);
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(
          "merchants/getAllDeletedMerchant"
        );
        const merchants = response.data.merchants;
        setData(merchants);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleReactive = async (id) => {
    setLoading(true);
    try {
      const responseRecovery = await AxiosInstance.post(
        `merchants/data-recovery-Merchant?id=${id}`
      );
      if (responseRecovery.data.result === false) {
        setShowModal(false);
        Swal.fire({
          icon: "info",
          title: "Recovery Data Failed",
          text: "There was an error Recovery Data the merchant!",
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Recovery Data Successful",
          text: "The merchant has been successfully data restored!",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {  
    setLoading(true);
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(
        `merchants/getMerchantById?id=${id}`
      );
      const { detailMerchant } = response.data;
      if (detailMerchant) {
        setSelectMerchantId(detailMerchant);
        setShowModal(true);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //load data lên màn hình modal
  useEffect(() => {
    if (selectMerchantById) {
      setId(selectMerchantById._id || "");
      setName(selectMerchantById.name || "");
      setAddress(selectMerchantById.address || "");
      setCloseTime(selectMerchantById.closeTime || "");
      setAvatar(selectMerchantById.imageBackground || noAvatar);
      setOpenTime(selectMerchantById.openTime || "");
      setPhoneNumber(
        selectMerchantById.user ? selectMerchantById.user.phoneNumber : ""
      );
      setFullName(
        selectMerchantById.user ? selectMerchantById.user.fullName : ""
      );
      const filteredDocuments = selectMerchantById.document || [];
      setIdCardDocuments(
        filteredDocuments.filter((doc) => doc.documentTypeID.name === "ID Card")
      );
      setLicenseDriverDocuments(
        filteredDocuments.filter(
          (doc) => doc.documentTypeID.name === "Business License"
        )
      );
      setEmail(selectMerchantById.user ? selectMerchantById.user.email : "N/A");
      setType(selectMerchantById.type ? selectMerchantById.type.name : "N/A");
    }
  }, [selectMerchantById]);

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
    setTippyVisible(false);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post(
          "/merchants/findDeletedMerchant",
          {
            keyword,
          }
        );
        if (response.data.result && response.data.merchants.length > 0) {
          setSearchResult(response.data.merchants);
          setTippyVisible(true);
          setData(response.data.merchants);
        } else {
          setSearchResult([]);
          setTippyVisible(false);
          setData([]);
        }
      } catch (error) {
        setSearchResult([]);
        setTippyVisible(false);
      }
    } else {
      setSearchResult([]);
      setTippyVisible(false);
      fetchData();
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
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
          {t("merchant.allDeletedMerchant")}
        </p>
        <div>
          <Tippy
            animation="fade"
            interactive
            placement="bottom"
            onClickOutside={handleClickOutSide}
            visible={tippyVisible}
            render={(attrs) => (
              <div
                tabIndex="-1"
                {...attrs}
                className={cx("search-result", { dark: theme === "dark" })}
              >
                {searchResult.length > 0 && (
                  <ProperWrapper>
                    <h4 className={cx("search-title", fontSize)}>
                      {t("merchant.accounts")}
                    </h4>
                    {searchResult.length > 0
                      ? searchResult.map((merchant) => (
                          <AccountItemMerchant
                            key={merchant._id}
                            merchant={merchant}
                            handleView={handleView}
                          />
                        ))
                      : setTippyVisible(false)}
                  </ProperWrapper>
                )}
              </div>
            )}
          >
            <div className={cx("inputSearch", { dark: theme === "dark" })}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={cx("icon-search")}
              />
              <input
                className={cx("input", { dark: theme === "dark" })}
                placeholder={t("merchant.searchByName")}
                onChange={handleSearch}
              />
            </div>
          </Tippy>
        </div>
        <div className={cx("line-background")} />
        <div className={cx("box-container", { dark: theme === "dark" })}>
          <table className={cx("table", fontSize, { dark: theme === "dark" })}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("merchant.name")}</th>
                <th>{t("merchant.address")}</th>
                <th>{t("merchant.time")}</th>
                <th>{t("merchant.image")}</th>
                <th>{t("merchant.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cx("table-row", { dark: theme === "dark" })}
                  onClick={() => handleView(item._id)}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.openTime}</td>
                  <td>
                    <img
                      src={item.imageBackground}
                      alt={`${item.name} logo`}
                      className={cx("logo")}
                    />
                  </td>
                  <td>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal
            isOpen={showModal}
            onRequestClose={handleModalClose}
            contentLabel="Update Merchant"
            className={cx("modal")}
          >
            {selectMerchantById && (
              <div
                className={cx("modal-container", { dark: theme === "dark" })}
              >
                <div
                  className={cx("logo-merchant", { dark: theme === "dark" })}
                >
                  <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                  <img
                    src={avatar || image_merchant}
                    alt="Merchant"
                    className={cx("img-merchant")}
                  />
                </div>
                <div className={cx("content-modal")}>
                  <Button awaiting>{t("merchant.deleted")}</Button>
                  <div className={cx("container-content")}>
                    <p className={cx("name-merchant", fontSize)}>{name}</p>
                    <div
                      className={cx("line", { dark: theme === "dark" })}
                    ></div>
                    <p className={cx("type-merchant", fontSize)}>{type}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant", fontSize)}>
                      {t("merchant.address")}:
                    </p>
                    <p className={cx("content-merchant", fontSize)}>
                      {address}
                    </p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant", fontSize)}>
                      {t("merchant.email")}:
                    </p>
                    <p className={cx("content-merchant", fontSize)}>{email}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant", fontSize)}>
                      {t("merchant.storeOwner")}:
                    </p>
                    <p className={cx("content-merchant", fontSize)}>
                      {fullName}
                    </p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant", fontSize)}>
                      {t("merchant.phone")}:
                    </p>
                    <p className={cx("content-merchant", fontSize)}>
                      {phoneNumber}
                    </p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant", fontSize)}>
                      {t("merchant.openTime")}:
                    </p>
                    <p className={cx("content-merchant", fontSize)}>
                      {openTime}
                    </p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant", fontSize)}>
                      {t("merchant.closeTime")}:
                    </p>
                    <p className={cx("content-merchant", fontSize)}>
                      {closeTime}
                    </p>
                  </div>
                  <div>
                    {idCardDocuments.map((doc, index) => (
                      <div key={index} className={cx("wrapper-image-content")}>
                        <div className={cx("wrapper-title-document")}>
                          <p className={cx("title-merchant", fontSize)}>
                            {t("merchant.idCard")}:
                          </p>
                        </div>
                        <div className={cx("wrapper-document")}>
                          <img
                            src={doc.imageFontSide}
                            alt="Document Front Side"
                            className={cx("image-document")}
                          />
                          <img
                            src={doc.imageBackSide}
                            alt="Document Front Side"
                            className={cx("image-document")}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {licenseDriverDocuments.map((doc, index) => (
                      <div key={index} className={cx("wrapper-image-content")}>
                        <div className={cx("wrapper-title-document")}>
                          <p className={cx("title-merchant", fontSize)}>
                            {t("merchant.businessLicense")}:
                          </p>
                        </div>
                        <div className={cx("wrapper-document")}>
                          <img
                            src={doc.imageFontSide}
                            alt="Document Front Side"
                            className={cx("image-document")}
                          />
                          <img
                            src={doc.imageBackSide}
                            alt="Document Front Side"
                            className={cx("image-document")}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={cx("btn-Reactive")}>
                    <Button approve_btn onClick={() => handleReactive(id)}>
                      {t("merchant.reactive")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default DeletedMerchant;
