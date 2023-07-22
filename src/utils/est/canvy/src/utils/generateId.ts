export const generateId = () => {
  const timestamp: number = new Date().getTime()
  const random: number = Math.floor(Math.random() * 10000)
  return `${timestamp}${random}`
}
