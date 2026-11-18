export async function safeParseJson<T = Record<string, unknown>>(
  res: Response
): Promise<T & { error?: string }> {
  const raw = await res.text();
  if (!raw) {
    return {} as T & { error?: string };
  }
  try {
    return JSON.parse(raw) as T & { error?: string };
  } catch {
    return {
      error: res.ok
        ? "Unexpected non-JSON response received from server."
        : `Server returned HTTP ${res.status}. Please try again shortly.`,
    } as T & { error?: string };
  }
}
