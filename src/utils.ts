/**
 * Rate limit key generator based in the request headers.
 * Sadly, it seems that there's no way to get the client IP unless it's from a proxy.
 * @param {Request} request incoming request.
 * @returns string key for the rate limiting.
 */
export const rateLimitKeyGenerator = (request: Request) => {
  const headers = [
    // Cloudflare
    "cf-connecting-ip",
    // Firebase, Fastly
    "fastly-client-ip",
    // Akamai
    "true-client-ip",
    // Google App Engine
    "x-appengine-user-ip",
    // NGINX
    "x-real-ip",
    // Standard
    "x-forwarded-for",
    "x-client-ip",
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value !== null) return value;
  }

  return "";
};
