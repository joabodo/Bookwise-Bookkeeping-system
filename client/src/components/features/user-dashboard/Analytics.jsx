import { useState } from "react";
import styles from "./Analytics.module.css";
import { motion } from "framer-motion";
import { Toggle, ToggleItem } from "components/shared/toggle";
import { FaFire } from "react-icons/fa";
import { IoHourglass } from "react-icons/io5";
const Analytics = () => {
  const [activityView, setActivityView] = useState("week");
  return (
    <div className={styles.analytics}>
      <div className={styles.activity}>
        <div className={styles.activityHeader}>
          <div className={styles.activityTitle}>
            <span className="heading-3">Activity</span>
            <div className={styles.divider} />
            <p>Mar 24 - Mar 31</p>
          </div>
          <Toggle>
            <ToggleItem isDefault onClick={() => setActivityView("week")}>
              Week
            </ToggleItem>
            <ToggleItem onClick={() => setActivityView("month")}>
              Month
            </ToggleItem>
          </Toggle>
        </div>
        <ul className={styles.barChart}>
          {/* Generate Random Bars */}
          {activityView === "week" &&
            Array.apply(null, Array(7)).map((bar, index) => {
              const rand = Math.floor(Math.random() * (90 - 10)) + 10;
              return (
                <li key={index} className={styles.barChartItem}>
                  <div className={styles.bar}>
                    <motion.div
                      className={styles.fill}
                      initial={{ height: 0 }}
                      animate={{ height: `${rand}%` }}
                    />
                  </div>
                  <span className={`small-text ${styles.label}`}>Mon</span>
                </li>
              );
            })}
          {activityView === "month" &&
            Array.apply(null, Array(30)).map((bar, index) => {
              const rand = Math.floor(Math.random() * (90 - 10)) + 10;
              return (
                <li key={index} className={styles.barChartItem}>
                  <div className={styles.bar}>
                    <motion.div
                      className={styles.fill}
                      initial={{ height: 0 }}
                      animate={{ height: `${rand}%` }}
                    />
                  </div>
                  <span className={`small-text ${styles.label}`}>
                    {String(index + 1).padStart(2, "0s")}
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <FaFire className={styles.statIcon} />
          <div className={styles.valueWrapper}>
            <span className={styles.value}>10</span>
            <span className={styles.unit}>hrs</span>
          </div>
          <span className={styles.name}>Daily avg.</span>
        </div>
        <div className={styles.stat}>
          <IoHourglass className={styles.statIcon} />
          <div className={styles.valueWrapper}>
            <span className={styles.value}>14</span>
            <span className={styles.unit}>days</span>
          </div>
          <span className={styles.name}>Streak</span>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
