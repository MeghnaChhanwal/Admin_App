import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import { RevenueChart, OrderPieChart } from "../components/chart";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const adminUrl = import.meta.env.VITE_ADMIN_API_URL;
  const userUrl = import.meta.env.VITE_USER_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminRes, userRes] = await Promise.all([
          axios.get(`${adminUrl}/api/dashboard`),
          axios.get(`${userUrl}/api/orders`)  // ✅ Correct endpoint
        ]);

        const userOrders = userRes.data || [];

        const totalRevenue = userOrders.reduce(
          (total, order) => total + (order.totalAmount || 0),
          0
        );

        const uniqueClients = new Set(
          userOrders.map((order) => order.user?.mobile)
        ).size;

        setData({
          chefs: adminRes.data.chefs || [],
          tables: adminRes.data.tables || [],
          orders: userOrders,
          revenue: totalRevenue,
          totalClients: uniqueClients,
        });
      } catch (err) {
        console.error("❌ Failed to fetch dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const totalChefs = data?.chefs?.length || 0;
  const totalOrders = data?.orders?.length || 0;
  const totalRevenue = data?.revenue || 0;
  const totalClients = data?.totalClients || 0;
  const reservedTables = data?.tables?.filter(t => t.isReserved)?.length || 0;
  const availableTables = (data?.tables?.length || 0) - reservedTables;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>Analytics</div>

      <div className={styles.summaryGrid}>
        <div className={styles.box}><h4>Total Chefs</h4><p>{totalChefs}</p></div>
        <div className={styles.box}><h4>Total Revenue</h4><p>₹{totalRevenue}K</p></div>
        <div className={styles.box}><h4>Total Orders</h4><p>{totalOrders}</p></div>
        <div className={styles.box}><h4>Total Clients</h4><p>{totalClients}</p></div>
      </div>

      <div className={styles.graphGrid}>
        <div className={styles.graphBox}>
          <h3>Revenue</h3>
          <RevenueChart orders={data?.orders || []} />
        </div>
        <div className={styles.graphBox}>
          <h3>Order Summary</h3>
          <OrderPieChart orders={data?.orders || []} />
        </div>
        <div className={styles.graphBox}>
          <h3>Tables</h3>
          <div className={styles.tables}>
            {Array.from({ length: 30 }, (_, i) => {
              const id = i + 1;
              const reserved = data?.tables?.some(
                (t) => t.name === `Table ${id}` && t.isReserved
              );
              return (
                <div
                  key={id}
                  className={`${styles.tableBox} ${
                    reserved ? styles.reserved : styles.available
                  }`}
                >
                  Table {String(id).padStart(2, "0")}
                </div>
              );
            })}
          </div>
          <div className={styles.tableLegend}>
            <span className={`${styles.legendBox} ${styles.reserved}`}></span>{" "}
            Reserved
            <span className={`${styles.legendBox} ${styles.available}`}></span>{" "}
            Available
          </div>
        </div>
      </div>

      <div className={styles.chefSection}>
        <h3>Chef Name</h3>
        <div className={styles.chefGrid}>
          {data?.chefs?.map((chef) => (
            <div key={chef._id} className={styles.chefCard}>
              <p>{chef.name}</p>
              <span>Orders: {chef.orderCount || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
