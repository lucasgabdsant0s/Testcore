import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react"
import type { ReactNode } from "react"

export type DashboardLink = {
  id: string
  label: string
  url: string
}

interface DashboardLinksContextType {
  links: DashboardLink[]
  activeLinkId: string
  setActiveLinkId: (id: string) => void
  activeLink: DashboardLink | undefined
  addLink: (link: DashboardLink) => void
  removeLink: (id: string) => void
}

const DashboardLinksContext = createContext<DashboardLinksContextType | undefined>(undefined)

const INITIAL_LINKS: DashboardLink[] = [
  {
    id: "slotpaypix",
    label: "SlotPayPix",
    url: "https://slotpixpay.io",
  },
]

const LINKS_STORAGE_KEY = "dashboard-links"
const ACTIVE_LINK_STORAGE_KEY = "dashboard-active-link-id"

export function DashboardLinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<DashboardLink[]>(() => {
    if (typeof window === "undefined") return INITIAL_LINKS
    const storedLinks = window.localStorage.getItem(LINKS_STORAGE_KEY)
    if (!storedLinks) return INITIAL_LINKS
    try {
      const parsed = JSON.parse(storedLinks) as DashboardLink[]
      return parsed.length > 0 ? parsed : INITIAL_LINKS
    } catch {
      return INITIAL_LINKS
    }
  })

  const [activeLinkId, rawSetActiveLinkId] = useState<string>(() => {
    if (typeof window === "undefined") return INITIAL_LINKS[0]?.id ?? ""
    const storedActiveLinkId = window.localStorage.getItem(ACTIVE_LINK_STORAGE_KEY)
    if (storedActiveLinkId) {
      return storedActiveLinkId
    }
    return INITIAL_LINKS[0]?.id ?? ""
  })
  const activeLink = useMemo(
    () => links.find((link) => link.id === activeLinkId),
    [links, activeLinkId],
  )

  const addLink = useCallback((link: DashboardLink) => {
    setLinks((prev) => [...prev, link])
    rawSetActiveLinkId(link.id)
  }, [])

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => {
      const filtered = prev.filter((link) => link.id !== id)
      if (filtered.length === 0) {
        rawSetActiveLinkId("")
        return INITIAL_LINKS
      }
      if (id === activeLinkId) {
        const newActiveId = filtered[0]?.id ?? ""
        rawSetActiveLinkId(newActiveId)
      }
      return filtered
    })
  }, [activeLinkId])

  const setActiveLinkId = useCallback((id: string) => {
    rawSetActiveLinkId(id)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links))
  }, [links])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (activeLinkId === "") {
      window.localStorage.setItem(ACTIVE_LINK_STORAGE_KEY, "")
      return
    }
    if (!links.some((link) => link.id === activeLinkId)) {
      const fallbackId = links[0]?.id ?? ""
      rawSetActiveLinkId(fallbackId)
      window.localStorage.setItem(ACTIVE_LINK_STORAGE_KEY, fallbackId)
      return
    }
    window.localStorage.setItem(ACTIVE_LINK_STORAGE_KEY, activeLinkId)
  }, [activeLinkId, links])

  const value = useMemo(
    () => ({
      links,
      activeLinkId,
      setActiveLinkId,
      activeLink,
      addLink,
      removeLink,
    }),
    [links, activeLinkId, activeLink, addLink, removeLink, setActiveLinkId],
  )

  return <DashboardLinksContext.Provider value={value}>{children}</DashboardLinksContext.Provider>
}

export function useDashboardLinks() {
  const context = useContext(DashboardLinksContext)
  if (context === undefined) {
    throw new Error("useDashboardLinks must be used within a DashboardLinksProvider")
  }
  return context
}

