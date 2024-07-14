import styles from "./Tags.module.css";
const TagItem = ({ label = "", outlined = false, color = "purple" }) => {
  const colorStyles = {
    purple: styles.purple,
    lime: styles.lime,
    oxford: styles.oxfordBlue,
  };
  return (
    <div
      className={`${styles.tagItem} ${
        outlined ? styles.outline : styles.fill
      } ${colorStyles[color]}`}
    >
      {label}
    </div>
  );
};
export default TagItem;
