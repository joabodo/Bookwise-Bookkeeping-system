import AuthStyles from "./Auth.module.css";
import LogoWhite from "assets/logo-white.svg";
// import { Link, useSearchParams, Navigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
// import { FcGoogle } from "react-icons/fc";
// import { StyledForm, TextInput, PasswordInput } from "components/shared/forms";
// import { useForm } from "react-hook-form";
// import useAuth from "hooks/context/auth/useAuth";
// import ADMIN_ROLES from "constants/ADMIN_ROLES";
import { SignIn } from "@clerk/clerk-react";
const SigninPage = () => {
  // const [searchParams] = useSearchParams();
  // const continueTo = searchParams.get("continueTo") || null;
  // const { loginWithGoogle, loginWithEmailandPassword, user } = useAuth();
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  // if (user) {
  //   if (!user.isVerified) {
  //     return (
  //       <Navigate
  //         to={`/verification${continueTo ? `?continueTo=${continueTo}` : ""}`}
  //       />
  //     );
  //   } else {
  //     const basePath = ADMIN_ROLES.includes(user.role) ? "/admin" : "/";
  //     return <Navigate to={`${continueTo ? continueTo : basePath}`} />;
  //   }
  // }

  // const onSubmit = (data) =>
  //   loginWithEmailandPassword(data.email, data.password);
  return (
    <>
      <div className={AuthStyles.banner}>
        <ReactSVG src={LogoWhite} className={AuthStyles.logo} />
      </div>
      <div className={AuthStyles.wrapper}>
        <SignIn signUpUrl="/signup" routing="virtual" />
      </div>
    </>
  );
};
export default SigninPage;
