import type { Order } from "../../types/models";

export const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    code: "CMD-20240112",
    user: "mock-user",
    product_name: "Boubou Royal",
    total: 120000,
    status: "in_progress",
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-01-14T14:30:00Z",
  },
  {
    id: "2",
    code: "CMD-20240108",
    user: "mock-user",
    product_name: "Caftan Prestige",
    total: 150000,
    status: "delivered",
    created_at: "2024-01-08T09:00:00Z",
    updated_at: "2024-01-12T11:20:00Z",
  },
  {
    id: "3",
    code: "CMD-20240103",
    user: "mock-user",
    product_name: "Ensemble Luxe",
    total: 95000,
    status: "delivered",
    created_at: "2024-01-03T08:00:00Z",
    updated_at: "2024-01-08T16:45:00Z",
  },
  {
    id: "4",
    code: "CMD-20231228",
    user: "mock-user",
    product_name: "Boubou Classique",
    total: 100000,
    status: "cancelled",
    created_at: "2023-12-28T10:30:00Z",
    updated_at: "2024-01-01T09:00:00Z",
  },
];