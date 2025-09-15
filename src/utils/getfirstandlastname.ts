export function getFirstAndLastName(fullName: string): string {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(" ");

  return `${parts[0]} ${parts[parts.length - 1]}`;
}

// function getFirstAndLastName({ fullName }: { fullName: string }) {
//   if (!fullName || typeof fullName !== "string") return "";

//   const parts = fullName.trim().split(/\s+/); // split by any whitespace
//   if (parts.length === 1) return parts[0]; // only one name given
//   if (parts.length === 2) return parts.join(" "); // already first + last

//   return `${parts[0]} ${parts[parts.length - 1]}`; // first + last
// }

// // Examples:
// console.log(getFirstAndLastName("John Doe")); // "John Doe"
// console.log(getFirstAndLastName("John Michael Doe")); // "John Doe"
// console.log(getFirstAndLastName("Mary Jane Watson Parker")); // "Mary Parker"
// console.log(getFirstAndLastName("Cher")); // "Cher"
