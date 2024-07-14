import FormStyles from "./Form.module.css";

const DateInput = ({
  name,
  label,
  required = false,
  register = () => {},
  error,
  info,
  className = "",
  half = false,
  disabled = false,
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
      <input
        name={name}
        type="date"
        disabled={disabled}
        className={FormStyles.input}
        {...(required && required)}
        {...register(name, { required: required })}
        aria-invalid={error ? true : false}
      />
      {info && !error && <span className={FormStyles.message}>{info}</span>}
      {error && (
        <span className={`${FormStyles.message} ${FormStyles.error}`}>
          {error.message}
        </span>
      )}
    </div>
  );
};
export default DateInput;
