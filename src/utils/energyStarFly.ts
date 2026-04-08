export function playEnergyStarFly(startX?: number, startY?: number, endX?: number, endY?: number) {
  return new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    const event = new CustomEvent('energy-star-fly', {
      detail: {
        startX,
        startY,
        endX,
        endY,
        done: resolve,
      },
    })
    window.dispatchEvent(event)
  })
}
