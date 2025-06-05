import React, { useEffect, useState } from "react";
import styles from "../styles/Order.module.css";

// Loading shimmer component inside this file for simplicity
function LoadingShimmer() {
  return (
    <div className={styles.shimmerWrapper}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className={styles.shimmerCard}>
          <div className={styles.shimmerLineShort}></div>
          <div className={styles.shimmerLineLong}></div>
          <div className={styles.shimmerLineMedium}></div>
          <div className={styles.shimmerLineShort}></div>
        </div>
      ))}
    </div>
  );
}

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editData, setEditData] = useState({ chef: "", table: "", status: "" });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchChefs(), fetchTables()]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchChefs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chefs");
      const data = await res.json();
      setChefs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching chefs:", err);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tables");
      const data = await res.json();
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  const updateOrderAPI = async (orderId, body) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await fetchOrders();
      setEditingOrderId(null);
      setEditData({ chef: "", table: "", status: "" });
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderAPI(orderId, { status: newStatus });
  };

  const handleEditClick = (order) => {
    setEditingOrderId(order._id);
    setEditData({
      chef: order.chef?._id || "",
      table: order.table?._id || "",
      status: order.status,
    });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = () => {
    if (editingOrderId) {
      updateOrderAPI(editingOrderId, {
        chef: editData.chef,
        table: editData.table,
        status: editData.status,
      });
    }
  };

  const getDuration = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    return `${Math.floor((now - start) / 60000)} min`;
  };

  const reservedTableIds = new Set(
    orders
      .filter((o) => o.table?._id && o.status !== "Done")
      .map((o) => o.table._id)
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Order Line</h2>
      {loading ? (
        <LoadingShimmer />
      ) : (
        <div className={styles.orderGrid}>
          {orders.map((order, idx) => (
            <div
              key={order._id}
              className={`${styles.orderCard} ${styles.fadeIn}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={styles.statusLine}>
                <span className={`${styles.status} ${styles[order.status.replace(/\s/g, "").toLowerCase()]}`}>
                  {order.status}
                </span>
                <span className={styles.duration}>{getDuration(order.createdAt)}</span>
              </div>

              <div className={styles.items}>
                {order.cartItems.map((item, i) => (
                  <p key={i}>
                    {item.name} x{item.qty}
                  </p>
                ))}
                {order.instructions && (
                  <p className={styles.instructions}>
                    <em>{order.instructions}</em>
                  </p>
                )}
              </div>

              <div className={styles.metaInfo}>
                <p>Order #{order._id.slice(-4).toUpperCase()}</p>
                <p>{order.orderType}</p>
                <p>Table: {order.table?.name || "N/A"}</p>
                <p>Total Items: {order.cartItems.length}</p>
                {order.chef && order.totalPrepTime && (
                  <p>Prep Time: {order.totalPrepTime} min</p>
                )}
              </div>

              {editingOrderId === order._id ? (
                <div className={styles.editSection}>
                  <label>Chef:</label>
                  <select
                    value={editData.chef}
                    onChange={(e) => handleEditChange("chef", e.target.value)}
                  >
                    <option value="">-- Select Chef --</option>
                    {chefs.map((chef) => (
                      <option key={chef._id} value={chef._id}>
                        {chef.name}
                      </option>
                    ))}
                  </select>

                  <label>Table:</label>
                  <select
                    value={editData.table}
                    onChange={(e) => handleEditChange("table", e.target.value)}
                  >
                    <option value="">-- Select Table --</option>
                    {tables.map((table) => (
                      <option
                        key={table._id}
                        value={table._id}
                        disabled={
                          reservedTableIds.has(table._id) &&
                          table._id !== order.table?._id
                        }
                      >
                        {table.name}{" "}
                        {reservedTableIds.has(table._id) &&
                        table._id !== order.table?._id
                          ? "(Reserved)"
                          : ""}
                      </option>
                    ))}
                  </select>

                  <label>Status:</label>
                  <select
                    value={editData.status}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                  >
                    {["Processing", "Served", "Not Picked up", "Done"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    )}
                  </select>

                  <button onClick={handleSaveClick} className={styles.saveBtn}>
                    Save
                  </button>
                  <button
                    onClick={() => setEditingOrderId(null)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {!order.chef && order.status !== "Done" && (
                    <div className={styles.chefAssign}>
                      <label>Assign Chef:</label>
                      <select
                        onChange={(e) =>
                          updateOrderAPI(order._id, { chef: e.target.value })
                        }
                        value={order.chef?._id || ""}
                      >
                        <option value="">-- Select Chef --</option>
                        {chefs.map((chef) => (
                          <option key={chef._id} value={chef._id}>
                            {chef.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {!order.table && order.status !== "Done" && (
                    <div className={styles.tableAssign}>
                      <label>Assign Table:</label>
                      <select
                        onChange={(e) =>
                          updateOrderAPI(order._id, { table: e.target.value })
                        }
                        value={order.table?._id || ""}
                      >
                        <option value="">-- Select Table --</option>
                        {tables.map((table) => (
                          <option
                            key={table._id}
                            value={table._id}
                            disabled={reservedTableIds.has(table._id)}
                          >
                            {table.name}{" "}
                            {reservedTableIds.has(table._id) ? "(Reserved)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={styles.btnGroup}>
                    {["Processing", "Served", "Not Picked up", "Done"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order._id, status)}
                          disabled={status === "Done" && !order.table}
                          className={`${styles.statusBtn} ${
                            order.status === status ? styles.active : ""
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>

                  {order.status !== "Done" && (
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditClick(order)}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
