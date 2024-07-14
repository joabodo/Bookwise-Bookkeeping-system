import { ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import LoadScreen from "components/overlays/LoadScreen";
import { Outlet, ScrollRestoration } from "react-router-dom";
const Root = () => {
  return (
    <>
      <ClerkLoading>
        <LoadScreen />
      </ClerkLoading>
      <ClerkLoaded>
        <Outlet />
      </ClerkLoaded>
      <ScrollRestoration />
    </>
  );
};
export default Root;
