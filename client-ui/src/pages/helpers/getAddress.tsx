import BASE_URL from "@/Config"

export const getAddress = async (lat: number, lng: number) => {
  const res = await fetch(
    `${BASE_URL}/api/location/reverse?lat=${lat}&lng=${lng}`
  )

  if (!res.ok) throw new Error("Failed to fetch address")

  const data = await res.json()
  return data.address
}