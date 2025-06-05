// components/FilterDropdown.jsx
import React from "react";
import styles from "../styles/Filter.module.css";
import { X } from "lucide-react"; // Optional: if using lucide-react icons

const FilterDropdown = ({ selected, onSelect, onClear }) => {
  const options = ["Revenue", "Order Summary", "Table Stats"];

  return (
    <div className={styles.filterDropdown}>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className={styles.select}
      >
        <option value="">Filter...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {selected && (
        <button className={styles.clearButton} onClick={onClear}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default FilterDropdown;
