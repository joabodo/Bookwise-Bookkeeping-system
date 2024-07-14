import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useState,
} from "react";
import styles from "./Toggle.module.css";
const Toggle = ({ classname, children }) => {
  const childrenWithContext = Children.map(children, (child) => {
    if (isValidElement) {
      return cloneElement(child, {
        context: ToggleContext,
      });
    }
    return child;
  });
  return (
    <ToggleProvider>
      <div className={`${styles.toggle} ${classname ? classname : ""}`}>
        {childrenWithContext}
      </div>
    </ToggleProvider>
  );
};

const ToggleContext = createContext({});

const ToggleProvider = ({ children }) => {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <ToggleContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </ToggleContext.Provider>
  );
};
export default Toggle;
