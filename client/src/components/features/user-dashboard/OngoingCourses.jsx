import { Link } from "react-router-dom";
import styles from "./OngoingCourses.module.css";
import ROUTES from "constants/ROUTES";
import Progress from "components/shared/Progress";
const OngoingCourses = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Ongoing Courses</h2>
        <Link to={ROUTES.learning}>View All</Link>
      </div>
      <div className={styles.ongoingCourses}>
        {Array.apply(null, Array(7)).map((card, index) => {
          const rand = Math.floor(Math.random() * (90 - 10)) + 10;
          return (
            <div key={index} className={styles.courseCard}>
              <img
                src="https://d3efbblnclyxj6.cloudfront.net/public/greyson-joralemon-9IBqihqhuHc-unsplash.jpg"
                alt="course-name"
                className={styles.image}
              />
              <div className={styles.info}>
                <h4>Equip: Understanding the meanings in the scriptures</h4>
                <Progress title={"Progress"} percentage={rand} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OngoingCourses;
