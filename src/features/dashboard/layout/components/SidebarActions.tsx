import { Button } from "@/shared/components/ui/button"
import { ChartNoAxesCombined, Plus } from "lucide-react"

interface SidebarActionsProps {
    onCreateLink: () => void
    onNavigateMonitoring: () => void
}

export function SidebarActions({ onCreateLink, onNavigateMonitoring }: SidebarActionsProps) {
    return (
        <>
            <div>
                <Button
                    size="lg"
                    variant="outline"
                    className="
            w-full rounded-full font-medium flex items-center justify-center
            group-data-[collapsible=icon]:w-12
            group-data-[collapsible=icon]:h-12
            group-data-[collapsible=icon]:rounded-full
            group-data-[collapsible=icon]:p-0
          "
                    onClick={onCreateLink}
                >
                    <span className="text-xl hidden sm:hidden group-data-[collapsible=icon]:inline">
                        <Plus className="w-4 h-4" />
                    </span>
                    <span className="sm:inline group-data-[collapsible=icon]:hidden">
                        Cadastrar novo site
                    </span>
                </Button>
            </div>
            <div>
                <Button
                    onClick={onNavigateMonitoring}
                    className="w-full rounded-full font-medium flex items-center justify-center
            group-data-[collapsible=icon]:w-12
            group-data-[collapsible=icon]:h-12
            group-data-[collapsible=icon]:rounded-full
            group-data-[collapsible=icon]:p-0"
                    variant="outline"
                >
                    <span className="text-xl hidden sm:hidden group-data-[collapsible=icon]:inline">
                        <ChartNoAxesCombined className="w-4 h-4" />
                    </span>
                    <span
                        className="
                flex items-center gap-2
                sm:flex
                group-data-[collapsible=icon]:hidden
                "
                    >
                        <ChartNoAxesCombined className="w-4 h-4" />
                        <span>Monitoramento</span>
                    </span>
                </Button>
            </div>
        </>
    )
}
