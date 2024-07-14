import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import { IoClose } from "react-icons/io5";
const Modal = ({ open, handleClose, className, title, children }) => {
  return (
    <>
      {open && (
        <div className={styles.modal}>
          <div className={`${styles.content} ${className ? className : ""}`}>
            <div className={styles.topBar}>
              <h3>{title}</h3>{" "}
              <IoClose className={styles.icon} onClick={handleClose} />
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};
export default Modal;
