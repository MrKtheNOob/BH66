import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
} from "lucide-react";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import type { Order } from "../../types/models";
import { MOCK_ORDERS } from "./Mockorders";

interface Step {
  key: string;
  label: string;
  Icon: React.ElementType;
}

const STEPS_NORMAL: Step[] = [
  { key: "pending",        label: "Commande validée",      Icon: CheckCircle },
  { key: "in_progress",   label: "En cours de confection", Icon: Package },
  { key: "delivered_ready", label: "Prêt pour livraison",  Icon: Truck },
  { key: "delivered",     label: "Livraison estimée",       Icon: Clock },
];

const STEPS_CANCELLED: Step[] = [
  { key: "pending",   label: "Commande validée", Icon: CheckCircle },
  { key: "cancelled", label: "Annulée",          Icon: XCircle },
];

const STATUS_INDEX: Record<Order["status"], number> = {
  pending:     0,
  in_progress: 1,
  delivered:   3,
  cancelled:   1,
};

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

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function CommandeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order>(`orders/${id}`)
      .then((res) => {
        const data = res.data;
        if (data?.id) {
          setOrder(data);
        } else {
          setOrder(MOCK_ORDERS.find((o) => o.id === id) ?? MOCK_ORDERS[0]);
        }
      })
      .catch(() => {
        setOrder(MOCK_ORDERS.find((o) => o.id === id) ?? MOCK_ORDERS[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-[13px]">Chargement...</p>
      </div>
    );
  }

  if (!order) return null;

  const isCancelled = order.status === "cancelled";
  const steps = isCancelled ? STEPS_CANCELLED : STEPS_NORMAL;
  const currentStep = isCancelled ? 1 : STATUS_INDEX[order.status];
  const updatedAt = formatDateTime(order.updated_at);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-10">
      <div className="max-w-4xl mx-auto lg:px-8 lg:pt-8">

        {/*
         * Desktop : bouton retour au-dessus de la carte
         * Mobile  : flottant sur le hero
         */}
        <button
          onClick={() => navigate("/client/commandes")}
          className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-5 text-sm"
        >
          <ArrowLeft size={16} />
          Retour aux commandes
        </button>

        {/* ── Layout desktop : deux colonnes ── */}
        <div className="lg:flex lg:gap-8 lg:items-start">

          {/* ── Colonne gauche : Hero ── */}
          <div className="lg:w-2/5 lg:shrink-0">
            <div className="relative bg-stone-700 overflow-hidden lg:rounded-2xl aspect-4/5">

              {/* Back button mobile only */}
              <button
                onClick={() => navigate("/client/commandes")}
                title="Retour aux commandes"
                className="lg:hidden absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5">
                <p className="text-[10px] text-white/50">{order.code}</p>
                <p className="text-[16px] sm:text-lg font-semibold text-white leading-tight mt-0.5">
                  {order.product_name}
                </p>
                <p className="text-[14px] font-semibold text-yellow-400 mt-0.5">
                  {order.total.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
            </div>

            {/* Status badge — sous l'image sur desktop, flottant sur mobile */}
            <div className="px-4 sm:px-5 pt-3 pb-1 lg:px-0 lg:pt-3">
              <span className={`inline-block text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>
          </div>

          {/* ── Colonne droite : Stepper + détails ── */}
          <div className="lg:flex-1 px-4 sm:px-5 lg:px-0 mt-2 lg:mt-0 flex flex-col gap-4">

            {/* Stepper */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100">
              <p className="text-[12px] sm:text-sm font-semibold text-gray-900 mb-4 sm:mb-5">
                Suivi de la commande
              </p>

              <div className="relative flex flex-col gap-4 sm:gap-5">
                {/* Ligne verticale */}
                <div className="absolute left-2.75 top-1 bottom-1 w-px bg-gray-100" />

                {steps.map((step, index) => {
                  const isActive = index <= currentStep;
                  const isCurrent = index === currentStep;
                  const { Icon } = step;

                  return (
                    <div key={step.key} className="relative z-10 flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? "bg-gray-900 text-white"
                            : isActive
                            ? "bg-gray-100 text-gray-600 border border-gray-200"
                            : "bg-gray-50 text-gray-300 border border-gray-100"
                        }`}
                      >
                        <Icon size={isCurrent ? 13 : 12} />
                      </div>

                      <div className="pt-0.5">
                        <p className={`text-[12px] sm:text-[13px] font-medium leading-tight ${isActive ? "text-gray-900" : "text-gray-300"}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
                            {updatedAt.date} · {updatedAt.time}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Détails commande */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100">
              <p className="text-[12px] sm:text-sm font-semibold text-gray-900 mb-3">
                Détails
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[12px] sm:text-[13px] text-gray-400">Référence</span>
                  <span className="text-[12px] sm:text-[13px] text-gray-900 font-medium">{order.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] sm:text-[13px] text-gray-400">Date de commande</span>
                  <span className="text-[12px] sm:text-[13px] text-gray-900">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] sm:text-[13px] text-gray-400">Dernière mise à jour</span>
                  <span className="text-[12px] sm:text-[13px] text-gray-900">
                    {new Date(order.updated_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-50">
                  <span className="text-[12px] sm:text-[13px] text-gray-400">Total</span>
                  <span className="text-[13px] sm:text-sm font-bold text-gray-900">
                    {order.total.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>
            </div>

            {/* CTA desktop — inline */}
            <div className="hidden lg:block">
              <Button
                onClick={() => navigate("/client/commandes")}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-3.5 rounded-2xl transition-colors"
              >
                Voir mes commandes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA mobile/tablet — fixé en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 lg:hidden">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={() => navigate("/client/commandes")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white text-[13px] sm:text-sm font-semibold py-3 sm:py-3.5 rounded-2xl transition-colors"
          >
            Voir mes commandes
          </Button>
        </div>
      </div>
    </div>
  );
}