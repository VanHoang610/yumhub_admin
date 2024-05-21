import React, { useState, useEffect } from "react";

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

const cx = classNames.bind(styles);
function NewMerchant() {
  const [data, setData] = useState([]);

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
      <div className={cx("header")}>
        <h1>Header</h1>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("side-bar")}>
          <h1>SideBar</h1>
        </div>
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
                    <p className={cx("type")}>Đồ ăn chay</p>
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
                  <Button detail>Detail</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewMerchant;
