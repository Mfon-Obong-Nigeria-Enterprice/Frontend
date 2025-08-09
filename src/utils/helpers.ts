export function isCategoryObject(
  category: string | { _id: string; name: string; units: string[] }
): category is { _id: string; name: string; units: string[] } {
  return typeof category === "object" && category !== null;
}
