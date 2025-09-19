export function getFirstAndLastName(fullName: string): string {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(" ");

  return `${parts[0]} ${parts[parts.length - 1]}`;
}
