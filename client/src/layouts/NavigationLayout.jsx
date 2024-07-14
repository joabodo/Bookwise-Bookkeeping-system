import styles from "./NavigationLayout.module.css";
import Navbar from "components/navbar";
import { Outlet } from "react-router-dom";
const NavigationLayout = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default NavigationLayout;
