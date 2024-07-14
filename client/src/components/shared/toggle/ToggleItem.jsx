import { useContext, useEffect, useState, useRef } from "react";
import styles from "./Toggle.module.css";
const ToggleItem = ({
  isDefault = false,
  disabled = false,
  onClick,
  context,
  children,
}) => {
  if (!context)
    throw Error("ToggleItem Component used oustide of Toggle Context");

  const { activeItem, setActiveItem } = useContext(context);
  const [isActive, setIsActive] = useState(false);
  const itemRef = useRef();

  useEffect(() => {
    if (isDefault) setActiveItem(itemRef.current);
  }, []);

  useEffect(() => {
    setIsActive(activeItem === itemRef.current);
  }, [activeItem]);

  const handleClick = () => {
    if (disabled) return;
    // Set to active and run onclick
    setActiveItem(itemRef.current);
    onClick();
  };

  return (
    <div
      ref={itemRef}
      className={`${styles.toggleItem} ${isActive ? styles.active : ""}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
export default ToggleItem;
