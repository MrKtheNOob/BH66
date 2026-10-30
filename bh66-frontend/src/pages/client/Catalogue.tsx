import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../../services/api";
import type { Product } from "../../types/models";
import { MOCK_PRODUCTS } from "./mockProducts";

const categories = [
  { key: "all",      label: "Tous" },
  { key: "boubou",   label: "Boubous" },
  { key: "caftan",   label: "Caftans" },
  { key: "ensemble", label: "Ensembles" },
];

export default function Catalogue() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Product[]>("products")
      .then((res) => {
        const data = res.data;
        setProducts(Array.isArray(data) && data.length > 0 ? data : MOCK_PRODUCTS);
      })
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">

      {/* ── Header ── */}
      <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-3 sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto">

          {/* Titre + filtre */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[18px] sm:text-xl font-semibold text-gray-900">
              Catalogue
            </h1>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <SlidersHorizontal size={14} className="text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:ring-1 focus:ring-yellow-400 focus:bg-white transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  category === cat.key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-gray-400 text-[13px] text-center py-16">Chargement...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center border border-white/10 mt-4">
            <p className="text-gray-400 text-[13px]">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/client/catalogue/${product.id}`)}
                className="rounded-2xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform group"
              >
                {/* Image carrée */}
                <div className="aspect-square overflow-hidden rounded-2xl relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-700 to-stone-900" />
                  )}
                  {/* Overlay bas */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Indispo badge */}
                  {!product.in_stock && (
                    <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full bg-red-500/80 text-white font-medium">
                      Indispo
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="pt-2 pb-1 px-0.5">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {product.price.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}