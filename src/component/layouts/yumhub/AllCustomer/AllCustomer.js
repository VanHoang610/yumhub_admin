import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./AllCustomer.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";
import Button from "../../../buttons";

const cx = classNames.bind(styles);

function AllCustomer() {
    // lấy ra ngày tháng năm trong api
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // getUTCMonth() trả về tháng từ 0 đến 11
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const [detailCustomer, setDetailCustomer] = useState({});
  const [detailAddress, setDetailAddress] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [document, setDocument] = useState("");
  const [typeId, setTypeId] = useState("");
  const [types, setTypes] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("customers/getAllCustomer");
        const customers = response.data.customer;
        console.log(customers);
        setData(customers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleView = async (id) => {
    try {
      const response = await AxiosInstance.get(`customers/?id=${id}`);
      const detailCustomer = response.data;
      if (detailCustomer.result === true) {
        setDetailCustomer({
          ...detailCustomer.customer,
          joinDay: formatDate(detailCustomer.customer.joinDay),
        });
        setDetailAddress(detailCustomer.address);
        setShowModal(true);
        setIsEditModal(false);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (id) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

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
        } catch (error) {
          console.error("Failed to delete customer:", error);
          Swal.fire("Error!", "Failed to delete customer.", "error");
        }
      }
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditModal(false);
  };
  return (
    <div className={cx("contaienr")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Shipper</p>
        <div className={cx("inputSearch")}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={cx("icon-search")}
          />
          <input
            className={cx("input")}
            placeholder="Trương Minh Thi, Đoàn Thanh Hòa"
          />
        </div>
        <div className={cx("line-background")} />
        <div className={cx("box-container")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Birth Day</th>
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
                  <td>{item.phoneNumber}</td>
                  <td>{item.birthDay}</td>
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
          contentLabel="Customer"
          className={cx("modal")}
        >
          {detailCustomer && (
            <div className={cx("modal-container")}>
              <div className={cx("logo-merchant")}>
                <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                <img
                  src={image_merchant}
                  alt="Merchant"
                  className={cx("img-merchant")}
                />
              </div>
              <div className={cx("content")}>
                <Button reviewed>Reviewed</Button>
                <div className={cx("container-content")}>
                  <p className={cx("name-merchant")}>
                    {detailCustomer.fullName}
                    {/* <input
                      className={cx("name-merchant")}
                      name="name"
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                    /> */}
                  </p>
                  <div className={cx("line")}></div>
                  <p className={cx("type-merchant")}>
                    {detailCustomer.sex}
                    {/* <select
                      className={cx("type-merchant")}
                      value={typeId}
                      onChange={(e) => setTypeId(e.target.value)}
                    >
                      {types.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.name}
                        </option>
                      ))}
                    </select> */}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Address:</p>
                  {detailAddress.map((address, index) => (
                    <p key={index} className={cx("content-merchant")}>
                      {[
                        address.houseNumber,
                        address.street,
                        address.ward,
                        address.district,
                        address.city,
                      ].join(", ") || "N/A"}
                    </p>
                  ))}
                  {/* <input
                      className={cx("content-merchant")}
                      name="address"
                      defaultValue={address}
                      onChange={(e) => setAddress(e.target.value)}
                    /> */}
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Email:</p>
                  <p className={cx("content-merchant")}>
                    {" "}
                    {detailCustomer.email}
                    {/* <input
                      className={cx("content-merchant")}
                      name="email"
                      defaultValue={email}
                      onChange={(e) => setEmail(e.target.value)}
                    /> */}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Birth Day:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.birthDay}
                    {/* <input
                      className={cx("content-merchant")}
                      name="fullName"
                      defaultValue={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    /> */}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Phone Number:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.phoneNumber}
                    {/* <input
                      className={cx("content-merchant")}
                      name="phoneNumber"
                      defaultValue={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    /> */}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Join Day:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.joinDay}
                    {/* <input
                      className={cx("content-merchant")}
                      name="openTime"
                      defaultValue={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                    /> */}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Rating:</p>
                  <p className={cx("content-merchant")}>
                    {detailCustomer.rating}
                    {/* <input
                      className={cx("content-merchant")}
                      name="closeTime"
                      defaultValue={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                    /> */}
                  </p>
                </div>

                <div className={cx("btn-delete")}>
                  <Button delete_btn>Deleted</Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default AllCustomer;
