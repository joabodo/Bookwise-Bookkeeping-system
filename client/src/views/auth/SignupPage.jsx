import AuthStyles from "./Auth.module.css";
// import { Link, useSearchParams, Navigate } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { FcGoogle } from "react-icons/fc";
// import EXTERNAL_LINKS from "constants/EXTERNAL_LINKS";
// import { UserSignupSchema } from "utils/validationSchemas";
// import { StyledForm, TextInput, PasswordInput } from "components/shared/forms";
// import useAuth from "hooks/context/auth/useAuth";
import { ReactSVG } from "react-svg";
import LogoWhite from "assets/logo-white.svg";
import { SignUp } from "@clerk/clerk-react";
const SignupPage = () => {
  // const [searchParams] = useSearchParams();
  // const continueTo = searchParams.get("redirect") || null;
  // const { loginWithGoogle, signupWithEmailAndPassword, user } = useAuth();
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: zodResolver(UserSignupSchema),
  // });

  // if (user) {
  //   if (!user.isVerified) {
  //     return (
  //       <Navigate
  //         to={`/verification${continueTo ? `?continueTo=${continueTo}` : ""}`}
  //       />
  //     );
  //   } else {
  //     return <Navigate to={`${continueTo ? continueTo : "/"}`} />;
  //   }
  // }
  // const onSubmit = (data) => signupWithEmailAndPassword(data);
  return (
    <>
      <div className={AuthStyles.banner}>
        <ReactSVG src={LogoWhite} className={AuthStyles.logo} />
      </div>
      <div className={AuthStyles.wrapper}>
        <SignUp signInUrl="/signin" routing="virtual" />
      </div>
    </>
  );
};
export default SignupPage;
