export function extractJSON(raw: string) {
  try {
    const cleaned = raw.trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Invalid AI JSON");
  }
}
