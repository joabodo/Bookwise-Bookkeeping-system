import styles from "./EmptyState.module.css";
const EmptyState = ({
  title,
  description,
  buttonLabel,
  onClick,
  className,
}) => {
  return (
    <div className={`${styles.wrapper} ${className ? className : ""}`}>
      <div className={styles.container}>
        <h2>{title}</h2>
        <p>{description}</p>
        {buttonLabel && (
          <button className="primary primary--blue" onClick={onClick}>
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};
export default EmptyState;
