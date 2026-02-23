import express from "express"
import axios from "axios"

const router = express.Router()
const OPENSTREETMAP_API_KEY = process.env.OPENSTREETMAP_API_KEY

router.get("/reverse", async (req, res) => {
  try {
    const { lat, lng } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng required" })
    }

    const response = await axios.get(
      `${OPENSTREETMAP_API_KEY}/reverse`,
      {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
        headers: {
          "User-Agent": "your-app-name", // REQUIRED by OSM
        },
      }
    )

    res.json(response.data)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Failed to fetch address" })
  }
})

export default router