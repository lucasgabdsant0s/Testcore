import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"

type OnPick = (selector: string) => void

type ElementPickerContextType = {
  isPicking: boolean
  startPicking: (onPick: OnPick) => void
  cancelPicking: () => void
  completePicking: (selector: string) => void
}

const ElementPickerContext = createContext<ElementPickerContextType | undefined>(undefined)

export function ElementPickerProvider({ children }: { children: ReactNode }) {
  const [isPicking, setIsPicking] = useState(false)
  const onPickRef = useRef<OnPick | null>(null)

  const startPicking = useCallback((onPick: OnPick) => {
    onPickRef.current = onPick
    setIsPicking(true)
  }, [])

  const cancelPicking = useCallback(() => {
    onPickRef.current = null
    setIsPicking(false)
  }, [])

  const completePicking = useCallback((selector: string) => {
    const cb = onPickRef.current
    onPickRef.current = null
    setIsPicking(false)
    if (cb) cb(selector)
  }, [])

  const value = useMemo(
    () => ({
      isPicking,
      startPicking,
      cancelPicking,
      completePicking,
    }),
    [isPicking, startPicking, cancelPicking, completePicking],
  )

  return <ElementPickerContext.Provider value={value}>{children}</ElementPickerContext.Provider>
}

export function useElementPicker() {
  const ctx = useContext(ElementPickerContext)
  if (!ctx) throw new Error("useElementPicker must be used within ElementPickerProvider")
  return ctx
}


