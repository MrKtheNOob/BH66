export type Measurement = {
  id: string;
  user: string;
  epaules: number;
  cou: number;
  poitrine: number;
  manche: number;
  longueur_boubou: number;
  ceinture: number;
  tour_fesse: number;
  cuisse: number;
  fond: number;
  created_at: string;
  updated_at: string;
};

export type MeasurementPayload = {
  epaules: number;
  cou: number;
  poitrine: number;
  manche: number;
  longueur_boubou: number;
  ceinture: number;
  tour_fesse: number;
  cuisse: number;
  fond: number;
};

export type Order = {
  id: string;
  code: string;
  user: string;
  product_name: string;
  status: "pending" | "in_progress" | "delivered" | "cancelled";
  total: number;
  created_at: string;
  updated_at: string;
};

export type OrderStats = {
  en_cours: number;
  livrees: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: "boubou" | "caftan" | "ensemble" | "accessoire";
  in_stock: boolean;
};