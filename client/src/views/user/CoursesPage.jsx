import Notifications from "components/features/notifications";
import styles from "./CoursesPage.module.css";
import GridSection from "components/shared/GridSection";
import SearchBar from "components/shared/search/SearchBar";
import { useState } from "react";
import FeaturedCourseCard from "components/features/explore-courses/FeaturedCourseCard";

const CoursesPage = () => {
  const [search, setSearch] = useState("");
  return (
    <>
      <GridSection>
        <div className={styles.header}>
          <div className={styles.searchWrapper}>
            <SearchBar search={search} setSearch={setSearch} />
          </div>
          {search}
          <Notifications />
        </div>
      </GridSection>
      <GridSection>
        <div className={styles.featuredCardWrapper}>
          <FeaturedCourseCard />
        </div>
      </GridSection>
    </>
  );
};
export default CoursesPage;
