import { useState, useCallback } from "react"

export function useTestModals() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
    const [testName, setTestName] = useState("")

    const handleOpenDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(true)
    }, [])

    const handleCloseDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false)
    }, [])

    const handleOpenSaveModal = useCallback(() => {
        setTestName("")
        setIsSaveModalOpen(true)
    }, [])

    const handleCloseSaveModal = useCallback(() => {
        setIsSaveModalOpen(false)
    }, [])

    return {
        isDeleteModalOpen,
        isSaveModalOpen,
        testName,
        setTestName,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleOpenSaveModal,
        handleCloseSaveModal,
    }
}
