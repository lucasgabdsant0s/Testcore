import { NavLink, Outlet, useLocation, useNavigate } from "react-router"
import { useMemo, useState } from "react"
import type { FormEvent } from "react"

import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarSeparator, SidebarTrigger, SidebarRail } from "@/shared/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/components/ui/breadcrumb"
import { Separator } from "@/shared/components/ui/separator"
import ThemeModeToggle from "@/shared/components/ThemeModeToggle"
import { useAuthStore } from "@/features/auth/store/authStore"
import { DashboardLinksProvider, useDashboardLinks } from "../context/DashboardLinksContext"
import { SidebarActions } from "./components/SidebarActions"
import { SitesList } from "./components/SitesList"
import { UserMenu } from "./components/UserMenu"
import { CreateLinkModal } from "./components/CreateLinkModal"

function DashboardLayoutContent() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { links, activeLinkId, setActiveLinkId, addLink } = useDashboardLinks()

  const navigate = useNavigate()
  const location = useLocation()
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false)
  const [newLinkLabel, setNewLinkLabel] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")

  const userInitial = useMemo(() => (user?.name?.trim()?.[0] ?? "U").toUpperCase(), [user?.name])

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  function handleOpenCreateLink() {
    setIsCreateLinkOpen(true)
  }

  function handleCloseCreateLink() {
    setIsCreateLinkOpen(false)
    setNewLinkLabel("")
    setNewLinkUrl("")
  }

  function handleSubmitCreateLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const label = newLinkLabel.trim()
    const url = newLinkUrl.trim()
    if (!label || !url) {
      return
    }
    const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`
    const newLink = {
      id: `${Date.now()}`,
      label,
      url: normalizedUrl,
    }
    addLink(newLink)
    handleCloseCreateLink()
  }

  function handleNavigateMonitoring() {
    setActiveLinkId("")
    navigate("/dashboard/monitorar")
  }

  function handleSelectLink(linkId: string) {
    setActiveLinkId(linkId)
    navigate("/dashboard")
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent>
          <SidebarActions
            onCreateLink={handleOpenCreateLink}
            onNavigateMonitoring={handleNavigateMonitoring}
          />

          <SitesList
            links={links}
            activeLinkId={activeLinkId}
            onSelectLink={handleSelectLink}
          />
        </SidebarContent>

        <SidebarSeparator />

        <UserMenu
          userName={user?.name}
          userEmail={user?.email}
          userInitial={userInitial}
          onLogout={handleLogout}
        />

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <div className="text-sm font-medium flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {(() => {
                  const current = location.pathname.replace(/^\/dashboard\/?/, "")
                  if (!current) return null
                  return (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{current}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )
                })()}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeModeToggle />
        </header>

        <div className="flex flex-1 flex-col p-4 lg:p-6">
          <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>

      <CreateLinkModal
        isOpen={isCreateLinkOpen}
        label={newLinkLabel}
        url={newLinkUrl}
        onLabelChange={setNewLinkLabel}
        onUrlChange={setNewLinkUrl}
        onSubmit={handleSubmitCreateLink}
        onClose={handleCloseCreateLink}
      />
    </SidebarProvider>
  )
}

export function DashboardLayout() {
  return (
    <DashboardLinksProvider>
      <DashboardLayoutContent />
    </DashboardLinksProvider>
  )
}

