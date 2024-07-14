import styles from "./MobileNavbar.module.css";
import { NavLink } from "react-router-dom";
import { ReactSVG } from "react-svg";
import LogoMark from "assets/logo-mark.svg";
import NAVBAR_LINKS from "constants/NAVBAR_LINKS";
import useAuth from "hooks/context/auth/useAuth";
const MobileNavbar = () => {
  // const { user } = useAuth();
  // const links = user.role === "user" ? NAVBAR_LINKS.user : NAVBAR_LINKS.admin;
  const links = NAVBAR_LINKS.user;
  return (
    <div className={styles.navWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.logoWrapper}>
          <ReactSVG src={LogoMark} />
        </div>
        <ul className={styles.links}>
          {links.map((navLink) => (
            <li key={navLink.name.mobile}>
              <NavLink
                to={navLink.link}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                <navLink.icon className={styles.icon} />
                <span>{navLink.name.mobile}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
export default MobileNavbar;
