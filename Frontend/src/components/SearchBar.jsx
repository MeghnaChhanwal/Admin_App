// SearchBar.jsx
import React from "react";
import styles from "../styles/SearchBar.module.css";

const SearchBar = ({ placeholder, onChange }) => {
  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
