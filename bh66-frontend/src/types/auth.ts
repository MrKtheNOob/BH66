export type AuthUser = {
  id: string;
  username: string;
  email: string;
  phone: string;
  is_staff: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  phone?: string;
};

export type TokenOut = {
  access_token: string;
  token_type: string;
};
