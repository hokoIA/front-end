export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  /** Quando o backend expuser agência explícita para o analyze */
  agency_id?: string;
};

export type AuthStatus = {
  authenticated: boolean;
  user?: UserProfile;
};
