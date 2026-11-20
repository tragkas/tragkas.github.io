import { getFirebaseClientConfig } from "./firebase-config";

function getRestConfig() {
  const firebaseConfig = getFirebaseClientConfig();
  const projectId = firebaseConfig.projectId;
  const databaseId = firebaseConfig.firestoreDatabaseId || "(default)";
  const apiKey = firebaseConfig.apiKey;

  if (!projectId || !apiKey) {
    throw new Error("Firebase environment variables are not configured.");
  }

  const dbRoot = `projects/${projectId}/databases/${databaseId}`;
  return {
    dbRoot,
    apiKey,
    docsBaseUrl: `https://firestore.googleapis.com/v1/${dbRoot}/documents`,
    commitUrl: `https://firestore.googleapis.com/v1/${dbRoot}:commit`,
  };
}

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { nullValue: null };

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
}

function encodeValue(val: unknown): FirestoreValue {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === "boolean") {
    return { booleanValue: val };
  }
  if (typeof val === "number") {
    if (Number.isInteger(val)) {
      return { integerValue: String(val) };
    }
    return { doubleValue: val };
  }
  return { stringValue: String(val) };
}

function decodeValue(val: FirestoreValue): unknown {
  if ("stringValue" in val) return val.stringValue;
  if ("booleanValue" in val) return val.booleanValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return val.doubleValue;
  if ("timestampValue" in val) return val.timestampValue;
  if ("nullValue" in val) return null;
  return undefined;
}

function decodeDoc<T extends { id: string }>(doc: FirestoreDocument): T {
  const parts = doc.name.split("/");
  const id = parts[parts.length - 1];
  const result: Record<string, unknown> = { id };
  if (doc.fields) {
    for (const [key, value] of Object.entries(doc.fields)) {
      result[key] = decodeValue(value);
    }
  }
  return result as T;
}

function encodeFields(data: Record<string, unknown>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields[key] = encodeValue(value);
    }
  }
  return fields;
}

export async function listCollection<T extends { id: string }>(
  collectionName: string
): Promise<T[]> {
  const { docsBaseUrl, apiKey } = getRestConfig();
  const url = `${docsBaseUrl}/${encodeURIComponent(collectionName)}?pageSize=200&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Firestore list failed (${res.status}): ${errText}`);
  }
  const json = (await res.json()) as { documents?: FirestoreDocument[] };
  if (!json.documents || !Array.isArray(json.documents)) {
    return [];
  }
  return json.documents.map((doc) => decodeDoc<T>(doc));
}

export async function getDocument<T extends { id: string }>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const { docsBaseUrl, apiKey } = getRestConfig();
  const url = `${docsBaseUrl}/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Firestore get failed (${res.status}): ${errText}`);
  }
  const doc = (await res.json()) as FirestoreDocument;
  return decodeDoc<T>(doc);
}

export async function createDocument(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>,
  idToken: string,
  options?: { includeCreatedAt?: boolean }
): Promise<void> {
  const { dbRoot, commitUrl } = getRestConfig();
  const includeCreatedAt = options?.includeCreatedAt ?? true;
  const transforms: { fieldPath: string; setToServerValue: "REQUEST_TIME" }[] = [
    { fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" },
  ];
  if (includeCreatedAt) {
    transforms.unshift({ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" });
  }

  const body = {
    writes: [
      {
        update: {
          name: `${dbRoot}/documents/${collectionName}/${docId}`,
          fields: encodeFields(data),
        },
        updateTransforms: transforms,
        currentDocument: { exists: false },
      },
    ],
  };

  const res = await fetch(commitUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Firestore create failed (${res.status}): ${errText}`);
  }
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>,
  idToken: string
): Promise<void> {
  const { dbRoot, commitUrl } = getRestConfig();
  const fieldPaths = Object.keys(data);
  const body = {
    writes: [
      {
        update: {
          name: `${dbRoot}/documents/${collectionName}/${docId}`,
          fields: encodeFields(data),
        },
        updateMask: {
          fieldPaths,
        },
        updateTransforms: [
          { fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" },
        ],
        currentDocument: { exists: true },
      },
    ],
  };

  const res = await fetch(commitUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Firestore update failed (${res.status}): ${errText}`);
  }
}

export async function upsertProfileDocument(
  data: Record<string, unknown>,
  idToken: string,
  exists: boolean
): Promise<void> {
  const { dbRoot, commitUrl } = getRestConfig();
  const fieldPaths = Object.keys(data);
  const write: Record<string, unknown> = {
    update: {
      name: `${dbRoot}/documents/profile/main`,
      fields: encodeFields(data),
    },
    updateTransforms: [
      { fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" },
    ],
    currentDocument: { exists },
  };
  if (exists) {
    write.updateMask = { fieldPaths };
  }

  const res = await fetch(commitUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ writes: [write] }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Firestore profile save failed (${res.status}): ${errText}`);
  }
}

export async function deleteDocument(
  collectionName: string,
  docId: string,
  idToken: string
): Promise<void> {
  const { docsBaseUrl } = getRestConfig();
  const url = `${docsBaseUrl}/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Firestore delete failed (${res.status}): ${errText}`);
  }
}

export async function batchSeedDocuments(
  writes: Array<{
    collectionName: string;
    docId: string;
    data: Record<string, unknown>;
    includeCreatedAt?: boolean;
  }>,
  idToken: string
): Promise<void> {
  if (writes.length === 0) return;
  const { dbRoot, commitUrl } = getRestConfig();
  const formattedWrites = writes.map((w) => {
    const transforms: { fieldPath: string; setToServerValue: "REQUEST_TIME" }[] = [
      { fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" },
    ];
    if (w.includeCreatedAt !== false) {
      transforms.unshift({ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" });
    }
    return {
      update: {
        name: `${dbRoot}/documents/${w.collectionName}/${w.docId}`,
        fields: encodeFields(w.data),
      },
      updateTransforms: transforms,
      currentDocument: { exists: false },
    };
  });

  const res = await fetch(commitUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ writes: formattedWrites }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Firestore batch seed failed (${res.status}): ${errText}`);
  }
}
