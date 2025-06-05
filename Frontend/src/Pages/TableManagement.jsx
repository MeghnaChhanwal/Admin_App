import React, { useEffect, useState } from "react";
import styles from "../styles/Table.module.css";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [name, setName] = useState("");
  const [chairs, setChairs] = useState(1);
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tables");
      const data = await res.json();

      const sorted = data.sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.name.replace(/\D/g, "")) || 0;
        return numA - numB;
      });

      const renamed = await Promise.all(
        sorted.map(async (table, index) => {
          const correctName = `Table ${index + 1}`;
          if (table.name !== correctName) {
            await fetch(`http://localhost:5000/api/tables/${table._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: correctName }),
            });
            return { ...table, name: correctName };
          }
          return table;
        }),
      );

      setTables(renamed);
      setName(`${renamed.length + 1}`);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const handleCreate = async () => {
    const tableName = name ? `Table ${name}` : `Table ${tables.length + 1}`;
    const chairCount = parseInt(chairs);

    if (!tableName || chairCount < 1) {
      alert("Please enter valid values");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tableName, chairs: chairCount }),
      });

      if (res.ok) {
        setChairs(1);
        setShowCreateBox(false);
        fetchTables();
      } else {
        const errorText = await res.text();
        console.error("Create table failed:", errorText);
        alert("Failed to create table.");
      }
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this table?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tables/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTables();
      }
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  const toggleReservation = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tables/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isReserved: !currentStatus }),
      });

      if (res.ok) {
        fetchTables();
      }
    } catch (error) {
      console.error("Error toggling reservation:", error);
    }
  };

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Table Management</h2>

      <input
        type="text"
        placeholder="Search Table..."
        className={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={styles.grid}>
        {!showCreateBox ? (
          <div className={styles.card} onClick={() => setShowCreateBox(true)}>
            <div className={styles.plusSign}>+</div>
            <p>Create Table</p>
          </div>
        ) : (
          <div className={styles.card}>
            <p className={styles.label}>Table name (auto)</p>
            <div className={styles.nameDisplay}>{`Table ${name}`}</div>
            <hr className={styles.dashed} />
            <p className={styles.label}>Chairs</p>
            <select
              className={styles.select}
              value={chairs}
              onChange={(e) => setChairs(parseInt(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            <button className={styles.createBtn} onClick={handleCreate}>
              Create
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setShowCreateBox(false)}
            >
              Cancel
            </button>
          </div>
        )}

        {filteredTables.map((t) => (
          <div
            key={t._id}
            className={`${styles.card} ${t.isReserved ? styles.reserved : ""}`}
          >
            <strong>{t.name}</strong>

            <p className={styles.chairLine}>
              <img
                src="/assets/logo/chair.png"
                alt="Chair"
                className={styles.icon}
              />
              {t.chairs}
            </p>

            <p>Status: {t.isReserved ? "Reserved" : "Available"}</p>

            <button
              className={styles.toggleBtn}
              onClick={() => toggleReservation(t._id, t.isReserved)}
            >
              {t.isReserved ? "Mark Available" : "Mark Reserved"}
            </button>

            <button
              className={styles.iconBtn}
              onClick={() => handleDelete(t._id)}
            >
              <img
                src="/assets/logo/delete.png"
                alt="Delete"
                className={styles.icon}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
