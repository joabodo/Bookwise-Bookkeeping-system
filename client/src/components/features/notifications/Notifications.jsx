import styles from "./Notifications.module.css";
import { FiBell } from "react-icons/fi";
const Notifications = () => {
  return (
    <div className={styles.notifications}>
      <div className={styles.hasNotification}>
        <FiBell className={styles.bell} />
      </div>
    </div>
  );
};
export default Notifications;
