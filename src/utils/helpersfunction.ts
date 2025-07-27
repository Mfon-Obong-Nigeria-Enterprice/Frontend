export function getDaysSince(dateString: string) {
  const created = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - created.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // days
}
