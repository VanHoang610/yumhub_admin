import React from "react";
import { format, subMonths } from "date-fns";
import { Bar, Line, PolarArea, Doughnut } from "react-chartjs-2";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import ChartDataLabels from "chartjs-plugin-datalabels";
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

// Dữ liệu mẫu

const YUMHUB_DATA = {
  revenue: 100000,
  deal: 9000,
  profit: 80000,
  merchant: 1000,
  shipper: 3600,
};

const REVENUE_DATA = {
  thisMonth: 100000,
  lastMonth: 90000,
  twoMonthsAgo: 80000,
};

const DEAL_DATA = {
  thisMonth: 10000,
  lastMonth: 5000,
  twoMonthsAgo: 8800,
};

const PROFIT_DATA = {
  thisMonth: 20000,
  lastMonth: 25500,
  twoMonthsAgo: 8800,
};

const MERCHANTS_DATA = {
  thisMonth: 50500,
  lastMonth: 79000,
  twoMonthsAgo: 8070,
};

const SHIPPERS_DATA = {
  thisMonth: 990,
  lastMonth: 900,
  twoMonthsAgo: 8900,
};

function Home() {
  const currentDate = new Date();
  const labels = Array.from({ length: 3 }, (_, i) => {
    const date = subMonths(currentDate, i);
    return format(date, "MMMM yyyy");
  }).reverse();

  const totalYumHub = {
    labels: ["Revenue", "Deal", "Profit", "Merchant", "Shipper"],
    datasets: [
      {
        label: "YumHub Chart",
        data: [
          YUMHUB_DATA.revenue,
          YUMHUB_DATA.deal,
          YUMHUB_DATA.profit,
          YUMHUB_DATA.merchant,
          YUMHUB_DATA.shipper,
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const revenueData = {
    labels: labels,
    datasets: [
      {
        label: "Revenue Chart",
        data: [
          REVENUE_DATA.twoMonthsAgo,
          REVENUE_DATA.lastMonth,
          REVENUE_DATA.thisMonth,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const dealData = {
    labels: labels,
    datasets: [
      {
        label: "Deal Chart",
        data: [
          DEAL_DATA.twoMonthsAgo,
          DEAL_DATA.lastMonth,
          DEAL_DATA.thisMonth,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const profitData = {
    labels: labels,
    datasets: [
      {
        label: "Profit Chart",
        data: [
          PROFIT_DATA.twoMonthsAgo,
          PROFIT_DATA.lastMonth,
          PROFIT_DATA.thisMonth,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const merchantData = {
    labels: labels,
    datasets: [
      {
        label: "Merchant Chart",
        data: [
          MERCHANTS_DATA.twoMonthsAgo,
          MERCHANTS_DATA.lastMonth,
          MERCHANTS_DATA.thisMonth,
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

  const shipperData = {
    labels: labels,
    datasets: [
      {
        label: "Shipper Chart",
        data: [
          SHIPPERS_DATA.twoMonthsAgo,
          SHIPPERS_DATA.lastMonth,
          SHIPPERS_DATA.thisMonth,
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

  return (
    <div className={cx("container")}>
      <div className={cx("yumhub-chart-wrapper")}>
        <Line
          className={cx("yumhub-chart")}
          data={totalYumHub}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "YumHub Chart",
                font: {
                  size: 20,
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
        <Doughnut
          className={cx("box-chart")}
          data={revenueData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Revenue Chart",
                font: {
                  size: 20,
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
        <Doughnut
          className={cx("box-chart")}
          data={profitData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Profit Chart",
                font: {
                  size: 20,
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
          data={merchantData}
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
          data={shipperData}
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
      <div className={cx("wrapper-chart", "end-box")}>
        <PolarArea
          className={cx("box-chart")}
          data={dealData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Deal Chart",
                font: {
                  size: 20,
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
