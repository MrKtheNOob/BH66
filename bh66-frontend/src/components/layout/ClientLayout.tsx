import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Ruler, ClipboardList, User } from "lucide-react";
import logo from "../../assets/logo-bh66-removebg.png";

const navItems = [
  { label: "Accueil",   icon: Home,          path: "/client" },
  { label: "Mesures",   icon: Ruler,         path: "/client/mesures" },
  { label: "Commandes", icon: ClipboardList, path: "/client/commandes" },
  { label: "Profil",    icon: User,          path: "/client/profil" },
];

export default function ClientLayout() {
  const location = useLocation();
  const navigate  = useNavigate();

  const hideNav =
    location.pathname.includes("/client/commandes/") ||
    location.pathname.includes("/client/catalogue/");

  if (hideNav) return <Outlet />;

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-gray-900">

      {/* ═══════════════════════════════════════
          MOBILE : barre du bas (inchangée)
      ═══════════════════════════════════════ */}
      <div className="flex flex-col md:hidden min-h-screen">
        <main className="flex-1 p-4 pb-20">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center text-xs font-medium transition-colors ${
                location.pathname === item.path ? "text-yellow-600" : "text-gray-400"
              }`}
            >
              <item.icon size={20} />
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ═══════════════════════════════════════
          DESKTOP : sidebar fixe + contenu
      ═══════════════════════════════════════ */}
      <div className="hidden md:flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="fixed top-0 left-0 h-full w-56 lg:w-60 bg-white border-r border-gray-100 z-30 flex flex-col">

          {/* Logo */}
          <div className="px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src={logo} alt="BH66" className="w-8 h-8 flex-shrink-0" />
              <span className="text-yellow-600 font-bold text-xl tracking-tight">BH66</span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-yellow-50 text-yellow-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={`flex-shrink-0 ${isActive ? "text-yellow-600" : "text-gray-400"}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer sidebar */}
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-[10px] text-gray-300 text-center">© 2024 BH66</p>
          </div>
        </aside>

        {/* ── Zone principale ── */}
        <div className="flex-1 ml-56 lg:ml-60 flex flex-col min-h-screen">

          {/* Topbar desktop */}
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 lg:px-10 py-3.5 flex items-center justify-between">
            {/* Fil d'ariane / titre page courante */}
            <p className="text-sm font-semibold text-gray-700">
              {navItems.find((n) => location.pathname.startsWith(n.path) && n.path !== "/client")
                ?.label ?? "Accueil"}
            </p>

            {/* Actions topbar */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                <User size={15} className="text-yellow-600" />
              </div>
            </div>
          </header>

          {/* Contenu */}
          <main className="flex-1 px-6 lg:px-10 py-6 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}