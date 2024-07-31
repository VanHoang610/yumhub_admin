import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThreeDots } from "react-loader-spinner";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react/headless";
import Modal from "react-modal";
import Swal from "sweetalert2";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";
import AccountItemShipper from "../../../AccountItem/AccountShipper/AccountCustomer/AccountShipper";
import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./DeletedShipper.module.scss";
import ellipse from "../../../../assets/images/ellipse.png";

const cx = classNames.bind(styles);

function DeletedShipper() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN"); 
  };

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([{}]);
  const [selectShipperById, setSelectShipperId] = useState({});
  const [id, setId] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [birthDay, setBirthDay] = useState(new Date());
  const [brandBike, setBrandBike] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [idBike, setIdBike] = useState("");
  const [modeCode, setModeCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [gender, setGender] = useState([]);
  const [idCardFrontSide, setIdCardFrontSide] = useState({});
  const [drivingLicenseFrontSide, setDrivingLicenseFrontSide] = useState({});
  const [driverLicenseFrontSide, setDriverLicenseFrontSide] = useState({});
  const [idCardBackSide, setIdCardBackSide] = useState({});
  const [drivingLicenseBackSide, setDrivingLicenseBackSide] = useState({});
  const [driverLicenseBackSide, setDriverLicenseBackSide] = useState({});

  //gọi api allshipper đã xóa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(
          "shippers/listShipperIsDeleted"
        );
        const shippers = response.data.deletedShipper;
        setData(shippers);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // nhấn xem chi tiết
  const handleView = async (id) => {
    setLoading(true);
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(
        `shippers/getShipperById/?id=${id}`
      );
      const { detailShipper } = response.data;
      if (detailShipper) {
        setSelectShipperId(detailShipper);
        setShowModal(true);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);}
  };

  useEffect(() => {
    if (selectShipperById) {
      setId(selectShipperById._id || "");
      setAddress(selectShipperById.address || "");
      setAvatar(selectShipperById.avatar || "");
      setBirthDay(new Date(selectShipperById.birthDay) || "");
      setBrandBike(selectShipperById.brandBike || "");
      setEmail(selectShipperById.email || "");
      setFullName(selectShipperById.fullName || "");
      setIdBike(selectShipperById.idBike || "");
      setModeCode(selectShipperById.modeCode || "");
      setPhoneNumber(selectShipperById.phoneNumber || "");
      setGender(selectShipperById.sex || "");
      setIdCardFrontSide(
        selectShipperById.idCard ? selectShipperById.idCard.front : ""
      );
      setDriverLicenseFrontSide(
        selectShipperById.driverLicense
          ? selectShipperById.driverLicense.front
          : ""
      );
      setDrivingLicenseFrontSide(
        selectShipperById.vehicleCertificate
          ? selectShipperById.vehicleCertificate.front
          : ""
      );

      setIdCardBackSide(
        selectShipperById.idCard ? selectShipperById.idCard.back : ""
      );
      setDriverLicenseBackSide(
        selectShipperById.driverLicense
          ? selectShipperById.driverLicense.back
          : ""
      );
      setDrivingLicenseBackSide(
        selectShipperById.vehicleCertificate
          ? selectShipperById.vehicleCertificate.back
          : ""
      );
    }
  }, [selectShipperById]);

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
  };
  const handleReactive = async (id) => {
    setLoading(true);
    try {
      const responseRecovery = await AxiosInstance.post(
        `shippers/data-recovery-Shipper?id=${id}`
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


  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post(
          "/shippers/findDeletedShipper",
          {
            keyword,
          }
        );
        console.log(response);
        if (response.data.result && response.data.shippers.length > 0) {
          setSearchResult(response.data.shippers);
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
          {t("shipper.allDeletedShipper")}
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
                      {t("shipper.accounts")}
                    </h4>
                    {searchResult.length > 0
                      ? searchResult.map((shipper) => (
                          <AccountItemShipper
                            key={shipper._id}
                            shipper={shipper}
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
                placeholder={t("shipper.searchByName")}
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
                <th>{t("shipper.name")}</th>
                <th>{t("shipper.address")}</th>
                <th>{t("shipper.numberPlate")}</th>
                <th>{t("shipper.avatar")}</th>
                <th>{t("shipper.actions")}</th>
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
                  <td>{item.fullName}</td>
                  <td>{item.address}</td>
                  <td>{item.idBike}</td>
                  <td>
                    <img
                      src={item.avatar}
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
            contentLabel="Update shipper"
            className={cx("modal")}
          >
            {selectShipperById && (
              <div
                className={cx("modal-container", { dark: theme === "dark" })}
              >
                <div className={cx("logo-shipper", { dark: theme === "dark" })}>
                  <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                  <img
                    src={avatar}
                    alt="shipper"
                    className={cx("img-shipper")}
                  />
                </div>
                <div className={cx("content-modal")}>
                  <Button awaiting>{t("shipper.deleted")}</Button>
                  <div className={cx("container-content")}>
                    <p className={cx("name-shipper", fontSize)}>{fullName}</p>
                    <div
                      className={cx("line", { dark: theme === "dark" })}
                    ></div>
                    <p className={cx("text-gender", fontSize)}>{gender}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-shipper", fontSize)}>
                      {t("shipper.address")}:
                    </p>
                    <p className={cx("content-shipper", fontSize)}>{address}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-shipper", fontSize)}>
                      {t("shipper.email")}:
                    </p>
                    <p className={cx("content-shipper", fontSize)}>{email}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-shipper", fontSize)}>
                      {t("shipper.phone")}:
                    </p>
                    <p className={cx("content-shipper", fontSize)}>
                      {phoneNumber}
                    </p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-shipper", fontSize)}>
                      {t("shipper.birthDay")}:
                    </p>
                    <p className={cx("content-shipper", fontSize)}>
                      {formatDate(birthDay)}
                    </p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-shipper", fontSize)}>
                      {t("shipper.numberPlate")}:
                    </p>
                    <p className={cx("content-shipper", fontSize)}>{idBike}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-shipper", fontSize)}>
                      {t("shipper.motorbikeBrand")}:
                    </p>
                    <p className={cx("content-shipper", fontSize)}>
                      {brandBike}
                    </p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-shipper", fontSize)}>
                      {t("shipper.motorbikeColor")}:
                    </p>
                    <p className={cx("content-shipper", fontSize)}>
                      {modeCode}
                    </p>
                  </div>
                  <div className={cx("wrapper-image-content")}>
                    <div className={cx("wrapper-title-document")}>
                      <p className={cx("title-shipper", fontSize)}>
                        {t("shipper.idCard")}:
                      </p>
                    </div>
                    <div className={cx("wrapper-document")}>
                      <img
                        src={idCardFrontSide}
                        alt="Document Front Side"
                        className={cx("image-document")}
                      />
                      <img
                        src={idCardBackSide}
                        alt="Document Front Side"
                        className={cx("image-document")}
                      />
                    </div>
                  </div>
                  <div className={cx("wrapper-image-content")}>
                    <div className={cx("wrapper-title-document")}>
                      <p className={cx("title-shipper", fontSize)}>
                        {t("shipper.drivingLicense")}:
                      </p>
                    </div>
                    <div className={cx("wrapper-document")}>
                      <img
                        src={drivingLicenseFrontSide}
                        alt="Document Front Side"
                        className={cx("image-document")}
                      />
                      <img
                        src={drivingLicenseBackSide}
                        alt="Document Front Side"
                        className={cx("image-document")}
                      />
                    </div>
                  </div>
                  <div className={cx("wrapper-image-content")}>
                    <div className={cx("wrapper-title-document")}>
                      <p className={cx("title-shipper", fontSize)}>
                        {t("shipper.driverLicense")}:
                      </p>
                    </div>
                    <div className={cx("wrapper-document")}>
                      <img
                        src={driverLicenseFrontSide}
                        alt="Document Front Side"
                        className={cx("image-document")}
                      />
                      <img
                        src={driverLicenseBackSide}
                        alt="Document Front Side"
                        className={cx("image-document")}
                      />
                    </div>
                  </div>
                  <div className={cx("btn-Reactive")}>
                    <Button approve_btn onClick={() => handleReactive(id)}>
                      {t("shipper.reactive")}
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

export default DeletedShipper;
