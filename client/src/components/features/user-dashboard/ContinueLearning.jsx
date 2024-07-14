import styles from "./ContinueLearning.module.css";
import { IoPlayOutline } from "react-icons/io5";
const ContinueLearning = () => {
  return (
    <div className={styles.continueLearning}>
      <h2>Continue Learning</h2>
      <p>Pick up right where you left off with FTSG 2024, Module 3</p>
      <button className="primary--lime">
        <IoPlayOutline /> Resume
      </button>
    </div>
  );
};
export default ContinueLearning;
