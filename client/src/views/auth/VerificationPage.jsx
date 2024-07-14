import AuthStyles from "./Auth.module.css";
import { useSearchParams, Navigate } from "react-router-dom";
import useAuth from "hooks/context/auth/useAuth";
import { useMeUpdateMutation } from "hooks/tanstack/me";
import LogoWhite from "assets/logo-white.svg";
import { ReactSVG } from "react-svg";
import { useEffect, useRef, useState } from "react";
// import sendEmailVerification from "services/firebase/sendEmailVerification";

const VerificationPage = () => {
  const { user, logout } = useAuth();
  const { mutate } = useMeUpdateMutation();
  const [searchParams] = useSearchParams();
  const [wait, setWait] = useState(false);
  const [timeString, setTimeString] = useState("");
  const continueTo = searchParams.get("continueTo") || null;

  if (user && user.isVerified) {
    return <Navigate to={`${continueTo || "/"}`} />;
  }

  const timeToWait = useRef(0);

  const updateTimeString = () => {
    const minutes = Math.floor(timeToWait.current / 60).toString();
    const seconds = (timeToWait.current % 60).toString().padStart(2, "0");
    const str = `${minutes}:${seconds}`;
    setTimeString(str);
  };

  const debounce = () => {
    setWait(true);
    timeToWait.current = 60;
    updateTimeString();
    const timer = setInterval(() => {
      const currentTime = timeToWait.current;
      if (currentTime - 1 > 0) {
        timeToWait.current = currentTime - 1;
        updateTimeString();
      } else {
        setWait(false);
        timeToWait.current = 0;
        updateTimeString();
        clearInterval(timer);
      }
    }, 1000);
  };

  const sendEmail = () => {
    const actionConfig = { url: process.env.API_URL + "/verification" };
    return sendEmailVerification(actionConfig);
  };

  const handleSend = () => {
    console.log("Email Sent");
    sendEmail()
      .then(() => {
        mutate({
          verificationSent: true,
        });
        toast.success(`Email sent to ${user.email}`);
        debounce();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong.\nTry again");
      });
  };

  useEffect(() => {
    const emailSent = user.verificationSent;
    if (emailSent) {
      debounce();
      return;
    }

    handleSend();
  }, []);
  return (
    <>
      <div className={AuthStyles.banner}>
        <ReactSVG src={LogoWhite} className={AuthStyles.logo} />
      </div>
      <div className={AuthStyles.wrapper}>
        <div className={AuthStyles.verificationInfo}>
          <h1 className={AuthStyles.title}>Let's verify your account</h1>
          <p>
            We've sent a verification email to {user.email}. Please check your
            inbox and click the link to confirm your email.
          </p>
          <div className={AuthStyles.buttonGroup}>
            <button
              className="primary--purple"
              disabled={wait}
              onClick={handleSend}
            >
              {wait ? `Resend in ${timeString}` : "Resend Email"}
            </button>
            <button className="secondary--purple" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default VerificationPage;
