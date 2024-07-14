import { createContext, useEffect, useMemo, useState } from "react";
// import { auth } from "services/firebase/firebaseConfig";
import { useQueryClient } from "@tanstack/react-query";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import toast from "react-hot-toast";
// import onAuthStateChange from "services/firebase/onAuthStateChange";
// import authAxios from "api/authAxios";
// import STATUS_CODES from "constants/STATUS_CODES";
import router from "src/router";
import { ME_KEYS, useMeQuery } from "hooks/tanstack/me";
import LoadScreen from "components/overlays/LoadScreen";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  // TODO: Uncomment query and delete dummy user
  // const { data: user } = useMeQuery();
  // Dummy user
  const user = {
    name: {
      first: "David",
      last: "Manufor",
    },
    isVerified: true,
    leaderBoardEnabled: true,
    email: "davemanufor@gmail.com",
    role: "user",
  };
  const [authLoaded, setAuthLoaded] = useState(true); //TODO: Change default to false
  const [signupData, setSignupData] = useState(null);

  const showAuthErrors = (error) => {
    let message = "";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = `Email address already in use.\nTry signing in`;
        break;
      case "auth/invalid-email":
        message = `Email address is invalid.`;
        break;
      case "auth/operation-not-allowed":
        message = `Error during sign up.`;
        break;
      case "auth/weak-password":
        message =
          "Password is not strong enough. Add additional characters including special characters and numbers.";
        break;
      case "auth/invalid-credential":
        message = "Invalid email";
        break;
      default:
        console.error(error);
        message = `Something went wrong`;
        break;
    }

    toast.error(message);
  };

  const signupWithEmailAndPassword = (formData) => {
    setAuthLoaded(false);
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        setSignupData({
          email: formData.email,
          name: {
            first: formData.firstName,
            last: formData.lastName,
          },
          verificationSent: true,
        });
      })
      .catch((error) => {
        showAuthErrors(error);
        setAuthLoaded(true);
      });
  };

  const loginWithEmailandPassword = (email, password) => {
    setAuthLoaded(false);
    return signInWithEmailAndPassword(auth, email, password).catch((error) => {
      showAuthErrors(error);
      setAuthLoaded(true);
    });
  };

  const loginWithGoogle = () => {
    setAuthLoaded(false);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Set signupData
        const newUser = result.user;
        const names = newUser.displayName.split(" ");
        const firstName = names[0];
        const lastName = names[1] || "";
        const email = newUser.email;
        const verificationSent = true;
        setSignupData({
          name: {
            first: firstName,
            last: lastName,
          },
          email,
          verificationSent,
        });
      })
      .catch((error) => {
        showAuthErrors(error);
        setAuthLoaded(true);
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        router.navigate("/signin");
        toast.success("Signed out successfully");
      })
      .catch((error) => {
        showAuthErrors(error);
        setAuthLoaded(true);
      });
  };

  // useEffect(() => {
  //   const controller = new AbortController();
  //   onAuthStateChange(async (_user) => {
  //     setAuthLoaded(false);

  //     if (!_user) {
  //       queryClient.setQueryData(ME_KEYS.all, null);
  //       setAuthLoaded(true);
  //       return;
  //     }

  //     const { claims } = await _user.getIdTokenResult();

  //     if (!claims.dbid) {
  //       // Register User
  //       try {
  //         const res = await authAxios.post("/users", signupData, {
  //           signal: controller.signal,
  //         });
  //         if (res.status === STATUS_CODES.CREATED) {
  //           const newUser = res.data.data;
  //           queryClient.setQueryData(ME_KEYS.all, newUser);
  //           await _user.getIdToken(true);
  //         }
  //         setAuthLoaded(true);
  //         return;
  //       } catch (error) {
  //         if (error.code === "ERR_CANCELED") {
  //           return;
  //         }
  //         toast.error("Something went wrong");
  //       }
  //     } else {
  //       // Fetch User
  //       try {
  //         const res = await authAxios.get("/users/me", {
  //           signal: controller.signal,
  //         });
  //         const fetchedUser = res.data.data;
  //         queryClient.setQueryData(ME_KEYS.all, fetchedUser);
  //         setAuthLoaded(true);
  //         return;
  //       } catch (error) {
  //         if (error.code === "ERR_CANCELED") {
  //           return;
  //         }
  //         console.error(error);
  //         toast.error("Something went wrong");
  //       }
  //     }

  //     if (_user) logout();
  //     toast.error("Something went wrong");
  //   });

  //   return () => controller.abort();
  // }, [signupData]);

  const values = useMemo(
    () => ({
      user,
      signupWithEmailAndPassword,
      loginWithEmailandPassword,
      loginWithGoogle,
      logout,
    }),
    [user]
  );

  if (!authLoaded) return <LoadScreen />;

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
