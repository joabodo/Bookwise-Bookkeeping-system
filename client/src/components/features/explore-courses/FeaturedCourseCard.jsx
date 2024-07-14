import { TagItem, TagsContainer } from "components/shared/tags";
import styles from "./FeaturedCourseCard.module.css";
const FeaturedCourseCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src="https://d3efbblnclyxj6.cloudfront.net/public/greyson-joralemon-9IBqihqhuHc-unsplash.jpg"
          alt="course-img"
        />
      </div>
      <div className={styles.info}>
        <TagsContainer>
          <TagItem color="purple" label="Featured" />
        </TagsContainer>
        <h2>Equip 2024</h2>
        <p>
          Embark on a transformative journey through the New Testament epistles
          in "Equip 2024". This in-depth course will guide you
          chapter-by-chapter, unlocking the meaning and application of these
          powerful letters for your life today.
        </p>
      </div>
    </div>
  );
};
export default FeaturedCourseCard;
