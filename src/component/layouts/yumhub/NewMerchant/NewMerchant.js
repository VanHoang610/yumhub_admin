import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AxiosInstance from "../../../../utils/AxiosInstance";
import Button from "../../../buttons/index";
import AccountItemMerchant from "../../../AccountItem/AccountMerchant/AccountCustomer/AccountMerchant";
import {
  faClock,
  faMagnifyingGlass,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./NewMerchant.module.scss";
import noAvatar from "../../../../assets/images/noAvatar.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);
function NewMerchant() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const [data, setData] = useState([]);
  const [selectMerchantById, setSelectMerchantId] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);

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
  const [checkIDCard, setCheckIDCard] = useState(false);
  const [checkBusinessLicense, setCheckBusinessLicense] = useState(false);
  const [overAllIDCard, setOverAllIDCard] = useState();
  const [messageBusiness, setMessageBusiness] = useState();
  const [loading, setLoading] = useState(false);

  // hiển thị chi tiết
  const selectDetail = async (id) => {
    try {
      setCheckIDCard(false);
      setCheckBusinessLicense(false);
      setOverAllIDCard(undefined);
      setMessageBusiness(undefined);
      setSearchResult([]);
      const response = await AxiosInstance.get(
        `merchants/getMerchantById/?id=${id}`
      );
      const { detailMerchant } = response.data;
      if (detailMerchant) {
        setSelectMerchantId(detailMerchant);
        setShowModal(true);
        console.log(document);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //load data hiển thị lên modal
  useEffect(() => {
    if (selectMerchantById) {
      setId(selectMerchantById._id || "");
      setName(selectMerchantById.name || "");
      setAvatar(
        selectMerchantById.imageBackground
          ? selectMerchantById.imageBackground
          : image_merchant
      );
      setAddress(selectMerchantById.address || "");
      setCloseTime(selectMerchantById.closeTime || "");
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
      setEmail(selectMerchantById.user ? selectMerchantById.user.email : "");
      setType(selectMerchantById.type ? selectMerchantById.type.name : ""); // show type
    }
  }, [selectMerchantById]);

  console.log(selectMerchantById);
  //list mercahnt
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(
          "/merchants/listMerchantApproval"
        );
        setData(response.data.listMerchantApproval);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post(
          "/merchants/findApproveMerchant",
          {
            keyword,
          }
        );
        console.log(response);
        if (response.data.result && response.data.merchants.length > 0) {
          setSearchResult(response.data.merchants);
          setTippyVisible(true);
        } else {
          setSearchResult([]);
          setTippyVisible(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResult([]);
        setTippyVisible(false);
      }
    } else {
      setSearchResult([]);
      setTippyVisible(false);
    }
  };

  // xác nhận merchant
  const handleApproval = async (id) => {
    try {
      const response = await AxiosInstance.patch(
        `merchants/updateMerchant?id=${id}`,
        { status: 3 }
      );
      if (response.data.result === false) {
        setShowModal(false);
        Swal.fire({
          icon: "info",
          title: "Approval Failed",
          text: "There was an error updating the merchant!",
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Approval Successful",
          text: "The merchant has been successfully updated!",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //check giấy tờ căn cước
  const handleCheckIDCard = async (imageUrl) => {
    try {
      setLoading(true);
      const apiKey = "a898FrZpkeYGYYPfz046hRervrSm2woD";
      const apiUrl = "https://api.fpt.ai/vision/idr/vnm";

      // Gửi FormData đến API
      const response = await axios.post(
        apiUrl,
        { image_url: imageUrl },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "api-key": apiKey,
          },
        }
      );
      setOverAllIDCard(response.data.data[0].overall_score);
      setCheckIDCard(true);
    } catch (error) {
      console.log(overAllIDCard);
      console.log(checkIDCard);
      setOverAllIDCard(t("merchant.cannotCheck"));
      setCheckIDCard(true);
      console.error("Error checking ID card:", error);
    } finally {
      setLoading(false);
    }
  };

  //check giấy phép kinh doanh
  const handleCheckBusinessLicense = async () => {
    try {
      setMessageBusiness(t("merchant.cannotCheck"));
      setCheckBusinessLicense(true);
    } catch (error) {}
  };

  return (
    <div className={cx("container", { dark: theme === "dark" })}>
      <div className={cx("content")}>
        <p className={cx("title", fontSize, { dark: theme === "dark" })}>
          {t("merchant.awaitApproval")}
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
                            theme
                            key={merchant._id}
                            merchant={merchant}
                            handleView={selectDetail}
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
        <div className={cx("grid-container")}>
          {data.map((item) => (
            <div
              className={cx("box", { dark: theme === "dark" })}
              key={item._id}
            >
              <div className={cx("titleBox")}>
                <img
                  src={item.imageBackground ? item.imageBackground : noAvatar}
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
                    {item.name}
                  </p>
                  <p className={cx("type", fontSize)}>
                    {item.type ? item.type.name : "N/A"}
                  </p>
                </div>
              </div>
              <div className={cx("line-bottom", { dark: theme === "dark" })} />
              <div className={cx("contentBox")}>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faMap}
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
                    icon={faClock}
                    className={cx("icon", { dark: theme === "dark" })}
                  />
                  <p
                    className={cx(
                      "textContent",
                      { dark: theme === "dark" },
                      fontSize
                    )}
                  >
                    {item.openTime}
                  </p>
                </div>
              </div>
              {theme === "dark" ? (
                <div className={cx("btn-detail", { dark: theme === "dark" })}>
                  <Button
                    detail_dark
                    onClick={() => {
                      selectDetail(item._id);
                    }}
                  >
                    {t("merchant.detail")}
                  </Button>
                </div>
              ) : (
                <div className={cx("btn-detail", { dark: theme === "dark" })}>
                  <Button
                    detail
                    onClick={() => {
                      selectDetail(item._id);
                    }}
                  >
                    {t("merchant.detail")}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Update Merchant"
        className={cx("modal")}
      >
        {selectMerchantById && (
          <div className={cx("modal-container", { dark: theme === "dark" })}>
            <div className={cx("logo-merchant", { dark: theme === "dark" })}>
              <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
              <img
                src={avatar ? avatar : image_merchant}
                alt="Merchant"
                className={cx("img-merchant")}
              />
            </div>
            <div className={cx("content-modal")}>
              <Button awaiting> {t("merchant.await")}</Button>
              <div className={cx("container-content")}>
                <p className={cx("name-merchant", fontSize)}>{name}</p>
                <div className={cx("line", { dark: theme === "dark" })}></div>
                <p className={cx("type-merchant", fontSize)}>{type}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant", fontSize)}>
                  {" "}
                  {t("merchant.address")}:
                </p>
                <p className={cx("content-merchant", fontSize)}>{address}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant", fontSize)}>
                  {" "}
                  {t("merchant.email")}:
                </p>
                <p className={cx("content-merchant", fontSize)}>{email}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant", fontSize)}>
                  {" "}
                  {t("merchant.storeOwner")}:
                </p>
                <p className={cx("content-merchant", fontSize)}>{fullName}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant", fontSize)}>
                  {" "}
                  {t("merchant.phone")}:
                </p>
                <p className={cx("content-merchant", fontSize)}>
                  {phoneNumber}
                </p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant", fontSize)}>
                  {" "}
                  {t("merchant.openTime")}:
                </p>
                <p className={cx("content-merchant", fontSize)}>{openTime}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant", fontSize)}>
                  {" "}
                  {t("merchant.closeTime")}:
                </p>
                <p className={cx("content-merchant", fontSize)}>{closeTime}</p>
              </div>
              <div>
                {idCardDocuments.map((doc, index) => (
                  <div key={index} className={cx("wrapper-image-content")}>
                    <div className={cx("wrapper-title-document")}>
                      <p className={cx("title-merchant", fontSize)}>
                        {t("merchant.idCard")}:
                      </p>
                      <div
                        className={cx("btn-check")}
                        onClick={() => handleCheckIDCard(doc.imageFontSide)}
                      >
                        <p className={cx("text-check")}>
                          {" "}
                          {t("merchant.check")}
                        </p>
                      </div>
                    </div>
                    <div className={cx("wrapper-document")}>
                      <img
                        src={doc.imageFontSide}
                        alt="Document Front Side"
                        className={cx("image-id-card-document")}
                      />
                      <img
                        src={doc.imageBackSide}
                        alt="Document Front Side"
                        className={cx("image-id-card-document")}
                      />
                      {loading && (
                        <div className={cx("wrapper-loading")}>
                          <span className={cx("text-loading")}>
                            Đang loading...
                          </span>
                          <TailSpin
                            height="40"
                            width="40"
                            color="#4bc2e6"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                          />
                        </div>
                      )}
                      {checkIDCard ? (
                        <h2 className={cx("text-overAll-id-card")}>
                          {overAllIDCard === t("merchant.cannotCheck") ? (
                            t("merchant.cannotCheck")
                          ) : (
                            <>
                              {t("merchant.overAll")}:
                              <span
                                style={{
                                  color:
                                    parseFloat(overAllIDCard) < 80
                                      ? "red"
                                      : "green",
                                  marginLeft: "10px",
                                }}
                              >
                                {overAllIDCard}%
                              </span>
                            </>
                          )}
                        </h2>
                      ) : (
                        ""
                      )}
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
                      <div
                        className={cx("btn-check")}
                        onClick={() => handleCheckBusinessLicense()}
                      >
                        <p className={cx("text-check")}>
                          {" "}
                          {t("merchant.check")}
                        </p>
                      </div>
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
                      {checkBusinessLicense ? (
                        <h2 className={cx("text-overAll-id-card")}>
                          {messageBusiness}
                        </h2>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={cx("btn-delete")}>
                <Button approve_btn onClick={() => handleApproval(id)}>
                  {t("merchant.approval")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default NewMerchant;
