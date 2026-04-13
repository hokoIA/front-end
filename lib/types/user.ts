export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  /** Quando o backend expuser agência explícita para o analyze */
  agency_id?: string;
  /** Contrato mais novo em alguns backends */
  id_account?: string;
  role?: string;
};

export type AuthStatus = {
  authenticated: boolean;
  user?: UserProfile;
};

export type RawUserLike = {
  id?: unknown;
  id_user?: unknown;
  email?: unknown;
  name?: unknown;
  avatarUrl?: unknown;
  foto_perfil?: unknown;
  agency_id?: unknown;
  id_account?: unknown;
  role?: unknown;
} & Record<string, unknown>;
