import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";
import { RevenueChart, OrderPieChart } from "../components/chart";

const Dashboard = () => {
  const [data, setData] = useState({
    totalChef: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
    thisWeekRevenue: 0,
    tableStats: { reserved: 0, available: 0 },
    orderSummary: { dinein: 0, takeaway: 0, served: 0 },
    revenueChart: [],
    chefStats: [],
    recentOrders: []
  });
  const [chefName, setChefName] = useState("");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload]);

  const handleAddChef = async () => {
    if (!chefName.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/dashboard/chef", { name: chefName });
      setChefName("");
      setReload(!reload);
    } catch  {
      alert("Error adding chef");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      {/* Top Summary Row */}
      <div className={styles.summaryRow}>
        <div className={styles.card}><h3>Total Chef</h3><p>{data.totalChef}</p></div>
        <div className={styles.card}><h3>Total Revenue</h3><p>₹{data.totalRevenue}</p></div>
        <div className={styles.card}><h3>Total Orders</h3><p>{data.totalOrders}</p></div>
        <div className={styles.card}><h3>Total Clients</h3><p>{data.totalClients}</p></div>
      </div>

      {/* Three Horizontal Sections */}
      <div className={styles.middleRow}>
        <div className={styles.box}><h3>Revenue (Daily)</h3><RevenueChart data={data.revenueChart} /></div>
        <div className={styles.box}>
          <h3>Order Summary</h3>
          <div className={styles.summaryDetails}>
            <p><strong>Served:</strong> {data.orderSummary.served}</p>
            <p><strong>Dine In:</strong> {data.orderSummary.dinein}</p>
            <p><strong>Take Away:</strong> {data.orderSummary.takeaway}</p>
          </div>
          <OrderPieChart data={data.orderSummary} />
        </div>
        <div className={styles.box}>
          <h3>Table Stats</h3>
          <div className={styles.tableStats}>
            <div className={styles.tableCard + " " + styles.reserved}>Reserved: {data.tableStats.reserved}</div>
            <div className={styles.tableCard + " " + styles.available}>Available: {data.tableStats.available}</div>
          </div>
        </div>
      </div>

      {/* Chef Section */}
      <div className={styles.chefSection}>
        <h3>Chef : Order Count</h3>
        {data.chefStats.map((chef, idx) => (
          <div key={idx} className={styles.chefRow}>
            <span>{chef.name}</span>
            <span>{chef.orders}</span>
          </div>
        ))}
        <div className={styles.addChef}>
          <input
            type="text"
            placeholder="New Chef Name"
            value={chefName}
            onChange={(e) => setChefName(e.target.value)}
          />
          <button onClick={handleAddChef}>Add Chef</button>
        </div>
      </div>
    </div>
  );
};
export default Dashboard