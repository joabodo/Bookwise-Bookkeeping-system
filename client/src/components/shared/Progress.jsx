import styles from "./Progress.module.css";
const Progress = ({ title, percentage, detailed = false }) => {
  const percentageStr = percentage ? `${percentage}%` : "0%";
  return (
    <>
      {detailed ? (
        <div className={`${styles.progress} ${styles.detailed}`}>
          <div className={styles.top}>
            <span className={`small-text ${styles.title}`}>{title}</span>
            <span className={`small-text ${styles.value}`}>
              {percentageStr}
            </span>
          </div>
          <div style={{ "--percentage": percentageStr }} className={styles.bar}>
            <div className={styles.marker} />
            <div className={styles.marker} />
            <div className={styles.marker} />
          </div>
        </div>
      ) : (
        <div className={styles.progress}>
          <div className={styles.top}>
            <span className={`small-text ${styles.title}`}>{title}</span>
            <span className={`small-text ${styles.value}`}>
              {percentageStr}
            </span>
          </div>
          <div
            style={{ "--percentage": percentageStr }}
            className={styles.bar}
          />
        </div>
      )}
    </>
  );
};
export default Progress;
