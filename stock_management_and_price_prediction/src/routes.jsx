import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  CreditCardIcon,
  CpuChipIcon
} from "@heroicons/react/24/solid";
import { AdminDashboard,UserDashboard, Profile, StockManagement,Stock, Notifications ,ManageUser,YourStock,StockPrediction} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

const user =  JSON.parse(localStorage.getItem('user'));

export const routes = [
  {
    layout: "dashboard",
    show:true,
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/admin-dashboard",
        element: <AdminDashboard />,
        show:user?.id == '67a6962b00d871416f095e9f'
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/user-dashboard",
        element: <UserDashboard />,
        show:user?.id != '67a6962b00d871416f095e9f'
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Stocks Management",
        path: "/stock-management",
        element: <StockManagement />,
        show:user?.id == '67a6962b00d871416f095e9f'
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Stocks",
        path: "/stock",
        element: <Stock />,
        show:user?.id != '67a6962b00d871416f095e9f'
      },
      {
        icon: <CreditCardIcon {...icon} />,
        name: "Your Stock",
        path: "/your-stock",
        element: <YourStock />,
        show:user?.id != '67a6962b00d871416f095e9f'
      },
      {
        icon: <CpuChipIcon {...icon} />,
        name: "Prediction",
        path: "/stock-prediction",
        element: <StockPrediction />,
        show:user?.id != '67a6962b00d871416f095e9f'
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
        show:true
      },
    ],
  },
  {
    title: "User Management",
    show:user?.id == '67a6962b00d871416f095e9f',
    layout: "dashboard",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "User",
        path: "/user",
        element: <ManageUser />,
        show:user?.id == '67a6962b00d871416f095e9f'
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
        show:true
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
        show:true
      },
    ],
  },
];

export default routes;
