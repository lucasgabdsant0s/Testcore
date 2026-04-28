import { useState } from "react"
import { useDashboardLinks } from "../context/DashboardLinksContext"
import { ElementPickerProvider } from "../context/ElementPickerContext"
import { BlocksFormProvider } from "../context/BlocksFormContext"
import { useBlockManagement } from "../hooks/useBlockManagement"
import { useTestModals } from "../hooks/useTestModals"
import { useTestOperations } from "../hooks/useTestOperations"
import { useTestStream } from "../hooks/useTestStream"
import { ActionBar } from "../components/sections/ActionBar"
import { SaveTestModal } from "../components/modals/SaveTestModal"
import { DeleteSiteModal } from "../components/modals/DeleteSiteModal"
import { TestBlocksSection } from "../components/sections/TestBlocksSection"
import { VisualizationSection } from "../components/sections/VisualizationSection"
import { TestPlayer } from "../components/TestPlayer"

function DashboardContent() {
  const { activeLink, removeLink, activeLinkId } = useDashboardLinks()

  const {
    blocks,
    setBlocks,
    addBlock,
    removeBlock,
    moveBlock,
    getPreviousClickBlocksForIndex,
    hasBlocks,
  } = useBlockManagement()

  const {
    isDeleteModalOpen,
    isSaveModalOpen,
    testName,
    setTestName,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleOpenSaveModal,
    handleCloseSaveModal,
  } = useTestModals()

  const {
    isSaving,
    isRunning,
    selectedTestId,
    setSelectedTestId,
    savedTests,
    handleSaveTest,
    handleUpdateTest,
    handleRunTest,
    loadTest,
  } = useTestOperations({
    blocks,
    setBlocks,
    testName,
    onCloseSaveModal: handleCloseSaveModal,
  })

  const { frames, generatedPhone, generatedPassword, cleanup } = useTestStream()
  const [showPlayer, setShowPlayer] = useState(false)

  const handleConfirmDelete = () => {
    if (activeLinkId) {
      removeLink(activeLinkId)
      handleCloseDeleteModal()
    }
  }

  const handleSelectTest = (id: string | undefined) => {
    setSelectedTestId(id)
    loadTest(id)
  }

  const handleRun = async () => {
    await handleRunTest(() => {
      setShowPlayer(false)
      setTimeout(() => setShowPlayer(true), 1000)
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <ActionBar
        hasBlocks={hasBlocks}
        isSaving={isSaving}
        isRunning={isRunning}
        selectedTestId={selectedTestId}
        savedTests={savedTests}
        activeLinkId={activeLinkId}
        activeLink={activeLink}
        onSelectTest={handleSelectTest}
        onSaveTest={handleOpenSaveModal}
        onUpdateTest={handleUpdateTest}
        onRunTest={handleRun}
        onDeleteSite={handleOpenDeleteModal}
      />

      <SaveTestModal
        isOpen={isSaveModalOpen}
        testName={testName}
        isSaving={isSaving}
        onClose={handleCloseSaveModal}
        onSave={handleSaveTest}
        onTestNameChange={setTestName}
      />

      <TestBlocksSection
        blocks={blocks}
        onAddBlock={addBlock}
        removeBlock={removeBlock}
        moveBlock={moveBlock}
        getPreviousClickBlocksForIndex={getPreviousClickBlocksForIndex}
      />

      <VisualizationSection activeLink={activeLink} />

      <DeleteSiteModal
        isOpen={isDeleteModalOpen}
        activeLink={activeLink}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <TestPlayer
        frames={frames}
        generatedPhone={generatedPhone}
        generatedPassword={generatedPassword}
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
        onCleanup={cleanup}
      />
    </div>
  )
}

export function Dashboard() {
  return (
    <ElementPickerProvider>
      <BlocksFormProvider>
        <DashboardContent />
      </BlocksFormProvider>
    </ElementPickerProvider>
  )
}
