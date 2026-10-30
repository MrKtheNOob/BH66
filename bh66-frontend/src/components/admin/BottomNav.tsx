import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Ruler,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const menus = [
    {
      name: "Accueil",
      icon: <LayoutDashboard size={22} />,
      path: "/admin",
    },
    {
      name: "Commandes",
      icon: <ShoppingBag size={22} />,
      path: "/admin/orders",
    },
    {
      name: "Clients",
      icon: <Users size={22} />,
      path: "/admin/customers",
    },
    {
      name: "Mesures",
      icon: <Ruler size={22} />,
      path: "/admin/measurements",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 flex justify-around items-center py-2 z-50">

      {menus.map((menu) => {
        const active = location.pathname === menu.path;

        return (
          <Link
            key={menu.path}
            to={menu.path}
            className={`flex flex-col items-center text-[11px] transition
              ${
                active
                  ? "text-yellow-500"
                  : "text-gray-400"
              }
            `}
          >
            {menu.icon}

            <span className="mt-1">
              {menu.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}