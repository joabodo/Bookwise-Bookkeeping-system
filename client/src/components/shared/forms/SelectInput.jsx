import FormStyles from "./Form.module.css";
const SelectInput = ({
  children,
  name,
  label,
  required = false,
  register = () => {},
  error,
  disabled,
  info,
  className = "",
  half = false,
}) => {
  return (
    <div
      className={`${FormStyles.inputWrapper} ${
        half ? FormStyles.half : ""
      } ${className} ${disabled ? FormStyles.disabled : ""}`}
    >
      {label && (
        <label htmlFor={name} className={FormStyles.label}>
          {label}
        </label>
      )}
      <select
        name={name}
        className={FormStyles.input}
        {...(required && required)}
        {...register(name, { required: required })}
        aria-invalid={error ? true : false}
        disabled={disabled ? true : false}
      >
        {children}
      </select>
      {info && !error && <span className={FormStyles.message}>{info}</span>}
      {error && (
        <span className={`${FormStyles.message} ${FormStyles.error}`}>
          {error.message}
        </span>
      )}
    </div>
  );
};
export default SelectInput;
