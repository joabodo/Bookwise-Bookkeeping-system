import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
// import AuthProvider from "contexts/AuthProvider.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastWrapper from "components/overlays/ToastWrapper.jsx";

const queryClient = new QueryClient();

const CLERK_KEY = process.env.CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) throw new Error("Missing Clerk publishable key");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
      <ClerkProvider publishableKey={CLERK_KEY}>
        <RouterProvider router={router} />
        <ToastWrapper />
      </ClerkProvider>
      {/* </AuthProvider> */}
    </QueryClientProvider>
  </React.StrictMode>
);
