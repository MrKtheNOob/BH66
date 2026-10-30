import { Search, UserRound } from "lucide-react";

export default function Customers() {
  const customers = [
    {
      id: 1,
      name: "Elyjo",
      phone: "+221 77 000 00 00",
      orders: 4,
    },
    {
      id: 2,
      name: "Prospère",
      phone: "+221 78 000 00 00",
      orders: 2,
    },
    {
      id: 3,
      name: "Bamba",
      phone: "+221 76 000 00 00",
      orders: 6,
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Clients
        </h1>

        <p className="text-gray-400 text-sm">
          Gérez vos clients et leurs informations
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3">

        <Search size={18} className="text-gray-400" />

        <input
          type="text"
          placeholder="Rechercher un client..."
          className="bg-transparent outline-none w-full text-white placeholder-gray-500"
        />

      </div>

      {/* CUSTOMERS */}
      <div className="space-y-4">

        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between"
          >

            {/* LEFT */}
            <div className="flex items-center gap-4">

              <div className="bg-yellow-500/20 p-3 rounded-full">
                <UserRound className="text-yellow-500" />
              </div>

              <div>
                <h2 className="font-semibold">
                  {customer.name}
                </h2>

                <p className="text-sm text-gray-400">
                  {customer.phone}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {customer.orders} commandes
                </p>
              </div>

            </div>

            {/* BUTTON */}
            <button className="border border-zinc-700 px-4 py-2 rounded-lg text-sm hover:bg-zinc-800 transition">
              Voir
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}