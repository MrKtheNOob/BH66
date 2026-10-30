import {
  ShoppingBag,
  Users,
  Bell,
  Truck,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-400 text-sm">
            Bienvenue sur l’espace administrateur BH66
          </p>
        </div>

        <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
          <Bell size={20} className="text-yellow-500" />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* COMMANDES */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <ShoppingBag className="text-yellow-500" />
            <span className="text-xs text-gray-400">
              Total
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            24
          </h2>

          <p className="text-gray-400 text-sm">
            Commandes
          </p>
        </div>

        {/* CLIENTS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Users className="text-yellow-500" />
            <span className="text-xs text-gray-400">
              Clients
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            18
          </h2>

          <p className="text-gray-400 text-sm">
            Utilisateurs
          </p>
        </div>

        {/* LIVRAISONS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Truck className="text-yellow-500" />
            <span className="text-xs text-gray-400">
              Livraisons
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            8
          </h2>

          <p className="text-gray-400 text-sm">
            En cours
          </p>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Bell className="text-yellow-500" />
            <span className="text-xs text-gray-400">
              Alertes
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            5
          </h2>

          <p className="text-gray-400 text-sm">
            Notifications
          </p>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">
            Commandes récentes
          </h2>

          <button className="text-yellow-500 text-sm">
            Voir tout
          </button>
        </div>

        <div className="space-y-4">

          {/* ITEM */}
          <div className="flex items-center justify-between bg-zinc-950 rounded-xl p-4">
            <div>
              <h3 className="font-medium">
                Boubou traditionnel
              </h3>

              <p className="text-sm text-gray-400">
                Client : Elyjo
              </p>
            </div>

            <span className="bg-yellow-500/20 text-yellow-500 text-xs px-3 py-1 rounded-full">
              En cours
            </span>
          </div>

          {/* ITEM */}
          <div className="flex items-center justify-between bg-zinc-950 rounded-xl p-4">
            <div>
              <h3 className="font-medium">
                Ensemble africain
              </h3>

              <p className="text-sm text-gray-400">
                Client : Prospère
              </p>
            </div>

            <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
              Terminé
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
