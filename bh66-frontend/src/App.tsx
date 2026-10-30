import { Route, Routes } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardClient from "./pages/client/Dashboard";
import DashboardAdmin from "./pages/admin/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Measurements from "./pages/admin/Measurements";
import GuestRoute from "./components/GuestRoute";
import ClientLayout from "./components/layout/ClientLayout";
import Commandes from "./pages/client/Commands";
import CommandeDetail from "./pages/client/CommandeDetail";
import Catalogue from "./pages/client/Catalogue";
import ProduitDetail from "./pages/client/ProduitDetail";
import Profil from "./pages/client/Profil";

export default function App() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<Home />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Pages protégées */}
      {/* <Route element={<ProtectedRoute allowedRole="admin" />}> */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="measurements" element={<Measurements />} />
      </Route>
      {/* </Route> */}

      {/* <Route element={<ProtectedRoute allowedRole="client" />}> */}
        {/* Client – avec layout commun (sidebar desktop + barre mobile) */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<DashboardClient />} />
          <Route path="mesures" element={<Measurements />} />
          <Route path="commandes" element={<Commandes/>} />
          <Route path="commandes/:id" element={<CommandeDetail />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="catalogue/:id" element={<ProduitDetail />} />
          <Route path="profil" element={<Profil />} />
        </Route>
      {/* </Route> */}
    </Routes>
  );
}
