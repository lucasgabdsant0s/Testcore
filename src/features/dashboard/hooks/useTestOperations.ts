import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/shared/lib/api-client"
import { useBlocksForm } from "../context/BlocksFormContext"
import { useDashboardLinks } from "../context/DashboardLinksContext"
import type { Block, BlockType } from "./useBlockManagement"
import type { SavedTest } from "../components/TestsCombobox"

interface UseTestOperationsProps {
    blocks: Block[]
    setBlocks: (blocks: Block[]) => void
    testName: string
    onCloseSaveModal: () => void
}

export function useTestOperations({
    blocks,
    setBlocks,
    testName,
    onCloseSaveModal,
}: UseTestOperationsProps) {
    const { activeLink, activeLinkId } = useDashboardLinks()
    const { getParams, setParams } = useBlocksForm()
    const [isSaving, setIsSaving] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [selectedTestId, setSelectedTestId] = useState<string | undefined>(undefined)
    const [savedTests, setSavedTests] = useState<SavedTest[]>([])

    const buildScenario = useCallback(
        (nameOverride?: string) => {
            const scenarioBlocks: Array<any> = []
            blocks.forEach((block, index) => {
                const pad = String(index + 1).padStart(2, "0")
                if (block.type === "goto") {
                    const p = getParams<{ url?: string }>(block.id)
                    scenarioBlocks.push({
                        id: block.id,
                        type: "goto",
                        params: {
                            url: (p.url && p.url.trim()) || activeLink?.url || "",
                            waitUntil: "domcontentloaded",
                        },
                    })
                } else if (block.type === "click") {
                    const p = getParams<{ selector?: string; clickType?: string }>(block.id)
                    scenarioBlocks.push({
                        id: block.id,
                        type: "click",
                        params: {
                            selector: p.selector ?? "",
                            timeout: 15000,
                        },
                    })
                } else if (block.type === "type") {
                    const p = getParams<{ selector?: string; text?: string }>(block.id)
                    scenarioBlocks.push({
                        id: block.id,
                        type: "type",
                        params: {
                            selector: p.selector ?? "",
                            text: p.text ?? "",
                            timeout: 5000,
                        },
                    })
                }
                scenarioBlocks.push({
                    id: `${block.id}-wait`,
                    type: "wait",
                    params: { timeout: 500 },
                })
                scenarioBlocks.push({
                    id: `${block.id}-screenshot`,
                    type: "screenshot",
                    params: { name: `${pad}-${block.type}` },
                })
            })

            const scenarioName = nameOverride ?? (testName || "Execução rápida")

            return {
                name: scenarioName,
                meta: {
                    siteId: activeLinkId,
                    siteUrl: activeLink?.url ?? "",
                },
                config: {
                    screenshotEnabled: true,
                    screenshotInterval: 300,
                    postScenarioDelay: 3000,
                },
                blocks: scenarioBlocks,
            }
        },
        [blocks, getParams, activeLink, activeLinkId, testName],
    )

    const refreshTests = useCallback(async () => {
        if (!activeLink?.url) {
            setSavedTests([])
            return
        }
        try {
            const resp = await apiClient.get("/tests", { params: { siteUrl: activeLink.url } })
            const items = (resp.data ?? []) as Array<{ id: number; name: string }>
            setSavedTests(items.map((it) => ({ id: String(it.id), name: it.name })))
        } catch {
            setSavedTests([])
        }
    }, [activeLink?.url])

    const handleSaveTest = useCallback(async () => {
        if (!testName.trim()) return

        const testData = {
            name: testName,
            json: buildScenario(testName),
        }

        setIsSaving(true)
        try {
            await apiClient.post("/tests", testData)
            onCloseSaveModal()
            await refreshTests()
        } catch (error) {
            console.error("Erro ao salvar teste:", error)
        } finally {
            setIsSaving(false)
        }
    }, [testName, buildScenario, onCloseSaveModal, refreshTests])

    const handleUpdateTest = useCallback(async () => {
        if (!selectedTestId) return
        const current = savedTests.find((t) => t.id === selectedTestId)
        const name = current?.name ?? (testName || "Teste sem nome")

        const testData = {
            name,
            json: buildScenario(name),
        }

        setIsSaving(true)
        try {
            await apiClient.put(`/tests/${selectedTestId}`, testData)
            await refreshTests()
            setSelectedTestId(undefined)
        } catch (error) {
            console.error("Erro ao atualizar teste:", error)
        } finally {
            setIsSaving(false)
        }
    }, [selectedTestId, savedTests, testName, buildScenario, refreshTests])

    const handleRunTest = useCallback(
        async (onSuccess?: () => void) => {
            if (blocks.length === 0) return
            setIsRunning(true)
            try {
                const scenario = buildScenario()
                await apiClient.post("/tests/run", { json: scenario }, { timeout: 60000 })
                if (onSuccess) onSuccess()
            } catch (error) {
                console.error("Erro ao executar teste:", error)
            } finally {
                setIsRunning(false)
            }
        },
        [blocks.length, buildScenario],
    )

    const loadTest = useCallback(
        async (testId: string | undefined) => {
            if (!testId) return
            try {
                const resp = await apiClient.get(`/tests/${testId}`)
                const data = resp.data?.json as any
                const loadedBlocks = Array.isArray(data?.blocks) ? (data.blocks as any[]) : []
                const uiBlocks: Block[] = []
                loadedBlocks.forEach((b: any) => {
                    if (b.type === "goto" || b.type === "click" || b.type === "type") {
                        const id = b.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
                        const type = b.type as BlockType
                        const label = type === "goto" ? "Ir para" : type === "click" ? "Clicar em" : "Digitar"
                        uiBlocks.push({ id, type, label })
                        if (type === "goto") {
                            const p = { url: b.params?.url ?? "" }
                            getParams(id)
                                ; (setParams as any)(id, p)
                        }
                        if (type === "click") {
                            const p = { selector: b.params?.selector ?? "", clickType: "Simples" }
                                ; (setParams as any)(id, p)
                        }
                        if (type === "type") {
                            const p = { selector: b.params?.selector ?? "", text: b.params?.text ?? "" }
                                ; (setParams as any)(id, p)
                        }
                    }
                })
                setBlocks(uiBlocks)
            } catch (e) {
                console.error("Falha ao carregar teste", e)
            }
        },
        [getParams, setParams, setBlocks],
    )

    useEffect(() => {
        refreshTests()
    }, [refreshTests])

    return {
        isSaving,
        isRunning,
        selectedTestId,
        setSelectedTestId,
        savedTests,
        handleSaveTest,
        handleUpdateTest,
        handleRunTest,
        loadTest,
        refreshTests,
        buildScenario,
    }
}
