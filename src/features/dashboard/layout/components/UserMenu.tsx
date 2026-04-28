import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { SidebarFooter } from "@/shared/components/ui/sidebar"

interface UserMenuProps {
    userName?: string
    userEmail?: string
    userInitial: string
    onLogout: () => void
}

export function UserMenu({ userName, userEmail, userInitial, onLogout }: UserMenuProps) {
    return (
        <SidebarFooter>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center gap-2 rounded-md border px-2 py-2 text-left hover:bg-accent cursor-pointer group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:hover:bg-transparent">
                        <Avatar className="size-7 group-data-[collapsible=icon]:size-9">
                            <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                            <div className="truncate text-sm font-medium">{userName ?? "Usuário"}</div>
                            <div className="truncate text-xs text-muted-foreground">{userEmail ?? ""}</div>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" alignOffset={0} sideOffset={8} collisionPadding={12} className="w-64">
                    <DropdownMenuLabel>
                        <div className="flex items-center gap-2">
                            <Avatar className="size-8">
                                <AvatarFallback>{userInitial}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <div className="text-sm font-medium leading-none truncate">{userName ?? "Usuário"}</div>
                                <div className="text-xs text-muted-foreground truncate">{userEmail ?? ""}</div>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
    )
}
