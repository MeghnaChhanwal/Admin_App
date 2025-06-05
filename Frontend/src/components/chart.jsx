import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Colors for Pie slices
const COLORS = ["#0088FE", "#FF8042"];

// Pie Chart: Order Summary
export const OrderPieChart = ({ data }) => {
  const chartData = [
    { name: "Dine-in", value: data.dinein || 0 },
    { name: "Takeaway", value: data.takeaway || 0 },
  ];

  return (
    <PieChart width={300} height={250}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

// Line Chart: Revenue over time
export const RevenueChart = ({ data }) => {
  return (
    <LineChart width={500} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#00C49F"
        strokeWidth={2}
      />
    </LineChart>
  );
};
