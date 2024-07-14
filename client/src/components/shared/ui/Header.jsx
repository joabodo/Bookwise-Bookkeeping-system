import styles from "./Header.module.css";
import { UserButton, useUser } from "@clerk/clerk-react";
import GridSection from "../GridSection";
import Notifications from "components/features/notifications";

const Header = () => {
  const { user } = useUser();
  return (
    <GridSection>
      <div className={styles.header}>
        <div className={styles.profile}>
          <UserButton
            userProfileMode="navigation"
            userProfileUrl="/account-settings"
          >
            {/* <img
              src={user.imageUrl}
              alt="profile-image"
              className={styles.image}
            /> */}
          </UserButton>
          <div className={styles.personalisation}>
            <h4 className={`heading-4`}>{`Hello, ${
              user.fullName ? user.fullName : ""
            }`}</h4>
            <span className="small-text">welcome back to your dashboard</span>
          </div>
        </div>
        <Notifications />
      </div>
    </GridSection>
  );
};
export default Header;
