import React, { useState, useEffect } from "react";

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

const cx = classNames.bind(styles);

function AllMerchant() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("merchants/getAllMerchant");
        console.log(response.data.merchants);
        setData(response.data.merchants);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className={cx("contaienr")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Merchant</p>
        <div className={cx("inputSearch")}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={cx("icon-search")}
          />
          <input className={cx("input")} placeholder="Đồ ăn chay" />
        </div>
        <div className={cx("line-background")} />

        <div className={cx("box-container")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>#</th>
                <th className={cx("title-box")}>Name</th>
                <th className={cx("title-box")}>Address</th>
                <th className={cx("title-box")}>Time</th>
                <th className={cx("title-box")}>Image</th>
                <th className={cx("title-box")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className={cx("table-row")}>
                  <td>{index + 1}</td>
                  <td className={cx("title-box")}>{item.name}</td>
                  <td className={cx("title-box")}>{item.address}</td>
                  <td className={cx("title-box")}>{item.openTime}</td>
                  <td className={cx("title-box")}>
                    <img
                      src={logo}
                      alt={`${item.name} logo`}
                      className={cx("logo")}
                    />
                  </td>
                  <td>
                    <button className={cx("action-button")}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className={cx("action-button")}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className={cx("action-button")}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllMerchant;
