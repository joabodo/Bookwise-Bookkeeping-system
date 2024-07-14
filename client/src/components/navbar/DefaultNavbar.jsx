import styles from "./DefaultNavbar.module.css";
import { NavLink } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { IoMdExit } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa";
import LogoWhite from "assets/logo-white.svg";
import LogoMark from "assets/logo-mark.svg";
import NAVBAR_LINKS from "constants/NAVBAR_LINKS";
import { useState } from "react";
import { SignOutButton } from "@clerk/clerk-react";
// import useAuth from "hooks/context/auth/useAuth";
const DefaultNavbar = () => {
  // const { user, logout } = useAuth();
  const [closed, setClosed] = useState(true);
  // const links = user.role === "user" ? NAVBAR_LINKS.user : NAVBAR_LINKS.admin;
  const links = NAVBAR_LINKS.user;
  return (
    <div className={`${styles.navWrapper} ${closed ? styles.closed : ""}`}>
      <div className={styles.overlay} />
      <nav className={styles.navbar}>
        <div className={styles.linksWrapper}>
          <NavLink to={"/"} className={styles.logo}>
            {!closed && <ReactSVG src={LogoWhite} />}
            {closed && <ReactSVG src={LogoMark} />}
          </NavLink>
          <ul className={styles.links}>
            {links.map((navLink) => (
              <li key={navLink.name.default}>
                <div className={styles.toolTip}>{navLink.name.default}</div>
                <NavLink
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ""}`
                  }
                  to={navLink.link}
                >
                  <navLink.icon className={styles.icon} />
                  <span>{navLink.name.default}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <SignOutButton redirectUrl="/signin">
                <button className={`secondary--white ${styles.logout}`}>
                  <IoMdExit /> <span>Sign Out</span>
                </button>
              </SignOutButton>
            </li>
          </ul>
        </div>
        <button
          className={`no-animate ${styles.toggle}`}
          onClick={() => setClosed((prev) => !prev)}
        >
          <FaChevronLeft />
        </button>
      </nav>
    </div>
  );
};
export default DefaultNavbar;
