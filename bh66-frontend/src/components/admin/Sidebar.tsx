import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Ruler,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo-bh66-removebg.png";

export default function Sidebar() {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
    },
    {
      name: "Commandes",
      icon: <ShoppingBag size={20} />,
      path: "/admin/orders",
    },
    {
      name: "Clients",
      icon: <Users size={20} />,
      path: "/admin/customers",
    },
    {
      name: "Mesures",
      icon: <Ruler size={20} />,
      path: "/admin/measurements",
    },
  ];

  return (
    <div className="hidden md:flex w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-5 flex-col">

      {/* LOGO */}
      <div className="flex items-center gap-2 mb-10">
        <img src={logo} alt="logo" className="w-8" />
        <span className="text-yellow-500 font-semibold text-lg">
          BH66 Admin
        </span>
      </div>

      {/* MENUS */}
      <div className="space-y-3">
        {menus.map((menu) => {
          const active = location.pathname === menu.path;

          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition
                ${
                  active
                    ? "bg-yellow-500 text-black"
                    : "text-gray-400 hover:bg-zinc-900 hover:text-white"
                }
              `}
            >
              {menu.icon}
              {menu.name}
            </Link>
          );
        })}
      </div>

    </div>
  );
}