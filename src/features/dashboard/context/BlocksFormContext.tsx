import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"

type IdToParams = Record<string, Record<string, unknown>>

type BlocksFormContextType = {
  getParams: <T extends Record<string, unknown> = Record<string, unknown>>(id: string) => T
  setParams: (id: string, partial: Record<string, unknown>) => void
  clearParams: (id: string) => void
}

const BlocksFormContext = createContext<BlocksFormContextType | undefined>(undefined)

export function BlocksFormProvider({ children }: { children: ReactNode }) {
  const [idToParams, setIdToParams] = useState<IdToParams>({})

  const getParams = useCallback(<T extends Record<string, unknown> = Record<string, unknown>>(id: string): T => {
    return (idToParams[id] as T) ?? ({} as T)
  }, [idToParams])

  const setParams = useCallback((id: string, partial: Record<string, unknown>) => {
    setIdToParams((prev) => {
      const current = prev[id] ?? {}
      return { ...prev, [id]: { ...current, ...partial } }
    })
  }, [])

  const clearParams = useCallback((id: string) => {
    setIdToParams((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const value = useMemo(() => ({ getParams, setParams, clearParams }), [getParams, setParams, clearParams])

  return <BlocksFormContext.Provider value={value}>{children}</BlocksFormContext.Provider>
}

export function useBlocksForm() {
  const ctx = useContext(BlocksFormContext)
  if (!ctx) throw new Error("useBlocksForm must be used within BlocksFormProvider")
  return ctx
}


