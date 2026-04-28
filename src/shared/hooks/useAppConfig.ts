import { useEffect, useState } from 'react'

export interface AppConfig {
  API_BASE_URL: string
  TENANT_ID: string
  CLIENT_ID: string
  BACKEND_CLIENT_ID: string
  BPA_GUIDELINES_URL: string
  SERVICENOW_URL: string
}

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null)

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json() as Promise<AppConfig>)
      .then(setConfig)
      .catch((err) => {
        throw new Error(`Could not fetch config: ${String(err)}`)
      })
  }, [])

  return config
}
