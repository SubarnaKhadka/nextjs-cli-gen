export function capitalize(name) {
  const withoutSpaces = name
    .substring(1)
    .replace(/\s+[A-Za-z]/g, (match) =>
      match.toUpperCase().replace(/\s+/g, "")
    );

  return name.charAt(0).toUpperCase() + withoutSpaces;
}
