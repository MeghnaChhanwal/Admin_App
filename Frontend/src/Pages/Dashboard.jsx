import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import { RevenueChart, OrderPieChart } from "../components/chart";
import axios from "axios";

const API_ADMIN_URL = import.meta.env.VITE_ADMIN_API_URL;
const API_USER_URL = import.meta.env.VITE_USER_API_URL;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [chefName, setChefName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await axios.get(`${API_ADMIN_URL}/api/dashboard`);
        const tablesRes = await axios.get(`${API_ADMIN_URL}/api/tables`);
        const ordersRes = await axios.get(`${API_USER_URL}/api/cart`);

        const orders = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : ordersRes.data.orders || [];

        const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const uniqueClients = new Set(
          orders.map((o) => o.user?.mobile).filter(Boolean)
        ).size;

        const dineInCount = orders.filter((o) =>
          (o.orderType || "").toLowerCase().includes("dine")
        ).length;

        const takeAwayCount = orders.filter((o) =>
          (o.orderType || "").toLowerCase().includes("take")
        ).length;

        const summaryStats = {
          dineIn: dineInCount,
          takeAway: takeAwayCount,
        };

        const tables = (tablesRes.data || []).map((table) => ({
          ...table,
          chairCount: table.chairs,
          isReserved: table.status === "reserved",
        }));

        setData({
          chefs: dashRes.data.chefStats || [],
          tables,
          orders,
          revenue,
          totalClients: uniqueClients,
          summaryStats,
        });
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError("Failed to load dashboard data.");
      }
    };

    fetchData();
  }, []);

  // ✅ Add new chef
  const handleAddChef = async () => {
    if (!chefName.trim()) {
      alert("Chef name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_ADMIN_URL}/api/dashboard/chef`, {
        name: chefName.trim(),
      });

      setData((prev) => ({
        ...prev,
        chefs: [...prev.chefs, res.data],
      }));

      setChefName("");
    } catch (err) {
      console.error("Add Chef Error:", err);
      if (err.response?.data?.error) {
        alert(`Failed to add chef: ${err.response.data.error}`);
      } else {
        alert("Failed to add chef. Please try again.");
      }
    }
    setLoading(false);
  };

  // ✅ Assign dummy order to chef (for testing increment)
  const handleAssignOrder = async (chefId) => {
    try {
      const res = await axios.put(
        `${API_ADMIN_URL}/api/dashboard/chef/${chefId}/increment`
      );
      setData((prev) => ({
        ...prev,
        chefs: prev.chefs.map((chef) =>
          chef._id === chefId ? res.data : chef
        ),
      }));
    } catch (err) {
      console.error("Assign Order Error:", err);
      alert("Failed to assign order to chef.");
    }
  };

  // ⏳ Loading / error state
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return <div className={styles.loading}>Loading dashboard data...</div>;

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.header}>Dashboard Analytics</h2>

      {/* TOP CARDS */}
      <div className={styles.summaryGrid}>
        <div className={styles.box}>
          <h4>Total Chefs</h4>
          <p>{data.chefs.length}</p>
        </div>
        <div className={styles.box}>
          <h4>Total Revenue</h4>
          <p>₹{data.revenue.toLocaleString("en-IN")}</p>
        </div>
        <div className={styles.box}>
          <h4>Total Orders</h4>
          <p>{data.orders.length}</p>
        </div>
        <div className={styles.box}>
          <h4>Total Clients</h4>
          <p>{data.totalClients}</p>
        </div>
      </div>

      {/* CHARTS + TABLES */}
      <div className={styles.graphGrid}>
        <div className={styles.graphBox}>
          <h3>Revenue Over Time</h3>
          <RevenueChart orders={data.orders} />
        </div>

        <div className={styles.graphBox}>
          <h3>Order Type Summary</h3>
          <OrderPieChart stats={data.summaryStats} />
          <div>
            <p>Dine In: {data.summaryStats.dineIn}</p>
            <p>Take Away: {data.summaryStats.takeAway}</p>
          </div>
        </div>

        <div className={styles.graphBox}>
          <h3>Tables Status</h3>
          <div className={styles.tables}>
            {data.tables.length === 0 ? (
              <p>No tables found.</p>
            ) : (
              data.tables
                .slice()
                .sort((a, b) => {
                  const numA = parseInt(a.name.replace(/\D/g, ""), 10) || 0;
                  const numB = parseInt(b.name.replace(/\D/g, ""), 10) || 0;
                  return numA - numB;
                })
                .map((table) => (
                  <div
                    key={table._id}
                    className={`${styles.tableBox} ${
                      table.isReserved ? styles.reserved : styles.available
                    }`}
                  >
                    <p>{table.name}</p>
                    <p>🪑 {table.chairCount || 0}</p>
                  </div>
                ))
            )}
          </div>
          <div className={styles.tableLegend}>
            <span className={`${styles.legendBox} ${styles.available}`}></span> Available
            <span className={`${styles.legendBox} ${styles.reserved}`}></span> Reserved
          </div>
        </div>
      </div>

      {/* CHEF SECTION */}
      <div className={styles.chefSection}>
        <h3>Chefs</h3>
        <div className={styles.chefInputBox}>
          <input
            type="text"
            value={chefName}
            onChange={(e) => setChefName(e.target.value)}
            placeholder="Enter chef name"
            className={styles.input}
          />
          <button
            className={styles.button}
            onClick={handleAddChef}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Chef"}
          </button>
        </div>

        <div className={styles.chefGrid}>
          {data.chefs.map((chef) => (
            <div key={chef._id} className={styles.chefCard}>
              <p><strong>{chef.name}</strong></p>
              <p>Orders Assigned: {chef.orderCount}</p>
              <button
                className={styles.assignBtn}
                onClick={() => handleAssignOrder(chef._id)}
              >
                Assign Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
