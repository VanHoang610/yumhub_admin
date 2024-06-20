import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TailSpin } from "react-loader-spinner";
import Modal from "react-modal";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  faBicycle,
  faMagnifyingGlass,
  faMap,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AxiosInstance from "../../../../utils/AxiosInstance";
import AccountItemShipper from "../../../AccountItem/AccountShipper/AccountCustomer/AccountShipper";
import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./AddShipper.module.scss";
import ellipse from "../../../../assets/images/ellipse.png";
import logo from "../../../../assets/images/logoYumhub.png";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function AddShipper() {
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
  const [joinDay, setJoinDay] = useState("");
  const [modeCode, setModeCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [gender, setGender] = useState([]);
  const [idCardFrontSide, setIdCardFrontSide] = useState([]);
  const [drivingLicenseFrontSide, setDrivingLicenseFrontSide] = useState([]);
  const [driverLicenseFrontSide, setDriverLicenseFrontSide] = useState([]);
  const [idCardBackSide, setIdCardBackSide] = useState([]);
  const [drivingLicenseBackSide, setDrivingLicenseBackSide] = useState([]);
  const [driverLicenseBackSide, setDriverLicenseBackSide] = useState([]);

  const [checkIDCard, setCheckIDCard] = useState(false);  // nhấn nút check
  const [overAllIDCard, setOverAllIDCard] = useState(""); // hiển thị overAll(% căn cước)
  const [loadingIdCard, setLoadingIdCard] = useState(false); // hiển thị nút loading khi nhấn check
  const [checkDrivingLicense, setCheckDrivingLicense] = useState(false);
  const [overAllDrivingLicense, setOverAllDrivingLicense] = useState("");
  const [checkDriverLicense, setCheckDriverLicense] = useState(false);
  const [overAllDriverLicense, setOverAllDriverLicense] = useState("");
  const [loadingDriverLicense, setLoadingDriverLicense] = useState(false);

  // hiển thị chi tiết
  const selectDetail = async (id) => {
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
      setJoinDay(selectShipperById.joinDay || "");
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

  //list shipper
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(
          "/shippers/listShipperApproval"
        );
        setData(response.data.listShipper);
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
          "/shippers/findApproveShipper",
          {
            keyword,
          }
        );
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

  // xác nhận merchant
  const handleApproval = async (id) => {
    try {
      const responseUpdate = await AxiosInstance.patch(
        `shippers/updateShipper?id=${id}`,
        { status: 3 }
      );

      const responseVerify = await AxiosInstance.post(
        "shippers/verifileShipper",
        { email: email }
      );
      console.log(responseUpdate, responseVerify);
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
    }
  };

  //check giấy tờ căn cước
  const handleCheckIDCard = async (imageUrl) => {
    try {
      setLoadingIdCard(true);
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
      setOverAllIDCard("Cannot check");
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
      const apiKey = "Y3n5OWk2LJukIzk08KGDipA5oIwzW73V";
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
      setOverAllDriverLicense("Cannot check");
      setCheckDriverLicense(true);
      console.error("Error checking Driver License:", error);
    } finally {
      setLoadingDriverLicense(false);
    }
  };

   //check giấy tờ xe (cà vẹt)
   const handleCheckDrivingLicense = async () => {
    try {
      setOverAllDrivingLicense("Cannot check");
      setCheckDrivingLicense(true);
    } catch (error) {
      console.error("Error checking Driving License:", error);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <p className={cx("title")}>Stores Awaiting Approval</p>
        <div>
          <Tippy
            animation="fade"
            interactive
            placement="bottom"
            onClickOutside={handleClickOutSide}
            visible={tippyVisible}
            render={(attrs) => (
              <div tabIndex="-1" {...attrs} className={cx("search-result")}>
                {searchResult.length > 0 && (
                  <ProperWrapper>
                    <h4 className={cx("search-title")}>Accounts</h4>
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
            <div className={cx("inputSearch")}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={cx("icon-search")}
              />
              <input
                className={cx("input")}
                placeholder="Search by name"
                onChange={handleSearch}
              />
            </div>
          </Tippy>
        </div>
        <div className={cx("line-background")} />
        <div className={cx("grid-container")}>
          {data.map((item) => (
            <div className={cx("box")} key={item._id}>
              <div className={cx("titleBox")}>
                <img src={logo} alt="logoShipper" className={cx("logo")} />
                <div className={cx("line")} />
                <div className={cx("textTitle")}>
                  <p className={cx("nameShipper")}>{item.fullName}</p>
                  <p className={cx("gender")}>{item.sex}</p>
                </div>
              </div>
              <div className={cx("line-bottom")} />
              <div className={cx("contentBox")}>
                <div className={cx("item")}>
                  <FontAwesomeIcon icon={faMap} className={cx("icon")} />
                  <p className={cx("textContent")}>{item.address}</p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon icon={faBicycle} className={cx("icon")} />
                  <p className={cx("textContent")}>{item.idBike}</p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon icon={faPalette} className={cx("icon")} />
                  <p className={cx("textContent")}>{item.modeCode}</p>
                </div>
              </div>
              <div className={cx("btn-detail")}>
                <Button
                  detail
                  onClick={() => {
                    selectDetail(item._id);
                  }}
                >
                  Detail
                </Button>
              </div>
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
        {selectShipperById && (
          <div className={cx("modal-container")}>
            <div className={cx("logo-merchant")}>
              <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
              <img src={avatar} alt="Shipper" className={cx("img-merchant")} />
            </div>
            <div className={cx("content-modal")}>
              <Button awaiting>Awaiting Approve</Button>
              <div className={cx("container-content")}>
                <p className={cx("name-shipper")}>{fullName}</p>
                <div className={cx("line")}></div>
                <p className={cx("gender-modal")}>{gender}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Address:</p>
                <p className={cx("content-merchant")}>{address}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Email:</p>
                <p className={cx("content-merchant")}>{email}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>PhoneNumber:</p>
                <p className={cx("content-merchant")}>{phoneNumber}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Birth Day:</p>
                <p className={cx("content-merchant")}>{birthDay}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Brand Bike:</p>
                <p className={cx("content-merchant")}>{brandBike}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Mode Code:</p>
                <p className={cx("content-merchant")}>{modeCode}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>ID Bike:</p>
                <p className={cx("content-merchant")}>{idBike}</p>
              </div>
              <div className={cx("wrapper-image-content")}>
                <div className={cx("wrapper-title-document")}>
                  <p className={cx("title-merchant")}>ID Card:</p>
                  <div
                    className={cx("btn-check")}
                    onClick={() => handleCheckIDCard(idCardFrontSide)}
                  >
                    <p className={cx("text-check")}>Check</p>
                  </div>
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
                  {loadingIdCard && (
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
                      {overAllIDCard === "Cannot check" ? (
                        "Cannot check"
                      ) : (
                        <>
                          OverAll:
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
                  <p className={cx("title-merchant")}>Driving License:</p>
                  <div
                    className={cx("btn-check")}
                    onClick={() => handleCheckDrivingLicense()}
                  >
                    <p className={cx("text-check")}>Check</p>
                  </div>
                </div>
                <div className={cx("wrapper-document")}>
                  <img
                    src={drivingLicenseFrontSide}
                    alt="Document Front Side"
                    className={cx("image-document")}
                  />
                  <img
                    src={drivingLicenseFrontSide}
                    alt="Document Front Side"
                    className={cx("image-document")}
                  />
                  {checkDrivingLicense ? (
                    <h2 className={cx("text-overAll-id-card")}>
                      {overAllDrivingLicense === "Cannot check" ? (
                        "Cannot check"
                      ) : (
                        <>
                          OverAll:
                          <span
                            style={{
                              color:
                                parseFloat(overAllDrivingLicense) < 80
                                  ? "red"
                                  : "green",
                              marginLeft: "10px",
                            }}
                          >
                            {overAllDrivingLicense}%
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
                  <p className={cx("title-merchant")}>Driver License:</p>
                  <div
                    className={cx("btn-check")}
                    onClick={() => handleCheckDriverLicense(driverLicenseFrontSide)}
                  >
                    <p className={cx("text-check")}>Check</p>
                  </div>
                </div>
                <div className={cx("wrapper-document")}>
                  <img
                    src={driverLicenseFrontSide}
                    alt="Document Front Side"
                    className={cx("image-document")}
                  />
                  <img
                    src={driverLicenseFrontSide}
                    alt="Document Front Side"
                    className={cx("image-document")}
                  />
                  {loadingDriverLicense && (
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
                  {checkDriverLicense? (
                    <h2 className={cx("text-overAll-id-card")}>
                      {overAllDriverLicense === "Cannot check" ? (
                        "Cannot check"
                      ) : (
                        <>
                          OverAll:
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

              <div className={cx("btn-delete")}>
                <Button approve_btn onClick={() => handleApproval(id)}>
                  Approval
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AddShipper;
