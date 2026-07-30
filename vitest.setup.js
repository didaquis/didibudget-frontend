import '@testing-library/jest-dom'

const originalRAF = globalThis.requestAnimationFrame
if (originalRAF) {
  globalThis.requestAnimationFrame = (cb) => {
    return originalRAF(function () {
      try {
        cb.apply(this, arguments)
      } catch {
        // react-widgets v5 useTabTrap can throw when its ref is null
        // if the popup unmounts before the rAF callback fires in jsdom
      }
    })
  }
}
