import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,  // 👈 Required for fill to work
  ArcElement
);

// ⭕ Pie Chart – Dine In vs Takeaway
export const OrderPieChart = ({ orders }) => {
  const dinein = orders.filter(o => o.orderType === "dinein").length;
  const takeaway = orders.filter(o => o.orderType === "takeaway").length;

  const data = {
    labels: ["Dine In", "Take Away"],
    datasets: [
      {
        label: "Order Type",
        data: [dinein, takeaway],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverOffset: 6,
      },
    ],
  };

  return <Pie data={data} />;
};

// 📈 Line Chart – Revenue Chart (Daily)
export const RevenueChart = ({ orders, view = "daily" }) => {
  const dataMap = {
    daily: Array(7).fill(0),
    weekly: Array(4).fill(0),
    monthly: Array(12).fill(0),
  };

  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const amount = order.cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    if (view === "daily") {
      dataMap.daily[date.getDay()] += amount;
    } else if (view === "weekly") {
      const week = Math.floor(date.getDate() / 7);
      dataMap.weekly[week] += amount;
    } else if (view === "monthly") {
      dataMap.monthly[date.getMonth()] += amount;
    }
  });

  const labels =
    view === "daily"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      : view === "weekly"
      ? ["Week 1", "Week 2", "Week 3", "Week 4"]
      : [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: dataMap[view],
        borderColor: "#3f51b5",
        backgroundColor: "rgba(63,81,181,0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
