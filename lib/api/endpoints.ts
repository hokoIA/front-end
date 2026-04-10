/**
 * Caminhos alinhados ao backend existente (sem prefixo /api onde o contrato não usa).
 * Query strings: passar via `searchParams` no http-client ou concatenar com segurança.
 */

export const endpoints = {
  auth: {
    register: () => "/api/register" as const,
    login: () => "/api/login" as const,
    logout: () => "/api/logout" as const,
    profile: () => "/api/profile" as const,
    authStatus: () => "/api/auth-status" as const,
    avatar: () => "/api/avatar" as const,
    update: () => "/api/update" as const,
    deleteAccount: () => "/api/delete-account" as const,
  },
  billing: {
    plans: () => "/api/billing/plans" as const,
    me: () => "/api/billing/me" as const,
    checkout: () => "/api/billing/checkout" as const,
    portal: () => "/api/billing/portal" as const,
  },
  customer: {
    list: () => "/customer" as const,
    get: (idCustomer: string) => `/customer/get/${idCustomer}` as const,
    add: () => "/customer/add" as const,
    edit: (idCustomer: string) => `/customer/edit/${idCustomer}` as const,
    delete: (idCustomer: string) => `/customer/delete/${idCustomer}` as const,
    cache: () => "/customer/cache" as const,
  },
  meta: {
    pages: () => "/api/meta/pages" as const,
    connect: () => "/api/meta/connect" as const,
    status: () => "/api/meta/status" as const,
  },
  googleAnalytics: {
    properties: () => "/api/googleAnalytics/properties" as const,
    connect: () => "/api/googleAnalytics/connect" as const,
    status: () => "/api/googleAnalytics/status" as const,
  },
  linkedin: {
    organizations: () => "/api/linkedin/organizations" as const,
    connect: () => "/api/linkedin/connect" as const,
  },
  youtube: {
    channels: () => "/api/youtube/channels" as const,
    connect: () => "/api/youtube/connect" as const,
    status: () => "/api/youtube/status" as const,
  },
  metrics: {
    reach: () => "/api/metrics/reach" as const,
    impressions: () => "/api/metrics/impressions" as const,
    followers: () => "/api/metrics/followers" as const,
    traffic: () => "/api/metrics/traffic" as const,
    searchVolume: () => "/api/metrics/search-volume" as const,
  },
  contents: {
    posts: () => "/api/contents/posts" as const,
  },
  analyze: {
    analyze: () => "/analyze/" as const,
  },
  documents: {
    store: () => "/documents/store" as const,
  },
  goals: {
    list: () => "/api/goals" as const,
    one: (idGoal: string) => `/api/goals/${idGoal}` as const,
    actionsSuggestions: () => "/api/goals/actions/suggestions" as const,
    generateAnalysis: (idGoal: string) =>
      `/api/goals/${idGoal}/actions/generate-analysis` as const,
  },
  team: {
    members: () => "/api/team/members" as const,
    memberDisable: (idTeamMember: string) =>
      `/api/team/members/${idTeamMember}/disable` as const,
    memberRole: (idTeamMember: string) =>
      `/api/team/members/${idTeamMember}/role` as const,
    invites: () => "/api/team/invites" as const,
    inviteResend: (idInvite: string) =>
      `/api/team/invites/${idInvite}/resend` as const,
    inviteDelete: (idInvite: string) =>
      `/api/team/invites/${idInvite}` as const,
  },
  rbac: {
    me: () => "/api/rbac/me" as const,
  },
  kanban: {
    boardData: () => "/api/kanban/board-data" as const,
    team: () => "/api/kanban/team" as const,
    clients: () => "/api/kanban/clients" as const,
    clientProfile: (idCustomer: string) =>
      `/api/kanban/clients/${idCustomer}/profile` as const,
    clientPortalLink: (idCustomer: string) =>
      `/api/kanban/clients/${idCustomer}/portal-link` as const,
    labels: () => "/api/kanban/labels" as const,
    label: (id: string) => `/api/kanban/labels/${id}` as const,
    columns: () => "/api/kanban/columns" as const,
    column: (id: string) => `/api/kanban/columns/${id}` as const,
    columnsReorder: () => "/api/kanban/columns/reorder" as const,
    cards: () => "/api/kanban/cards" as const,
    card: (id: string) => `/api/kanban/cards/${id}` as const,
    cardMove: (id: string) => `/api/kanban/cards/${id}/move` as const,
  },
} as const;

export function withQuery(
  path: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    search.set(k, String(v));
  }
  const q = search.toString();
  return q ? `${path}?${q}` : path;
}
