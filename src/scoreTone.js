export default function scoreTone(value) {
  if (value === null || value === undefined || value === "") return "neutral";
  const score = Number(value);
  if (!Number.isFinite(score)) return "neutral";
  if (score >= 85) return "high";
  if (score >= 60) return "medium";
  return "low";
}
