import React, { useState, useEffect } from "react";
import { ThreeDots, TailSpin } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import {
  faBicycle,
  faMagnifyingGlass,
  faMap,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import axios from "axios";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";
import AccountItemShipper from "../../../AccountItem/AccountShipper/AccountCustomer/AccountShipper";
import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./AddShipper.module.scss";
import ellipse from "../../../../assets/images/ellipse.png";
import noAvatar from "../../../../assets/images/noAvatar.png";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function AddShipper() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectShipperById, setSelectShipperId] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [brandBike, setBrandBike] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [idBike, setIdBike] = useState("");
  const [modeCode, setModeCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [gender, setGender] = useState([]);
  const [idCardFrontSide, setIdCardFrontSide] = useState([]);
  const [drivingLicenseFrontSide, setDrivingLicenseFrontSide] = useState([]);
  const [driverLicenseFrontSide, setDriverLicenseFrontSide] = useState([]);
  const [idCardBackSide, setIdCardBackSide] = useState([]);
  const [drivingLicenseBackSide, setDrivingLicenseBackSide] = useState([]);
  const [driverLicenseBackSide, setDriverLicenseBackSide] = useState([]);

  const [checkIDCard, setCheckIDCard] = useState(false); // nhấn nút check
  const [overAllIDCard, setOverAllIDCard] = useState(""); // hiển thị overAll(% căn cước)
  const [loadingIdCard, setLoadingIdCard] = useState(false); // hiển thị nút loading khi nhấn check
  const [checkDrivingLicense, setCheckDrivingLicense] = useState(false);
  const [overAllDrivingLicense, setOverAllDrivingLicense] = useState("");
  const [checkDriverLicense, setCheckDriverLicense] = useState(false);
  const [overAllDriverLicense, setOverAllDriverLicense] = useState("");
  const [loadingDriverLicense, setLoadingDriverLicense] = useState(false);

  // hiển thị chi tiết
  const selectDetail = async (id) => {
    setCheckIDCard(false);
    setOverAllIDCard(undefined);
    setCheckDrivingLicense(false);
    setOverAllDrivingLicense(undefined);
    setCheckDriverLicense(false);
    setOverAllDriverLicense(undefined);
    setLoading(true);
    try {
      setSearchResult([]);
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
      setLoading(false);
    }
  };

  //load data hiển thị lên modal
  useEffect(() => {
    if (selectShipperById) {
      setId(selectShipperById._id || "");
      setAddress(selectShipperById.address || "");
      setAvatar(selectShipperById.avatar || "");
      setBirthDay(selectShipperById.birthDay || "");
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
      setCheckedFields({
        image: false,
        fullName: false,
        address: false,
        email: false,
        phoneNumber: false,
        birthDay: false,
        brandBike: false,
        modeCode: false,
        idBike: false,
        idCard: false,
        drivingLicense: false,
        driverLicense: false,
        note: "",
      });
      setCheckDriverLicense(false);
      setCheckIDCard(false);
      setCheckDrivingLicense(false);
    }
  }, [selectShipperById]);

  //list shipper
  useEffect(() => {
    
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(
        "/shippers/listShipperApproval"
      );
      setData(response.data.listShipper);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
    setTippyVisible(true);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post(
          "/shippers/findApproveShipper",
          {
            keyword,
          }
        );
        if (response.data.result && response.data.shippers.length > 0) {
          setSearchResult(response.data.shippers);
          setTippyVisible(true);
          setData(response.data.shippers);
        } else {
          setData([]);
          setSearchResult([]);
          setTippyVisible(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResult([]);
        setTippyVisible(false);
      }
    } else {
      fetchData();
      setSearchResult([]);
      setTippyVisible(false);
    }
  };

  const [checkedFields, setCheckedFields] = useState({
    image: false,
    fullName: false,
    address: false,
    email: false,
    phoneNumber: false,
    birthDay: false,
    brandBike: false,
    modeCode: false,
    idBike: false,
    idCard: false,
    drivingLicense: false,
    driverLicense: false,
    note: "",
  });
  const allFieldsChecked = () => {
    return (
      checkedFields.image &&
      checkedFields.fullName &&
      checkedFields.address &&
      checkedFields.email &&
      checkedFields.phoneNumber &&
      checkedFields.birthDay &&
      checkedFields.brandBike &&
      checkedFields.modeCode &&
      checkedFields.idBike &&
      checkDrivingLicense &&
      checkIDCard &&
      checkDriverLicense &&
      checkedFields.idCard &&
      checkedFields.drivingLicense &&
      checkedFields.driverLicense
    );
  };
  const handleNoteChange = (event) => {
    const { value } = event.target;
    setCheckedFields((prevState) => ({
      ...prevState,
      note: value,
    }));
  };
  
  const handleCheckboxChange = (field) => {
    setCheckedFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  // từ chối shipper
  const handleReject = async () => {
    setLoading(true);
    try {
      const update = await AxiosInstance.patch(`shippers/reject?id=${id}`, {
        image: checkedFields.image,
        fullName: checkedFields.fullName,
        address: checkedFields.address,
        email: checkedFields.email,
        phoneNumber: checkedFields.phoneNumber,
        birthDay:  checkedFields.birthDay,
        brandBike: checkedFields.brandBike,
        modeCode: checkedFields.modeCode,
        idBike: checkedFields.idBike,
        idCard: checkedFields.idCard,
        driverLicense: checkedFields.driverLicense,
        vehicleCertificate: checkedFields.drivingLicense,
        note: checkedFields.note,
      });
      if (update.data.result === false) {
        setShowModal(false);
        Swal.fire({
          icon: "info",
          title: "Reject Failed",
          text: "There was an error reject the shipper!",
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Reject Successful",
          text: "The shipper has been successfully updated!",
        }).then(() => {
          fetchData();
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // xác nhận shipper
  const handleApproval = async (id) => {
    setLoading(true);
    try {
      const responseUpdate = await AxiosInstance.patch(
        `shippers/updateShipper?id=${id}`,
        { status: 3 }
      );

      const responseVerify = await AxiosInstance.post(
        "shippers/verifileShipper",
        { email: email }
      );

      if (
        responseUpdate.data.result === false &&
        responseVerify.data.result === false
      ) {
        setShowModal(false);
        Swal.fire({
          icon: "info",
          title: "Approval Failed",
          text: "There was an error approval the shipper!",
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Approval Successful",
          text: "The shipper has been successfully updated!",
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

  //check giấy tờ căn cước
  const handleCheckIDCard = async (imageUrl) => {
    try {
      setLoadingIdCard(true);
      const apiKey = "WTNAr9oCEk4rNkUCR7rhVAGfeNSjRHgM";
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
      console.log("response----", response);
      setOverAllIDCard(response.data.data[0].overall_score);
      setCheckIDCard(true);
    } catch (error) {
      console.log(checkIDCard);
      setOverAllIDCard(t("shipper.cannotCheck"));
      setCheckIDCard(true);
      console.error("Error checking ID card:", error);
    } finally {
      setLoadingIdCard(false);
    }
  };

  //check bằng lái xe
  const handleCheckDriverLicense = async (imageUrl) => {
    try {
      setLoadingDriverLicense(true);
      const apiKey = "WTNAr9oCEk4rNkUCR7rhVAGfeNSjRHgM";
      const apiUrl = "https://api.fpt.ai/vision/dlr/vnm";

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
      setOverAllDriverLicense(response.data.data[0].overall_score);
      setCheckDriverLicense(true);
    } catch (error) {
      setOverAllDriverLicense(t("shipper.cannotCheck"));
      setCheckDriverLicense(true);
      console.error("Error checking Driver License:", error);
    } finally {
      setLoadingDriverLicense(false);
    }
  };

  //check giấy tờ xe (cà vẹt)
  const handleCheckDrivingLicense = async () => {
    try {
      setOverAllDrivingLicense(t("shipper.cannotCheck"));
      setCheckDrivingLicense(true);
    } catch (error) {
      console.error("Error checking Driving License:", error);
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
          {t("shipper.awaitApproval")}
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
                placeholder={t("shipper.searchByName")}
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
                  src={item.avatar || noAvatar}
                  alt="logoShipper"
                  className={cx("logo")}
                />
                <div className={cx("line")} />

                <div className={cx("textTitle")}>
                  <p
                    className={cx("nameShipper", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {item.fullName}
                  </p>
                  <p className={cx("gender", fontSize)}>{item.sex}</p>
                </div>
              </div>
              <div className={cx("line-bottom", { dark: theme === "dark" })} />
              <div className={cx("contentBox")}>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faMap}
                    className={cx("icon", fontSize, { dark: theme === "dark" })}
                  />
                  <p
                    className={cx("textContent", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {item.address}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faBicycle}
                    className={cx("icon", fontSize, { dark: theme === "dark" })}
                  />
                  <p
                    className={cx("textContent", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {item.idBike}
                  </p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon
                    icon={faPalette}
                    className={cx("icon", fontSize, { dark: theme === "dark" })}
                  />
                  <p
                    className={cx("textContent", fontSize, {
                      dark: theme === "dark",
                    })}
                  >
                    {item.modeCode}
                  </p>
                </div>
              </div>
              {theme === "dark" ? (
                <div className={cx("btn-detail")}>
                  <Button
                    detail_dark
                    onClick={() => {
                      selectDetail(item._id);
                    }}
                  >
                    {t("shipper.detail")}
                  </Button>
                </div>
              ) : (
                <div className={cx("btn-detail")}>
                  <Button
                    detail
                    onClick={() => {
                      selectDetail(item._id);
                    }}
                  >
                    {t("shipper.detail")}
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
        contentLabel="Update Shipper"
        className={cx("modal")}
      >
        {selectShipperById && (
          <div className={cx("modal-container", { dark: theme === "dark" })}>
            <div className={cx("logo-shipper", { dark: theme === "dark" })}>
              <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
              <img src={avatar} alt="Shipper" className={cx("img-shipper")} />
              <input
                className={cx("checkbox", "checkImage")}
                type="checkbox"
                checked={checkedFields.image}
                onChange={() => handleCheckboxChange("image")}
              />
            </div>
            <div className={cx("content-modal")}>
              <Button awaiting>{t("shipper.await")}</Button>
              <div className={cx("container-content")}>
                <p className={cx("name-shipper", fontSize)}>{fullName}</p>
                <div className={cx("line", { dark: theme === "dark" })}></div>
                <p className={cx("gender-modal", fontSize)}>{gender}</p>
                <div className={cx("divcheckbox-name")}>
                  <input
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={checkedFields.fullName}
                    onChange={() => handleCheckboxChange("fullName")}
                  />
                </div>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-shipper", fontSize)}>
                  {t("shipper.address")}:
                </p>
                <p className={cx("content-shipper", fontSize)}>{address}</p>
                <div className={cx("divcheckbox")}>
                  <input
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={checkedFields.address}
                    onChange={() => handleCheckboxChange("address")}
                  />
                </div>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-shipper", fontSize)}>
                  {t("shipper.email")}:
                </p>
                <p className={cx("content-shipper", fontSize)}>{email}</p>
                <div className={cx("divcheckbox")}>
                  <input
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={checkedFields.email}
                    onChange={() => handleCheckboxChange("email")}
                  />
                </div>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-shipper", fontSize)}>
                  {t("shipper.phone")}:
                </p>
                <p className={cx("content-shipper", fontSize)}>{phoneNumber}</p>
                <div className={cx("divcheckbox")}>
                  <input
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={checkedFields.phoneNumber}
                    onChange={() => handleCheckboxChange("phoneNumber")}
                  />
                </div>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-shipper", fontSize)}>
                  {t("shipper.birthDay")}:
                </p>
                <p className={cx("content-shipper", fontSize)}>{birthDay}</p>
                <div className={cx("divcheckbox")}>
                  <input
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={checkedFields.birthDay}
                    onChange={() => handleCheckboxChange("birthDay")}
                  />
                </div>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-shipper", fontSize)}>
                  {t("shipper.motorbikeBrand")}:
                </p>
                <p className={cx("content-shipper", fontSize)}>{brandBike}</p>
                <div className={cx("divcheckbox")}>
                  <input
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={checkedFields.brandBike}
                    onChange={() => handleCheckboxChange("brandBike")}
                  />
                </div>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-shipper", fontSize)}>
                  {t("shipper.motorbikeColor")}:
                </p>
                <p className={cx("content-shipper", fontSize)}>{modeCode}</p>
                <div className={cx("divcheckbox")}>
                  <input
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={checkedFields.modeCode}
                    onChange={() => handleCheckboxChange("modeCode")}
                  />
                </div>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-shipper", fontSize)}>
                  {t("shipper.numberPlate")}:
                </p>
                <p className={cx("content-shipper", fontSize)}>{idBike}</p>
                <div className={cx("divcheckbox")}>
                  <input
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={checkedFields.idBike}
                    onChange={() => handleCheckboxChange("idBike")}
                  />
                </div>
              </div>
              <div className={cx("wrapper-image-content")}>
                <div className={cx("wrapper-title-document")}>
                  <p className={cx("title-shipper", fontSize)}>
                    {t("shipper.idCard")}:
                  </p>
                  {!checkIDCard && (
                    <div
                      className={cx("btn-check")}
                      onClick={() => handleCheckIDCard(idCardFrontSide)}
                    >
                      <p className={cx("text-check")}>{t("shipper.check")}</p>
                    </div>
                  )}
                </div>
                <input
                  className={cx("checkbox")}
                  type="checkbox"
                  checked={checkedFields.idCard}
                  onChange={() => handleCheckboxChange("idCard")}
                />
                <div className={cx("wrapper-document")}>
                  <img
                    src={idCardFrontSide}
                    alt="Document Front Side"
                    className={cx("image-document")}
                  />
                  <img
                    src={idCardBackSide}
                    alt="Document Back Side"
                    className={cx("image-document")}
                  />
                  {loadingIdCard && (
                    <div className={cx("wrapper-loading")}>
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
                      {overAllIDCard === t("shipper.cannotCheck") ? (
                        t("shipper.cannotCheck")
                      ) : (
                        <>
                          Overall:
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

              <div className={cx("wrapper-image-content")}>
                <div className={cx("wrapper-title-document")}>
                  <p className={cx("title-shipper", fontSize)}>
                    {t("shipper.drivingLicense")}:
                  </p>
                  {!checkDrivingLicense && (
                    <div
                      className={cx("btn-check dp-n")}
                      onClick={() => handleCheckDrivingLicense()}
                    >
                      <p className={cx("text-check")}>{t("shipper.check")}</p>
                    </div>
                  )}
                </div>
                <input
                  className={cx("checkbox")}
                  type="checkbox"
                  checked={checkedFields.drivingLicense}
                  onChange={() => handleCheckboxChange("drivingLicense")}
                />
                <div className={cx("wrapper-document")}>
                  <img
                    src={drivingLicenseFrontSide}
                    alt="Document Front Side"
                    className={cx("image-document")}
                  />
                  <img
                    src={drivingLicenseBackSide}
                    alt="Document Back Side"
                    className={cx("image-document")}
                  />
                  {checkDrivingLicense ? (
                    <h2 className={cx("text-overAll-id-card")}>
                      {overAllDrivingLicense === t("shipper.cannotCheck") ? (
                        t("shipper.cannotCheck")
                      ) : (
                        <>
                          Overall:
                          <span
                            style={{
                              color:
                                parseFloat(overAllDrivingLicense) < 80
                                  ? "red"
                                  : "green",
                              marginLeft: "10px",
                            }}
                          >
                            {overAllDrivingLicense}
                          </span>
                        </>
                      )}
                    </h2>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className={cx("wrapper-image-content")}>
                <div className={cx("wrapper-title-document")}>
                  <p className={cx("title-shipper", fontSize)}>
                    {t("shipper.driverLicense")}:
                  </p>
                  {!checkDriverLicense && (
                    <div
                      className={cx("btn-check")}
                      onClick={() =>
                        handleCheckDriverLicense(driverLicenseFrontSide)
                      }
                    >
                      <p className={cx("text-check")}>{t("shipper.check")}</p>
                    </div>
                  )}
                </div>
                <input
                  className={cx("checkbox")}
                  type="checkbox"
                  checked={checkedFields.driverLicense}
                  onChange={() => handleCheckboxChange("driverLicense")}
                />
                <div className={cx("wrapper-document")}>
                  <img
                    src={driverLicenseFrontSide}
                    alt="Document Front Side"
                    className={cx("image-document")}
                  />
                  <img
                    src={driverLicenseBackSide}
                    alt="Document Back Side"
                    className={cx("image-document")}
                  />
                  {loadingDriverLicense && (
                    <div className={cx("wrapper-loading")}>
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
                  {checkDriverLicense ? (
                    <h2 className={cx("text-overAll-id-card")}>
                      {overAllDriverLicense === t("shipper.cannotCheck") ? (
                        t("shipper.cannotCheck")
                      ) : (
                        <>
                          Overall:
                          <span
                            style={{
                              color:
                                parseFloat(overAllDriverLicense) < 80
                                  ? "red"
                                  : "green",
                              marginLeft: "10px",
                            }}
                          >
                            {overAllDriverLicense}%
                          </span>
                        </>
                      )}
                    </h2>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className={cx("wrapper-footer")}>
                <div>
                  <input
                    className={cx("textbox")}
                    type="text"
                    placeholder={t("shipper.note")}
                    value={checkedFields.note}
                    onChange={handleNoteChange}
                  />
                </div>
                <div>
                  {allFieldsChecked() ? (
                    <div className={cx("approval-btn")}>
                      <Button
                        approve_btn={allFieldsChecked()}
                        onClick={() => handleApproval(id)}
                      >
                        {t("shipper.approval")}
                      </Button>
                    </div>
                  ) : (
                    <div className={cx("reject-btn")}>
                      {" "}
                      <Button
                        approve_btn={allFieldsChecked()}
                        onClick={() => handleReject()}
                      >
                        {t("shipper.reject")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AddShipper;
