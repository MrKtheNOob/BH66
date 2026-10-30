import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../../services/api";
import type { Order } from "../../types/models";
import { MOCK_ORDERS } from "./Mockorders";

const TABS = [
  { key: "all",        label: "Toutes" },
  { key: "in_progress", label: "En cours" },
  { key: "delivered",  label: "Livrées" },
  { key: "cancelled",  label: "Annulées" },
];

const statusLabels: Record<Order["status"], string> = {
  pending:     "En attente",
  in_progress: "En cours",
  delivered:   "Livrée",
  cancelled:   "Annulée",
};

const statusStyles: Record<Order["status"], string> = {
  pending:     "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  delivered:   "bg-green-100 text-green-800",
  cancelled:   "bg-red-100 text-red-800",
};

export default function Commandes() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order[]>("orders/me")
      .then((res) => {
        const data = res.data;
        setOrders(Array.isArray(data) && data.length > 0 ? data : MOCK_ORDERS);
      })
      .catch(() => setOrders(MOCK_ORDERS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      o.status === activeTab ||
      (activeTab === "in_progress" && o.status === "pending");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">

      {/* ── Header sticky ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[17px] sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
            Mes commandes
          </h1>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-[13px] outline-none focus:ring-1 focus:ring-yellow-400 focus:bg-white transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── List ── */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 max-w-3xl mx-auto">
        {loading ? (
          <p className="text-gray-400 text-[13px] text-center py-16">Chargement...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 text-[13px]">Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:gap-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/client/commandes/${order.id}`)}
                className="bg-white rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer active:scale-[0.98] hover:shadow-sm transition-all border border-gray-100 group"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex-shrink-0 overflow-hidden bg-gradient-to-br from-stone-300 to-stone-400" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] sm:text-sm lg:text-[15px] font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                    {order.product_name}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    {order.total.toLocaleString("fr-FR")} FCFA
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-300 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className={`flex-shrink-0 text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1 rounded-full font-medium ${statusStyles[order.status]}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}