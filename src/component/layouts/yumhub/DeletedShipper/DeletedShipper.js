import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react/headless";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./DeletedShipper.module.scss";
import AccountItemShipper from "../../../AccountItem/AccountShipper/AccountCustomer/AccountShipper";

import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";
import Button from "../../../buttons";

const cx = classNames.bind(styles);
Modal.setAppElement("#root");

function DeletedShipper() {
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN"); // Định dạng theo kiểu Việt Nam ngày/tháng/năm
  };

  const [data, setData] = useState([{}]);
  const [selectShipperById, setSelectShipperId] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);

  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [birthDay, setBirthDay] = useState(new Date());
  const [brandBike, setBrandBike] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [idBike, setIdBike] = useState("");
  const [joinDay, setJoinDay] = useState("");
  const [modeCode, setModeCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [gender, setGender] = useState([]);
  const [idCardFrontSide, setIdCardFrontSide] = useState({});
  const [drivingLicenseFrontSide, setDrivingLicenseFrontSide] = useState({});
  const [driverLicenseFrontSide, setDriverLicenseFrontSide] = useState({});
  const [idCardBackSide, setIdCardBackSide] = useState({});
  const [drivingLicenseBackSide, setDrivingLicenseBackSide] = useState({});
  const [driverLicenseBackSide, setDriverLicenseBackSide] = useState({});

  //gọi api allMerchant đã xóa
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
      }
    };
    fetchData();
  }, []);

  // nhấn xem chi tiết
  const handleView = async (id) => {
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(
        `shippers/getShipperById/?id=${id}`
      );
      const { detailShipper } = response.data;
      if (detailShipper) {
        setSelectShipperId(detailShipper);
        setShowModal(true);
        setIsEditModal(false);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectShipperById) {
      console.log(selectShipperById);
      setId(selectShipperById._id || "");
      setAddress(selectShipperById.address || "");
      setAvatar(selectShipperById.avatar || "");
      setBirthDay(new Date(selectShipperById.birthDay) || "");
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

  return (
    <div className={cx("contaienr")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Deleted Merchant</p>
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
                            handleView={handleView}
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
        <div className={cx("box-container")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>ID Bike</th>
                <th>Avatar</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cx("table-row")}
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
            contentLabel="Update Merchant"
            className={cx("modal")}
          >
            {selectShipperById && (
              <div className={cx("modal-container")}>
                <div className={cx("logo-shipper")}>
                  <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                  <img
                    src={avatar}
                    alt="Merchant"
                    className={cx("img-shipper")}
                  />
                </div>
                <div className={cx("content-modal")}>
                  <Button awaiting>Deleted</Button>
                  <div className={cx("container-content")}>
                    <p className={cx("name-shipper")}>{fullName}</p>
                    <div className={cx("line")}></div>
                    <p className={cx("text-gender")}>{gender}</p>
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
                    <p className={cx("content-merchant")}>
                      {birthDay instanceof Date
                        ? birthDay.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>ID Bike:</p>
                    <p className={cx("content-merchant")}>{idBike}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>Brand Bike:</p>
                    <p className={cx("content-merchant")}>{brandBike}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>Mode Code:</p>
                    <p className={cx("content-merchant")}>{modeCode}</p>
                  </div>
                  <div className={cx("wrapper-image-content")}>
                    <div className={cx("wrapper-title-document")}>
                      <p className={cx("title-merchant")}>ID Card:</p>
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
                      <p className={cx("title-merchant")}>Driving License:</p>
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
                      <p className={cx("title-merchant")}>Driver License:</p>
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
