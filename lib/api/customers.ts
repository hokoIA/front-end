import type { Customer } from "@/lib/types/customer";
import { endpoints, withQuery } from "./endpoints";
import { HttpError, httpJson } from "./http-client";

function normalizeCustomer(raw: Record<string, unknown>): Customer {
  const id = String(raw.id_customer ?? raw.id ?? "");
  const name = String(raw.name ?? raw.nome ?? "Sem nome");
  return { ...raw, id_customer: id, name };
}

function parseCustomerList(data: unknown): Customer[] {
  if (Array.isArray(data)) {
    return data.map((row) =>
      normalizeCustomer(typeof row === "object" && row ? (row as Record<string, unknown>) : {}),
    );
  }
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return ((data as { data: Record<string, unknown>[] }).data).map(
      normalizeCustomer,
    );
  }
  if (
    data &&
    typeof data === "object" &&
    "customers" in data &&
    Array.isArray((data as { customers: unknown }).customers)
  ) {
    return ((data as { customers: Record<string, unknown>[] }).customers).map(
      normalizeCustomer,
    );
  }
  return [];
}

export async function listCustomers(): Promise<Customer[]> {
  try {
    const data = await httpJson<unknown>(endpoints.customer.list(), {
      method: "GET",
    });
    return parseCustomerList(data);
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) {
      const data = await httpJson<unknown>("/customer", { method: "GET" });
      return parseCustomerList(data);
    }
    throw e;
  }
}

export async function getCustomer(idCustomer: string): Promise<Customer> {
  const data = await httpJson<Record<string, unknown>>(
    endpoints.customer.get(idCustomer),
    { method: "GET" },
  );
  return normalizeCustomer(data);
}

export async function addCustomer(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.customer.add(), { method: "POST", json: body });
}

export async function editCustomer(
  idCustomer: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.customer.edit(idCustomer), {
    method: "PUT",
    json: body,
  });
}

export async function deleteCustomer(idCustomer: string): Promise<void> {
  await httpJson(endpoints.customer.delete(idCustomer), { method: "DELETE" });
}

export async function postCustomerCache(
  body?: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.customer.cache(), {
    method: "POST",
    json: body ?? {},
  });
}

/* Integrações por cliente — mesma origem da API principal */

export async function getMetaPages(idCustomer: string): Promise<unknown> {
  return httpJson(
    withQuery(endpoints.meta.pages(), { id_customer: idCustomer }),
    { method: "GET" },
  );
}

export async function postMetaConnect(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.meta.connect(), { method: "POST", json: body });
}

export async function getMetaStatus(idCustomer: string): Promise<unknown> {
  return httpJson(
    withQuery(endpoints.meta.status(), { id_customer: idCustomer }),
    { method: "GET" },
  );
}

export async function getGoogleAnalyticsProperties(
  idCustomer: string,
): Promise<unknown> {
  return httpJson(
    withQuery(endpoints.googleAnalytics.properties(), {
      id_customer: idCustomer,
    }),
    { method: "GET" },
  );
}

export async function postGoogleAnalyticsConnect(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.googleAnalytics.connect(), {
    method: "POST",
    json: body,
  });
}

export async function getGoogleAnalyticsStatus(
  idCustomer: string,
): Promise<unknown> {
  return httpJson(
    withQuery(endpoints.googleAnalytics.status(), {
      id_customer: idCustomer,
    }),
    { method: "GET" },
  );
}

export async function getLinkedinOrganizations(
  idCustomer: string,
): Promise<unknown> {
  return httpJson(
    withQuery(endpoints.linkedin.organizations(), {
      id_customer: idCustomer,
    }),
    { method: "GET" },
  );
}

export async function postLinkedinConnect(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.linkedin.connect(), {
    method: "POST",
    json: body,
  });
}

export async function getYoutubeChannels(idCustomer: string): Promise<unknown> {
  return httpJson(
    withQuery(endpoints.youtube.channels(), { id_customer: idCustomer }),
    { method: "GET" },
  );
}

export async function postYoutubeConnect(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.youtube.connect(), { method: "POST", json: body });
}

export async function getYoutubeStatus(idCustomer: string): Promise<unknown> {
  return httpJson(
    withQuery(endpoints.youtube.status(), { id_customer: idCustomer }),
    { method: "GET" },
  );
}
