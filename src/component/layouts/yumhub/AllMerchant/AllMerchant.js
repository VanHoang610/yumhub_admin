import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Tippy from '@tippyjs/react/headless';

import AxiosInstance from "../../../../utils/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./AllMerchant.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";
import Button from "../../../buttons";

const cx = classNames.bind(styles);

function AllMerchant() {
  const [data, setData] = useState([{}]);
  const [selectMerchantById, setSelectMerchantId] = useState({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("merchants/getAllMerchant");
        const merchants = response.data.merchants;
        setData(merchants);

        const responseType = await AxiosInstance.get(
          "merchants/getAllTypeOfMerchant"
        );
        setTypes(responseType.data.types);
      } catch (error) {
        setTypes([]);
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectMerchantById) {
      setName(selectMerchantById.name || "");
      setAddress(selectMerchantById.address || "");
      setCloseTime(selectMerchantById.closeTime || "");
      setOpenTime(selectMerchantById.openTime || "");
      setPhoneNumber(
        selectMerchantById.user ? selectMerchantById.user.phoneNumber : ""
      );
      setFullName(
        selectMerchantById.user ? selectMerchantById.user.fullName : ""
      );
      setDocument(
        selectMerchantById.document ? selectMerchantById.document.image : ""
      );
      setTypeId(selectMerchantById.type ? selectMerchantById.type._id : "");
      setEmail(selectMerchantById.user ? selectMerchantById.user.email : "N/A");
      setType(selectMerchantById.type ? selectMerchantById.type.name : "N/A");
    }
  }, [selectMerchantById]);

  const handleEdit = async (id) => {
    try {
      const response = await AxiosInstance.get(`merchants/?id=${id}`);
      const { detailMerchant } = response.data;
      if (detailMerchant) {
        setSelectMerchantId(detailMerchant);
        setIsEditModal(true);
        setShowModal(true);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
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
          const response = await AxiosInstance.post(
            `merchants/deleteMerchant/?id=${id}`
          );
          console.log(response);
          setData(data.filter((merchant) => merchant._id !== id));
          Swal.fire("Deleted!", "Your merchant has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete merchant:", error);
          Swal.fire("Error!", "Failed to delete merchant.", "error");
        }
      }
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditModal(false);
  };

  const handleView = async (id) => {
    try {
      const response = await AxiosInstance.get(`merchants/?id=${id}`);
      const { detailMerchant } = response.data;
      if (detailMerchant) {
        console.log(detailMerchant);
        setSelectMerchantId(detailMerchant);
        setShowModal(true);
        setIsEditModal(false);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        name,
        address,
        closeTime,
        openTime,
        phoneNumber,
        fullName,
        email,
        type: typeId,
      };

      const response = await AxiosInstance.patch(
        `merchants/updateMerchant?id=${selectMerchantById._id}`,
        updateData
      );

      const updatedMerchant = response.data.merchantNew;
      setData((prevData) =>
        prevData.map((merchant) =>
          merchant._id === updatedMerchant._id ? updatedMerchant : merchant
        )
      );
      setShowModal(false);
      setIsEditModal(false);
      Swal.fire("Success", "Merchant updated successfully.", "success");
    } catch (error) {
      console.error("Failed to update merchant:", error);
      Swal.fire("Error", "Failed to update merchant.", "error");
    }
  };

  return (
    <div className={cx("contaienr")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Merchant</p>
        <Tippy
          render={(attrs) => (
            <div className="box" tabIndex="-1" {...attrs}>
              My tippy box
            </div>
          )}
        >
          <div className={cx("inputSearch")}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={cx("icon-search")}
            />
            <input className={cx("input")} placeholder="Đồ ăn chay" />
          </div>
        </Tippy>
        <div className={cx("line-background")} />
        <div className={cx("box-container")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>Time</th>
                <th>Image</th>
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
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.openTime}</td>
                  <td>
                    <img
                      src={logo}
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
          {selectMerchantById && (
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
                {!isEditModal ? <Button reviewed>Reviewed</Button> : ""}
                <div className={cx("container-content")}>
                  <p className={cx("name-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("name-merchant")}
                        name="name"
                        defaultValue={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      name
                    )}
                  </p>
                  <div className={cx("line")}></div>
                  <p className={cx("type-merchant")}>
                    {isEditModal ? (
                      <select
                        className={cx("type-merchant")}
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                      >
                        {types.map((type) => (
                          <option key={type._id} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      type || "N/A"
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
                      <input
                        className={cx("content-merchant")}
                        name="email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      email || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Store Owner:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="fullName"
                        defaultValue={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    ) : (
                      fullName || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>PhoneNumber:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="phoneNumber"
                        defaultValue={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    ) : (
                      phoneNumber || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Open Time:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="openTime"
                        defaultValue={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                      />
                    ) : (
                      openTime || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-content")}>
                  <p className={cx("title-merchant")}>Close Time:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant")}
                        name="closeTime"
                        defaultValue={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                      />
                    ) : (
                      closeTime || "N/A"
                    )}
                  </p>
                </div>
                <div className={cx("wrapper-image-content")}>
                  <p className={cx("title-merchant")}>Document:</p>
                  <p className={cx("content-merchant")}>
                    {isEditModal ? (
                      "N/A"
                    ) : (
                      <img
                        src={document}
                        alt="Document"
                        className={cx("image-document")}
                      />
                    )}
                  </p>
                </div>
                <div className={cx("btn-delete")}>
                  {isEditModal ? (
                    <Button approve_btn onClick={handleUpdate}>
                      Update
                    </Button>
                  ) : (
                    <Button delete_btn>Deleted</Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default AllMerchant;
