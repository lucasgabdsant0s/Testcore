import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shared/components/ui/sidebar"
import { Link as LinkIcon } from "lucide-react"
import type { DashboardLink } from "../../context/DashboardLinksContext"

interface SitesListProps {
    links: DashboardLink[]
    activeLinkId: string
    onSelectLink: (id: string) => void
}

export function SitesList({ links, activeLinkId, onSelectLink }: SitesListProps) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Sites</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {links.map((link) => (
                        <SidebarMenuItem key={link.id}>
                            <SidebarMenuButton
                                onClick={() => onSelectLink(link.id)}
                                isActive={activeLinkId === link.id}
                                tooltip={link.label}
                            >
                                <LinkIcon />
                                <span>{link.label}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
