import React, { useEffect, useState } from "react";
import { Bar, Line, PolarArea } from "react-chartjs-2";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import "react-datepicker/dist/react-datepicker.css";

import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../component/layouts/defaultLayout/header/Settings/Context/ThemeContext";
import { useFontSize } from "../../../../component/layouts/defaultLayout/header/Settings/Context/FontSizeContext";
import AxiosInstance from "../../../../utils/AxiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement
);

const cx = classNames.bind(styles);

function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [yumhubData, setYumhubData] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [foodData, setFoodData] = useState({});
  const [profitData, setProfitData] = useState({});
  const [merchantsData, setMerchantsData] = useState({});
  const [shippersData, setShippersData] = useState({});
  const [shipData, setShipData] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        await AxiosInstance.get("admin/checkRole");
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Swal.fire("Info", "Access Denied", "warning");
          navigate("/all-vouchers");
        } else {
          console.log(error);
        }
      }
    };
    fetchRole();
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const month = formatDate(startDate);

        const response = await AxiosInstance.get(
          `orders/revenueFoodDelivery?month=${month}`
        );
        const DATA = response.data;

        if (DATA.thisMonth && DATA.lastMonth && DATA.twoMonthAgos) {
          setYumhubData({
            revenue: DATA.thisMonth.totalRevenue,
            food: DATA.thisMonth.totalFood,
            ship: DATA.thisMonth.totalShip,
            profitMerchant: DATA.thisMonth.totalMerchant,
            profitShipper: DATA.thisMonth.totalShipper,
            vocher: DATA.thisMonth.totalVoucher,
            profit:
              (DATA.thisMonth.totalRevenue || 0) -
              ((DATA.thisMonth.totalShipper || 0) +
                (DATA.thisMonth.totalMerchant || 0)),
          });

          setRevenueData({
            thisMonth: DATA.thisMonth.totalRevenue || 0,
            lastMonth: DATA.lastMonth.totalRevenue || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalRevenue || 0,
          });

          setFoodData({
            thisMonth: DATA.thisMonth.totalFood || 0,
            lastMonth: DATA.lastMonth.totalFood || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalFood || 0,
          });

          setProfitData({
            thisMonth:
              (DATA.thisMonth.totalRevenue || 0) -
              ((DATA.thisMonth.totalShipper || 0) +
                (DATA.thisMonth.totalMerchant || 0)),
            lastMonth:
              (DATA.lastMonth.totalRevenue || 0) -
              ((DATA.lastMonth.totalShipper || 0) +
                (DATA.lastMonth.totalMerchant || 0)),
            twoMonthsAgo:
              (DATA.twoMonthAgos.totalRevenue || 0) -
              ((DATA.twoMonthAgos.totalShipper || 0) +
                (DATA.twoMonthAgos.totalMerchant || 0)),
          });

          setMerchantsData({
            thisMonth: DATA.thisMonth.totalMerchant || 0,
            lastMonth: DATA.lastMonth.totalMerchant || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalMerchant || 0,
          });

          setShippersData({
            thisMonth: DATA.thisMonth.totalShipper || 0,
            lastMonth: DATA.lastMonth.totalShipper || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalShipper || 0,
          });

          setShipData({
            thisMonth: DATA.thisMonth.totalShip || 0,
            lastMonth: DATA.lastMonth.totalShip || 0,
            twoMonthsAgo: DATA.twoMonthAgos.totalShip || 0,
          });
        } else {
          console.log("Some data properties are missing in the API response.");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate]);

  const labels = [
    t("home.twoMonthsAgo"),
    t("home.lastMonth"),
    t("home.thisMonth"),
  ];

  // chỉnh sửa fontsize của title
  const getTitleFontSize = () => {
    switch (fontSize) {
      case "small":
        return 16;
      case "large":
        return 24;
      default:
        return 20;
    }
  };

  const totalYumHub = {
    labels: [
      t("home.revenue"),
      t("home.profit"),
      t("home.food"),
      t("home.ship"),
      t("home.voucher"),
      t("home.merchant"),
      t("home.shipper"),
    ],
    datasets: [
      {
        label: t("home.yumhubChart"),
        data: [
          yumhubData?.revenue || 0,
          yumhubData?.profit || 0,
          yumhubData?.food || 0,
          yumhubData?.ship || 0,
          yumhubData?.vocher || 0,
          yumhubData?.profitMerchant || 0,
          yumhubData?.profitShipper || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 206, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueDataConfig = {
    labels: labels,
    datasets: [
      {
        label: t("home.revenueChart"),
        data: [
          revenueData?.twoMonthsAgo || 0,
          revenueData?.lastMonth || 0,
          revenueData?.thisMonth || 0,
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const foodDataConfig = {
    labels: labels,
    datasets: [
      {
        label: t("home.foodChart"),
        data: [
          foodData?.twoMonthsAgo || 0,
          foodData?.lastMonth || 0,
          foodData?.thisMonth || 0,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const shipDataConfig = {
    labels: labels,
    datasets: [
      {
        label: t("home.shipChart"),
        data: [
          shipData?.twoMonthsAgo || 0,
          shipData?.lastMonth || 0,
          shipData?.thisMonth || 0,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const profitDataConfig = {
    labels: labels,
    datasets: [
      {
        label: t("home.profitChart"),
        data: [
          profitData?.twoMonthsAgo || 0,
          profitData?.lastMonth || 0,
          profitData?.thisMonth || 0,
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const merchantDataConfig = {
    labels: labels,
    datasets: [
      {
        label: t("home.merchantChart"),
        data: [
          merchantsData?.twoMonthsAgo || 0,
          merchantsData?.lastMonth || 0,
          merchantsData?.thisMonth || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const shipperDataConfig = {
    labels: labels,
    datasets: [
      {
        label: t("home.shipperChart"),
        data: [
          shippersData?.twoMonthsAgo || 0,
          shippersData?.lastMonth || 0,
          shippersData?.thisMonth || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
        ],
        borderWidth: 1,
      },
    ],
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
    <div
      className={cx("container", {
        dark: theme === "dark",
      })}
    >
      <div className={cx("wrapper-date-picker")}>
        <p
          className={cx("title-date-picker", fontSize, {
            dark: theme === "dark",
          })}
        >
          {t("home.seleteDate")}
        </p>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="MM/dd/yyyy"
          className={cx("customDatePicker", fontSize)}
        />
      </div>
      <div className={cx("yumhub-chart-wrapper")}>
        <Bar
          className={cx("yumhub-chart")}
          data={totalYumHub}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                color: theme === "dark" ? "#fff" : "#333",
                text: t("home.yumhubChart"),
                font: {
                  size: getTitleFontSize(),
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <div className={cx("line-bottom")} />
      <div className={cx("wrapper-chart")}>
        <Line
          className={cx("box-chart")}
          data={revenueDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                color: theme === "dark" ? "#fff" : "#333",
                text: t("home.revenueChart"),
                font: {
                  size: getTitleFontSize(),
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
        <div className={cx("line")} />
        <Line
          className={cx("box-chart")}
          data={profitDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                color: theme === "dark" ? "#fff" : "#333",
                text: t("home.profitChart"),
                font: {
                  size: getTitleFontSize(),
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>
      <div className={cx("line-bottom")} />
      <div className={cx("wrapper-chart")}>
        <Bar
          className={cx("box-chart")}
          data={merchantDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: { display: true, text: "" },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
        <div className={cx("line")} />
        <Bar
          className={cx("box-chart")}
          data={shipperDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: { display: true, text: "" },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>

      <div className={cx("line-bottom")} />
      <div className={cx("wrapper-chart")}>
        <PolarArea
          className={cx("box-chart")}
          data={shipDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                color: theme === "dark" ? "#fff" : "#333",
                text: t("home.shipChart"),
                font: {
                  size: getTitleFontSize(),
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: {
              r: {
                ticks: {
                  display: false,
                },
              },
            },
          }}
        />
        <div className={cx("line")} />
        <PolarArea
          className={cx("box-chart")}
          data={foodDataConfig}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                color: theme === "dark" ? "#fff" : "#333",
                text: t("home.foodChart"),
                font: {
                  size: getTitleFontSize(),
                },
                padding: {
                  top: 20,
                  bottom: 30,
                },
              },
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  if (index === 0 || index === 1) {
                    const thirdValue = context.dataset.data[2];
                    const percentageChange =
                      ((value - thirdValue) / thirdValue) * 100;
                    return `${percentageChange.toFixed(2)}%`;
                  }
                  return "";
                },
              },
            },
            scales: {
              r: {
                ticks: {
                  display: false,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Home;
