import { Fragment } from "react";
import styles from "./Leaderboard.module.css";
import useAuth from "hooks/context/auth/useAuth";

const Leaderboard = ({ classname }) => {
  const { user } = useAuth();
  //TODO: Add confirmation prompt on enable with message "By enabling leaderboards, your username and Spiritual Growth Points (SGP) will be visible to other users, and you'll be able to see theirs too."
  return (
    <div className={`${styles.wrapper} ${classname}`}>
      <h2>Leaderboard</h2>
      {user.leaderBoardEnabled ? (
        <div className={styles.users}>
          {Array.apply(null, Array(5)).map((card, index, arr) => {
            return (
              <Fragment key={index}>
                <div className={styles.user}>
                  <div className={styles.info}>
                    <img
                      src="https://d3efbblnclyxj6.cloudfront.net/public/greyson-joralemon-9IBqihqhuHc-unsplash.jpg"
                      alt="profile-img"
                      className={styles.profileImg}
                    />
                    <span className={styles.username}>David Manufor</span>
                  </div>
                  <div className={styles.points}>
                    <span className={styles.value}>297</span>
                    <span className={styles.unit}>GP</span>
                  </div>
                </div>
                {index !== arr.length - 1 && <div className={styles.divider} />}
              </Fragment>
            );
          })}
        </div>
      ) : (
        <div className={styles.enablePrompt}>
          <p>
            See how you stack up against others and challenge yourself to climb
            the ranks!
          </p>
          <button className="primary--purple">Enable</button>
        </div>
      )}
    </div>
  );
};
export default Leaderboard;
