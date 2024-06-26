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
import styles from "./AllShipper.module.scss";
import AccountItemShipper from "../../../AccountItem/AccountShipper/AccountCustomer/AccountShipper";
import ellipse from "../../../../assets/images/ellipse.png";
import Button from "../../../buttons";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function AllShipper() {
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

  const [orderStatuses, setOrderStatuses] = useState([]);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [isEditingBirthDay, setIsEditingBirthDay] = useState(false);
  //gọi api all shipper
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("shippers/getAllShipper");
        const shippers = response.data.AllShipper;
        setData(shippers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  //load data hiển thị lên modal
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

  // nhấn edit shipper
  const handleEdit = async (id) => {
    try {
      const response = await AxiosInstance.get(
        `shippers/getShipperById?id=${id}`
      );
      const { detailShipper } = response.data;
      if (detailShipper) {
        setSelectShipperId(detailShipper);
        setIsEditModal(true);
        setShowModal(true);
      } else {
        Swal.fire({
          icon: "info",
          title: "Infomation",
          text: "No infomation found!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // nhấn btn update shipper
  const handleUpdate = async () => {
    try {
      const updateData = {
        fullName,
        sex: gender,
        birthDay: birthDay.toISOString().split('T')[0],
        address,
      };
      console.log(birthDay);

      const response = await AxiosInstance.patch(
        `shippers/updateShipper?id=${selectShipperById._id}`,
        updateData
      );

      if (response.data.result) {
        const updatedShipper = response.data.data;
        setData((prevData) =>
          prevData.map((shipper) =>
            shipper._id === updatedShipper._id ? updatedShipper : shipper
          )
        );
        setShowModal(false);
        setIsEditModal(false);
        Swal.fire("Success", "Shipper updated successfully.", "success");
      } else {
        Swal.fire("Error", "Failed to update shipper.", "error");
      }
    } catch (error) {
      console.error("Failed to update shipper:", error);
      Swal.fire("Error", "Failed to update shipper.", "error");
    }
  };

  // nhấn edit những field không edit được
  const handleClickEditField = () => {
    Swal.fire({
      icon: "info",
      title: "Infomation",
      text: "Cannot change",
    });
  };

  // nhấn xóa shipper
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      customClass: {
        popup: cx("swal2-popup"),
        title: cx("swal2-title"),
        confirmButton: cx("swal2-confirm"),
        cancelButton: cx("swal2-cancel"),
      },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await AxiosInstance.post(
            `shippers/deleteShipper/?id=${id}`
          );
          console.log(response.data.result);
          if (response.data.result) {
            setData(data.filter((shipper) => shipper._id !== id));
            Swal.fire("Deleted!", "Your shipper has been deleted.", "success");
          }
        } catch (error) {
          console.error("Failed to delete shipper:", error);
          Swal.fire("Error!", "Failed to delete shipper.", "error");
        }
      }
    });
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post("/shippers/findShipper", {
          keyword,
        });
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

  // nhấn tắt modal
  const handleModalClose = () => {
    setShowModal(false);
    setIsEditModal(false);
    setShowModalHistory(false);
  };

  // show history shipper
  const handleHistory = async (id) => {
    try {
      const response = await AxiosInstance.get(
        `shippers/getHistoryOrder/?id=${id}`
      );
      if (
        Array.isArray(response.data.historyShipper) &&
        response.data.historyShipper.length === 0
      ) {
        // Nếu history là một mảng rỗng, tức là không có đơn hàng
        Swal.fire({
          icon: "info",
          title: "No orders placed",
          text: "No orders have been placed!",
        });
      } else {
        if (Array.isArray(response.data.historyShipper)) {
          const updatedHistory = response.data.historyShipper.map((item) => ({
            ...item,
            timeBook: formatDate(item.timeBook),
            nameStatus: getOrderStatusName(item.status),
          }));
          console.log(updatedHistory);
          setDataHistory(updatedHistory);
          setShowModalHistory(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // gọi api lấy orderStatus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("orders/getAllOrderStatus");
        setOrderStatuses(response.data.orderStatus)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // lấy ra tên của status trong order
  function getOrderStatusName(statusId) {
    const matchingStatus = orderStatuses.find(
      (status) => status._id === statusId
    );
    return matchingStatus ? matchingStatus.name : "N/A";
  }

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Shipper</p>
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
                        handleEdit(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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
        </div>
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
                {!isEditModal ? <Button reviewed>Reviewed</Button> : ""}
                <div className={cx("container-content")}>
                  <p className={cx("name-shipper")}>
                    {isEditModal ? (
                      <input
                        className={cx("name-shipper")}
                        name="name"
                        defaultValue={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    ) : (
                      fullName
                    )}
                  </p>
                  <div className={cx("line")}></div>
                  <p className={cx("text-gender")}>
                    {isEditModal ? (
                      <select
                        className={cx("text-gender")}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      gender || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Address:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="address"
                        defaultValue={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    ) : (
                      address || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Email:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <span onClick={handleClickEditField}>
                        {email || "N/A"}
                      </span>
                    ) : (
                      email || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>PhoneNumber:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <span onClick={handleClickEditField}>
                        {phoneNumber || "N/A"}
                      </span>
                    ) : (
                      phoneNumber || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Birth Day:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <DatePicker
                        selected={birthDay}
                        onChange={(date) => {
                          setBirthDay(date);
                          setIsEditingBirthDay(false);
                        }}
                        dateFormat="MM-dd-yyyy"
                        className={cx("content-merchant")}
                        onClickOutside={() => setIsEditingBirthDay(false)} // Ẩn DatePicker khi nhấn ra ngoài
                      />
                    ) : (
                      birthDay instanceof Date ? birthDay.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>ID Bike:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <span onClick={handleClickEditField}>
                        {idBike || "N/A"}
                      </span>
                    ) : (
                      idBike || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Brand Bike:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <span onClick={handleClickEditField}>
                        {brandBike || "N/A"}
                      </span>
                    ) : (
                      brandBike || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Mode Code:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <span onClick={handleClickEditField}>
                        {modeCode || "N/A"}
                      </span>
                    ) : (
                      modeCode || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-image-content")}>
                  <div className={cx("wrapper-title-document")}>
                    <p className={cx("title-merchant")}>ID Card:</p>
                  </div>
                  <div
                    className={cx("wrapper-document")}
                    onClick={handleClickEditField}
                  >
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
                <div
                  className={cx("wrapper-image-content")}
                  onClick={handleClickEditField}
                >
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
                <div
                  className={cx("wrapper-image-content")}
                  onClick={handleClickEditField}
                >
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
                <div className={cx("btn-delete")}>
                  {isEditModal ? (
                    <Button approve_btn onClick={() => handleUpdate()}>
                      Update
                    </Button>
                  ) : (
                    <Button approve_btn onClick={() => handleHistory(id)}>
                      History
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/*Modal show history shipper */}
        <Modal
          isOpen={showModalHistory}
          onRequestClose={handleModalClose}
          contentLabel="HistoryShipper"
          className={cx("modal-history")}
        >
          <div className={cx("box-history")}>
            <h2 className={cx("title-history")}>History Shipper</h2>
            <table className={cx("table")}>
              <thead className={cx("table-row-history")}>
                <tr>
                  <th>#</th>
                  <th>Name Merchant</th>
                  <th>Name Customer </th>
                  <th>Delivery Address</th>
                  <th>Time Book</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className={cx("table-row-history")}>
                {dataHistory.map((item, index) => (
                  <tr key={index} onClick={() => handleView(item._id)}>
                    <td>{index + 1}</td>
                    <td>{item.merchantID ? item.merchantID.name : "N/A"}</td>
                    <td>{item.customerID ? item.customerID.fullName : "N/A"}</td>
                    <td>{item ? item.deliveryAddress : "N/A"}</td>
                    <td>{item ? item.timeBook : "N/A"}</td>
                    <td>{item ? item.priceFood + " đ" : "N/A"}</td>

                    <td>
                      <p
                        className={cx(
                          "status", // Base class for all status elements
                          item.nameStatus === "cancel"
                            ? "status-cancel"
                            : "status-work"
                        )}
                      >
                        {item.nameStatus}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AllShipper;
