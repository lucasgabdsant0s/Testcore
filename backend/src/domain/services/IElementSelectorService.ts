export type PreAction = {
  type: "click"
  selector: string
  timeout?: number
}

export type ResolveSelectorInput = {
  url: string
  xPercent: number
  yPercent: number
  viewport?: { width: number; height: number }
  waitUntil?: "load" | "domcontentloaded" | "networkidle"
  timeoutMs?: number
  preActions?: PreAction[]
}

export type ResolveSelectorOutput = {
  css: string
  xpath: string
  elementInfo?: {
    tagName: string
    type?: string
    name?: string
    id?: string
    placeholder?: string
    className?: string
  }
}

export interface IElementSelectorService {
  resolveFromPoint(input: ResolveSelectorInput): Promise<ResolveSelectorOutput>
}


