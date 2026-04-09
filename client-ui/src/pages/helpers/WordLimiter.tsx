export const limitWords = (text: string, count: number) => {
  const words = text.split(" ")
  return words.slice(0, count).join(" ") + (words.length > count ? "..." : "")
}