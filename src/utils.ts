export const cleanPercentage = (value: number) => {
  let percentage = value * 100
  percentage = Math.min(percentage, 100)
  percentage = Math.max(percentage, 0)
  return percentage
}
