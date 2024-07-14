import { useRef } from "react";
import styles from "./Search.module.css";
import { IoClose, IoSearch } from "react-icons/io5";
const SearchBar = ({ placeholder, search, setSearch, className }) => {
  const inputRef = useRef();
  const resetSearch = () => {
    setSearch("");
    inputRef.current.focus();
  };
  return (
    <div className={`${styles.search} ${className || ""}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder || ""}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.icon}>
        {search ? (
          <IoClose onClick={resetSearch} className={styles.clear} />
        ) : (
          <IoSearch />
        )}
      </div>
    </div>
  );
};
export default SearchBar;
