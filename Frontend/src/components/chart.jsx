import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Revenue Line Chart component
export const RevenueChart = ({ orders }) => {
  // Group revenue by date (YYYY-MM-DD)
  const revenueByDate = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0]; // e.g. '2025-06-06'
    const amount = order.totalAmount || order.grandTotal || 0;
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {});

  // Sort dates ascending
  const sortedDates = Object.keys(revenueByDate).sort();

  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: "Revenue (₹)",
        data: sortedDates.map((date) => revenueByDate[date]),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3, // smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Daily Revenue" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Format y-axis ticks with ₹
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

// Order Type Pie Chart component
export const OrderPieChart = ({ stats }) => {
  const data = {
    labels: ["Dine In", "Take Away"],
    datasets: [
      {
        label: "Order Types",
        data: [stats.dineIn || 0, stats.takeAway || 0],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Order Type Distribution" },
    },
  };

  return <Pie data={data} options={options} />;
};
