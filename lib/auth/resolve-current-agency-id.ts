type UserLike = {
  id?: string;
  agency_id?: string;
  id_account?: string;
};

export function resolveCurrentAgencyId(
  authUser: UserLike | null,
  profileUser: UserLike | null,
): string {
  // Legado: agency_id deve vir prioritariamente de /api/profile (id_user -> profile.id).
  // Isso precisa bater com o namespace Pinecone usado na ingestão.
  if (profileUser?.id) return profileUser.id;
  if (profileUser?.agency_id) return profileUser.agency_id;
  if (profileUser?.id_account) return profileUser.id_account;
  if (authUser?.id) return authUser.id;
  if (authUser?.agency_id) return authUser.agency_id;
  if (authUser?.id_account) return authUser.id_account;
  return process.env.NEXT_PUBLIC_DEFAULT_AGENCY_ID?.trim() ?? "";
}
