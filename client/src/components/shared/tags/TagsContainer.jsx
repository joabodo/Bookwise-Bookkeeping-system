import styles from "./Tags.module.css";
const TagsContainer = ({ children, className }) => {
  return (
    <div className={`${styles.tagsContainer} ${className ? className : ""}`}>
      {children}
    </div>
  );
};
export default TagsContainer;
