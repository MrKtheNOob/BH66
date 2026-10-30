import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Heart } from "lucide-react";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import type { Product } from "../../types/models";
import { MOCK_PRODUCTS } from "./mockProducts";

const availableColors = [
  { name: "Noir",   bgClass: "bg-[#1a1a1a]",  textClass: "text-white",      ring: "ring-white" },
  { name: "Marine", bgClass: "bg-[#1e3a5f]",  textClass: "text-white",      ring: "ring-white" },
  { name: "Blanc",  bgClass: "bg-[#f5f5f0]",  textClass: "text-stone-900",  ring: "ring-stone-400" },
  { name: "Beige",  bgClass: "bg-[#c9a96e]",  textClass: "text-white",      ring: "ring-white" },
];

export default function ProduitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Product>(`products/${id}`)
      .then((res) => {
        const data = res.data;
        if (data?.id) {
          setProduct(data);
        } else {
          setProduct(MOCK_PRODUCTS.find((p) => p.id === id) ?? MOCK_PRODUCTS[0]);
        }
      })
      .catch(() => {
        setProduct(MOCK_PRODUCTS.find((p) => p.id === id) ?? MOCK_PRODUCTS[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-400 text-[13px]">Chargement...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-5xl mx-auto lg:flex lg:gap-10 lg:px-8 lg:pt-10 lg:pb-24">

        {/* ── Image ── */}
        <div className="lg:w-1/2 lg:flex-shrink-0 relative">

          {/* Bouton retour */}
          <button
            onClick={() => navigate("/client/catalogue")}
            className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Favoris */}
          <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <Heart size={16} />
          </button>

          {/* Image principale */}
          <div className="w-full overflow-hidden lg:rounded-2xl aspect-[4/5] bg-stone-900">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-700 to-stone-900" />
            )}
          </div>

          {/* Dot indicator mobile */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
            <div className="w-4 h-1 rounded-full bg-white/80" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
          </div>
        </div>

        {/* ── Contenu ── */}
        <div className="lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
          <div className="px-4 sm:px-6 lg:px-0 pt-5 lg:pt-0">

            {/* Nom + dispo */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-[22px] sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              {!product.in_stock && (
                <span className="flex-shrink-0 text-[10px] px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-medium mt-1">
                  Indisponible
                </span>
              )}
            </div>

            {/* Prix */}
            <p className="text-[18px] sm:text-xl font-bold text-gray-900 mb-4">
              {product.price.toLocaleString("fr-FR")} FCFA
            </p>

            {/* Description */}
            <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed mb-6">
              {product.description ||
                "Tissu premium · Finition haut de gamme. Confection sur mesure selon vos mesures."}
            </p>

            {/* Couleurs */}
            <div className="mb-8">
              <p className="text-[12px] font-semibold text-gray-700 mb-3">
                Couleurs disponibles
              </p>
              <div className="flex gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    className={`
                      w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                      flex-shrink-0 transition-all active:scale-90 hover:scale-110
                      ${color.bgClass}
                      ${selectedColor === color.name
                        ? `ring-2 ${color.ring} ring-offset-2 ring-offset-gray-50`
                        : "ring-1 ring-white/10"
                      }
                    `}
                  >
                    {selectedColor === color.name && (
                      <Check size={13} className={color.textClass} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA desktop */}
            <div className="hidden lg:block">
              <Button
                onClick={() => {}}
                disabled={!product.in_stock}
                className={`w-full text-[14px] font-semibold py-4 rounded-2xl transition-colors ${
                  product.in_stock
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {product.in_stock ? "Choisir ce modèle" : "Indisponible"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA mobile/tablet fixé en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 lg:hidden">
        <div className="max-w-md mx-auto sm:max-w-xl">
          <Button
            onClick={() => {}}
            disabled={!product.in_stock}
            className={`w-full text-[13px] sm:text-sm font-semibold py-3.5 rounded-2xl transition-colors ${
              product.in_stock
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {product.in_stock ? "Choisir ce modèle" : "Indisponible"}
          </Button>
        </div>
      </div>
    </div>
  );
}