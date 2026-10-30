import type { Product } from "../../types/models";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Boubou Royal",
    description: "Tissu premium - Finition haut de gamme. Confection sur mesure selon vos mesures.",
    price: 120000,
    category: "boubou",
    in_stock: true,
  },
  {
    id: "2",
    name: "Caftan Prestige",
    description: "Broderie artisanale fine. Élégance et raffinement pour les grandes occasions.",
    price: 150000,
    category: "caftan",
    in_stock: true,
  },
  {
    id: "3",
    name: "Ensemble Luxe",
    description: "Ensemble deux pièces taillé sur mesure. Coupe moderne et tissu de qualité supérieure.",
    price: 95000,
    category: "ensemble",
    in_stock: true,
  },
  {
    id: "4",
    name: "Boubou Classique",
    description: "Le boubou intemporel revisité. Sobriété et élégance pour toutes les occasions.",
    price: 100000,
    category: "boubou",
    in_stock: false,
  },
];