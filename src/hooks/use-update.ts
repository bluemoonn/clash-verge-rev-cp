import { useQuery } from '@tanstack/react-query'

import { queryClient } from '@/services/query-client'

export interface UpdateInfo {
  version: string
  body: string
  date: string
  available: boolean
  downloadAndInstall: (onEvent?: any) => Promise<void>
}

const LAST_CHECK_KEY = 'last_check_update'

export const readLastCheckTime = (): number | null => {
  const stored = localStorage.getItem(LAST_CHECK_KEY)
  if (!stored) return null
  const ts = parseInt(stored, 10)
  return isNaN(ts) ? null : ts
}

export const updateLastCheckTime = (timestamp?: number): number => {
  const now = timestamp ?? Date.now()
  localStorage.setItem(LAST_CHECK_KEY, now.toString())
  queryClient.setQueryData([LAST_CHECK_KEY], now)
  return now
}

// --- useUpdate hook ---

export const useUpdate = (enabled: boolean = true) => {
  void enabled
  const shouldCheck = false

  const {
    data: updateInfo,
    refetch: checkUpdate,
    isFetching: isValidating,
  } = useQuery<UpdateInfo | null>({
    queryKey: ['checkUpdate'],
    queryFn: async () => null,
    enabled: shouldCheck,
    refetchInterval: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  // Shared last check timestamp
  const { data: lastCheckUpdate } = useQuery({
    queryKey: [LAST_CHECK_KEY],
    queryFn: readLastCheckTime,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    updateInfo,
    checkUpdate,
    loading: isValidating,
    lastCheckUpdate: lastCheckUpdate ?? null,
  }
}
