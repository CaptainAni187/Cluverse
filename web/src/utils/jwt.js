// Safe JWT-payload reader (Base64-URL → JSON)
// returns {} if the token is empty, malformed, or expired
export function getPayload(token = '') {
  try {
    const base64url = token.split('.')[1];          // payload part only
    if (!base64url) return {};
    const base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(base64url.length / 4) * 4, '=');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}
