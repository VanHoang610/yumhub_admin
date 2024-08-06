import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { ThreeDots } from "react-loader-spinner";
import {
  faChevronLeft,
  faEdit,
  faEye,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react/headless";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";
import AccountItemMerchant from "../../../AccountItem/AccountMerchant/AccountCustomer/AccountMerchant";
import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./AllMerchant.module.scss";
import noAvatar from "../../../../assets/images/noAvatar.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";

const cx = classNames.bind(styles);

function AllMerchant() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const formatDate = (date) => {
    const now = new Date(date);
    return now.toLocaleDateString("vi-VN");
  };

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectMerchantById, setSelectMerchantId] = useState({});
  const [isEditModal, setIsEditModal] = useState(false);

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
  const [typeId, setTypeId] = useState("");
  const [types, setTypes] = useState([]);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);

  //gọi api allMerchant
  useEffect(() => {
    
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get("merchants/getAllMerchantAdmin");
      const merchants = response.data.merchants;
      setData(merchants);

      const responseType = await AxiosInstance.get(
        "merchants/getAllTypeOfMerchant"
      );
      setTypes(responseType.data.types);
    } catch (error) {
      setTypes([]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //load data lên màn hình
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
      setTypeId(selectMerchantById.type ? selectMerchantById.type._id : "");
      setEmail(selectMerchantById.user ? selectMerchantById.user.email : "N/A");
      setType(selectMerchantById.type ? selectMerchantById.type.name : "N/A");
    }
  }, [selectMerchantById]);

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`merchants/?id=${id}`);
      const { detailMerchant } = response.data;
      if (detailMerchant) {
        setSelectMerchantId(detailMerchant);
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
    } finally {
      setLoading(false);
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
      setLoading(true);
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
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditModal(false);
    setShowModalHistory(false);
  };

  const handleView = async (id) => {
    setLoading(true);
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(
        `merchants/getMerchantById/?id=${id}`
      );
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);}
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post("/merchants/findMerchant", {
          keyword,
        });
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
        console.error("Error fetching search results:", error);
        setSearchResult([]);
        setTippyVisible(false);
      }
    } else {
      setSearchResult([]);
      setTippyVisible(false);
      fetchData();
    }
  };

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
    setTippyVisible(false);
  };

  // show history merchant
  const handleHistory = async (id) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(
        `merchants/getHistoryMerchant/?id=${id}`
      );
      if (
        Array.isArray(response.data.history) &&
        response.data.history.length === 0
      ) {
        Swal.fire({
          icon: "info",
          title: "No orders placed",
          text: "No orders have been placed!",
        });
      } else {
        if (Array.isArray(response.data.history)) {
          const updatedHistory = response.data.history.map((item) => ({
            ...item,
            timeBook: formatDate(item.timeBook),
          }));
          console.log(updatedHistory);
          setDataHistory(updatedHistory);
          setShowModalHistory(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);}
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
          {t("merchant.allMerchant")}
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
                      {" "}
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
                className={cx("input", fontSize, { dark: theme === "dark" })}
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
                <th> {t("merchant.name")}</th>
                <th> {t("merchant.address")}</th>
                <th> {t("merchant.time")}</th>
                <th> {t("merchant.image")}</th>
                <th> {t("merchant.actions")}</th>
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
                      src={item.imageBackground || noAvatar}
                      alt={"avatar"}
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
            <div className={cx("modal-container", { dark: theme === "dark" })}>
              <div className={cx("logo-merchant", { dark: theme === "dark" })}>
                <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                <img
                  src={avatar}
                  alt="Merchant"
                  className={cx("img-merchant")}
                />
              </div>
              <div className={cx("content-modal")}>
                {!isEditModal ? (
                  <Button reviewed> {t("merchant.reviewed")}</Button>
                ) : (
                  ""
                )}
                <div className={cx("container-content")}>
                  <p className={cx("name-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        className={cx("name-merchant", fontSize)}
                        name="name"
                        defaultValue={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      name
                    )}
                  </p>
                  <div className={cx("line", { dark: theme === "dark" })}></div>
                  <p className={cx("type-merchant", fontSize)}>
                    {isEditModal ? (
                      <select
                        className={cx("type-merchant", fontSize)}
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
                  <p className={cx("title-merchant", fontSize)}>
                    {" "}
                    {t("merchant.address")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant", fontSize)}
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
                  <p className={cx("title-merchant", fontSize)}>
                    {" "}
                    {t("merchant.email")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant", fontSize)}
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
                  <p className={cx("title-merchant", fontSize)}>
                    {" "}
                    {t("merchant.storeOwner")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant", fontSize)}
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
                  <p className={cx("title-merchant", fontSize)}>
                    {" "}
                    {t("merchant.phone")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant", fontSize)}
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
                  <p className={cx("title-merchant", fontSize)}>
                    {" "}
                    {t("merchant.openTime")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant", fontSize)}
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
                  <p className={cx("title-merchant", fontSize)}>
                    {" "}
                    {t("merchant.closeTime")}:
                  </p>
                  <p className={cx("content-merchant", fontSize)}>
                    {isEditModal ? (
                      <input
                        className={cx("content-merchant", fontSize)}
                        name="closeTime"
                        defaultValue={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                      />
                    ) : (
                      closeTime || "N/A"
                    )}
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
                <div className={cx("btn-delete")}>
                  {isEditModal ? (
                    <Button approve_btn onClick={handleUpdate}>
                      {t("merchant.update")}
                    </Button>
                  ) : (
                    <Button approve_btn onClick={() => handleHistory(id)}>
                      {t("merchant.history")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/*Modal show history merchants */}
        <Modal
          isOpen={showModalHistory}
          onRequestClose={handleModalClose}
          contentLabel="HistoryMerchant"
          className={cx("modal-history", { dark: theme === "dark" })}
        >
          <div className={cx("box-history")}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                onClick={() => setShowModalHistory(false)}
                icon={faChevronLeft}
                className={cx("iconLeft", fontSize)}
              />
              <h2
                className={cx("title-history", fontSize, {
                  dark: theme === "dark",
                })}
              >
                {t("merchant.historyMerchant")}
              </h2>
            </div>
            <table className={cx("table")}>
              <thead
                className={cx("table-row-history", fontSize, {
                  dark: theme === "dark",
                })}
              >
                <tr>
                  <th>#</th>
                  <th>{t("merchant.nameCustomer")}</th>
                  <th>{t("merchant.nameShipper")} </th>
                  <th>{t("merchant.deliveryAddress")}</th>
                  <th>{t("merchant.timeBook")}</th>
                  <th>{t("merchant.totalPrice")}</th>
                  <th>{t("merchant.status")}</th>
                </tr>
              </thead>
              <tbody
                className={cx("table-row-history", fontSize, {
                  dark: theme === "dark",
                })}
              >
                {dataHistory.map((item, index) => (
                  <tr key={index} onClick={() => handleView(item._id)}>
                    <td>{index + 1}</td>
                    <td>
                      {item.customerID ? item.customerID.fullName : "N/A"}
                    </td>
                    <td>{item.shipperID ? item.shipperID.fullName : "N/A"}</td>
                    <td>{item ? item.deliveryAddress : "N/A"}</td>
                    <td>{item ? item.timeBook : "N/A"}</td>
                    <td>{item ? item.priceFood + " đ" : "N/A"}</td>

                    <td>
                      <p
                        className={cx(
                          "status",
                          fontSize, // Base class for all status elements
                          item.status.name === "cancel"
                            ? "status-cancel"
                            : "status-work"
                        )}
                      >
                        {item.status ? item.status.name : "N/A "}
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

export default AllMerchant;
