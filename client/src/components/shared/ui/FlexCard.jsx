import styles from "./FlexCard.module.css";
const FlexCard = ({ children, className, clickable = false, onClick }) => {
  return (
    <div
      className={`${styles.card} ${className ? className : ""} ${
        onClick ? styles.clickable : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
export default FlexCard;
