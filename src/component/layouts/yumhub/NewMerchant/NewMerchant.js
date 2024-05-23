import React, { useState, useEffect } from "react";
import Modal from "react-modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../buttons/index";
import {
  faClock,
  faMagnifyingGlass,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./NewMerchant.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";

const cx = classNames.bind(styles);
function NewMerchant() {
  const [data, setData] = useState([]);
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

  const selectDetail = async (id) => {
    try {
      const response = await AxiosInstance.get(`merchants/?id=${id}`);
      const { detailMerchant } = response.data;
      if (detailMerchant) {
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

  //load data hiển thị lên modal
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
      setEmail(selectMerchantById.user ? selectMerchantById.user.email : "");
      setType(selectMerchantById.type ? selectMerchantById.type.name : ""); // show type
    }
  }, [selectMerchantById]);

  //list mercahnt
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(
          "/merchants/listMerchantApproval"
        );
        console.log(response.data.listMerchantApproval);
        setData(response.data.listMerchantApproval);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={cx("contaienr")}>
      <div className={cx("content")}>
        <p className={cx("title")}>Stores Awaiting Approval</p>
        <div className={cx("inputSearch")}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={cx("icon-search")}
          />
          <input className={cx("input")} placeholder="Đồ ăn chay" />
        </div>
        <div className={cx("line-background")} />
        <div className={cx("grid-container")}>
          {data.map((item) => (
            <div className={cx("box")} key={item._id}>
              <div className={cx("titleBox")}>
                <img src={logo} alt="logoMerchant" className={cx("logo")} />
                <div className={cx("line")} />
                <div className={cx("textTitle")}>
                  <p className={cx("nameMerchant")}>{item.name}</p>
                  <p className={cx("type")}>{item.type.name}</p>
                </div>
              </div>
              <div className={cx("line-bottom")} />
              <div className={cx("contentBox")}>
                <div className={cx("item")}>
                  <FontAwesomeIcon icon={faMap} className={cx("icon")} />
                  <p className={cx("textContent")}>{item.address}</p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon icon={faClock} className={cx("icon")} />
                  <p className={cx("textContent")}>{item.openTime}</p>
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
            <div className={cx("content-modal")}>
              <Button awaiting>Awaiting Approve</Button>
              <div className={cx("container-content")}>
                <p className={cx("name-merchant")}>{name}</p>
                <div className={cx("line")}></div>
                <p className={cx("type-merchant")}>{type}</p>
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
                <p className={cx("title-merchant")}>Store Owner:</p>
                <p className={cx("content-merchant")}>{fullName}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>PhoneNumber:</p>
                <p className={cx("content-merchant")}>{phoneNumber}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Open Time:</p>
                <p className={cx("content-merchant")}>{openTime}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Close Time:</p>
                <p className={cx("content-merchant")}>{closeTime}</p>
              </div>
              <div className={cx("wrapper-image-content")}>
                  <p className={cx("title-merchant")}>Document:</p>
                  <p className={cx("content-merchant")}>
                    <img src={document} alt="Document" className={cx("image-document")}/>
                  </p>
                </div>
              <div className={cx("btn-delete")}>
                <Button approve_btn>Approval</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default NewMerchant;
