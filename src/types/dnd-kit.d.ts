declare module "@dnd-kit/core" {
  export const DndContext: any
  export const closestCenter: any
  export type DragEndEvent = any
  export const PointerSensor: any
  export const useSensor: (...args: any[]) => any
  export const useSensors: (...args: any[]) => any
}

declare module "@dnd-kit/sortable" {
  export const SortableContext: any
  export const horizontalListSortingStrategy: any
  export const arrayMove: <T>(items: T[], oldIndex: number, newIndex: number) => T[]
  export const useSortable: (options: { id: string }) => {
    attributes: any
    listeners: any
    setNodeRef: (element: HTMLElement | null) => void
    transform: any
    transition: any
    isDragging: boolean
  }
}

declare module "@dnd-kit/utilities" {
  export const CSS: {
    Transform: {
      toString(transform: any): string
    }
  }
}

declare module "@dnd-kit/modifiers" {
  export const restrictToHorizontalAxis: any
}


