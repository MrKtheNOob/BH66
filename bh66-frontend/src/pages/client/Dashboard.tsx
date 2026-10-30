import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ruler,
  ShoppingBag,
  Camera,
  Bell,
  ChevronRight,
  User,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import type { Measurement, OrderStats } from "../../types/models";

export default function Dashboard() {
  const { user } = useAuth();
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [stats, setStats] = useState<OrderStats>({ en_cours: 0, livrees: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // this is nice - bamba
    Promise.all([
      api.get<Measurement>("measurements/me").then((r) => r.data).catch(() => null),
      api.get<OrderStats>("orders/stats").then((r) => r.data).catch(() => ({ en_cours: 0, livrees: 0 })),
    ])
      .then(([mes, st]) => {
        setMeasurement(mes);
        setStats(st);
      })
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.username?.split(" ")[0] || "Client";
  const lastUpdate = measurement?.updated_at
    ? new Date(measurement.updated_at).toLocaleDateString("fr-FR")
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 space-y-5 sm:space-y-6">

        {/* ── Hero card : Bonjour + mesures ── */}
        <div className="bg-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden">
          {/* Bell */}
          <button title="Notifications" className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-white transition-colors">
            <Bell size={18} />
          </button>

          {/* Illustration ruler — décorative, top right */}
          <div className="absolute bottom-4 right-5 opacity-20 pointer-events-none">
            <Ruler size={80} className="text-yellow-400 rotate-12" />
          </div>

          {/* Greeting */}
          <p className="text-[13px] sm:text-sm text-gray-400 mb-0.5">Bonjour,</p>
          <h1 className="text-[22px] sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-5">
            {firstName}
          </h1>

          {/* Mesures card interne */}
          <div className="bg-gray-800/60 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-4 sm:mb-5">
            <p className="text-[11px] sm:text-xs text-gray-400 mb-1">Mes mesures</p>
            {lastUpdate ? (
              <p className="text-[11px] sm:text-xs text-gray-500">
                Dernière mise à jour · {lastUpdate}
              </p>
            ) : (
              <p className="text-[11px] sm:text-xs text-gray-500">
                Aucune mesure enregistrée
              </p>
            )}
            <Link to="/client/mesures">
              <button className="mt-2.5 bg-yellow-500 hover:bg-yellow-400 text-black text-[11px] sm:text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors">
                Voir mes mesures
              </button>
            </Link>
          </div>

          {/* Avatar placeholder + nom */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
              <User size={16} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[12px] sm:text-[13px] font-medium text-white leading-tight">
                {user?.username || "Client"}
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-500 leading-tight">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats commandes ── */}
        <div>
          <h2 className="text-[14px] sm:text-[15px] lg:text-base font-semibold text-gray-900 mb-2.5 sm:mb-3">
            Mes commandes
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* En cours */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:shadow-sm transition-shadow">
              <p className="text-[28px] sm:text-[32px] font-extrabold text-gray-900 leading-none">
                {String(stats.en_cours).padStart(2, "0")}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1.5">En cours</p>
              <Link
                to="/client/commandes"
                className="inline-flex items-center gap-1 mt-3 text-[11px] sm:text-xs text-yellow-600 font-medium hover:text-yellow-500 transition-colors"
              >
                En cours <ChevronRight size={12} />
              </Link>
            </div>

            {/* Livrées */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:shadow-sm transition-shadow">
              <p className="text-[28px] sm:text-[32px] font-extrabold text-gray-900 leading-none">
                {String(stats.livrees).padStart(2, "0")}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1.5">Livrées</p>
              <Link
                to="/client/commandes"
                className="inline-flex items-center gap-1 mt-3 text-[11px] sm:text-xs text-yellow-600 font-medium hover:text-yellow-500 transition-colors"
              >
                Ce mois <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Actions rapides ── */}
        <div>
          <h2 className="text-[14px] sm:text-[15px] lg:text-base font-semibold text-gray-900 mb-2.5 sm:mb-3">
            Actions rapides
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Camera,      label: "Prendre\nmesures",   path: "/client/mesures" },
              { icon: ShoppingBag, label: "Mes\ncommandes",     path: "/client/commandes" },
              { icon: Ruler,       label: "Catalogue",          path: "/client/catalogue" },
            ].map(({ icon: Icon, label, path }) => (
              <Link
                key={label}
                to={path}
                className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 text-center hover:shadow-sm active:scale-95 transition-all"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Icon size={18} className="text-yellow-600" />
                </div>
                <span className="text-[11px] sm:text-xs text-gray-600 font-medium whitespace-pre-line leading-tight">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Empty state mesures ── */}
        {!loading && !measurement && (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 sm:p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-3">
              <Ruler size={18} className="text-yellow-500" />
            </div>
            <p className="text-[13px] sm:text-sm text-gray-500 mb-4">
              Vous n'avez pas encore enregistré vos mesures.
            </p>
            <Link to="/client/mesures">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-[13px] sm:text-sm font-semibold py-3 rounded-xl transition-colors">
                Prendre mes mesures
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}