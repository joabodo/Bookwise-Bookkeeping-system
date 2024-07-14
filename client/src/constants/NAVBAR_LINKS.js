import { LuLayoutDashboard } from "react-icons/lu";
import { CgArrowsExchange } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { TbFileInvoice } from "react-icons/tb";

export default {
  user: [
    {
      name: {
        default: "Dashboard",
        mobile: "Dashboard",
      },
      link: "/",
      icon: LuLayoutDashboard,
    },
    {
      name: {
        default: "Accounts",
        mobile: "Accounts",
      },
      link: "/accounts",
      icon: MdOutlineAccountBalanceWallet,
    },
    {
      name: {
        default: "Transactions",
        mobile: "Transactions",
      },
      link: "/transactions",
      icon: CgArrowsExchange,
    },
    {
      name: {
        default: "Invoices",
        mobile: "Invoices",
      },
      link: "/invoices",
      icon: TbFileInvoice,
    },
    {
      name: {
        default: "Profile Settings",
        mobile: "Profile",
      },
      link: "/account-settings",
      icon: FaRegUserCircle,
    },
  ],
  admin: [],
};
