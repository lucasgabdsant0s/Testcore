import type { IElementSelectorService, ResolveSelectorInput, ResolveSelectorOutput } from "../../domain/services/IElementSelectorService"
import { chromium } from "playwright"

let browserPromise: ReturnType<typeof chromium.launch> | null = null
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = chromium.launch({ headless: true })
  }
  return browserPromise
}

export class PlaywrightElementSelectorService implements IElementSelectorService {
  async resolveFromPoint(input: ResolveSelectorInput): Promise<ResolveSelectorOutput> {
    const browser = await getBrowser()
    const context = await browser.newContext({
      viewport: input.viewport ?? { width: 1280, height: 800 },
    })
    const page = await context.newPage()
    try {
      await page.goto(input.url, { waitUntil: input.waitUntil ?? "networkidle", timeout: input.timeoutMs ?? 15000 })

      if (input.preActions && input.preActions.length > 0) {
        for (const action of input.preActions) {
          if (action.type === "click") {
            try {
              await page.waitForSelector(action.selector, {
                timeout: action.timeout ?? 5000,
                state: "visible"
              })
              await page.click(action.selector, { timeout: action.timeout ?? 5000 })
              await page.waitForTimeout(1000)
              try {
                await Promise.race([
                  page.waitForSelector('[role="dialog"]', { timeout: 2000, state: "visible" }).catch(() => null),
                  page.waitForSelector('.modal', { timeout: 2000, state: "visible" }).catch(() => null),
                  page.waitForSelector('[class*="modal"]', { timeout: 2000, state: "visible" }).catch(() => null),
                  page.waitForSelector('[class*="Modal"]', { timeout: 2000, state: "visible" }).catch(() => null),
                  page.waitForSelector('[class*="dialog"]', { timeout: 2000, state: "visible" }).catch(() => null),
                  page.waitForSelector('[class*="Dialog"]', { timeout: 2000, state: "visible" }).catch(() => null),
                  page.waitForSelector('[class*="overlay"]', { timeout: 2000, state: "visible" }).catch(() => null),
                  page.waitForSelector('[class*="Overlay"]', { timeout: 2000, state: "visible" }).catch(() => null),
                  page.waitForTimeout(2000),
                ])
              } catch {
              }
            } catch (error) {
              console.warn(`Não foi possível executar preAction click em ${action.selector}:`, error)
            }
          }
        }
      }

      const viewport = page.viewportSize() ?? { width: 1280, height: 800 }
      const x = Math.round((input.xPercent / 100) * viewport.width)
      const y = Math.round((input.yPercent / 100) * viewport.height)

      const result = await page.evaluate(
        ({ x, y }: { x: number; y: number }) => {
          const MODAL_SELECTORS = [
            '[role="dialog"]',
            '[role="alertdialog"]',
            '[aria-modal="true"]',
            '[data-modal]',
            '[data-dialog]',
            '[data-drawer]',
            '[data-sheet]',
            '[data-radix-portal]',
            '[data-state="open"]',
            '.modal',
            '.Modal',
            '.dialog',
            '.Dialog',
            '.drawer',
            '.Drawer',
            '.sheet',
            '.Sheet',
            '.overlay',
            '.Overlay',
            '.chakra-portal',
            '.chakra-modal__content',
            '.mantine-Modal-root',
            '.mantine-Dialog-root',
            '.mantine-Drawer-root',
            '.ant-modal',
            '.ant-drawer',
            '.MuiModal-root',
            '.MuiDialog-root',
            '.MuiDrawer-root',
          ]
          const STABLE_DATA_ATTRIBUTES = [
            "data-testid",
            "data-test",
            "data-test-id",
            "data-cy",
            "data-qa",
            "data-qa-id",
            "data-id",
            "data-name",
            "data-role",
            "data-component",
            "data-element",
          ]
          const INTERACTIVE_TAGS = new Set(["input", "textarea", "select", "button", "a", "label"])

          function cssEscapeIdent(ident: string) {
            const canEscape = typeof window !== "undefined" && window.CSS && typeof window.CSS.escape === "function"
            if (canEscape) return window.CSS.escape(ident)
            return ident.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1")
          }

          function getXPathForElement(el: Element): string {
            if (el.id) return `//*[@id="${el.id}"]`
            const parts: string[] = []
            let current: Element | null = el
            while (current && current.nodeType === Node.ELEMENT_NODE) {
              let index = 1
              let sibling = current.previousElementSibling
              while (sibling) {
                if (sibling.tagName === current.tagName) index++
                sibling = sibling.previousElementSibling
              }
              parts.unshift(`${current.tagName.toLowerCase()}[${index}]`)
              current = current.parentElement
            }
            return "/" + parts.join("/")
          }

          function elementMatchesModalSelector(el: Element | null): boolean {
            if (!el) return false
            for (const selector of MODAL_SELECTORS) {
              try {
                if (el.matches(selector)) return true
              } catch {
                continue
              }
            }
            return false
          }

          function isInsideModal(el: Element | null): boolean {
            let current = el
            let depth = 0
            while (current && depth < 15 && current !== document.body) {
              if (elementMatchesModalSelector(current)) return true
              const attr = (current.getAttribute("role") || "").toLowerCase()
              const className = (current.className || "").toString().toLowerCase()
              const id = (current.id || "").toLowerCase()
              if (
                attr === "dialog" ||
                attr === "alertdialog" ||
                className.includes("modal") ||
                className.includes("dialog") ||
                className.includes("overlay") ||
                className.includes("popup") ||
                className.includes("drawer") ||
                className.includes("sheet") ||
                id.includes("modal") ||
                id.includes("dialog") ||
                id.includes("overlay") ||
                id.includes("popup")
              ) {
                return true
              }
              try {
                const style = window.getComputedStyle(current)
                const zIndex = parseInt(style.zIndex) || 0
                if ((style.position === "fixed" || style.position === "absolute") && zIndex > 50) {
                  return true
                }
              } catch { }
              current = current.parentElement
              depth++
            }
            return false
          }

          function isElementVisible(el: Element | null): boolean {
            if (!el) return false
            try {
              const style = window.getComputedStyle(el)
              if (style.visibility === "hidden" || style.display === "none") return false
              if (parseFloat(style.opacity) < 0.05) return false
              if (style.pointerEvents === "none") return false
              const rect = el.getBoundingClientRect()
              if (!rect || rect.width === 0 || rect.height === 0) return false
              if (el.closest('[aria-hidden="true"]')) return false
              return true
            } catch {
              return true
            }
          }

          function isBackgroundGraphic(el: Element): boolean {
            const tag = el.tagName.toLowerCase()
            if (tag !== "img" && tag !== "svg" && tag !== "picture") return false
            try {
              const style = window.getComputedStyle(el)
              const zIndex = parseInt(style.zIndex) || 0
              if ((style.position === "static" || style.position === "relative") && zIndex < 10) {
                return true
              }
            } catch {
              return true
            }
            return false
          }

          function pickElement(x: number, y: number): Element | null {
            const elements = document.elementsFromPoint(x, y)
            if (!elements || elements.length === 0) return null
            const filtered = elements.filter(
              (el) =>
                el.tagName !== "HTML" &&
                el.tagName !== "BODY" &&
                el.tagName !== "SCRIPT" &&
                el.tagName !== "STYLE" &&
                isElementVisible(el)
            )
            if (filtered.length === 0) return null
            const withoutGraphics = filtered.filter((el) => !isBackgroundGraphic(el))
            const candidates = withoutGraphics.length > 0 ? withoutGraphics : filtered
            const modalElements = candidates.filter((el) => isInsideModal(el))
            if (modalElements.length > 0) {
              const interactiveModal = modalElements.find(
                (el) => INTERACTIVE_TAGS.has(el.tagName.toLowerCase()) || el.getAttribute("tabindex") !== null,
              )
              if (interactiveModal) return interactiveModal
              const fallbackModal = modalElements[0]
              return fallbackModal ?? null
            }
            const highZIndex = candidates.filter((el) => {
              try {
                const style = window.getComputedStyle(el)
                const zIndex = parseInt(style.zIndex) || 0
                return (style.position === "fixed" || style.position === "absolute") && zIndex > 50
              } catch {
                return false
              }
            })

            if (highZIndex.length > 0) {
              const interactive = highZIndex.find((el) => INTERACTIVE_TAGS.has(el.tagName.toLowerCase()))
              const fallbackHighZ = highZIndex[0]
              return interactive ?? fallbackHighZ ?? null
            }
            const formInput = candidates.find(el => ["input", "textarea", "select"].includes(el.tagName.toLowerCase()))
            if (formInput) return formInput

            const labelEl = candidates.find(el => el.tagName.toLowerCase() === "label") as HTMLLabelElement | undefined
            if (labelEl && labelEl.htmlFor) {
              const linkedInput = document.getElementById(labelEl.htmlFor)
              if (linkedInput) return linkedInput
            }

            const buttonOrLink = candidates.find(
              (el) =>
                ["button", "a"].includes(el.tagName.toLowerCase()) ||
                el.getAttribute("role") === "button" ||
                el.getAttribute("role") === "link"
            )
            if (buttonOrLink) return buttonOrLink

            const interactiveOutside = candidates.find(
              (el) =>
                INTERACTIVE_TAGS.has(el.tagName.toLowerCase()) ||
                el.getAttribute("tabindex") !== null ||
                (el as HTMLElement).contentEditable === "true"
            )
            if (interactiveOutside) return interactiveOutside
            const fallbackCandidate = candidates[0]
            return fallbackCandidate ?? null
          }

          function getStableDataAttributeSelector(el: Element): string | null {
            for (const attr of STABLE_DATA_ATTRIBUTES) {
              if (el.hasAttribute(attr)) {
                const value = el.getAttribute(attr)?.trim()
                if (value) {
                  const selector = `[${attr}="${cssEscapeIdent(value)}"]`
                  try {
                    if (document.querySelectorAll(selector).length === 1) return selector
                  } catch {
                    continue
                  }
                }
              }
            }
            return null
          }

          function getBestCssSelector(el: Element): string {
            if (!(el instanceof Element)) return ""
            const htmlEl = el as HTMLElement
            if (htmlEl.id) {
              const idSelector = `#${cssEscapeIdent(htmlEl.id)}`
              try {
                if (document.querySelectorAll(idSelector).length === 1) return idSelector
              } catch { }
              // Fallback to name/class if ID is not unique
            }
            const dataAttrSelector = getStableDataAttributeSelector(htmlEl)
            if (dataAttrSelector) return dataAttrSelector
            if (htmlEl.tagName === "INPUT" || htmlEl.tagName === "TEXTAREA" || htmlEl.tagName === "SELECT") {
              const inputEl = htmlEl as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              if (inputEl.type && inputEl.name) {
                const typeNameSelector = `${htmlEl.tagName.toLowerCase()}[name="${cssEscapeIdent(
                  inputEl.name,
                )}"][type="${cssEscapeIdent(inputEl.type)}"]`
                try {
                  if (document.querySelectorAll(typeNameSelector).length === 1) return typeNameSelector
                } catch { }
              }
              if (inputEl.name) {
                const nameSelector = `${htmlEl.tagName.toLowerCase()}[name="${cssEscapeIdent(inputEl.name)}"]`
                try {
                  if (document.querySelectorAll(nameSelector).length === 1) return nameSelector
                } catch { }
                return nameSelector
              }
            }
            const classes = Array.from(htmlEl.classList)
            if (classes.length > 0) {
              const fullClassSelector = `${htmlEl.tagName.toLowerCase()}.${classes.map((c) => cssEscapeIdent(c)).join(".")}`
              try {
                if (document.querySelectorAll(fullClassSelector).length === 1) return fullClassSelector
              } catch { }
              const mainClasses = classes.slice(0, 3)
              if (mainClasses.length > 0) {
                const mainSelector = `${htmlEl.tagName.toLowerCase()}.${mainClasses.map((c) => cssEscapeIdent(c)).join(".")}`
                try {
                  if (document.querySelectorAll(mainSelector).length === 1) return mainSelector
                } catch { }
                return mainSelector
              }
              return "." + classes.map((c) => cssEscapeIdent(c)).join(".")
            }
            const path: string[] = []
            let current: Element | null = el
            let depth = 0
            while (current && depth < 8) {
              let selector = current.tagName.toLowerCase()
              if (current.id) {
                selector += `#${cssEscapeIdent(current.id)}`
                path.unshift(selector)
                const test = path.join(" > ")
                try {
                  if (document.querySelectorAll(test).length === 1) return test
                } catch { }
              }
              const mainClasses = Array.from(current.classList || []).slice(0, 2)
              if (mainClasses.length > 0) {
                selector += "." + mainClasses.map((c) => cssEscapeIdent(c)).join(".")
              }
              let index = 1
              let sibling = current.previousElementSibling
              while (sibling) {
                if (sibling.tagName === current.tagName) index++
                sibling = sibling.previousElementSibling
              }
              selector += `:nth-of-type(${index})`
              path.unshift(selector)
              const combined = path.join(" > ")
              try {
                if (document.querySelectorAll(combined).length === 1) return combined
              } catch { }
              current = current.parentElement
              depth++
            }
            if (path.length > 0) return path.join(" > ")
            return htmlEl.tagName.toLowerCase()
          }

          const el = pickElement(x, y)
          if (!el) {
            return { css: "", xpath: "", elementInfo: undefined }
          }
          const htmlEl = el as HTMLElement
          const inputEl = htmlEl as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          const css = getBestCssSelector(el)
          const xpath = getXPathForElement(el)
          const placeholderValue =
            inputEl instanceof HTMLInputElement || inputEl instanceof HTMLTextAreaElement ? inputEl.placeholder : undefined
          const elementInfo: {
            tagName: string
            type?: string
            name?: string
            id?: string
            placeholder?: string
            className?: string
          } = {
            tagName: htmlEl.tagName.toLowerCase(),
          }
          if (inputEl.type) elementInfo.type = inputEl.type
          if (inputEl.name) elementInfo.name = inputEl.name
          if (htmlEl.id) elementInfo.id = htmlEl.id
          if (placeholderValue) elementInfo.placeholder = placeholderValue
          if (htmlEl.className) elementInfo.className = htmlEl.className
          return { css, xpath, elementInfo }
        },
        { x, y },
      )

      return {
        css: result.css,
        xpath: result.xpath,
        ...(result.elementInfo ? { elementInfo: result.elementInfo } : {}),
      }
    } finally {
      await page.close()
      await context.close()
    }
  }
}


