import { Outlet } from "react-router-dom";




import Sidebar from "../components/admin/Sidebar";
import BottomNav from "../components/admin/BottomNav";

export default function AdminLayout() {
  return (
    <div className="flex bg-black text-white min-h-screen">      
      <Sidebar />
      {/* MAIN */}
      <main className="flex-1 p-5 pb-24 md:pb-5">
        <Outlet />
      </main>
      {/* MOBILE NAV */}
      <BottomNav />
    </div>
  );
}
