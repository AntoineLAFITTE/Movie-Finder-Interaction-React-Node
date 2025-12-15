import { useEffect, useState } from 'react'

type UseFetchResult<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T = any>(url: string | null, deps: any[] = []): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    let isCancelled = false
    setLoading(true)
    setError(null)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then(json => { if (!isCancelled) setData(json) })
      .catch(err => { if (!isCancelled) setError(err.message) })
      .finally(() => { if (!isCancelled) setLoading(false) })

    return () => { isCancelled = true }
  }, deps)

  return { data, loading, error }
}
