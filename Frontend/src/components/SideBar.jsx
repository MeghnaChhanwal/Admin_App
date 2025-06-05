import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      {/* Logo-based Nav Group */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.logoLink} ${isActive ? styles.active : ""}`
        }
      >
        <img
          src="./assets/logo/Dash.png"
          alt="Dashboard"
          className={styles.logo}
        />
      </NavLink>
      <NavLink
        to="/tables"
        className={({ isActive }) =>
          `${styles.logoLink} ${isActive ? styles.active : ""}`
        }
      >
        <img
          src="../assets/logo/Table.png"
          alt="Tables"
          className={styles.logo}
        />
      </NavLink>
      <NavLink
        to="/orders"
        className={({ isActive }) =>
          `${styles.logoLink} ${isActive ? styles.active : ""}`
        }
      >
        <img src="/assets/logo/Book.png" alt="Orders" className={styles.logo} />
      </NavLink>
    </div>
  );
};

export default Sidebar;
