"use client";

import { createClient } from "./client";
import type { Json } from "./types";

export const accountDocumentEvent = "pedago-helper:account-document";

export interface AccountDocumentChange<T = unknown> {
  ownerId: string;
  key: string;
  value: T;
}

export async function readAccountDocument<T>(
  ownerId: string,
  key: string,
  isValid: (value: unknown) => value is T,
  legacyStorageKey?: string,
): Promise<T | null> {
  const { data, error } = await createClient().from("user_documents")
    .select("value")
    .eq("user_id", ownerId)
    .eq("document_key", key)
    .maybeSingle();
  if (error) throw error;
  if (data) {
    if (!isValid(data.value)) throw new Error("Stored account document is invalid");
    return data.value;
  }

  if (!legacyStorageKey) return null;
  let raw: string | null;
  try { raw = window.localStorage.getItem(legacyStorageKey); }
  catch { return null; }
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!isValid(parsed)) throw new Error("Stored browser document is invalid");
  await writeAccountDocument(ownerId, key, parsed);
  try { window.localStorage.removeItem(legacyStorageKey); }
  catch { /* The cloud copy is authoritative after a successful write. */ }
  return parsed;
}

export async function writeAccountDocument<T>(ownerId: string, key: string, value: T): Promise<void> {
  const serialized = JSON.stringify(value);
  if (!serialized || serialized.length > 2_000_000) throw new Error("Account document is too large");
  const json = JSON.parse(serialized) as Json;
  const { error } = await createClient().from("user_documents")
    .upsert({ user_id: ownerId, document_key: key, value: json }, { onConflict: "user_id,document_key" });
  if (error) throw error;
  window.dispatchEvent(new CustomEvent<AccountDocumentChange<T>>(accountDocumentEvent, { detail: { ownerId, key, value } }));
}
