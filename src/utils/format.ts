export const timeRemaining = (unlockTime?: number | null, charSpaceing?: string) => {
    if (!unlockTime) return ``
    const now = Math.ceil(Date.now() / 1000)
    const timeDiff = unlockTime - now
  
    if (timeDiff <= 0) {
      return ``
    }
  
    const days = Math.floor(timeDiff / (24 * 3600))
    const hours = Math.floor((timeDiff % (24 * 3600)) / 3600)
    const minutes = Math.floor((timeDiff % 3600) / 60)
    const seconds = timeDiff % 60
    const spacing = charSpaceing ? charSpaceing : ' '
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `${hours}h${spacing}${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m${spacing}${seconds}s`
    } else if (seconds > 0) {
      return `${seconds}s`
    } else {
      return ``
    }
  }