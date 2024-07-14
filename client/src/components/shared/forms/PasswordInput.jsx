import { useState } from "react";
import FormStyles from "./Form.module.css";
import { BiHide, BiShow } from "react-icons/bi";

const PasswordInput = ({
  name,
  label,
  placeholder,
  required = false,
  register = () => {},
  error,
  info,
  className = "",
  half = false,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className={`${FormStyles.inputWrapper} ${
        half ? FormStyles.half : ""
      } ${className}`}
    >
      {label && (
        <label htmlFor={name} className={FormStyles.label}>
          {label}
        </label>
      )}
      <div className={`${FormStyles.passwordWrapper} ${FormStyles.input}`}>
        <input
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...(required && required)}
          {...register(name, { required: required })}
          aria-invalid={error ? true : false}
        />
        <span
          className={FormStyles.toggle}
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? <BiShow /> : <BiHide />}
        </span>
      </div>
      {info && !error && <span className={FormStyles.message}>{info}</span>}
      {error && (
        <span className={`${FormStyles.message} ${FormStyles.error}`}>
          {error.message}
        </span>
      )}
    </div>
  );
};
export default PasswordInput;
