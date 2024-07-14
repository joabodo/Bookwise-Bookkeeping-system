import styles from "./LoadScreen.module.css";
import { LuLoader2 } from "react-icons/lu";
import LogoMark from "assets/logo-mark.svg";
import { ReactSVG } from "react-svg";
const LoadScreen = () => {
  return (
    <div className={styles.wrapper}>
      <ReactSVG src={LogoMark} className={styles.logo} />
      <div className={styles.spinnerWrapper}>
        <LuLoader2 className={styles.spinner} />
      </div>
    </div>
  );
};
export default LoadScreen;
