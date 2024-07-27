export function extractNameFromEmail(email: string) {
  let localPart = email.split('@')[0];

  localPart = localPart.replace(/[._]/g, ' ');

  localPart = localPart.replace(/\b\w/g, (char) => char.toUpperCase());

  return localPart;
}
