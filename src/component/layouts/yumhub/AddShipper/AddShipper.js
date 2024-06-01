import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./AddShipper.module.scss";
import Modal from "react-modal";

const cx = classNames.bind(styles);

Modal.setAppElement("#root");

function AddShipper() {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const response = await AxiosInstance.get(
          "shippers/listShipperApproval"
        )
          setShippers(response.data.listMerchantApproval);
        }
       catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShippers();
  }, []);

  const handleViewClick = (e, shipper) => {
    e.stopPropagation();
    setSelectedShipper(shipper);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Shipper Awaiting Approval</div>
      <div className={cx("search-bar")}>
        <input type="text" placeholder="Nombre, Unidad, Status" />
      </div>
      <div className={cx("card-container")}>
        {shippers.map((shipper) => (
          <div key={shipper._id} className={cx("card")}>
            <div className={cx("card-header")}>
              <img
                src={"https://th.bing.com/th/id/OIP.bbvSNRBEMEPuujn-OZ-aVgHaHa?rs=1&pid=ImgDetMain"}
                alt={shipper.fullName}
                className={cx("default-shipper")}
              />
              <div className={cx("info")}>
                <div className={cx("name")}>{shipper.fullName}</div>
                <div className={cx("phone")}>{shipper.phoneNumber}</div>
              </div>
            </div>
            <div className={cx("container-card-body")}>
              {" "}
              <div className={cx("card-body")}>
                <div className={cx("bike")}>72G1-12311</div>
                <div className={cx("cccd")}>077 090 092 014</div>
                <div className={cx("item")}>065497668</div>
              </div>
              <div className={cx("avatar")}>
                <img
                  src={shipper.avatar || "/default-avatar.png"}
                  alt={"avatar"}
                  className={cx("avatar")}
                />
              </div>
            </div>

            <div className={cx("card-footer")}>
              <button
                className={cx("view-btn")}
                onClick={(e) => handleViewClick(e, shipper)}
              >
                Chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Shipper Details"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        {selectedShipper && (
          <div>
            <h2>Shipper Details</h2>
            <p>ID: {selectedShipper._id}</p>
            <p>Name: {selectedShipper.fullName}</p>
            <p>Phone: {selectedShipper.phoneNumber}</p>
            <p>Address: {selectedShipper.address}</p>
            <p>Bike: {selectedShipper.idBike}</p>
            <p>Balance: {selectedShipper.balance}</p>
            <p>Status: {selectedShipper.status}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AddShipper;
