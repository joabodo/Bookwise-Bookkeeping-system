import { createBrowserRouter, Navigate } from "react-router-dom";
import { SigninPage, SignupPage } from "views/auth";
import {
  DashboardPage,
  CoursesPage,
  MyLearningPage,
  AccountSettingsPage,
  UserProfilePage,
  AccountsPage,
  AccountCreationPage,
  AccountDetailsPage,
  AccountEditPage,
  TransactionsPage,
  TransactionCreationPage,
  TransactionEditPage,
  InvoicesPage,
  InvoiceCreationPage,
  InvoiceEditPage,
} from "views/user";
import { NavigationLayout } from "./layouts";
import Root from "./Root";
import { AdminProtectedRoute, ProtectedRoute } from "components/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // Auth Pages
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/signin",
        element: <SigninPage />,
      },
      {
        //  USER WITH SIDEBAR
        element: (
          <ProtectedRoute>
            <NavigationLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/accounts",
            element: <AccountsPage />,
          },
          {
            path: "/accounts/new",
            element: <AccountCreationPage />,
          },
          {
            path: "/accounts/:accountID",
            element: <AccountDetailsPage />,
          },
          {
            path: "/accounts/edit/:accountID",
            element: <AccountEditPage />,
          },
          {
            path: "/transactions",
            element: <TransactionsPage />,
          },
          {
            path: "/transactions/new",
            element: <TransactionCreationPage />,
          },
          {
            path: "/transactions/edit/:transactionID",
            element: <TransactionEditPage />,
          },
          {
            path: "/invoices",
            element: <InvoicesPage />,
          },
          {
            path: "/invoices/new",
            element: <InvoiceCreationPage />,
          },
          {
            path: "/invoices/edit/:invoiceID",
            element: <InvoiceEditPage />,
          },
          {
            path: "/account-settings",
            element: <UserProfilePage />,
          },
        ],
      },
      {
        // ADMIN WITH SIDEBAR
        element: (
          <AdminProtectedRoute>
            <NavigationLayout />
          </AdminProtectedRoute>
        ),
        path: "/admin",
        children: [
          {
            path: "",
            element: <h1>Admin Dashboard</h1>,
          },
        ],
      },
    ],
  },
  {
    path: "/*",
    element: <Navigate to={"/"} />,
  },
]);
export default router;
