import { UserProfile } from "@clerk/clerk-react";
import styles from "./UserProfilePage.module.css";

const UserProfilePage = () => {
  return (
    <UserProfile
      routing="virtual"
      appearance={{
        elements: {
          rootBox: styles.rootBox,
          cardBox: styles.cardBox,
        },
      }}
    />
  );
};
export default UserProfilePage;
