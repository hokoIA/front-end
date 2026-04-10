import type {
  ContextDocumentListItem,
  DocumentListFilters,
} from "../types";

function matchesSearch(doc: ContextDocumentListItem, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  const blob = [
    doc.title,
    doc.summary,
    doc.author,
    doc.origin,
    doc.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return blob.includes(s);
}

function validityBucket(
  doc: ContextDocumentListItem,
): "valid" | "expiring" | "expired" | "none" {
  if (!doc.validUntil) return "valid";
  const end = new Date(doc.validUntil + "T23:59:59");
  const now = new Date();
  if (end < now) return "expired";
  const days = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 30) return "expiring";
  return "valid";
}

export function filterContextDocuments(
  docs: ContextDocumentListItem[],
  f: DocumentListFilters,
): ContextDocumentListItem[] {
  return docs.filter((doc) => {
    if (!matchesSearch(doc, f.search)) return false;
    if (f.contentType !== "all" && doc.docType !== f.contentType) return false;
    if (
      f.category.trim() &&
      !doc.mainCategory.toLowerCase().includes(f.category.trim().toLowerCase())
    )
      return false;
    if (f.status !== "all" && doc.status !== f.status) return false;
    if (f.validity !== "all") {
      const b = validityBucket(doc);
      if (f.validity === "valid" && b !== "valid") return false;
      if (f.validity === "expiring" && b !== "expiring") return false;
      if (f.validity === "expired" && b !== "expired") return false;
    }
    if (f.submittedFrom) {
      const t = new Date(doc.submittedAt).getTime();
      const from = new Date(f.submittedFrom + "T00:00:00").getTime();
      if (t < from) return false;
    }
    if (f.submittedTo) {
      const t = new Date(doc.submittedAt).getTime();
      const to = new Date(f.submittedTo + "T23:59:59").getTime();
      if (t > to) return false;
    }
    return true;
  });
}
