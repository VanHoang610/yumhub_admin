import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../../utils/AxiosInstance";
import classNames from "classnames/bind";
import styles from "./AddAdmin.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const cx = classNames.bind(styles);

function AddAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    avatar: "",
    email: "",
    address: "",
    gender: "",
    phoneNumber: "",
    position: "",
    dob: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
    setErrors({ ...errors, dob: "" });
  };

  const validate = () => {
    const newErrors = {};
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.userName) newErrors.userName = "Username is required";
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailPattern.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    else if (!phonePattern.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone Number must be 10 digits";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);
    try {
        console.log('====================================');
        console.log(formData);
        console.log('====================================');
      await AxiosInstance.post("/admin/createAdmin", formData);
      navigate("/employee");
    } catch (err) {
      if (err.response && err.response.data) {
        const { message } = err.response.data;
        setApiError(message);
      } else {
        setApiError(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className={cx("container")}>
      <h2>Add New Admin</h2>
      {apiError && <p className={cx("error")}>{apiError}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
        <span className={cx("error-message")}>{errors.username}</span>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <span className={cx("error-message")}>{errors.fullName}</span>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <span className={cx("error-message")}>{errors.email}</span>

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <span className={cx("error-message")}>{errors.phoneNumber}</span>

        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        >

        <option value="">Select position</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <span className={cx("error-message")}>{errors.gender}</span>

        <div className={cx("form-group")}>
              <label>Day of birth</label>
              <input
                className={cx("date-input")}
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              <span className={cx("error-message")}>{errors.dob}</span>
            </div>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="avatar"
          placeholder="Avatar URL"
          value={formData.avatar}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </form>
    </div>
  );
}

export default AddAdmin;
