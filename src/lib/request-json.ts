export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "too_large" | "invalid_json" };

export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<JsonBodyResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      return { ok: false, reason: "too_large" };
    }
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return { ok: false, reason: "invalid_json" };
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      try {
        await reader.cancel();
      } catch {
        // The size limit still applies if the request stream has already closed.
      }
      return { ok: false, reason: "too_large" };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return {
      ok: true,
      value: JSON.parse(new TextDecoder().decode(bytes)) as unknown,
    };
  } catch {
    return { ok: false, reason: "invalid_json" };
  }
}
