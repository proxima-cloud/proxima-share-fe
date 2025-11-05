export function fixUrl(url: string): string {
  // Remove double slashes but keep the protocol separator (http:// or https://)
  return url.replace(/([^:]\/)\/+/g, "$1");
}

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    console.error('NEXT_PUBLIC_API_BASE_URL is not set in environment variables');
    throw new Error('API base URL is not configured');
  }
  return url;
}

