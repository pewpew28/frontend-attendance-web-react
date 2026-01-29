import {
  Home,
  ShoppingCart,
  BarChart,
  Settings,
  User,
  Package,
  Users,
  FileText,
  CreditCard,
  Bell,
  HelpCircle,
  Inbox,
  AlarmCheck,
  QrCode,
  LogOut,
  Heart,
} from "lucide-react";
import { ROUTES } from "./Routes";

export const mainMenuItems = [
  {
    icon: Home,
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/orders",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];

// Menu items dengan group/kategori
export const sidebarMenuItems = [
  {
    icon: Home,
    label: "Home",
    href: ROUTES.DASHBOARD,
  },
  {
    type: "group",
    title: "Reports",
    icon: BarChart,
    items: [
      { label: "Analytics", href: "/analytics", icon: BarChart },
      { label: "Sales Report", href: "/reports/sales", icon: FileText },
      { label: "Revenue", href: "/reports/revenue", icon: CreditCard },
    ],
  },
  {
    icon: User,
    label: "Profile",
    href: ROUTES.PROFILE,
  },
  {
    icon: Settings,
    label: "Settings",
    href: ROUTES.SETTINGS,
  },
];

// User dropdown menu items
export const getUserDropdownItems = (navigate, handleLogout) => [
  {
    icon: Settings,
    label: 'Settings',
    onClick: () => {
      navigate(ROUTES.SETTINGS);
    }
  },
  {
    icon: Bell,
    label: 'Notifications',
    onClick: () => {
      navigate(ROUTES.NOTIFICATIONS);
    },
    badge: 3 
  },
  {
    icon: CreditCard,
    label: 'Payroll',
    onClick: () => {
      navigate(ROUTES.BILLING);
    }
  },
  {
    icon: HelpCircle,
    label: 'Help & Support',
    onClick: () => {
      navigate(ROUTES.HELP);
    }
  },
  {
    divider: true
  },
  {
    icon: LogOut,
    label: 'Logout',
    onClick: handleLogout,
    className: 'text-red-600 hover:bg-red-50'
  }
];

export const bottomBarMenuItems = [
  {
    icon: Home,
    label: "Home",
    href: ROUTES.DASHBOARD,
  },
  {
    icon: AlarmCheck,
    label: "Attendance",
    href: ROUTES.ATTENDANCE,
  },
  {
    icon: QrCode,
    label: "Scan QR",
    href: ROUTES.SCANQR,
  },
  {
    icon: Bell,
    label: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    badge: 3,
  },
  {
    icon: User,
    label: "Profile",
    href: ROUTES.PROFILE,
  },
];
