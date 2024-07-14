import styles from "./BackLink.module.css";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";

const BackLink = ({ children, to, className }) => {
  return (
    <Link to={to} className={`${styles.back} ${className ? className : ""}`}>
      <MdOutlineKeyboardArrowLeft /> {children}
    </Link>
  );
};
export default BackLink;
