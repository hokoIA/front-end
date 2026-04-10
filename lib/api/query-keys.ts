export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    status: () => [...queryKeys.auth.all, "status"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
  },
  billing: {
    all: ["billing"] as const,
    me: () => [...queryKeys.billing.all, "me"] as const,
    plans: () => [...queryKeys.billing.all, "plans"] as const,
  },
  customers: {
    all: ["customers"] as const,
    list: () => [...queryKeys.customers.all, "list"] as const,
    detail: (id: string) => [...queryKeys.customers.all, "detail", id] as const,
  },
  rbac: {
    all: ["rbac"] as const,
    me: () => [...queryKeys.rbac.all, "me"] as const,
  },
  goals: {
    all: ["goals"] as const,
    list: () => [...queryKeys.goals.all, "list"] as const,
    detail: (id: string) => [...queryKeys.goals.all, "detail", id] as const,
  },
  team: {
    all: ["team"] as const,
    members: () => [...queryKeys.team.all, "members"] as const,
    invites: () => [...queryKeys.team.all, "invites"] as const,
  },
  kanban: {
    all: ["kanban"] as const,
    boardData: () => [...queryKeys.kanban.all, "board-data"] as const,
    team: () => [...queryKeys.kanban.all, "team"] as const,
    clients: () => [...queryKeys.kanban.all, "clients"] as const,
    labels: () => [...queryKeys.kanban.all, "labels"] as const,
    columns: () => [...queryKeys.kanban.all, "columns"] as const,
    cards: () => [...queryKeys.kanban.all, "cards"] as const,
    card: (id: string) => [...queryKeys.kanban.all, "card", id] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    reach: (id: string, start: string, end: string) =>
      ["dashboard", "reach", id, start, end] as const,
    impressions: (id: string, start: string, end: string) =>
      ["dashboard", "impressions", id, start, end] as const,
    followers: (id: string, start: string, end: string) =>
      ["dashboard", "followers", id, start, end] as const,
    traffic: (id: string, start: string, end: string) =>
      ["dashboard", "traffic", id, start, end] as const,
    searchVolume: (id: string, start: string, end: string) =>
      ["dashboard", "search-volume", id, start, end] as const,
    posts: (id: string, start: string, end: string) =>
      ["dashboard", "posts", id, start, end] as const,
  },
  integrations: {
    metaPages: (idCustomer: string) =>
      ["integrations", "meta", "pages", idCustomer] as const,
    metaStatus: (idCustomer: string) =>
      ["integrations", "meta", "status", idCustomer] as const,
    gaProperties: (idCustomer: string) =>
      ["integrations", "ga", "properties", idCustomer] as const,
    gaStatus: (idCustomer: string) =>
      ["integrations", "ga", "status", idCustomer] as const,
    linkedinOrgs: (idCustomer: string) =>
      ["integrations", "linkedin", "orgs", idCustomer] as const,
    youtubeChannels: (idCustomer: string) =>
      ["integrations", "youtube", "channels", idCustomer] as const,
    youtubeStatus: (idCustomer: string) =>
      ["integrations", "youtube", "status", idCustomer] as const,
  },
  contextBase: {
    all: ["context-base"] as const,
    documents: (clientId: string) =>
      ["context-base", "documents", clientId] as const,
  },
} as const;
