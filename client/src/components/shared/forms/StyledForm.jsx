import FormStyles from "./Form.module.css";
const StyledForm = ({ onSubmit, className, children }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`${FormStyles.form} ${className ? className : ""}`}
    >
      {children}
    </form>
  );
};
export default StyledForm;
