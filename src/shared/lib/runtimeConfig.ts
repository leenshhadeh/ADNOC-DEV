/**
 * Runtime configuration — loaded from /config.json at startup.
 *
 * In production the file is served from a Kubernetes ConfigMap mounted at
 * /usr/share/nginx/html/config.json, so values can be changed without
 * rebuilding the image.
 *
 * In development the file is served from public/config.json by Vite's dev
 * server.
 */

interface RuntimeConfig {
  API_BASE_URL: string
  TENANT_ID: string
  CLIENT_ID: string
  BACKEND_CLIENT_ID: string
  BPA_GUIDELINES_URL: string
  SERVICENOW_URL: string
}

let config: RuntimeConfig | null = null

export async function loadRuntimeConfig(): Promise<void> {
  const res = await fetch('/config.json', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to load /config.json: ${res.status}`)
  }
  const json = (await res.json()) as RuntimeConfig

  // In development, fall back to VITE_* env vars for fields left empty in
  // public/config.json so the existing .env.local workflow still works.
  if (import.meta.env.DEV) {
    config = {
      API_BASE_URL: json.API_BASE_URL || (import.meta.env.VITE_API_BASE_URL as string) || '',
      TENANT_ID: json.TENANT_ID || (import.meta.env.VITE_TENANT_ID as string) || '',
      CLIENT_ID: json.CLIENT_ID || (import.meta.env.VITE_CLIENT_ID as string) || '',
      BACKEND_CLIENT_ID:
        json.BACKEND_CLIENT_ID || (import.meta.env.VITE_BACKEND_CLIENT_ID as string) || '',
      BPA_GUIDELINES_URL: json.BPA_GUIDELINES_URL,
      SERVICENOW_URL: json.SERVICENOW_URL,
    }
  } else {
    config = json
  }
}

export function getRuntimeConfig(): RuntimeConfig {
  if (!config) {
    throw new Error(
      'Runtime config not loaded. Make sure loadRuntimeConfig() is called before rendering.',
    )
  }
  return config
}
