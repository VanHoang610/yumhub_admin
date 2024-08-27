import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faDollar,
  faMagnifyingGlass,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";

import { Wrapper as ProperWrapper } from "../../../Proper/index";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import AccountItemFood from "../../../AccountItem/AccountFood/AccountFood";
import AxiosInstance from "../../../../utils/AxiosInstance";
import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./FoodRequest.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import ellipse from "../../../../assets/images/ellipse.png";

const cx = classNames.bind(styles);

function FoodRequest() {
  const formatMoney = (number) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(number);
  };

  const { t } = useTranslation();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const [tippyVisible, setTippyVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [detailFood, setDetailFood] = useState({});
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageBackground, setImageBackground] = useState("");
  const [nameFood, setNameFood] = useState("");
  const [priceFood, setPriceFood] = useState("");
  const [imageFood, setImageFood] = useState("");
  const [note, setNote] = useState("");

  //load data
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await AxiosInstance.post("/food/getFoodByStatus", {
        status: 1,
      });
      setData(response.data.processingFood);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //set data
  useEffect(() => {
    setId(detailFood._id || "N/A");
    setName(detailFood.merchantID ? detailFood.merchantID.name : "N/A");
    setAddress(detailFood.merchantID ? detailFood.merchantID.address : "N/A");
    setImageBackground(
      detailFood.merchantID ? detailFood.merchantID.imageBackground : "N/A"
    );
    setNameFood(detailFood ? detailFood.nameFood : "N/A");
    setPriceFood(detailFood ? detailFood.price : "N/A");
    setImageFood(detailFood ? detailFood.image : "N/A");
    setNote("");
  }, [detailFood]);

  const handleDetailFood = async (id) => {
    setLoading(true);
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(`food/getFoodById/?id=${id}`);
      setDetailFood(response.data.Foods);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
    setTippyVisible(false);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post("/food/findApproveFood", {
          keyword,
        });
        if (response.data.result && response.data.foods.length > 0) {
          setSearchResult(response.data.foods.slice(0, 5));
          setTippyVisible(true);
          setData(response.data.foods);
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

  const handleNoteChange = (event) => {
    const { value } = event.target;
    setNote(value);
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post(
        `food/deleteFood?id=${id}`,
        {note: note},
      );
      if (response.data.result) {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Reject Successful",
          text: "The food has been successfully Rejected!",
        }).then(() => {
          fetchData();
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "info",
          title: "Reject Failed",
          text: "There was an error rejecting the food!",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // xác nhận food request
  const handleApproval = async (id) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post("food/Status", {
        ID: id,
        status: 3,
      });
      if (response.data.result === false) {
        setShowModal(false);
        Swal.fire({
          icon: "info",
          title: "Approval Failed",
          text: "There was an error updating the food!",
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Approval Successful",
          text: "The food has been successfully updated!",
        }).then(() => {
          fetchData();
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // lọc ra food của từng merchant
  const groupByMerchant = (data) => {
    return data.reduce((acc, item) => {
      // acc là 1 {} rỗng
      const merchantId = item.merchantID._id;

      if (!acc[merchantId]) {
        acc[merchantId] = {
          merchant: item.merchantID,
          items: [],
        };
      }
      acc[merchantId].items.push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByMerchant(data);

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
          {t("merchant.foodAwaitApproval")}
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
                      ? searchResult.map((food) => (
                          <AccountItemFood
                            key={food._id}
                            food={food}
                            handleView={handleDetailFood}
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
        {Object.keys(groupedData).map((merchantId) => (
          <div key={merchantId}>
            <h2
              className={cx("merchant-name-title", fontSize, {
                dark: theme === "dark",
              })}
            >
              {groupedData[merchantId].merchant.name}
            </h2>
            <div className={cx("grid-container")}>
              {groupedData[merchantId].items.map((item, index) => (
                <div
                  className={cx("box", { dark: theme === "dark" })}
                  key={index}
                >
                  <div className={cx("titleBox")}>
                    <img src={logo} alt="logoMerchant" className={cx("logo")} />
                    <div className={cx("line")} />
                    <div className={cx("textTitle")}>
                      <p
                        className={cx("nameMerchant", fontSize, {
                          dark: theme === "dark",
                        })}
                      >
                        {groupedData[merchantId].merchant.name}
                      </p>
                      <p className={cx("type", fontSize)}>
                        {groupedData[merchantId].merchant.address}
                      </p>
                    </div>
                  </div>
                  <div className={cx("line-bottom")} />
                  <div className={cx("contentBox")}>
                    <div className={cx("content-food")}>
                      <div className={cx("item")}>
                        <FontAwesomeIcon
                          icon={faBowlFood}
                          className={cx("icon", fontSize, {
                            dark: theme === "dark",
                          })}
                        />
                        <p
                          className={cx("textContent", fontSize, {
                            dark: theme === "dark",
                          })}
                        >
                          {item.nameFood}
                        </p>
                      </div>
                      <div className={cx("item")}>
                        <FontAwesomeIcon
                          icon={faDollar}
                          className={cx("icon", fontSize, {
                            dark: theme === "dark",
                          })}
                        />
                        <p
                          className={cx("textContent", fontSize, {
                            dark: theme === "dark",
                          })}
                        >
                          {formatMoney(item.price)}
                        </p>
                      </div>
                      <div className={cx("item")}>
                        <FontAwesomeIcon
                          icon={faUtensils}
                          className={cx("icon", fontSize, {
                            dark: theme === "dark",
                          })}
                        />
                        <p
                          className={cx("textContent", fontSize, {
                            dark: theme === "dark",
                          })}
                        >
                          Cơm
                        </p>
                      </div>
                    </div>
                    <div className={cx("line-content-food")} />
                    <div className={cx("image-food")}>
                      <img
                        src={item.image}
                        alt="food"
                        className={cx("food-request")}
                      ></img>
                    </div>
                  </div>
                  <div className={cx("line-bottom")} />
                  {theme === "dark" ? (
                    <div
                      className={cx("btn-detail", { dark: theme === "dark" })}
                    >
                      <Button
                        detail_dark
                        onClick={() => {
                          handleDetailFood(item._id);
                        }}
                      >
                        Detail
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={cx("btn-detail", { dark: theme === "dark" })}
                    >
                      <Button
                        detail
                        onClick={() => {
                          handleDetailFood(item._id);
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
          // </div>
        ))}
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Detail Food Request"
        className={cx("modal")}
      >
        {detailFood && (
          <div className={cx("modal-container", { dark: theme === "dark" })}>
            <div className={cx("logo-merchant", { dark: theme === "dark" })}>
              <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
              <img
                src={imageBackground}
                alt="Merchant"
                className={cx("img-merchant")}
              />
            </div>
            <div className={cx("content-modal")}>
              <Button awaiting> {t("merchant.await")}</Button>
              <div className={cx("container-content")}>
                <p className={cx("name-merchant", fontSize)}>{name}</p>
                <div className={cx("line", { dark: theme === "dark" })}></div>
                <p className={cx("type-merchant", fontSize)}>Đồ mặn</p>
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
                  {t("merchant.price")}:
                </p>
                <p className={cx("content-merchant", fontSize)}>
                  {formatMoney(priceFood)}
                </p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant", fontSize)}>
                  {" "}
                  {t("merchant.nameFood")}:
                </p>
                <p className={cx("content-merchant", fontSize)}>{nameFood}</p>
              </div>

              <div className={cx("wrapper-image-content")}>
                <p className={cx("title-merchant", fontSize)}>
                  {" "}
                  {t("merchant.imageFood")}:
                </p>
                <p className={cx("content-merchant")}>
                  <img
                    src={imageFood}
                    alt="Document"
                    className={cx("image-document")}
                  />
                </p>
              </div>
              <div>
                <input
                  className={cx("textbox")}
                  type="text"
                  placeholder={t("merchant.note")}
                  value={note}
                  onChange={handleNoteChange}
                />
              </div>
              <div className={cx("wrapper-btn")}>
                <div >
                  <button className={cx("button-delete")} approve_btn onClick={() => handleDelete(id)}>
                    {t("merchant.cancel")}
                  </button>
                </div>
                <div>
                  <button className={cx("button-approve")} approve_btn onClick={() => handleApproval(id)}>
                    {t("merchant.approval")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FoodRequest;
