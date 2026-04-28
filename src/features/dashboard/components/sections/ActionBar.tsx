import { Button } from "@/shared/components/ui/button"
import { Save, Play, Trash2 } from "lucide-react"
import { TestsCombobox, type SavedTest } from "../TestsCombobox"

interface ActionBarProps {
    hasBlocks: boolean
    isSaving: boolean
    isRunning: boolean
    selectedTestId: string | undefined
    savedTests: SavedTest[]
    activeLinkId: string | null
    activeLink: { label: string; url: string } | null | undefined
    onSelectTest: (id: string | undefined) => void
    onSaveTest: () => void
    onUpdateTest: () => void
    onRunTest: () => void
    onDeleteSite: () => void
}

export function ActionBar({
    hasBlocks,
    isSaving,
    isRunning,
    selectedTestId,
    savedTests,
    activeLinkId,
    activeLink,
    onSelectTest,
    onSaveTest,
    onUpdateTest,
    onRunTest,
    onDeleteSite,
}: ActionBarProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <TestsCombobox
                tests={savedTests}
                value={selectedTestId}
                onSelect={onSelectTest}
                disabled={!activeLinkId}
            />
            <div className="flex items-center gap-2">
                {selectedTestId ? (
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        disabled={!hasBlocks || isSaving}
                        onClick={onUpdateTest}
                    >
                        <Save className="size-4" />
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        disabled={!hasBlocks}
                        onClick={onSaveTest}
                    >
                        <Save className="size-4" />
                        Salvar teste
                    </Button>
                )}
                <Button
                    size="sm"
                    className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:hover:bg-emerald-600"
                    disabled={!hasBlocks || isRunning}
                    onClick={onRunTest}
                >
                    <Play className="size-4" />
                    {isRunning ? "Rodando..." : "Rodar teste"}
                </Button>
                {activeLink && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onDeleteSite}
                        className="gap-2"
                    >
                        <Trash2 className="size-4" />
                        Deletar Site
                    </Button>
                )}
            </div>
        </div>
    )
}
