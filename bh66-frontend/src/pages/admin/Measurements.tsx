import { Ruler, Search } from "lucide-react";

export default function Measurements() {
  const measurements = [
    {
      id: 1,
      client: "Elyjo",
      shoulders: 45,
      chest: 102,
      sleeve: 62,
      length: 140,
    },
    {
      id: 2,
      client: "Prospère",
      shoulders: 42,
      chest: 98,
      sleeve: 60,
      length: 135,
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Mesures
        </h1>

        <p className="text-gray-400 text-sm">
          Consultez les dimensions des clients
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

      {/* LIST */}
      <div className="space-y-4">

        {measurements.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5"
          >

            {/* TOP */}
            <div className="flex items-center gap-3">

              <div className="bg-yellow-500/20 p-3 rounded-full">
                <Ruler className="text-yellow-500" />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {item.client}
                </h2>

                <p className="text-sm text-gray-400">
                  Mesures enregistrées
                </p>
              </div>

            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-zinc-950 rounded-xl p-3">
                <p className="text-gray-400 text-xs">
                  Épaules
                </p>

                <h3 className="text-lg font-semibold">
                  {item.shoulders} cm
                </h3>
              </div>

              <div className="bg-zinc-950 rounded-xl p-3">
                <p className="text-gray-400 text-xs">
                  Poitrine
                </p>

                <h3 className="text-lg font-semibold">
                  {item.chest} cm
                </h3>
              </div>

              <div className="bg-zinc-950 rounded-xl p-3">
                <p className="text-gray-400 text-xs">
                  Manche
                </p>

                <h3 className="text-lg font-semibold">
                  {item.sleeve} cm
                </h3>
              </div>

              <div className="bg-zinc-950 rounded-xl p-3">
                <p className="text-gray-400 text-xs">
                  Longueur
                </p>

                <h3 className="text-lg font-semibold">
                  {item.length} cm
                </h3>
              </div>

            </div>

            {/* BUTTON */}
            <button className="w-full border border-zinc-700 py-2 rounded-xl hover:bg-zinc-800 transition">
              Voir toutes les mesures
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}