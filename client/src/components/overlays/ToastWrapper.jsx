import { Toaster } from "react-hot-toast";

const ToastWrapper = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 5000,
        style: {
          background: "var(--white-100)",
          color: "var(--black-100)",
        },

        // Default options for specific types
        success: {
          theme: {
            primary: "var(--success-green)",
            secondary: "var(--black-100)",
          },
        },
        error: {
          theme: {
            primary: "var(--error-red)",
            secondary: "var(--black-100)",
          },
        },
      }}
    />
  );
};
export default ToastWrapper;
