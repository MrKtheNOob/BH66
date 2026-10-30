import {
  Clock3,
  CheckCircle2,
  Truck,
} from "lucide-react";

export default function Orders() {
  const orders = [
    {
      id: 1,
      client: "Elyjo",
      model: "Boubou traditionnel",
      status: "En cours",
      delivery: "12 Mai",
    },
    {
      id: 2,
      client: "Prospère",
      model: "Ensemble africain",
      status: "Terminé",
      delivery: "10 Mai",
    },
    {
      id: 3,
      client: "Bamba",
      model: "Costume moderne",
      status: "Livraison",
      delivery: "15 Mai",
    },
  ];

  const getStatus = (status: string) => {
    switch (status) {
      case "En cours":
        return {
          icon: <Clock3 size={16} />,
          style: "bg-yellow-500/20 text-yellow-500",
        };

      case "Terminé":
        return {
          icon: <CheckCircle2 size={16} />,
          style: "bg-green-500/20 text-green-400",
        };

      case "Livraison":
        return {
          icon: <Truck size={16} />,
          style: "bg-blue-500/20 text-blue-400",
        };

      default:
        return {
          icon: null,
          style: "",
        };
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Commandes
        </h1>

        <p className="text-gray-400 text-sm">
          Gérez toutes les commandes clients
        </p>
      </div>

      {/* ORDERS */}
      <div className="space-y-4">

        {orders.map((order) => {
          const status = getStatus(order.status);

          return (
            <div
              key={order.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4"
            >

              {/* TOP */}
              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-lg">
                    {order.model}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    Client : {order.client}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${status.style}`}
                >
                  {status.icon}
                  {order.status}
                </div>

              </div>

              {/* DELIVERY */}
              <div className="flex items-center justify-between text-sm">

                <p className="text-gray-400">
                  Livraison prévue
                </p>

                <span className="font-medium">
                  {order.delivery}
                </span>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">

                <button className="flex-1 bg-yellow-500 text-black py-2 rounded-lg font-medium hover:bg-yellow-400 transition">
                  Modifier
                </button>

                <button className="flex-1 border border-zinc-700 py-2 rounded-lg hover:bg-zinc-800 transition">
                  Détails
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}