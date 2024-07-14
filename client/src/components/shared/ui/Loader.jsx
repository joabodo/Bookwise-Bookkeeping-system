import { LuLoader2 } from "react-icons/lu";
import styles from "./Loader.module.css";

const Loader = ({ white = false }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinnerWrapper}>
        <LuLoader2
          className={`${styles.spinner} ${white ? styles.white : styles.black}`}
        />
      </div>
    </div>
  );
};
export default Loader;
